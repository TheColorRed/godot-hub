import { Injectable } from '@angular/core'
import { Constants } from '../constants'

@Injectable({ providedIn: 'root' })
export class StorageService {

  init() {
    this.initProjectSaveLocation()
    this.initEditorSaveLocation()
  }

  private initProjectSaveLocation() {
    if (!this.exists(Constants.SETTINGS_CREATE_PROJECT_LOCATION)) {
      const { os, path } = window
      const root = path.join(os.homedir(), 'Documents', 'Godot')
      this.create(Constants.SETTINGS_CREATE_PROJECT_LOCATION, root)
    }
  }

  private initEditorSaveLocation() {
    if (!this.exists(Constants.SETTINGS_SAVE_EDITOR_LOCATION)) {
      const { os, path } = window
      const root = path.join(os.homedir(), 'Godot')
      this.create(Constants.SETTINGS_SAVE_EDITOR_LOCATION, root)
    }
  }

  private exists(key: string) {
    return !!localStorage.getItem(key)
  }

  private create<T>(key: string, value: T) {
    const val = typeof value === 'string' ? value : JSON.stringify(value)
    localStorage.setItem(key, val)
  }
}
