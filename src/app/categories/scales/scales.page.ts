import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {IonSlides} from '@ionic/angular';
import {ChannelList, SortMode} from '../channel-list.model';
import {HttpChannelManagerService} from "../../services/http-channel-manager.service";

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

  constructor(public channelManager: ChannelManagerService, public httpChannelManager: HttpChannelManagerService) {
    this.channelList = new ChannelList([
        {col1: 'xasd', col2: Math.trunc(Date.now() / 1000)},
        {col1: 'egas', col2: Math.trunc(Date.now() / 1000) + 180},
        {col1: 'ksae', col2: Math.trunc(Date.now() / 1000) + 60},
        {col1: 'zzzz', col2: Math.trunc(Date.now() / 1000) + 7886}
      ],
      [{title: 'Id Bilancia', mode: SortMode.none}, {title: 'Channel Disponibili', mode: SortMode.none}]
    );
    this.channelList.sortFilterChannels();
  }

  ngOnInit() {
    this.getScales();
  }

  getScales(){
    /*this.channelList.setChannels(this.channelManager.getActors(this.category));
    this.channelList.sortFilterChannels();*/
    this.httpChannelManager.actorsOfCategory(this.category)
      .subscribe(actors => {
        this.channelList.setChannels(actors);
        this.channelList.sortFilterChannels();
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
      await this.channelManager.updateAll();
      this.getScales();
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
