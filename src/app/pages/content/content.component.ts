import { Component, Input } from '@angular/core'
import { MenuItem } from 'src/app/app.component'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {

  @Input() current!: MenuItem

}
