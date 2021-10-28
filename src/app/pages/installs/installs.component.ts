import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { MatDialog, MatDialogRef } from '@angular/material/dialog'
import { interval, Subscription } from 'rxjs'
import { GodotVersion } from 'src/app/classes/godot-version.class'
import { InstallDialogComponent } from '../../components/dialogs/install-dialog/install-dialog.component'
import { InstallInfoComponent } from '../../components/dialogs/install-info/install-info.component'
import { Constants } from '../../constants'
import { GodotInstalledService } from '../../services/godot-version.service'
import { OpenService } from '../../services/open.service'

@Component({
  selector: 'app-installs',
  templateUrl: './installs.component.html',
  styleUrls: ['./installs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InstallsComponent implements OnInit, OnDestroy {

  installDialogRef?: MatDialogRef<any>

  allInstalls: GodotVersion[] = []
  stableInstalls: GodotVersion[] = []
  monoInstalls: GodotVersion[] = []
  preInstalls: GodotVersion[] = []

  installsSub?: Subscription

  constructor(
    private readonly installed: GodotInstalledService,
    private readonly dialog: MatDialog,
    private readonly open: OpenService
  ) { }

  ngOnInit(): void {
    this.loadInstalls()
    interval(200).subscribe(() => {
      if (this.installed.versions.length !== this.allInstalls.length) {
        console.log('reload installs')
        this.loadInstalls()
      }
    })

    this.installsSub = this.installed.installsChanged.subscribe(() => this.loadInstalls())
  }

  ngOnDestroy() {
    this.installsSub?.unsubscribe()
  }

  openInstaller() {
    this.installDialogRef = this.dialog.open(InstallDialogComponent, {
      disableClose: true,
      width: Constants.DIALOG_WIDTH,
      minHeight: '80vh',
      panelClass: 'install-dialog',
      autoFocus: false
    })
  }

  showInFolder(install: GodotVersion) {
    if (install.installLocation) {
      this.open.showInExplorer(install.installLocation)
    }
  }

  showDetails(install: GodotVersion) {
    this.dialog.open(InstallInfoComponent, {
      width: '80vw',
      data: install
    })
  }

  uninstall(install: GodotVersion) {
    this.installed.remove(install)
  }

  private loadInstalls() {
    this.allInstalls = this.installed.versions.filter(v => v)
    this.stableInstalls = this.installed.versions.filter(v => v.isStable)
    this.monoInstalls = this.installed.versions.filter(v => v.isMono)
    this.preInstalls = this.installed.versions.filter(v => v.isBeta || v.isAlpha)
  }

}
