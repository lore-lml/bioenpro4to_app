import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  tabs: any;
  selectedTab: number;
  constructor() {
    this.tabs = [
      {title: 'Monitora', icon: 'compass'},
      {title: 'Statistiche', icon: 'stats-chart'},
      {title: 'Profilo', icon: 'person'}
    ];
  }

  setSelected(tab: string) {
    const t = tab.substr(3);
    this.selectedTab = parseInt(t, 10);
  }

  getIcon(i: number) {
    return i+1 === this.selectedTab ? this.tabs[i].icon : `${this.tabs[i].icon}-outline`;
  }
}
