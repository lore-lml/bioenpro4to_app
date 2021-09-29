import {Component, OnInit} from '@angular/core';
import {ChannelManagerService, RootState} from '../services/channel-manager.service';
import {RootChannel} from '../models/root-channel.model';
import {Feed} from '../models/feed.model';
import {ModalController} from '@ionic/angular';
import {AlertsComponent} from '../modals/alerts/alerts.component';
import {HttpChannelManagerService} from '../services/http-channel-manager.service';
import {UtilsService} from '../services/utils.service';
import {of} from 'rxjs';

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

  constructor(private channelManager: ChannelManagerService,
              private httpChannelManager: HttpChannelManagerService,
              private utils: UtilsService,
              private modalController: ModalController) {
    this.categoryInfo = [
      {title: 'Camion', imgSrc: this.feedImgs[0], link: '/trucks'},
      {title: 'Pesate', imgSrc: this.feedImgs[1], link: '/scales'},
      {title: 'Biocelle', imgSrc: this.feedImgs[2], link: '/biocells'},
    ];
    this.feed = [];
  }

  async ngOnInit() {

    this.utils.modeReady.subscribe(async res => {
      if (!res) {
        return of(undefined);
      }
      const mode = (await this.utils.getValue('network_mode')).mode;
      if (mode === 'server'){
        this.serverMode();
      }else{
        this.tangleMode();
      }
    });
  }

  serverMode(){
    this.updateFeed();
    setInterval(() => this.updateFeed(), 60*1000);
  }

  tangleMode(){
    this.channelManager.root.subscribe(root => {
      if (root.state === RootState.ready) {
        this.root = root;
        this.updateFeed(false);
        setInterval(() => this.updateFeed(false), 60*1000);
      }
    });
  }

  updateFeed(server: boolean = true){
    if (!server){
      this.feed = this.root.getNewsFeed(10);
      return;
    }
    this.httpChannelManager.newsFeed(10)
      .subscribe(feed => {
        if (feed === undefined){
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
