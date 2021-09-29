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
  spinnerVisible: boolean;
  isSearching: boolean;
  searchingGrid: DailyChannelGrid;
  filterGrid: DailyChannelGrid;
  constructor(private activatedRoute: ActivatedRoute,
              private channelManager: ChannelManagerService,
              private httpChannelManager: HttpChannelManagerService,
              private utils: UtilsService) {
    this.channelGrids = [];
    this.spinnerVisible = true;
    this.isSearching = false;
    this.filterGrid = new DailyChannelGrid([]);
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    const category = this.activatedRoute.snapshot.parent.parent.url[0].path;
    this.category = this.categories[category];
    this.getMessages(() => this.spinnerVisible = false);
  }

  getMessages(onComplete?: () => void){
    /*this.channelList.setChannels(this.channelManager.getDailyChannels(this.id, this.category));
    this.channelList.sortFilterChannels();*/
    this.httpChannelManager.dailyChannelsOfActor(this.category, this.id)
      .subscribe(channels =>{
        this.channelGrids = channels
          .sort((c1,c2) => {
            const a = c1[0];
            const b = c2[0];
            return new Date(b.year, b.month, 1).getTime() - new Date(a.year, a.month, 1).getTime();
          })
          .map(dateFormats => new DailyChannelGrid(dateFormats));
        const flatList = this.channelGrids.map(grid => grid.dateList)
          .reduce((prev, curr) => prev.concat(curr));
        this.searchingGrid = new DailyChannelGrid(flatList);
        if (onComplete !== undefined){
          onComplete();
        }
      });
  }

  async loadContent(ev) {
    this.getMessages(() => ev.target.complete());
  }

  filterChannels(ev: any) {
    const filterVal = ev.currentTarget.value.trim();
    this.isSearching = filterVal !== '';
    this.filteredGrid(filterVal.toLowerCase());
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
    const mmyy = grid.monthYear(0);
    const month = this.utils.monthToString(mmyy[0]);
    const year = mmyy[1];
    return `${month} ${year}`;
  }

  get noContent(): boolean{
    return this.channelGrids.length === 0;
  }

  filteredGrid(filterVal: string){
    if (filterVal === ''){
      this.filterGrid.dateList = [];
      return;
    }
    console.log(filterVal);
    this.filterGrid.dateList = this.searchingGrid.dateList
      .map(v => {
        const d1 = `${this.utils.zeroPad(v.day)}/${this.utils.zeroPad(v.month)}/${v.year}`;
        const d2 = `${this.utils.zeroPad(v.day)}-${this.utils.zeroPad(v.month)}-${v.year}`;
        const d3 = `${v.day}/${v.month}/${v.year}`;
        const d4 = `${v.day} ${this.utils.monthToString(v.month)} ${v.year}`.toLowerCase();
        return [v, [d1, d2, d3, d4]];
      })
      .filter(v => (v[1] as string[]).some(value => value.includes(filterVal)))
      .map(v => v[0] as ChannelDateFormat);
  }
}
