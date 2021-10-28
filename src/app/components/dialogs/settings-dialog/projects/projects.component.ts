import { Component, OnInit } from '@angular/core'
import { OpenService } from '../../../../services/open.service'
import { SettingsService } from '../../../../services/settings.service'

@Component({
  selector: 'app-settings-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class SettingsProjectsComponent implements OnInit {

  location = ''

  constructor(
    private readonly settings: SettingsService,
    private readonly open: OpenService
  ) { }

  async ngOnInit() {
    this.location = window.formatPath(this.settings.createProjectLocation)
  }

  async openFolderExplorer() {
    this.open.showFolder(this.location).subscribe(result => {
      if (typeof result === 'string' && result.length > 3) {
        this.location = result
        this.settings.createProjectLocation = result
      }
    })
  }

}
