import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { Subject, timer } from 'rxjs'
import { GodotVersion } from '../classes/godot-version.class'
import { Project } from './project.service'

@Injectable({ providedIn: 'root' })
export class OpenService {

  constructor(
    private readonly electron: ElectronService
  ) { }

  project(version: GodotVersion, project: Project) {
    timer(100).subscribe(() => {
      const { formatPath, cp } = window
      const godotPath = formatPath(version.installLocation || '')
      const projectPath = formatPath(project.location || '')
      // console.log(project.args || '')
      cp.spawn(`"${godotPath}"`, ['-e', '--path', `"${projectPath}"`, project.args], {
        detached: true,
        shell: true,
        windowsHide: false
      })
    })
  }

  showFolder(defaultPath: string) {
    const sub = new Subject<string | undefined>()
    timer(100).subscribe(async () => {
      const { dialog, main } = window
      const result = await dialog.showOpenDialog(main, {
        defaultPath,
        properties: ['openDirectory']
      })
      sub.next(result.filePaths[0])
    })
    return sub.asObservable()
  }

  showProjectOpen() {
    const sub = new Subject<string | undefined>()
    timer(100).subscribe(async () => {
      const { os, fs, path, dialog, formatPath, main } = window
      const result = await dialog.showOpenDialog(main, {
        defaultPath: os.homedir(),
        properties: ['openDirectory'],
        // filters: [{ name: 'Godot', extensions: ['godot'] }]
      })
      const folderPath = result.filePaths[0]
      if (!folderPath) {
        // Emit an empty path
        sub.next('')
      } else {
        const godotPath = path.join(folderPath, 'project.godot')
        const projectExists = await fs.pathExists(formatPath(godotPath))
        if (!projectExists) {
          sub.next(undefined)
        } else {
          sub.next(godotPath)
        }
      }
      sub.unsubscribe()
    })
    return sub.asObservable()
  }

  showInExplorer(path: string) {
    this.electron.shell.showItemInFolder(window.formatPath(path))
  }
}
