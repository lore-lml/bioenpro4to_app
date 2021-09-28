import {Component, OnInit} from '@angular/core';
import {ChannelManagerService} from '../services/channel-manager.service';
import {RootChannel} from '../models/root-channel.model';
import {Feed} from '../models/feed.model';
import {ModalController} from '@ionic/angular';
import {AlertsComponent} from '../modals/alerts/alerts.component';
import {HttpChannelManagerService} from '../services/http-channel-manager.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  readonly feedImgs = ['assets/categories/trucks.svg', 'assets/categories/scales.svg', 'assets/categories/biocells.svg'];
  readonly categories = ['trucks', 'scales', 'biocells'];
  title = 'Monitoraggio';
  categoryOpts = {
    freeMode: true,
    slidesPerView: 2.5
  };
  categoryInfo: any;
  root: RootChannel;
  feed: Feed[];
  tryFeedRequest: number;

  constructor(private channelManager: ChannelManagerService, private httpChannelManager: HttpChannelManagerService,
              private modalController: ModalController) {
    this.categoryInfo = [
      {title: 'Camion', imgSrc: this.feedImgs[0], link: '/trucks'},
      {title: 'Pesate', imgSrc: this.feedImgs[1], link: '/scales'},
      {title: 'Biocelle', imgSrc: this.feedImgs[2], link: '/biocells'},
    ];
    this.feed = [];
  }

  ngOnInit() {
    /*this.channelManager.root.subscribe(root => {
      if (root.state === RootState.ready) {
        this.root = root;
        this.feed = this.root.getNewsFeed(5);
      }
    });*/
    this.tryFeedRequest = 3;
    this.updateFeed();
    setInterval(() => this.updateFeed(), 60*1000);
  }

  updateFeed(){
    this.httpChannelManager.newsFeed(10)
      .subscribe(feed => {
        if (feed === undefined && this.tryFeedRequest > 0){
          this.tryFeedRequest--;
          setTimeout(() => this.updateFeed(), 1000);
          return;
        }else if (feed === undefined){
          this.feed = [];
          return;
        }
        this.feed = feed;
      });
  }

  isLoading() {
    return this.channelManager.isRootLoading && this.httpChannelManager.isLoading;
  }

  getFeedImg(feed: Feed){
    return this.feedImgs[feed.category];
  }

  async showAlerts() {
    const modal = await this.modalController.create({
      component: AlertsComponent,
      cssClass: 'alerts'
    });
    await modal.present();
  }

  toPage(f: Feed): string{
    const cat = this.categories[f.category];
    const date = f.date.replace(/\//g, '');
    return `/${cat}/${f.actorId}/messages/${date}`;
  }
}
