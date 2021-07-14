import {Channel, InfoReader} from './channel.model';
import {ActorChannel} from './actor-channel.model';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {Packet} from './packet.model';
import {Feed} from './feed.model';

export enum Category{
  trucks,
  scales,
  biocells
}

export class CategoryChannel extends Channel implements InfoReader{
  category: Category;
  actorChannels: ActorChannel[];
  opened: boolean;

  constructor(info: ChannelInfo, mainnet: boolean, category: Category) {
    super(info, mainnet);
    this.category = category;
    this.actorChannels = [];
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

    try{
      while(this.reader.has_next_msg()){
        const m = this.reader.pop_msg();
        const p = new Packet(m.msg_id, m.public, m.masked);
        const jsonInfo = p.toJson()[0];
        const info = new ChannelInfo(jsonInfo.address.channel_id, jsonInfo.address.announce_id);
        this.actorChannels.push(new ActorChannel(info, this.mainnet, this.category, jsonInfo.actor_id));
      }

      return await this.readNextLayer();
    }catch (_){
      return false;
    }
  }

  getNewsFeed(n: number, step: number): Feed[] {
    const temp = this.actorChannels
      .map(ch => ch.getNewsFeed(n, step));

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

  getActorsArray(): Array<any> {
    return this.actorChannels.map(ch => ({col1: ch.actorId, col2: ch.getLastUpdate()}));
  }

  getDailyChannels(actorId: string): Array<any>{
    const actor = this.actorChannels.find(a => a.actorId.toLowerCase() === actorId.toLowerCase());
    if (actor === undefined){
      return [];
    }
    return actor.getDailyChannels();
  }

  getPacketsOf(actorId: string, date: string): Packet[]{
    const actor = this.actorChannels.find(a => a.actorId.toLowerCase() === actorId.toLowerCase());
    if (actor === undefined){
      return [];
    }
    return actor.getPacketsOf(date);
  }

  private async readNextLayer(): Promise<boolean>{
    let success = true;
    for (const ch of this.actorChannels){
      success &&= await ch.readInfo();
    }
    return success;
  }
}
