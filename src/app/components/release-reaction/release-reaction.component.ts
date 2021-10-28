import { Component, Input, OnInit } from '@angular/core'

@Component({
  selector: 'release-reaction',
  template: `
    <div class="reaction" fxLayout="row" fxLayoutAlign="flex-start center" fxLayoutGap="3px">
      <ng-container *ngIf="text!=='rocket';else svg">
        <mat-icon class="material-icons-outlined">{{text}}</mat-icon>
      </ng-container>
      <ng-template #svg>
        <mat-icon class="material-icons-outlined" [svgIcon]="text"></mat-icon>
      </ng-template>
      <span>{{reaction?.value||0}}</span>
    </div>
  `,
  styles: [
    `
    .material-icons-outlined {
      transform: scale(0.8);
    }
    .reaction {
      border: solid 1px gray;
      border-radius: 30px;
      padding: 2px 8px;
      background: rgba(0, 0, 0, 0.2);
    }
    `
  ]
})
export class ReleaseReactionComponent implements OnInit {

  @Input() reaction!: { key: string, value: number }

  up = 'thumb_up'
  down = 'thumb_down'
  laugh = 'mood'
  hooray = 'celebration'
  confused = 'sentiment_neutral'
  heart = 'favorite_border'
  rocket = 'rocket'
  eyes = 'visibility'

  text = ''

  ngOnInit(): void {
    this.text = this.reaction.key === '+1' ? this.up :
      this.reaction.key === '-1' ? this.down : (this as any)[this.reaction.key]
  }

}
