import {Component, OnInit, ViewChild} from '@angular/core';
import {IonSlides} from '@ionic/angular';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';

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

  category: Category;
  trucks = [];
  constructor(private channelManager: ChannelManagerService) {
    this.category = Category.trucks;
  }

  ngOnInit() {
    this.getTrucks();
  }

  getTrucks(){
    this.trucks = this.channelManager.getActors(this.category);
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
}
