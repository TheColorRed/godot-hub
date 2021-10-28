import { Pipe, PipeTransform } from '@angular/core'
import { GodotVersion } from '../classes/godot-version.class'
import { GodotInstalledService } from '../services/godot-version.service'
import { Project } from '../services/project.service'

@Pipe({
  name: 'isInstalled'
})
export class IsInstalledPipe implements PipeTransform {

  constructor(
    private readonly installedService: GodotInstalledService
  ) { }

  transform(value: string, version: GodotVersion | Project): boolean {
    if (!(version instanceof GodotVersion)) {
      const g = version.godot
      return !!this.installedService.findVersion(g.version, g.os, g.isMono)
    }
    return !!this.installedService.findVersion(version.version, version.os, version.isMono)
  }

}
