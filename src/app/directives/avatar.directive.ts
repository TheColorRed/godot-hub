import { Directive, HostBinding, Input } from '@angular/core'

@Directive({
  selector: '[avatar]'
})
export class AvatarDirective {

  @HostBinding('style.border-radius')
  borderRadius = '100%'

  @HostBinding('style.height')
  @Input() height = '30px'

}
