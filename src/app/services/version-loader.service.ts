import { Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { of, Subject } from 'rxjs'
import { GithubRelease, GodotVersion } from 'src/app/classes/godot-version.class'
import { Constants } from '../constants'
import { GodotInstalledService, GodotVersionService } from './godot-version.service'

interface CacheInstalls {
  date: Date | null,
  versions: GithubRelease[]
}

export interface CacheInstalled {
  location: string
  version: string
  isMono: boolean
  os: OS
}

@Injectable({ providedIn: 'root' })
export class VersionLoaderService {

  constructor(
    private readonly electron: ElectronService,
    private readonly godotVersionService: GodotVersionService,
    private readonly godotInstalledService: GodotInstalledService
  ) { }

  /**
   * Loads the version information from the cache.
   * If the cache doesn't exist when getVersions() is called
   * it will then become populated.
   */
  loadCache() {
    const { date, versions } = (
      JSON.parse(localStorage.getItem(Constants.VERSION_CACHE_KEY) || 'null') || {
        date: null, versions: []
      }
    ) as CacheInstalls

    if (date !== null) {
      const nextCheck = new Date(date)
      nextCheck.setHours(nextCheck.getHours() + Constants.CACHE_HOURS)

      // Load the cached versions if the cache is not outdated.
      if (nextCheck.getTime() > Date.now()) {
        versions.forEach(release => this.addGodotReleases(release))
      }
    }
  }

  getVersions() {
    if (this.godotVersionService.versions.length > 0) {
      this.loadInstalled()
      return of(this.godotVersionService.versions)
    }
    const sub = new Subject<GodotVersion[]>()
    const api = Constants.GITHUB_API
    api.pathname = '/repos/godotengine/godot/releases'
    api.search = 'per_page=50'
    fetch(api.toString())
      .then(r => r.json())
      .then((result: GithubRelease[]) => {
        result.forEach(release => this.addGodotReleases(release))
        const cache = {
          date: new Date,
          versions: this.godotVersionService.versions.map(i => i.release)
        }
        this.loadInstalled()
        localStorage.setItem(Constants.VERSION_CACHE_KEY, JSON.stringify(cache))
        localStorage.setItem('github-result', JSON.stringify(result))
        console.log('load versions from github')
        sub.next(this.godotVersionService.versions)
        sub.unsubscribe()
      })
      .catch((e) => {
        sub.error(e)
        sub.unsubscribe()
      })
    return sub.asObservable()
  }

  private loadInstalled() {
    const installed = JSON.parse(localStorage.getItem(Constants.INSTALLED_CACHE_KEY) || 'null') as CacheInstalled[] || []
    installed.forEach(version => {
      const gVersion = this.godotVersionService.findVersion(version.version, version.os, version.isMono)
      if (gVersion) {
        gVersion.installLocation = version.location || ''
        this.godotInstalledService.versions.push(gVersion)
      }
    })
  }

  private addGodotReleases(release: GithubRelease) {
    release.assets.forEach(asset => {
      if (!['osx', 'win', 'x11'].some(i => asset.browser_download_url.includes(i))) return
      if (this.godotVersionService.versions
        .some(v => v.asset.browser_download_url === asset.browser_download_url)) return

      this.godotVersionService.versions.push(new GodotVersion(asset, release, this.electron))
    })
  }

}