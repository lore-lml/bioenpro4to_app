import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {ChannelList, SortMode} from '../channel-list.model';
import {HttpChannelManagerService} from '../../services/http-channel-manager.service';

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
  spinnerVisible: boolean;

  constructor(public channelManager: ChannelManagerService, public httpChannelManager: HttpChannelManagerService) {
    this.channelList = new ChannelList([
      // {col1: 'xasd', col2: Math.trunc(Date.now() / 1000)},
      // {col1: 'egas', col2: Math.trunc(Date.now() / 1000) + 180},
      // {col1: 'ksae', col2: Math.trunc(Date.now() / 1000) + 60},
      // {col1: 'zzzz', col2: Math.trunc(Date.now() / 1000) + 7886}
    ],
      [{title: 'Targa', mode: SortMode.none}, {title: 'Channel Disponibili', mode: SortMode.none}]
    );
    //this.channelList.sortFilterChannels();
    this.spinnerVisible = true;
  }

  ngOnInit() {
    this.getTrucks(() => this.spinnerVisible = false);
  }

  getTrucks(onComplete: () => void){
    /*this.channelList.setChannels(this.channelManager.getActors(this.category));
    this.channelList.sortFilterChannels();*/
    this.httpChannelManager.actorsOfCategory(this.category)
      .subscribe(actors => {
        this.channelList.setChannels(actors);
        this.channelList.sortFilterChannels();
        onComplete();
      });
  }

  async segmentChanged() {
    await this.slides.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slides.getActiveIndex();
  }

  async loadContent(ev) {
    if(this.segment === 0) {
      //await this.channelManager.updateAll();
      this.getTrucks(() => ev.target.complete());
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
