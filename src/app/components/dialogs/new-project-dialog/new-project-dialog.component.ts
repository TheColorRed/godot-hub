import { HttpClient } from '@angular/common/http'
import { Component, EventEmitter, OnInit } from '@angular/core'
import { GodotVersion } from '../../../classes/godot-version.class'
import { Constants } from '../../../constants'
import { GodotInstalledService } from '../../../services/godot-version.service'
import { Project } from '../../../services/project.service'

@Component({
  selector: 'app-new-project-dialog',
  templateUrl: './new-project-dialog.component.html',
  styleUrls: ['./new-project-dialog.component.scss']
})
export class NewProjectDialogComponent implements OnInit {

  projectCreated = new EventEmitter<Project>()

  name = ''
  exists = false

  installed: GodotVersion[] = []
  version?: GodotVersion

  private template = ''

  constructor(
    private readonly httpClient: HttpClient,
    private readonly installedService: GodotInstalledService
  ) { }

  ngOnInit(): void {
    this.httpClient.get('/assets/base.godot', {
      responseType: 'text'
    }).subscribe(txt => this.template = txt.toString())
    this.installed = this.installedService.versions
  }

  async createProject() {
    const { fs, path, formatPath } = window
    const root = localStorage.getItem(Constants.SETTINGS_CREATE_PROJECT_LOCATION) || ''
    if (root.length > 0) {
      const filePath = path.join(root, this.name, 'project.godot')
      this.exists = await fs.pathExists(filePath)
      if (!this.exists && this.version && this.name) {
        await fs.ensureFile(formatPath(filePath))
        await fs.promises.writeFile(filePath, this.template.replace(/\$\{name\}/g, this.name))
        this.projectCreated.next({
          args: '',
          location: path.parse(filePath).dir,
          name: this.name,
          godot: {
            version: this.version.version,
            os: this.version.os,
            isMono: this.version.isMono
          }
        })
      }
    }
  }

}
