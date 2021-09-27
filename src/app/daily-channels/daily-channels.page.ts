import {Component, OnInit} from '@angular/core';
import {Category} from '../models/category-channel.model';
import {ActivatedRoute} from '@angular/router';
import {ChannelManagerService} from '../services/channel-manager.service';
import {HttpChannelManagerService} from '../services/http-channel-manager.service';
import {ChannelDateFormat, DailyChannelGrid} from './daily-channel-grid.model';
import {UtilsService} from '../services/utils.service';

@Component({
  selector: 'app-daily-channels',
  templateUrl: './daily-channels.page.html',
  styleUrls: ['./daily-channels.page.scss'],
})
export class DailyChannelsPage implements OnInit {

  readonly categories = {trucks: Category.trucks, scales: Category.scales, biocells: Category.biocells};
  id = '';
  category: Category;
  channelGrids: DailyChannelGrid[];
  constructor(private activatedRoute: ActivatedRoute,
              private channelManager: ChannelManagerService,
              private httpChannelManager: HttpChannelManagerService,
              private utils: UtilsService) {
    this.channelGrids = [];
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const category = this.activatedRoute.snapshot.parent.parent.url[0].path;
    this.category = this.categories[category];
    this.getMessages();
  }

  getMessages(){
    /*this.channelList.setChannels(this.channelManager.getDailyChannels(this.id, this.category));
    this.channelList.sortFilterChannels();*/
    this.httpChannelManager.dailyChannelsOfActor(this.category, this.id)
      .subscribe(channels =>{
        this.channelGrids = channels.map(dateFormats => new DailyChannelGrid(dateFormats));
      });
  }

  async loadContent(ev) {
    setTimeout(() => ev.target.complete(), 2000);
  }

  filterChannels(ev: any) {
  }

  toMessagePage(ch: ChannelDateFormat): string{
    const d = `${this.utils.zeroPad(ch.day)}${this.utils.zeroPad(ch.month)}${ch.year}`;
    return `messages/${d}`;
  }

  availableChannels(grid: DailyChannelGrid) {
    const end = grid.listLength === 1 ? 'e' : 'i';
    return `${grid.listLength} canal${end} disponibil${end}`;
  }

  monthYearGrid(grid: DailyChannelGrid): string{
    const mmyy = grid.monthYear();
    const year = mmyy[1];
    let month;
    switch (mmyy[0]) {
      case 1: month = 'Gennaio'; break;
      case 2: month = 'Febbraio'; break;
      case 3: month = 'Marzo'; break;
      case 4: month = 'Aprile'; break;
      case 5: month = 'Maggio'; break;
      case 6: month = 'Giugno'; break;
      case 7: month = 'Luglio'; break;
      case 8: month = 'Agosto'; break;
      case 9: month = 'Settembre'; break;
      case 10: month = 'Ottobre'; break;
      case 11: month = 'Novembre'; break;
      case 12: month = 'Dicembre'; break;
      default: month = 'err'; break;
    }
    return `${month} ${year}`;
  }
}
