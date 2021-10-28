import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GodotVersion } from '../../../classes/godot-version.class'

@Component({
  selector: 'app-install-info',
  templateUrl: './install-info.component.html',
  styleUrls: ['./install-info.component.scss']
})
export class InstallInfoComponent implements OnInit {

  reactions: { key: string, value: number }[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly version: GodotVersion
  ) {
  }

  ngOnInit(): void {
    this.reactions = Object.entries(this.version.release.reactions || {})
      .map(([key, value]) => {
        if (['url', 'total_count'].includes(key)) return undefined
        return { key, value }
      })
      .filter(i => typeof i !== 'undefined') as { key: string, value: number }[]
  }

}
