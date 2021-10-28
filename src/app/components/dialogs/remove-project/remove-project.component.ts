import { Component, EventEmitter, Inject } from '@angular/core'
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Project } from '../../../services/project.service'

@Component({
  selector: 'app-remove-project',
  templateUrl: './remove-project.component.html',
  styleUrls: ['./remove-project.component.scss']
})
export class RemoveProjectComponent {

  confirmed = new EventEmitter<void>()

  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly project: Project
  ) { }


}
