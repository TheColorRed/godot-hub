import { Injectable } from '@angular/core'
import { Constants } from '../constants'

@Injectable({ providedIn: 'root' })
export class SettingsService {

  get saveEditorLocation() {
    return localStorage.getItem(Constants.SETTINGS_SAVE_EDITOR_LOCATION) || ''
  }

  set saveEditorLocation(value: string) {
    localStorage.setItem(Constants.SETTINGS_SAVE_EDITOR_LOCATION, value)
  }

  get createProjectLocation() {
    return localStorage.getItem(Constants.SETTINGS_CREATE_PROJECT_LOCATION) || ''
  }

  set createProjectLocation(value: string) {
    localStorage.setItem(Constants.SETTINGS_CREATE_PROJECT_LOCATION, value)
  }

}
