import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatIconRegistry } from '@angular/material/icon'
import { MatSelectionList } from '@angular/material/list'
import { DomSanitizer } from '@angular/platform-browser'
import { SettingsDialogComponent } from './components/dialogs/settings-dialog/settings-dialog.component'
import { Constants } from './constants'

export interface MenuItem {
  label: string
  active: boolean
  id: string
  icon?: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  menuItems: MenuItem[] = [
    { label: 'Projects', id: 'projects', icon: 'view_in_ar', active: false },
    { label: 'Installs', id: 'installs', icon: 'file_download', active: false },
    { label: 'Learn', id: 'learn', icon: 'school', active: false },
    { label: 'Community', id: 'community', icon: 'forum', active: true },
  ]
  current: MenuItem = this.menuItems.find(i => i.active) || this.menuItems[0]

  @ViewChild('nav')
  nav!: MatSelectionList

  constructor(
    private readonly dialog: MatDialog,
    private readonly matRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer
  ) {
    this.matRegistry.addSvgIcon(
      'rocket',
      this.domSanitizer.bypassSecurityTrustResourceUrl('/assets/rocket.svg')
    )
  }

  ngAfterViewInit() {
    this.nav.selectionChange.subscribe(val => {
      this.current = val.options[0].value
    })
  }

  openSettings() {
    this.dialog.open(SettingsDialogComponent, {
      width: Constants.DIALOG_WIDTH,
      height: '80vh'
    })
  }
}
