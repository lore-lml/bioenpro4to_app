import { Injectable } from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly channelId = '15a05797d8e69b50b5895247319a070931a263ec31076d4ba8ce18cdc028470c0000000000000000';
  readonly announceId = '90b72a5f2cfabd97daaf7322';
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
