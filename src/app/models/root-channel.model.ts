import {ChannelInfo} from '../../../streams_lib/pkg';
import {Category, CategoryChannel} from './category-channel.model';
import {Channel, InfoReader} from './channel.model';
import {Packet} from './packet.model';
import {Feed} from './feed.model';
import {RootState} from '../services/channel-manager.service';

export class RootChannel extends Channel implements InfoReader{
  categoryChannels: CategoryChannel[];
  state: RootState;

  constructor(rootInfo: ChannelInfo, mainnet: boolean, state: RootState) {
    super(rootInfo, mainnet);
    this.state = state;
    this.categoryChannels = [];
  }

  async readInfo(): Promise<boolean> {
    const res = await this.attach();
    if (!res){
      return false;
    }

    if (!await this.reader.clone().fetch_raw_msgs()){
      return false;
    }

    try{
      if(this.reader.has_next_msg()){
        const m = this.reader.pop_msg();
        const p = new Packet(m.msg_id, m.public, m.masked);
        const jsonInfo = p.toJson()[0];

        const trucks = new ChannelInfo(jsonInfo.trucks.channel_id, jsonInfo.trucks.announce_id);
        const scales = new ChannelInfo(jsonInfo.weighing_scales.channel_id, jsonInfo.weighing_scales.announce_id);
        const biocells = new ChannelInfo(jsonInfo.biocells.channel_id, jsonInfo.biocells.announce_id);

        this.categoryChannels.push(new CategoryChannel(trucks, this.mainnet, Category.trucks));
        this.categoryChannels.push(new CategoryChannel(scales, this.mainnet, Category.scales));
        this.categoryChannels.push(new CategoryChannel(biocells, this.mainnet, Category.biocells));
      }
      return await this.readNextLayer();
    }catch (_){
      return false;
    }
  }

  getNewsFeed(n: number, step: number = 0): Feed[]{
    const temp = this.categoryChannels
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

  getActorsArray(category: Category): Array<any>{
    if (this.categoryChannels.length === 0){
      return [];
    }
    return this.categoryChannels[category].getActorsArray();
  }

  getDailyChannels(actorId: string, category: Category): Array<any> {
    if (this.categoryChannels.length === 0){
      return [];
    }
    return this.categoryChannels[category].getDailyChannels(actorId);
  }

  getPacketsOf(actorId: string, date: string, category: Category): Packet[]{
    if (this.categoryChannels.length === 0){
      return [];
    }
    return this.categoryChannels[category].getPacketsOf(actorId, date);
  }

  private async readNextLayer(): Promise<boolean>{
    let success = true;
    for (const ch of this.categoryChannels){
      success &&= await ch.readInfo();
    }
    return success;
  }
}
