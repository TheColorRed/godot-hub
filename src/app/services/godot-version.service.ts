import { EventEmitter, Injectable } from '@angular/core'
import { ElectronService } from 'ngx-electron'
import { GodotVersion } from '../classes/godot-version.class'
import { Constants } from '../constants'
import { InstallerService } from './installer.service'
import { SettingsService } from './settings.service'
import { CacheInstalled } from './version-loader.service'

@Injectable({ providedIn: 'root' })
export class GodotVersionService {

  public versions: GodotVersion[] = []

  constructor(
    protected readonly settings: SettingsService,
    protected readonly electron: ElectronService,
    protected readonly installer: InstallerService
  ) { }

  getStableVersions(versionsBack: number, isMono: boolean) {
    const stableVersions = this.versions.filter(version => version.isStable)
    return this.getLatestReleases(versionsBack, stableVersions, isMono)
  }

  getPrereleaseVersions(versionsBack: number, isMono: boolean) {
    const preReleases = this.versions.filter(version => version.isAlpha || version.isBeta)
    return this.getLatestReleases(versionsBack, preReleases, isMono)
  }

  getReleasesForMinor(version: string) {
    const versions = this.versions
    const versionGroup = versions.reduce<{ minor: string, versions: GodotVersion[] }[]>((acc, val) => {
      const minor = val.toString('minor')
      let minorGroup = acc.find(i => i.minor === minor)
      if (!minorGroup) {
        minorGroup = { minor, versions: [] }
        acc.push(minorGroup)
      }
      minorGroup.versions.push(val)
      return acc
    }, [])
      .find(v => v.minor === version.split('.').slice(0, 2).join('.'))
    return versionGroup?.versions
  }

  getLatestReleases(versionsBack: number, versions: GodotVersion[], isMono: boolean) {
    const isWindows = this.electron.isWindows
    const isLinux = this.electron.isLinux
    const isMac = this.electron.isMacOS

    const is64 = this.electron.isX64
    const is32 = this.electron.isX86

    const versionGroup = versions.reduce<{ minor: string, versions: GodotVersion[] }[]>((acc, val) => {
      // If the version doesn't match the operating system do not include it
      if (isWindows !== val.isWindows || (is64 !== val.isWin64 && is32 !== val.isWin32)) return acc
      if (isLinux !== val.isLinux || (is64 !== val.isLinux64 && is32 !== val.isLinux32)) return acc
      if (isMac !== val.isMac) return acc

      // Only get the mono or non-mono versions
      if (isMono !== val.isMono) return acc

      const minor = val.toString('minor')
      let minorGroup = acc.find(i => i.minor === minor)
      if (!minorGroup) {
        minorGroup = { minor, versions: [] }
        acc.push(minorGroup)
      }
      minorGroup.versions.push(val)
      return acc
    }, [])
    return versionGroup.slice(0, versionsBack)
  }

  findVersion(version: string, os: OS, isMono: boolean) {
    return this.versions.find(v => v.version === version && v.isMono === isMono && v.os === os)
  }

  find(major: number, minor?: number) {
    if (major && minor)
      return this.versions.filter(i => i.major === major && i.minor === minor)
    else
      return this.versions.filter(i => i.major === major)
  }
}


@Injectable({ providedIn: 'root' })
export class GodotInstalledService extends GodotVersionService {

  installsChanged = new EventEmitter<GodotVersion[]>()

  add(version: GodotVersion) {
    this.versions.push(version)
    const installed = this.getInstalledCache()
    const { path } = window
    const location = path.join(this.settings.saveEditorLocation, version.version, version.basename)
    version.installLocation = location

    installed.push({ version: version.version, os: version.os, location, isMono: version.isMono })
    localStorage.setItem(Constants.INSTALLED_CACHE_KEY, JSON.stringify(installed))
    this.installsChanged.emit(this.versions)
  }

  remove(version: GodotVersion) {
    // const sub = new Subject()
    if (version.installLocation) {
      this.installer.uninstall({
        file: version.installLocation,
        isMono: version.isMono,
        version: version.version
      }).subscribe(() => {
        const installed = this.getInstalledCache().filter(i => {
          const v = this.findVersion(i.version, i.os, i.isMono)
          return v != version
        })
        localStorage.setItem(Constants.INSTALLED_CACHE_KEY, JSON.stringify(installed))
        this.cacheToVersion()
        this.installsChanged.emit(this.versions)
      })
    }
    // return sub.asObservable()
  }

  private getInstalledCache() {
    return JSON.parse(localStorage.getItem(Constants.INSTALLED_CACHE_KEY) || '[]') as CacheInstalled[] || []
  }

  private cacheToVersion() {
    const cached = this.getInstalledCache()
    this.versions = cached.map(itm => this.findVersion(itm.version, itm.os, itm.isMono))
      .filter(i => i instanceof GodotVersion) as GodotVersion[]
  }
}