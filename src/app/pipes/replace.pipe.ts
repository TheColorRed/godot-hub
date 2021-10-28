import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string, expression: string, replacement: string): string {
    const regexp = new RegExp(expression, 'ig')
    return value.replace(regexp, replacement)
  }

}
