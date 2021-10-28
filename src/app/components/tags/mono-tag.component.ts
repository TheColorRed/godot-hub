import { Component, Input } from '@angular/core'
import { GodotVersion } from '../../classes/godot-version.class'
import { Project } from '../../services/project.service'

@Component({
  selector: 'mono-tag',
  template: `<div *ngIf="isMono">Mono</div>`,
  styles: [
    `div {
      font-size: 0.55rem;
      letter-spacing: 1px;
      padding: 2px 5px;
      border-radius: 3px;
      display: inline;
      border: solid 1px #00e7ff;
      color: #00e7ff;
    }`
  ]
})
export class MonoTagComponent {

  isMono = false

  @Input() // version?: GodotVersion | Project
  set version(value: GodotVersion | Project) {
    if (value instanceof GodotVersion) {
      this.isMono = value.isMono
    } else {
      this.isMono = value.godot.isMono
    }
  }

}
