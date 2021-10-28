import { AfterContentInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material/tabs'
import { ElectronService } from 'ngx-electron'
import { GodotVersion } from '../../../classes/godot-version.class'
import { GodotInstalledService, GodotVersionService } from '../../../services/godot-version.service'
import { InstallerService } from '../../../services/installer.service'

export interface Installable {
  installProgress: number,
  current: GodotVersion,
  all: GodotVersion[]
}

export interface InstallGroup {
  label: string
  isMono: boolean
  installable: Installable[]
}

@Component({
  selector: 'app-install-dialog',
  templateUrl: './install-dialog.component.html',
  styleUrls: ['./install-dialog.component.scss']
})
export class InstallDialogComponent implements OnInit, OnDestroy, AfterContentInit {

  installable: InstallGroup[] = []
  renderId!: string

  @ViewChildren('versionRow')
  versionRows!: QueryList<HTMLDivElement>

  constructor(
    private readonly godotVersion: GodotVersionService,
    public readonly godotInstalled: GodotInstalledService,
    private readonly electron: ElectronService,
    private readonly cd: ChangeDetectorRef,
    private readonly installer: InstallerService
  ) { }

  ngOnInit(): void {
    this.generateId()
    this.loadTabData(0)
  }

  ngOnDestroy() {
    this.electron.ipcRenderer.removeAllListeners('download')
  }

  ngAfterContentInit() {
    this.generateId()
  }

  loadTabData(tab: MatTabChangeEvent | number) {
    const index = tab instanceof MatTabChangeEvent ? tab.index : tab
    switch (index) {
      case 0:
        this.installable = [
          {
            label: 'Latest Stable Releases',
            isMono: false,
            installable: this.godotVersion.getStableVersions(3, false)
              .map((...[item]) => ({ installProgress: 0, all: item.versions, current: item.versions[0] }))
          },
          {
            label: 'Latest Stable Mono Releases',
            isMono: true,
            installable: this.godotVersion.getStableVersions(3, true)
              .map((...[item]) => ({ installProgress: 0, all: item.versions, current: item.versions[0] }))
          }
        ]
        break
      case 1:
      case 2:
        this.installable = []
        break
    }
  }

  installVersion(version: GodotVersion) {
    version && this.godotInstalled.add(version)
    this.generateId()

    this.installer.install({
      endpoint: version.downloadUrl, version: version.version
    }).subscribe(progress => {
      const version: string = progress.version
      const current: number = +progress.progress
      this.versionRows.find(i => i.id === `minor_${version}`)
      console.log(current)
    })
    // this.electron.ipcRenderer.invoke('save-install', 'download', {
    //   endpoint: version.downloadUrl, version: version.version
    // })
  }

  generateId() {
    this.renderId = (Math.random() * 10000).toString(36)
    this.cd.detectChanges()
  }

}
