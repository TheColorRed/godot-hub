import { ElectronService } from 'ngx-electron'

export interface GithubAsset {
  browser_download_url: string
  content_type: string
  url: string
}

export interface GithubRelease {
  draft: boolean
  body: string
  name: string
  prerelease: boolean
  published_at: string
  tag_name: string
  assets: GithubAsset[]
  reactions: {
    '+1': number
    '-1': number
    confused: number
    eyes: number
    heart: number
    hooray: number
    laugh: number
    rocket: number
    total: number
    url: string
  }
  author: {
    avatar_url: string
    html_url: string
    login: string
    url: string
  }
}

export class GodotVersion {

  public installLocation?: string
  public readonly isMono: boolean
  public readonly basename: string
  public readonly os: OS

  constructor(
    public readonly asset: GithubAsset,
    public readonly release: GithubRelease,
    public readonly electron: ElectronService
  ) {
    this.isMono = asset.browser_download_url.includes('mono')
    const url = new URL(asset.browser_download_url)
    this.basename = window.path.parse(url.pathname).base.replace(/\.zip$/, '')
    if (this.isWindows && this.isMono) this.basename = `${this.basename}.exe`
    this.os = this.isWindows ? 'win' :
      this.isLinux ? 'x11' :
        this.isMac ? 'osx' : 'win'
  }

  get installRoot() {
    if (this.installLocation) return window.path.parse(this.installLocation).dir
    return undefined
  }

  get major() {
    const [major] = this.release.tag_name.replace(/[^\d.]/g, '').split('.')
    return +major
  }
  get minor() {
    const [, minor] = this.release.tag_name.replace(/[^\d.]/g, '').split('.')
    return +minor
  }
  get patch() {
    const [, , patch] = this.release.tag_name.replace(/[^\d.]/g, '').split('.')
    return +patch || 0
  }

  get isStable() {
    const type = this.release.tag_name.replace(/.+?-/, '')
    return type === 'stable'
  }
  get isBeta() {
    const type = this.release.tag_name.replace(/.+?-/, '')
    return type === 'beta'
  }
  get isAlpha() {
    const type = this.release.tag_name.replace(/.+?-/, '')
    return type === 'alpha'
  }

  get isWindows() { return this.asset.browser_download_url.includes('win') }
  get isMac() { return this.asset.browser_download_url.includes('osx') }
  get isLinux() { return this.asset.browser_download_url.includes('x11') }

  get isWin64() { return this.asset.browser_download_url.includes('win64') }
  get isWin32() { return this.asset.browser_download_url.includes('win32') }
  get isLinux64() { return this.asset.browser_download_url.includes('x11.64') || this.asset.browser_download_url.includes('x11_64') }
  get isLinux32() { return this.asset.browser_download_url.includes('x11.32') || this.asset.browser_download_url.includes('x11_32') }

  get downloadUrl() {
    return this.asset.browser_download_url
  }

  get version() {
    return this.toString()
  }

  toString(depth: 'major' | 'minor' | 'patch' = 'patch') {
    switch (depth) {
      case 'patch':
        return `${this.major}.${this.minor}${this.patch > 0 ? `.${this.patch}` : ''}`
      case 'minor':
        return `${this.major}.${this.minor}`
      case 'major':
        return `${this.major}`
    }
  }
}