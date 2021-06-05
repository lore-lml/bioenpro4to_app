import {ChannelInfo} from '../../../streams_lib/pkg';
import {Category, CategoryChannel} from './category-channel.model';
import {Channel, InfoReader} from './channel.model';
import {Packet} from './packet.model';

export class RootChannel extends Channel implements InfoReader{
  categoryChannels: CategoryChannel[];

  constructor(rootInfo: ChannelInfo, mainnet: boolean) {
    super(rootInfo, mainnet);
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

  private async readNextLayer(): Promise<boolean>{
    let success = true;
    for (const ch of this.categoryChannels){
      success &&= await ch.readInfo();
    }
    return success;
  }
}
