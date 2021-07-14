import {Component, OnInit} from '@angular/core';
import {ChannelManagerService, RootState} from '../services/channel-manager.service';
import {RootChannel} from '../models/root-channel.model';
import {Feed} from '../models/feed.model';
import {Category} from '../models/category-channel.model';
import {ModalController} from '@ionic/angular';
import {AlertsComponent} from '../modals/alerts/alerts.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  title = 'Monitoraggio';
  categoryOpts = {
    freeMode: true,
    slidesPerView: 2.5
  };
  categoryInfo = [
    {title: 'Camion', imgSrc: 'assets/categories/trucks.svg', link: '/trucks'},
    {title: 'Pesate', imgSrc: 'assets/categories/scales.svg', link: '/scales'},
    {title: 'Biocelle', imgSrc: 'assets/categories/biocells.svg', link: '/biocells'},
  ];

  root: RootChannel;
  feed: Feed[];

  constructor(private channelManager: ChannelManagerService, private modalController: ModalController) {
    this.feed = [];
  }

  ngOnInit() {
    this.channelManager.root.subscribe(root => {
      if (root !== undefined && root.state === RootState.ready) {
        this.root = root;
        this.feed = this.root.getNewsFeed(5);
      }
    });
  }

  isLoading() {
    return this.channelManager.isRootLoading;
  }

  getFeedImg(feed: Feed){
    switch (feed.category){
      case Category.trucks:
        return 'assets/categories/trucks.svg';
      case Category.scales:
        return 'assets/categories/scales.svg';
      case Category.biocells:
        return 'assets/categories/biocells.svg';
    }
  }

  async showAlerts() {
    const modal = await this.modalController.create({
      component: AlertsComponent,
      cssClass: 'alerts'
    });
    await modal.present();
  }
}
