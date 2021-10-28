import { HttpClientModule } from '@angular/common/http'
import { APP_INITIALIZER, NgModule } from '@angular/core'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgxElectronModule } from 'ngx-electron'
import { MarkdownModule } from 'ngx-markdown'
import { first } from 'rxjs/internal/operators/first'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { ButtonMenuComponent, ButtonMenuItemDirective, ButtonMenuLabelDirective } from './components/button-menu/button-menu.component'
import { DialogHeaderComponent } from './components/dialog-header/dialog-header.component'
import { CmdArgsDialogComponent } from './components/dialogs/cmd-args-dialog/cmd-args-dialog.component'
import { InstallDialogComponent } from './components/dialogs/install-dialog/install-dialog.component'
import { InstallInfoComponent } from './components/dialogs/install-info/install-info.component'
import { NewProjectDialogComponent } from './components/dialogs/new-project-dialog/new-project-dialog.component'
import { ProjectLocateErrorDialogComponent } from './components/dialogs/project-locate-error/project-locate-error.component'
import { RemoveProjectComponent } from './components/dialogs/remove-project/remove-project.component'
import { SelectProjectVersionComponent } from './components/dialogs/select-project-version/select-project-version.component'
import { SettingsInstallsComponent } from './components/dialogs/settings-dialog/installs/installs.component'
import { SettingsProjectsComponent } from './components/dialogs/settings-dialog/projects/projects.component'
import { SettingsDialogComponent } from './components/dialogs/settings-dialog/settings-dialog.component'
import { InputActionDirective, InputComponent } from './components/input/input.component'
import { ReleaseReactionComponent } from './components/release-reaction/release-reaction.component'
import { MonoTagComponent } from './components/tags/mono-tag.component'
import { OsTagComponent } from './components/tags/os-tag.component'
import { ReleaseTagComponent } from './components/tags/release-tag.component'
import { VersionSelectComponent } from './components/version-select/version-select.component'
import { AvatarDirective } from './directives/avatar.directive'
import { FaDirective, FaSizeDirective } from './directives/fa.directive'
import { ColorDirective } from './directives/panel.directive'
import { UIModule } from './modules/ui.module'
import { CommunityComponent } from './pages/community/community.component'
import { ContentHeaderDirective } from './pages/content/content-header.directive'
import { ContentComponent } from './pages/content/content.component'
import { MainContentDirective } from './pages/content/main-content.directive'
import { InstallsComponent } from './pages/installs/installs.component'
import { LearnComponent } from './pages/learn/learn.component'
import { ProjectsComponent } from './pages/projects/projects.component'
import { FormatPathPipe } from './pipes/format-path.pipe'
import { IsInstalledPipe } from './pipes/is-installed.pipe'
import { ReplacePipe } from './pipes/replace.pipe'
import { StorageService } from './services/storage.service'
import { VersionLoaderService } from './services/version-loader.service'
@NgModule({
  declarations: [
    AppComponent,
    InstallsComponent,
    ProjectsComponent,
    ColorDirective,
    ContentComponent,
    ContentHeaderDirective,
    MainContentDirective,
    FaDirective,
    FaSizeDirective,
    ButtonMenuComponent,
    ButtonMenuLabelDirective,
    ButtonMenuItemDirective,
    InstallDialogComponent,
    ReplacePipe,
    IsInstalledPipe,
    ReleaseTagComponent,
    NewProjectDialogComponent,
    FormatPathPipe,
    CmdArgsDialogComponent,
    DialogHeaderComponent,
    MonoTagComponent,
    OsTagComponent,
    SettingsDialogComponent,
    SettingsInstallsComponent,
    SettingsProjectsComponent,
    InputComponent,
    InputActionDirective,
    ProjectLocateErrorDialogComponent,
    SelectProjectVersionComponent,
    InstallInfoComponent,
    AvatarDirective,
    ReleaseReactionComponent,
    VersionSelectComponent,
    RemoveProjectComponent,
    CommunityComponent,
    LearnComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    UIModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [VersionLoaderService],
      useFactory: (install: VersionLoaderService) => () => {
        install.loadCache()
        return install.getVersions().pipe(first()).toPromise()
      }
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [StorageService],
      useFactory: (storage: StorageService) => () => {
        storage.init()
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
