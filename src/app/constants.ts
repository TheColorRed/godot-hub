
export class Constants {
  public static get GITHUB_API() { return new URL('https://api.github.com') }

  public static readonly PROJECTS_LIST_KEY = 'projects'

  public static readonly VERSION_CACHE_KEY = 'github-versions'
  public static readonly INSTALLED_CACHE_KEY = 'installed-versions'
  public static readonly CACHE_HOURS = 24

  public static readonly SETTINGS_SAVE_EDITOR_LOCATION = 'save-editor-location'
  public static readonly SETTINGS_CREATE_PROJECT_LOCATION = 'project-create-location'

  public static readonly DIALOG_WIDTH = '75vw'
}