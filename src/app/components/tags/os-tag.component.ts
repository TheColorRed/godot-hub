import { Component, Input, OnInit } from '@angular/core'
import { GodotVersion } from '../../classes/godot-version.class'

@Component({
  selector: 'os-tag',
  template: '<div *ngIf="text.length>0">{{text}}</div>',
  styles: [`
    div {
      font-size: 0.55rem;
      letter-spacing: 1px;
      padding: 2px 5px;
      border-radius: 3px;
      display: inline;
      border: solid 1px #ff8d00;
      color: #ff8d00;
    }
  `]
})
export class OsTagComponent implements OnInit {

  @Input() version?: GodotVersion
  text = ''

  ngOnInit(): void {
    this.text = this.version?.isWindows ? 'Windows' :
      this.version?.isLinux ? 'Linux' :
        this.version?.isMac ? 'Mac' : ''
  }

}
