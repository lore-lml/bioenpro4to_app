import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {Category} from '../../models/category-channel.model';
import {ChannelList, SortMode} from '../channel-list.model';
import {ChannelManagerService} from '../../services/channel-manager.service';

@Component({
  selector: 'app-biocells',
  templateUrl: './biocells.page.html',
  styleUrls: ['./biocells.page.scss', '../categories.scss'],
})
export class BiocellsPage implements OnInit {

  @ViewChild(IonSlides) slides: IonSlides;
  segment = 0;
  sliderOptions = {
    initialSlide: 0,
    slidesPerView: 1,
    speed: 400
  };

  category = Category.biocells;
  channelList: ChannelList;

  constructor(public channelManager: ChannelManagerService) {
    this.channelList = new ChannelList([
        {col1: 'xasd', col2: Math.trunc(Date.now() / 1000)},
        {col1: 'egas', col2: Math.trunc(Date.now() / 1000) + 180},
        {col1: 'ksae', col2: Math.trunc(Date.now() / 1000) + 60},
        {col1: 'zzzz', col2: Math.trunc(Date.now() / 1000) + 7886}
      ],
      [{title: 'Id Biocella', mode: SortMode.none}, {title: 'Ultimo Aggiornamento', mode: SortMode.none}]
    );
    this.channelList.sortFilterChannels();
  }

  ngOnInit() {
    this.getBiocells();
  }

  getBiocells(){
    this.channelList.setChannels(this.channelManager.getActors(this.category));
    this.channelList.sortFilterChannels();
  }

  async segmentChanged() {
    await this.slides.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slides.getActiveIndex();
  }

  async loadContent(ev) {
    if(this.segment === 0) {
      await this.channelManager.updateAll();
      this.getBiocells();
      ev.target.complete();
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
