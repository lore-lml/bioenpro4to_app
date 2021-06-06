import {Channel, InfoReader} from './channel.model';
import {Category} from './category-channel.model';
import {DailyChannel} from './daily-channel.model';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {Packet} from './packet.model';

export class ActorChannel extends Channel implements InfoReader{
  category: Category;
  actorId: string;
  dailyChannels: DailyChannel[];

  constructor(info: ChannelInfo, mainnet: boolean, category: Category, actorId: string) {
    super(info, mainnet);
    this.category = category;
    this.actorId = actorId;
    this.dailyChannels = [];
  }

  async readInfo(): Promise<boolean> {
    const res = await this.attach();
    if (!res){
      return false;
    }

    await this.reader.clone().fetch_raw_msgs();

    try {
      while (this.reader.has_next_msg()) {
        const m = this.reader.pop_msg();
        const p = new Packet(m.msg_id, m.public, m.masked);
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

  getNewsFeed(n: number, step: number) {
    const msgs = this.dailyChannels
      .map(ch => ch.getNewsFeed(n, step))
      .reduce((previousValue, currentValue) => previousValue.concat(currentValue))
      .sort((a, b) => b.timestamp - a.timestamp);

    const start = step*n;
    let end = (step+1)*n;
    const len = msgs.length;
    if (start > len){
      return [];
    }
    if (end >= len){
      end = len-1;
    }

    return msgs.slice(start, end);
  }

  private async readNextLayer(): Promise<boolean>{
    let success = true;
    for (const ch of this.dailyChannels){
      success &&= await ch.readMsgs();
    }
    return success;
  }
}
