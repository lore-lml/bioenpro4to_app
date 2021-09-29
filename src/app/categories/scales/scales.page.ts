import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {IonSlides} from '@ionic/angular';
import {ChannelList, SortMode} from '../channel-list.model';
import {HttpChannelManagerService} from '../../services/http-channel-manager.service';
import {UtilsService} from '../../services/utils.service';

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
  spinnerVisible: boolean;
  mode: string;

  constructor(public channelManager: ChannelManagerService,
              public httpChannelManager: HttpChannelManagerService,
              private utils: UtilsService) {
    this.channelList = new ChannelList([],
      [{title: 'Id Bilancia', mode: SortMode.none}, {title: 'Channel Disponibili', mode: SortMode.none}]
    );
    this.spinnerVisible = true;
  }

  async ngOnInit() {
    this.mode =  (await this.utils.getValue('network_mode')).mode;
    this.getScales(() => this.spinnerVisible = false);
  }

  async getScales(onComplete: () => void){
    if (this.mode === 'server'){
      this.httpChannelManager.actorsOfCategory(this.category)
        .subscribe(actors => {
          this.channelList.setChannels(actors);
          this.channelList.sortFilterChannels();
          onComplete();
        });
      return;
    }
    this.channelList.setChannels(this.channelManager.getActors(this.category));
    this.channelList.sortFilterChannels();
    onComplete();
  }

  async segmentChanged() {
    await this.slides.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slides.getActiveIndex();
  }

  async loadContent(ev) {
    if(this.segment === 0) {
      if (this.mode === 'server') {
        await this.getScales(() => ev.target.complete());
        return;
      }
      await this.channelManager.updateAll();
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
