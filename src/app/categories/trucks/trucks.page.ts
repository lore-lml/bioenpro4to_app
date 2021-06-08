import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {ChannelList, SortMode} from '../channel-list.model';

@Component({
  selector: 'app-trucks',
  templateUrl: './trucks.page.html',
  styleUrls: ['./trucks.page.scss', '../categories.scss'],
})
export class TrucksPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  segment = 0;
  sliderOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 400
  };

  category = Category.trucks;
  channelList: ChannelList;

  constructor(public channelManager: ChannelManagerService) {
    this.channelList = new ChannelList([
      {id: 'xasd', lastUpdate: Math.trunc(Date.now() / 1000)},
      {id: 'egas', lastUpdate: Math.trunc(Date.now() / 1000) + 180},
      {id: 'ksae', lastUpdate: Math.trunc(Date.now() / 1000) + 60},
      {id: 'zzzz', lastUpdate: Math.trunc(Date.now() / 1000) + 7886}
    ],
      [{title: 'Targa', mode: SortMode.none}, {title: 'Ultimo Aggiornamento', mode: SortMode.none}]
    );
    this.channelList.sortFilterChannels();
  }

  ngOnInit() {
    this.getTrucks();
  }

  getTrucks(){
    this.channelList.setChannels(this.channelManager.getActors(this.category));
    this.channelList.sortFilterChannels();
  }

  async segmentChanged() {
    await this.slides.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slides.getActiveIndex();
  }

  loadContent(ev) {
    if(this.segment === 0) {
      this.getTrucks();
      setTimeout(() => ev.target.complete(), 700);
    }else{
      setTimeout(() => ev.target.complete(), 2000);
    }
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
