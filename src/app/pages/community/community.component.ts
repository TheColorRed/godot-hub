import { Component, OnInit } from '@angular/core'
import { MatTabChangeEvent } from '@angular/material/tabs'

export type TabType = 'social' | 'help' | 'dev'

export interface Community {
  name: string
  link: string
  descr: string,
  tab: TabType
}

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss']
})
export class CommunityComponent implements OnInit {

  communities: Community[] = [
    // Help Links
    { name: 'Q&A', link: 'https://godotengine.org/qa/', descr: 'A place to ask questions and search for answers from the community.', tab: 'help' },
    { name: 'Forum', link: 'https://godotforums.org/', descr: 'Community forum for all Godot developers.', tab: 'help' },
    { name: 'YouTube', link: 'https://www.youtube.com/c/GodotEngineOfficial', descr: 'Channel for official Godot videos.', tab: 'help' },
    { name: 'StackOverflow', link: 'https://stackoverflow.com/questions/tagged/godot', descr: 'Ask questions and search for answers on StackOverflow.', tab: 'help' },

    // Social Links
    { name: 'Discord', link: 'https://discord.gg/4JBkykG', descr: 'A vibrant community for discussion, user support, showcases... and custom emoji!', tab: 'social' },
    { name: 'Facebook', link: 'https://www.facebook.com/groups/godotengine/', descr: 'Large community for discussions around Godot.', tab: 'social' },
    { name: 'Twitter', link: 'https://twitter.com/godotengine', descr: 'Get small bits of development news.', tab: 'social' },
    { name: 'Reddit', link: 'https://www.reddit.com/r/godot', descr: 'For the anti-imperialist resistance to Facebook.', tab: 'social' },
    { name: 'Steam', link: 'https://steamcommunity.com/app/404790', descr: 'Discuss and share tips with other developers on Steam.', tab: 'social' },

    // Development Links
    { name: 'GitHub', link: 'https://github.com/godotengine/godot', descr: 'Send bug reports here. To request features, use the Godot proposals repository instead.', tab: 'dev' },
    { name: 'Godot Proposals', link: 'https://github.com/godotengine/godot-proposals', descr: 'Request features for the Godot engine.', tab: 'dev' },
  ]

  display: Community[] = []

  ngOnInit(): void {
    this.setDisplay('help')
  }

  setTabContent(e: MatTabChangeEvent) {
    const label = e.tab.textLabel.toLowerCase()
    switch (label) {
      case 'help': this.setDisplay('help'); break
      case 'social': this.setDisplay('social'); break
      case 'development': this.setDisplay('dev'); break
    }
  }

  private setDisplay(tab: TabType) {
    this.display = this.communities.filter(i => i.tab === tab)
  }

}
