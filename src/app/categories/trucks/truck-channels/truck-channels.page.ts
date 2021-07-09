import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChannelList, SortMode} from '../../channel-list.model';
import {ChannelManagerService} from '../../../services/channel-manager.service';
import {Category} from '../../../models/category-channel.model';

@Component({
  selector: 'app-truck-channels',
  templateUrl: './truck-channels.page.html',
  styleUrls: ['./truck-channels.page.scss'],
})
export class TruckChannelsPage implements OnInit {

  id = '';
  channelList: ChannelList;
  category = Category.trucks;

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
    this.getMessages();
  }

  getMessages(){
    this.channelList.setChannels(this.channelManager.getDailyChannels(this.id, this.category));
    this.channelList.sortFilterChannels();
  }

  loadContent(ev) {
      setTimeout(() => ev.target.complete(), 2000);
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
}
