import {Injectable} from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {ConnectableObservable, Observable, Subject} from 'rxjs';
import {multicast} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly channelId = '97a9ee591b8bd9f68eba0b74e55dc84b27b9766d35c4bf8ef24264c307111c640000000000000000';
  readonly announceId = 'e5e26e9ae0069b63b181ed68';
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
