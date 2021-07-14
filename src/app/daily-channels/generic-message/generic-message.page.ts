import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {Packet} from '../../models/packet.model';
import {Category} from '../../models/category-channel.model';

@Component({
  selector: 'app-generic-message',
  templateUrl: './generic-message.page.html',
  styleUrls: ['./generic-message.page.scss'],
})
export class GenericMessagePage implements OnInit {

  readonly categories = {trucks: Category.trucks, scales: Category.scales, biocells: Category.biocells};
  actorId = '';
  date = '';
  packets: Packet[] = [];
  dataShowed: boolean[];
  toShow: number;
  category: Category;
  constructor(private activatedRoute: ActivatedRoute, public channelManager: ChannelManagerService) { }

  ngOnInit() {
    this.actorId = this.activatedRoute.snapshot.parent.paramMap.get('id');
    const date = this.activatedRoute.snapshot.paramMap.get('date');
    this.date = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`;
    const category = this.activatedRoute.snapshot.parent.parent.url[0].path;
    this.category = this.categories[category];

    this.packets = this.channelManager.getPacketsOf(this.actorId, this.date, this.category);
    this.dataShowed = this.packets.map(() => false);
  }

  toJson(msg: any){
    return JSON.stringify(msg, null, 2);
  }

  toggleShow(idx: number){
    const res = !this.dataShowed[idx];
    this.dataShowed = this.dataShowed.map(() => false);
    this.dataShowed[idx] = res;
  }
}
