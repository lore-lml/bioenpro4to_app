import {Channel, InfoReader} from './channel.model';
import {Category} from './category-channel.model';
import {DailyChannel} from './daily-channel.model';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {Packet} from './packet.model';
import {Feed} from './feed.model';

export class ActorChannel extends Channel implements InfoReader{
  category: Category;
  actorId: string;
  dailyChannels: DailyChannel[];
  opened: boolean;

  constructor(info: ChannelInfo, mainnet: boolean, category: Category, actorId: string) {
    super(info, mainnet);
    this.category = category;
    this.actorId = actorId;
    this.dailyChannels = [];
    this.opened = false;
  }

  async readInfo(): Promise<boolean> {
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
        const jsonInfo = p.toJson()[0];
        const info = new ChannelInfo(jsonInfo.address.channel_id, jsonInfo.address.announce_id);
        const timestamp = jsonInfo.creation_timestamp;
        this.dailyChannels.push(new DailyChannel(info, this.mainnet, this.category, this.actorId, timestamp));
      }
      return await this.readNextLayer();

    }catch(_){
      return false;
    }
  }

  getNewsFeed(n: number, step: number): Feed[]{
    const today = new Date();
    const keyDate = `${DailyChannel.zeroPad(today.getDate())}/${DailyChannel.zeroPad(today.getMonth()+1)}/${today.getFullYear()}`;
    const temp = this.dailyChannels
      .filter(ch => ch.stringDate === keyDate)
      .map(ch => ch.getNewsFeed());

    if (temp.length <= 0){
      return [];
    }

    const res = temp.reduce((previousValue, currentValue) => previousValue.concat(currentValue))
      .sort((a, b) => b.timestamp - a.timestamp);

    const start = step*n;
    let end = (step+1)*n;
    const len = res.length;
    if (start > len){
      return [];
    }
    if (end >= len){
      end = len;
    }

    return res.slice(start, end);
  }

  // getLastUpdate(): number {
  //   if (this.dailyChannels.length === 0){
  //     return 0;
  //   }
  //   return this.dailyChannels.reduce((previousValue, currentValue) => {
  //     if (previousValue.timestamp > currentValue.timestamp){
  //       return previousValue;
  //     }
  //     return currentValue;
  //   })
  //     .timestamp;
  // }

  getDailyChannels(): Array<any>{
    return this.dailyChannels.map(ch => {
      const d = new Date(ch.timestamp*1000);
      return {day: d.getDate(), month: d.getMonth()+1, year: d.getFullYear()};
    });
  }

  getPacketsOf(date: string): Packet[]{
    const dailyChannel = this.dailyChannels.find(c => c.stringDate === date);
    if (dailyChannel === undefined){
      return [];
    }
    return dailyChannel.packets;
  }

  private async readNextLayer(): Promise<boolean>{
    let success = true;
    for (const ch of this.dailyChannels){
      success &&= await ch.readMsgs();
    }
    return success;
  }
}
