import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Constants } from '../constants'

@Injectable({ providedIn: 'root' })
export class GithubService {

  constructor(
    private readonly httpClient: HttpClient
  ) { }

  issues() {
    const api = Constants.GITHUB_API
    api.pathname = '/repos/godotengine/godot/issues'
    this.httpClient.get(api.toString()).subscribe(response => {
      console.log(response)
    })
  }
}
