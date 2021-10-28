import { Injectable } from '@angular/core'
import { timer } from 'rxjs'
import { Subject } from 'rxjs/internal/Subject'
import { AssetDeleteInfo } from '../../../global'
import { Unzip } from '../classes/unzip'

export interface DownloadProgress {
  version: string
  progress: number
}

interface AssetDownloadInfo {
  endpoint: string
  version: string
}

@Injectable({ providedIn: 'root' })
export class InstallerService {

  install(asset: AssetDownloadInfo) {

    const { fs, path, https } = window

    const basename = path.parse(new URL(asset.endpoint).pathname).base
    const saveLocationBase = localStorage.getItem('save-editor-location') || ''
    const saveLocationRoot = path.join(saveLocationBase, asset.version)
    const saveLocationFile = path.join(saveLocationRoot, basename)

    fs.ensureDirSync(saveLocationRoot)
    const writeStream = fs.createWriteStream(saveLocationFile)
    const sub = new Subject<DownloadProgress>()
    https.get(asset.endpoint, async res => {
      const length = +(res.headers['content-length'] ?? 0)
      let completed = 0
      let lastEmit = 0
      res.pipe(writeStream)
      res.on('data', (/** @type {string} */ d) => {
        completed += d.length
        lastEmit = Math.min(Math.max(completed / length, 0), 0.999999999999999)
        sub.next({ version: asset.version, progress: lastEmit })
      })
      res.once('close', async () => {
        new Unzip(saveLocationFile, saveLocationRoot).unzip()
        fs.unlinkSync(saveLocationFile)
        sub.next({ version: asset.version, progress: 1 })
        sub.unsubscribe()
      })
    })
    return sub.asObservable()
  }

  uninstall(asset: AssetDeleteInfo) {
    const { fs, path, formatPath } = window
    const sub = new Subject<string>()
    timer().subscribe(async () => {
      const dir = formatPath(path.parse(asset.file).dir)
      const exists = await fs.pathExists(dir)
      if (!exists) {
        sub.next(asset.version)
        sub.unsubscribe()
        return
      }
      try {
        if (asset.isMono) {
          await fs.remove(formatPath(path.join(dir, 'GodotSharp')))
        }
      } catch (e) { }

      try {
        await fs.promises.unlink(formatPath(asset.file))
      } catch (e) { }

      try {
        if ((await fs.promises.readdir(dir)).length === 0) {
          await fs.promises.rmdir(dir)
        }
      } catch (e) { }

      sub.next(asset.version)
      sub.unsubscribe()
    })
    return sub.asObservable()
  }

}