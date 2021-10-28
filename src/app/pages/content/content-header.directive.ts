import { Directive, ElementRef, HostBinding, Input } from '@angular/core'

@Directive({
  selector: '[content-header]'
})
export class ContentHeaderDirective {

  @Input('padding-bottom') hasPaddingBottom = true

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>
  ) { }

  @HostBinding('style')
  get style() {
    const h1 = this.elementRef.nativeElement.querySelector('h1')
    if (h1) {
      h1.style.margin = '0'
    }
    return `
      padding: 15px;
      padding-bottom: ${this.hasPaddingBottom ? '15px' : '0'}
      color: #fff;
    `
  }

  @HostBinding('class.header')
  header = true

}