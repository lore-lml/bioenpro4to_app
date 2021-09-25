import {ChannelInfo, ChannelReader, ChannelReaderBuilder} from '../../../streams_lib/pkg';

export interface InfoReader {
  readInfo(): Promise<boolean>;
}

export abstract class Channel {
  info: ChannelInfo;
  reader: ChannelReader;
  mainnet: boolean;
  attached: boolean;

  protected constructor(info: ChannelInfo, mainnet: boolean) {
    this.info = info;
    this.mainnet = mainnet;
    const node = mainnet ? 'https://chrysalis-nodes.iota.cafe' : 'https://api.lb-0.h.chrysalis-devnet.iota.cafe/';
    this.reader = new ChannelReaderBuilder().node(node).build(info.channel_id(), info.announce_id());
    this.attached = false;
  }

  async attach(): Promise<boolean>{
    try{
      await this.reader.clone().attach();
      this.attached = true;
      return true;
    }catch (_){
      return false;
    }
  }
}
