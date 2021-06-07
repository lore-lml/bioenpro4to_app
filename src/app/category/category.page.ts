import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Category} from '../models/category-channel.model';
import {ChannelManagerService} from '../services/channel-manager.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit{
  category: Category;
  title = '';
  constructor(private channelManager: ChannelManagerService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.title = this.route.snapshot.parent.url[0].path;
    this.title = this.title[0].toUpperCase() + this.title.substring(1);
    switch (this.title.toLowerCase()){
      case 'trucks':
        this.category = Category.trucks;
        break;
      case 'scales':
        this.category = Category.scales;
        break;
      case 'biocells':
        this.category = Category.biocells;
        break;
    }
  }
}
