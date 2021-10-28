import { Directive, HostBinding } from '@angular/core'

@Directive({
  selector: '[panel]'
})
export class ColorDirective {

  @HostBinding('class.panel')
  panel = true

}
