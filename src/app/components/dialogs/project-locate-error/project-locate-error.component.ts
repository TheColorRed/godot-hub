import { Component, EventEmitter, OnDestroy } from '@angular/core'

@Component({
  selector: 'app-project-locate-error',
  templateUrl: './project-locate-error.component.html',
  styleUrls: ['./project-locate-error.component.scss']
})
export class ProjectLocateErrorDialogComponent implements OnDestroy {

  tryAgain = new EventEmitter<void>()

  ngOnDestroy() {
    this.tryAgain.unsubscribe()
  }

}
