import {Component, OnInit} from '@angular/core';
import {ChannelManagerService, RootState} from '../services/channel-manager.service';
import {RootChannel} from '../models/root-channel.model';
import {Feed} from '../models/feed.model';
import {Category} from '../models/category-channel.model';

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
  /*lastUpdate = [
    {imgSrc: 'assets/categories/trucks.svg', title: 'Actor1', timestamp: '10.55 - 21/05/2012'},
    {imgSrc: 'assets/categories/trucks.svg', title: 'Actor2', timestamp: '9.55 - 20/05/2012'},
    {imgSrc: 'assets/categories/scales.svg', title: 'Actor3', timestamp: '8.55 - 19/05/2012'},
    {imgSrc: 'assets/categories/biocells.svg', title: 'Actor4', timestamp: '7.55 - 18/05/2012'},
    {imgSrc: 'assets/categories/biocells.svg', title: 'Actor5', timestamp: '6.55 - 17/05/2012'},
    {imgSrc: 'assets/categories/scales.svg', title: 'Actor6', timestamp: '5.55 - 16/05/2012'},
  ];*/

  root: RootChannel;
  feed: Feed[];

  constructor(private channelManager: ChannelManagerService) {
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
}
