import {Channel} from './channel.model';
import {Category} from './category-channel.model';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {Packet} from './packet.model';
import {Feed} from './feed.model';

export class DailyChannel extends Channel{
  category: Category;
  actorId: string;
  timestamp: number;
  msgs: Packet[];

  constructor(info: ChannelInfo, mainnet: boolean, category: Category, actorId: string, timestamp: number) {
    super(info, mainnet);
    this.category = category;
    this.actorId = actorId;
    this.timestamp = timestamp;
    this.msgs = [];
  }

  get stringDate(): string{
    const date = new Date(this.timestamp*1000);
    const day = DailyChannel.zeroPad(date.getDate());
    const month = DailyChannel.zeroPad(date.getMonth()+1);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  private static zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  getNewsFeed(): Feed[] {
    return undefined;
  }
}
