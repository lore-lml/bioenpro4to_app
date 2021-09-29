import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ChannelManagerService} from '../../services/channel-manager.service';
import {Packet} from '../../models/packet.model';
import {Category} from '../../models/category-channel.model';
import {HttpChannelManagerService} from '../../services/http-channel-manager.service';
import {UtilsService} from '../../services/utils.service';
import {of} from 'rxjs';

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
  category: Category;
  spinnerVisible: boolean;
  mode: string;
  constructor(private activatedRoute: ActivatedRoute,
              private channelManager: ChannelManagerService,
              private httpChannelManager: HttpChannelManagerService,
              private utils: UtilsService) {
    this.spinnerVisible = true;
  }

  async ngOnInit() {
    this.actorId = this.activatedRoute.snapshot.parent.paramMap.get('id');
    const date = this.activatedRoute.snapshot.paramMap.get('date');
    this.date = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4)}`;
    const category = this.activatedRoute.snapshot.parent.parent.url[0].path;
    this.category = this.categories[category];

    this.mode = (await this.utils.getValue('network_mode')).mode;
    this.getPackets(() => this.spinnerVisible = false);
  }

  getPackets(onComplete: () => void){
    const packetObs = this.mode === 'server' ? this.serverMode() : this.tangleMode();
    packetObs.subscribe(packets => {
        this.packets = packets;
        onComplete();
      });
  }

  serverMode(){
    return this.httpChannelManager.packetsOf(this.category, this.actorId, this.date);
  }

  tangleMode(){
    return of(this.channelManager.getPacketsOf(this.actorId, this.date, this.category));
  }

  toJson(msg: any){
    const json = JSON.parse(msg);
    return JSON.stringify(json, null, 1);
  }

  timestampToHoursDate(timestamp: number) {
    return this.utils.timestampToHoursDate(timestamp);
  }

  loadContent(ev: any) {
    this.getPackets(() => ev.target.complete());
  }
}
