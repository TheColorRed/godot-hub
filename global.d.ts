import * as cp from 'child_process'
import { BrowserWindow, dialog } from 'electron'
import { https } from 'follow-redirects'
import * as fs from 'fs-extra'
import * as ini from 'ini'
import * as jszip from 'jszip'
import * as os from 'os'
import * as path from 'path'

declare global {
  type OS = 'win' | 'osx' | 'x11'

  interface String {
    fuzzy(search: string): boolean
  }

  interface Window {
    fs: typeof fs
    os: typeof os
    path: typeof path
    cp: typeof cp
    jszip: typeof jszip
    https: typeof https
    dialog: typeof dialog
    ini: typeof ini
    main: BrowserWindow
    // electron: typeof electron
    formatPath(path: string): string
  }
}

declare interface AssetDownloadInfo {
  endpoint: string
  version: string
}

declare interface AssetDeleteInfo {
  file: string
  isMono: boolean
  version: string
}

declare interface OpenGodotProject {
  godotPath: string
  projectPath: string
}
