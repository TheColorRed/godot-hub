import { Component, Directive, forwardRef, HostBinding, Input, ViewEncapsulation } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

@Directive({ selector: '[input-action]' })
export class InputActionDirective { }

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent)
    }
  ]
})
export class InputComponent implements ControlValueAccessor {

  private val = ''
  @Input() name = ''
  @Input() placeholder = ''
  @Input() color: 'primary' | 'accent' = 'primary'

  set value(v: any) {
    if (v !== undefined && this.val !== v) {
      this.val = v
      this.onChange(v)
      this.onTouched()
    }
  }

  get value() { return this.val }

  @HostBinding('class.custom-input')
  inputClass = true

  onChange = (value: any) => { };
  onTouched = () => { };

  writeValue(obj: any): void {
    this.value = obj
  }
  registerOnChange(fn: any): void {
    this.onChange = fn
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

}
