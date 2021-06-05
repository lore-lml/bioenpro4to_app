import { Injectable } from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly channelId = 'ff47c242da89c2decbbcd2a91b3da93dd5639417ac4c3f72c44d521c1fad69f30000000000000000';
  readonly announceId = '49768e9a7f0d1fb476ee361a';
  rootInfo: ChannelInfo;
  rootChannel: RootChannel;
  rootObservable: Observable<RootChannel>;
  updateObservable: any;

  constructor() {
    this.rootInfo = new ChannelInfo(this.channelId, this.announceId);
    this.rootChannel = new RootChannel(this.rootInfo, false);
    this.rootObservable = new Observable(observer => {
      observer.next(undefined);
      this.updateObservable = (nextValue: RootChannel) => observer.next(nextValue);
    });
    this.rootChannel.readInfo().then(success => {
      if (success){
        this.updateObservable(this.rootChannel);
      }
    });
  }

  get root(): Observable<RootChannel>{
    return this.rootObservable;
  }
}
