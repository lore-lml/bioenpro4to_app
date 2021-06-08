import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {IonSlides} from '@ionic/angular';
import {ChannelList, SortMode} from '../channel-list.model';

@Component({
  selector: 'app-scales',
  templateUrl: './scales.page.html',
  styleUrls: ['./scales.page.scss', '../categories.scss'],
})
export class ScalesPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  segment = 0;
  sliderOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 400
  };

  category = Category.scales;
  channelList: ChannelList;

  constructor(public channelManager: ChannelManagerService) {
    this.channelList = new ChannelList([
        {id: 'xasd', lastUpdate: Math.trunc(Date.now() / 1000)},
        {id: 'egas', lastUpdate: Math.trunc(Date.now() / 1000) + 180},
        {id: 'ksae', lastUpdate: Math.trunc(Date.now() / 1000) + 60},
        {id: 'zzzz', lastUpdate: Math.trunc(Date.now() / 1000) + 7886}
      ],
      [{title: 'Id Bilancia', mode: SortMode.none}, {title: 'Ultimo Aggiornamento', mode: SortMode.none}]
    );
    this.channelList.sortFilterChannels();
  }

  ngOnInit() {
    this.getScales();
  }

  getScales(){
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
      this.getScales();
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
