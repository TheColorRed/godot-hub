import { Component, OnDestroy, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Subscription } from 'rxjs'
import { first } from 'rxjs/internal/operators/first'
import { CmdArgsDialogComponent } from '../../components/dialogs/cmd-args-dialog/cmd-args-dialog.component'
import { NewProjectDialogComponent } from '../../components/dialogs/new-project-dialog/new-project-dialog.component'
import { ProjectLocateErrorDialogComponent } from '../../components/dialogs/project-locate-error/project-locate-error.component'
import { RemoveProjectComponent } from '../../components/dialogs/remove-project/remove-project.component'
import { SelectProjectVersionComponent } from '../../components/dialogs/select-project-version/select-project-version.component'
import { Constants } from '../../constants'
import { GodotInstalledService } from '../../services/godot-version.service'
import { OpenService } from '../../services/open.service'
import { Project, ProjectService } from '../../services/project.service'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {

  projects: Project[] = []
  query = ''

  private projUpdate?: Subscription
  private installUpdate?: Subscription

  constructor(
    private readonly installed: GodotInstalledService,
    private readonly dialog: MatDialog,
    private readonly open: OpenService,
    private readonly project: ProjectService
  ) { }

  ngOnInit(): void {
    this.projects = this.project.projects
    this.projUpdate = this.project.projectsUpdated.subscribe(projects => this.projects = projects)
    this.installUpdate = this.installed.installsChanged.subscribe()
  }

  ngOnDestroy() {
    this.projUpdate?.unsubscribe()
    this.installUpdate?.unsubscribe()
  }

  search(query: string) {
    this.query = query
    const projects = this.project.projects
    if (query.length > 0) {
      this.projects = projects.filter(project => {
        return project.name.fuzzy(query) ||
          project.location.fuzzy(query) ||
          project.args.fuzzy(query) ||
          project.godot.version.fuzzy(query) ||
          project.godot.os.fuzzy(query) ||
          (project.godot.isMono === true && query.toLocaleLowerCase() === 'mono')
      })
    } else {
      this.projects = projects
    }
  }

  openProject(project: Project) {
    const version = this.installed.findVersion(project.godot.version, project.godot.os, project.godot.isMono)
    if (version?.installLocation && project.location) {
      this.open.project(version, project)
    }
  }

  newProject() {
    const ref = this.dialog.open(NewProjectDialogComponent, {
      width: '80vw',
      disableClose: true
    })
    ref.componentInstance.projectCreated.subscribe(item => {
      this.project.add(item)
      ref.close()
    })
  }

  findProject() {
    this.open.showProjectOpen().subscribe(path => {
      // Path was selected but was not a valid godot project
      if (typeof path === 'undefined') {
        const ref = this.dialog.open(ProjectLocateErrorDialogComponent)
        ref.componentInstance.tryAgain.subscribe(() => this.findProject())
      }
      // Path Was selected and is a valid godot project
      else if (path.length > 0) {
        this.project.add(path)
      }
    })
  }

  selectVersion(event: MouseEvent, project: Project) {
    event.stopPropagation()
    const versionSelect = this.dialog.open(SelectProjectVersionComponent, {
      width: '80vw',
      data: project
    })

    versionSelect.componentInstance.versionChanged
      .pipe(first())
      .subscribe(changedProject => {
        this.project.updateProject(project, changedProject)
      })
  }

  showInExplorer(project: Project) {
    const path = window.path
    this.open.showInExplorer(path.join(project.location, 'project.godot'))
  }

  showCmdArgsDialog(project: Project) {
    const ref = this.dialog.open(CmdArgsDialogComponent, {
      width: Constants.DIALOG_WIDTH,
      panelClass: 'cmd-args-dialog',
      data: project
    })
    ref.componentInstance.argumentsChanged
      .pipe(first())
      .subscribe(changedProject => {
        console.log(changedProject)
        this.project.updateProject(project, changedProject)
      })
  }

  removeProject(project: Project) {
    const ref = this.dialog.open(RemoveProjectComponent, {
      width: '80vw',
      data: project
    })
    ref.componentInstance.confirmed.subscribe(() => {
      this.project.remove(project)
    })
  }

}
