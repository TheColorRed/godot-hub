import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { GodotVersion } from '../../classes/godot-version.class'

@Component({
  selector: 'release-tag',
  template: `<div [ngClass]="{
    'stable-tag': version?.isStable,
    'beta-tag': version?.isBeta,
    'alpha-tag': version?.isAlpha
  }">{{text}}</div>`,
  styles: [`
    div {
      font-size: 0.55rem;
      letter-spacing: 1px;
      padding: 2px 5px;
      border-radius: 3px;
      display: inline;
    }
    .stable-tag {
      border: solid 1px #04ff00;
      color: #04ff00;
    }
    .beta-tag {
      border: solid 1px #2b2987;
      color: #2b2987;
    }
    .alpha-tag {
      border: solid 1px #876129;
      color: #876129;
    }
  `]
})
export class ReleaseTagComponent implements OnInit {

  defaultColor = 'transparent'
  stableColor = '#2c8729'
  text = ''

  @Input() version?: GodotVersion

  @HostBinding('style.border')
  get style() {
    if (this.version?.isStable) return this.stableColor
    return this.defaultColor
  }

  ngOnInit() {
    this.text = this.version?.isStable ? 'Stable' :
      this.version?.isBeta ? 'Beta' :
        this.version?.isAlpha ? 'Alpha' : ''
  }

}
