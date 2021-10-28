import { Component, EventEmitter, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Project } from '../../../services/project.service'


@Component({
  selector: 'app-cmd-args-dialog',
  templateUrl: './cmd-args-dialog.component.html',
  styleUrls: ['./cmd-args-dialog.component.scss']
})
export class CmdArgsDialogComponent implements OnInit {

  argumentsChanged = new EventEmitter<Project>()

  project!: Project

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: Project
  ) { }

  ngOnInit(): void {
    this.project = JSON.parse(JSON.stringify(this.data))
  }

  saveArguments() {
    this.argumentsChanged.emit(this.project)
  }

}
