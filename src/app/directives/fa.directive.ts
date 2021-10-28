import { Directive, HostBinding, Input } from '@angular/core'

@Directive({
  selector: 'i[fa]'
})
export class FaDirective {
  @Input() fa: string = ''
  @HostBinding('class')
  get iconClass() {
    return `fa-${this.fa}`
  }
  @HostBinding('class.fas')
  faClass = true
}

@Directive({
  selector: 'i[faLarge], i[faMedium], i[faSmall]'
})
export class FaSizeDirective {
  @Input() faLarge?: string
  @Input() faMedium?: string
  @Input() faSmall?: string

  @HostBinding('style.font-size')
  get fontSize() {
    if (this.faLarge) {
      return '2rem'
    } else if (this.faSmall) {
      return '0.8rem'
    }
    return '1rem'
  }
}
