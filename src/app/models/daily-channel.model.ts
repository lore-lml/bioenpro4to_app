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
  opened: boolean;

  constructor(info: ChannelInfo, mainnet: boolean, category: Category, actorId: string, timestamp: number) {
    super(info, mainnet);
    this.category = category;
    this.actorId = actorId;
    this.timestamp = timestamp;
    this.msgs = [];
    this.opened = false;
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

  static zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  getNewsFeed(): Feed[] {
    const found = this.msgs
      .map(m => new Feed(this.category, this.actorId, m.timestamp))
      .sort((a, b) => b.timestamp - a.timestamp);

    if (found.length === 0){
      return [];
    }
    return [found[0]];
  }

  async readMsgs(): Promise<boolean> {
    if (!this.opened){
      const res = await this.attach();
      if (!res){
        return false;
      }
      this.opened = true;
    }

    await this.reader.clone().fetch_raw_msgs();
    try {
      while (this.reader.has_next_msg()) {
        const m = this.reader.pop_msg();
        const p = Packet.fromStreamsResponse(m.msg_id, m.public, m.masked);
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

  get packets(): Packet[]{
    return this.msgs;
  }
}
