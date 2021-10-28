import { AfterContentChecked, Directive, ElementRef, HostBinding } from '@angular/core'

@Directive({
  selector: '[main-content]'
})
export class MainContentDirective implements AfterContentChecked {

  private bodyHeight = '';

  constructor(
    private readonly elRef: ElementRef<HTMLElement>
  ) { }

  @HostBinding('style.overflow')
  overflow = 'auto'

  @HostBinding('style.height')
  get height() { return this.bodyHeight }

  ngAfterContentChecked() {
    const header = this.elRef.nativeElement.closest('app-content')?.querySelector('.header')
    const headerBounds = header?.getBoundingClientRect()
    this.bodyHeight = `calc(100vh - (${headerBounds?.height || 0}px + 20px))`
  }
}