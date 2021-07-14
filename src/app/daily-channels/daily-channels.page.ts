import { Component, OnInit } from '@angular/core';
import {ChannelList, SortMode} from '../categories/channel-list.model';
import {Category} from '../models/category-channel.model';
import {ActivatedRoute} from '@angular/router';
import {ChannelManagerService} from '../services/channel-manager.service';

@Component({
  selector: 'app-daily-channels',
  templateUrl: './daily-channels.page.html',
  styleUrls: ['./daily-channels.page.scss'],
})
export class DailyChannelsPage implements OnInit {

  readonly categories = {trucks: Category.trucks, scales: Category.scales, biocells: Category.biocells};
  id = '';
  channelList: ChannelList;
  category: Category;

  constructor(private activatedRoute: ActivatedRoute, public channelManager: ChannelManagerService) {
    this.channelList = new ChannelList([
        {col1: '01/01/2021', col2: Math.trunc(Date.now() / 1000)},
        {col1: '02/01/2021', col2: Math.trunc(Date.now() / 1000) + 180},
        {col1: '03/01/2021', col2: Math.trunc(Date.now() / 1000) + 60},
        {col1: '04/01/2021', col2: Math.trunc(Date.now() / 1000) + 7886}
      ],
      [{title: 'Data', mode: SortMode.none}, {title: 'Messaggi', mode: SortMode.none}]
    );
    this.channelList.sortFilterChannels();
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const category = this.activatedRoute.snapshot.parent.parent.url[0].path;
    this.category = this.categories[category];
    this.getMessages();
  }

  getMessages(){
    this.channelList.setChannels(this.channelManager.getDailyChannels(this.id, this.category));
    this.channelList.sortFilterChannels();
  }

  async loadContent(ev) {
    await this.channelManager.updateAll();
    this.getMessages();
    ev.target.complete();
  }

  sortModeToIcon(mode: SortMode): string{
    switch (mode){
      case SortMode.ascending:
        return 'caret-up';
      case SortMode.descending:
        return 'caret-down';
      case SortMode.none:
        return 'remove';
    }
  }

  toggleSort(index: number){
    this.channelList.toggleSortMode(index);
  }

  filterChannels(ev: any) {
    const val = ev.currentTarget.value;
    this.channelList.filterChannels(val);
  }

  toMessagePage(date: string): string{
    const d = date.replace(/\//g, '');
    return `messages/${d}`;
  }

}
