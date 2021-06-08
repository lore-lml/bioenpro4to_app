import {Component, OnInit, ViewChild} from '@angular/core';
import {Category} from '../../models/category-channel.model';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {IonSlides} from '@ionic/angular';

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

  category: Category;
  title = '';
  scales = [];
  constructor(private channelManager: ChannelManagerService) {
    this.category = Category.scales;
  }

  ngOnInit() {
    this.getScales();
  }

  getScales(){
    this.scales = this.channelManager.getActors(this.category);
  }

  async segmentChanged() {
    await this.slides.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slides.getActiveIndex();
  }

  loadContent(ev) {
    this.getScales();
    setTimeout(() => ev.target.complete(), 700);
  }

}
