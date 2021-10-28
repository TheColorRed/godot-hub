import { Component, EventEmitter, Inject, OnDestroy, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { GodotVersion } from '../../../classes/godot-version.class'
import { GodotInstalledService } from '../../../services/godot-version.service'
import { Project } from '../../../services/project.service'

@Component({
  selector: 'app-select-project-version',
  templateUrl: './select-project-version.component.html',
  styleUrls: ['./select-project-version.component.scss']
})
export class SelectProjectVersionComponent implements OnInit, OnDestroy {

  installed: GodotVersion[] = []

  current?: Project

  versionChanged = new EventEmitter<Project>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: Project,
    private readonly installedService: GodotInstalledService
  ) { }

  ngOnInit(): void {
    this.installed = this.installedService.versions
    this.current = JSON.parse(JSON.stringify(this.data))
  }

  ngOnDestroy() {
    this.versionChanged.unsubscribe()
  }

  acceptVersion() {
    this.versionChanged.next(this.current)
  }

}
