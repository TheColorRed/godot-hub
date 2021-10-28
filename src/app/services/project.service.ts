import { EventEmitter, Injectable } from '@angular/core'
import { Constants } from '../constants'

export interface Project {
  name: string
  location: string
  args: string
  godot: {
    version: string
    isMono: boolean
    os: OS
  }
}

export interface GodotConfig {
  application: {
    'config/name': string
  }
}

@Injectable({ providedIn: 'root' })
export class ProjectService {

  projects: Project[] = []
  projectsUpdated = new EventEmitter<Project[]>()

  constructor() {
    this.get()
  }

  get() {
    this.projects = JSON.parse(localStorage.getItem(Constants.PROJECTS_LIST_KEY) || '[]') as Project[]
    return this.projects
  }

  save() {
    localStorage.setItem(Constants.PROJECTS_LIST_KEY, JSON.stringify(this.projects))
    this.projectsUpdated.next(this.projects)
  }

  updateProject(original: Project, changed: Project) {
    const idx = this.projects.findIndex(itm =>
      original.name === itm.name &&
      original.location === itm.location &&
      original.godot.version === itm.godot.version &&
      original.godot.os === itm.godot.os &&
      original.godot.isMono === itm.godot.isMono
    )
    if (idx > -1) {
      this.projects[idx] = changed
      this.save()
    }
  }

  add(path: string): Project
  add(project: Project): Project
  add(project: Project | string): Project {
    const { ini, fs, path } = window
    let newProject: Project | undefined = undefined
    if (typeof project === 'string') {
      const str = fs.readFileSync(project).toString()
      const decoded = ini.decode(str) as GodotConfig
      newProject = <Project>{
        name: decoded.application['config/name'],
        location: path.parse(project).dir,
        args: '',
        godot: {}
      }
    }

    const godotProject = typeof newProject !== 'undefined' ? newProject : project as Project
    this.projects.push(godotProject)
    this.save()
    return godotProject
  }

  remove(project: Project) {
    this.projects = this.projects.filter(p =>
      p.name !== project.name &&
      p.location !== project.location
    )
    this.save()
  }
}
