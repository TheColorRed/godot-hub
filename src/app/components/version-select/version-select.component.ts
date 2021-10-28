import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { GodotVersion } from '../../classes/godot-version.class'
import { Project } from '../../services/project.service'
import { InstallDialogComponent } from '../dialogs/install-dialog/install-dialog.component'

@Component({
  selector: 'app-version-select',
  templateUrl: './version-select.component.html',
  styleUrls: ['./version-select.component.scss']
})
export class VersionSelectComponent {

  @Input() versions: GodotVersion[] = []
  @Input() current?: Project

  @Output() versionChanged = new EventEmitter<{ project: Project, version: GodotVersion }>()
  // @Output('installEditor') installRequest = new EventEmitter<void>()

  constructor(
    private readonly dialog: MatDialog
  ) { }

  installEditor(event: MouseEvent) {
    event.preventDefault()
    this.dialog.open(InstallDialogComponent, {
      width: '80vw',
      autoFocus: false
    })
  }

  selectVersion(version: GodotVersion) {

    if (!this.current) {
      this.current = {
        args: '',
        location: '',
        name: '',
        godot: {
          version: '',
          os: 'win',
          isMono: false
        }
      }
    }

    if (this.current) {
      this.current.godot = {
        version: version.version,
        os: version.os,
        isMono: version.isMono
      }
    }
    this.versionChanged.emit({ project: this.current, version })
  }
}
