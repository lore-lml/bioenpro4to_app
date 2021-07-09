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

  get stringHourDate(): string{
    const date = new Date(this.timestamp*1000);
    const day = DailyChannel.zeroPad(date.getDate());
    const month = DailyChannel.zeroPad(date.getMonth()+1);
    const year = date.getFullYear();
    const sDate =  `${day}/${month}/${year}`;
    const hours = date.getHours();
    const minutes = DailyChannel.zeroPad(date.getMinutes());
    return `${hours}.${minutes} - ${sDate}`;
  }

  private static zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  getNewsFeed(n: number, step: number): Feed[] {
    const start = step*n;
    let end = (step+1)*n;
    const len = this.msgs.length;
    if (start > len){
      return [];
    }
    if (end >= len){
      end = len;
    }

    return this.msgs.map(m => new Feed(this.category, this.actorId, m.timestamp))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(start, end);
  }

  async readMsgs(): Promise<boolean> {
    const res = await this.attach();
    if (!res){
      return false;
    }

    await this.reader.clone().fetch_raw_msgs();
    try {
      while (this.reader.has_next_msg()) {
        const m = this.reader.pop_msg();
        const p = new Packet(m.msg_id, m.public, m.masked);
        this.msgs.push(p);
      }
      //console.log(this.msgs);
      return true;

    }catch(_){
      return false;
    }
  }

  get numberOfMessages() {
    return this.msgs.length;
  }
}
