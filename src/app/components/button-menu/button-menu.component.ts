import { AfterContentInit, Component, ContentChildren, Directive, EventEmitter, Input, Output, QueryList, TemplateRef, ViewChild } from '@angular/core'


@Directive({ selector: 'button-menu-label' })
export class ButtonMenuLabelDirective { }

@Component({
  selector: 'button-menu-item',
  template: '<ng-template><ng-content></ng-content></ng-template>'
})
export class ButtonMenuItemDirective {
  @Input() value: any
  @Input() disabled = false
  @ViewChild(TemplateRef)
  template!: TemplateRef<any>
}

@Component({
  selector: 'app-button-menu',
  templateUrl: './button-menu.component.html',
  styleUrls: ['./button-menu.component.scss']
})
export class ButtonMenuComponent implements AfterContentInit {

  @Input() disabled = false
  @Input() mainDisabled = false
  @Input() subDisabled = false

  @Output() buttonClicked = new EventEmitter<any>()
  @ContentChildren(ButtonMenuItemDirective)
  buttonMenuItem!: QueryList<ButtonMenuItemDirective>

  value: any

  constructor() { }

  ngAfterContentInit() {
    this.value = this.buttonMenuItem.get(0)?.value
  }

  emitValue() {
    this.buttonClicked.next(this.value)
  }

  emitNewValue(item: ButtonMenuItemDirective) {
    this.value = item.value
    this.emitValue()
  }

}
