import {Injectable} from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {ConnectableObservable, Observable, Subject} from 'rxjs';
import {multicast} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly channelId = '15a05797d8e69b50b5895247319a070931a263ec31076d4ba8ce18cdc028470c0000000000000000';
  readonly announceId = '90b72a5f2cfabd97daaf7322';
  rootChannel: RootChannel;
  rootObservable: ConnectableObservable<RootChannel>;
  updateObservable: any;
  rootReady = false;

  constructor() {
    const rootInfo = new ChannelInfo(this.channelId, this.announceId);
    this.rootChannel = new RootChannel(rootInfo, false);
    this.rootObservable = new Observable(observer => {
      observer.next(undefined);
      this.updateObservable = (nextValue: RootChannel) => observer.next(nextValue);
    }).pipe(multicast(() => new Subject<RootChannel>())) as ConnectableObservable<RootChannel>;
    this.rootObservable.connect();

    this.rootChannel.readInfo().then(success => {
      const next = success ? this.rootChannel : undefined;
      this.updateObservable(next);
      this.rootReady = true;
    });
  }

  get root(): ConnectableObservable<RootChannel>{
    return this.rootObservable;
  }
}
