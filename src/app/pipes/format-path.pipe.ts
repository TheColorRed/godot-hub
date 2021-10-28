import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'formatPath'
})
export class FormatPathPipe implements PipeTransform {

  async transform(value: string): Promise<string> {
    return window.formatPath(value)
  }

}
