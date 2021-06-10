import {Injectable} from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {ConnectableObservable, Observable, ReplaySubject} from 'rxjs';
import {multicast} from 'rxjs/operators';
import {Category} from '../models/category-channel.model';

export enum RootState{
  loading,
  ready,
  unknown
}
@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly channelId = '97a9ee591b8bd9f68eba0b74e55dc84b27b9766d35c4bf8ef24264c307111c640000000000000000';
  readonly announceId = 'e5e26e9ae0069b63b181ed68';
  rootChannel: RootChannel;
  rootObservable: ConnectableObservable<RootChannel>;
  updateObservable: any;
  private rootState = RootState.loading;

  constructor() {
    const rootInfo = new ChannelInfo(this.channelId, this.announceId);
    this.rootChannel = new RootChannel(rootInfo, false, this.rootState);
    this.rootObservable = new Observable(observer => {
      this.updateObservable = (nextValue: RootChannel) => observer.next(nextValue);
      this.readInfo().catch(e => console.error(e));
    }).pipe(
      multicast(() => new ReplaySubject<RootChannel>()),
    ) as ConnectableObservable<RootChannel>;
    this.rootObservable.connect();
  }

  private static zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  async readInfo(){
    const success = await this.rootChannel.readInfo();
    this.rootState = success ? RootState.ready : RootState.unknown;
    this.rootChannel.state = this.rootState;
    this.updateObservable(this.rootChannel);
  }

  get root(): ConnectableObservable<RootChannel>{
    return this.rootObservable;
  }

  get isRootLoading(){
    return this.rootState === RootState.loading;
  }

  getActors(category: Category): Array<any>{
    return this.rootChannel.getActorsArray(category);
  }

  timestampToHoursDate(timestamp: number){
    const date = new Date(timestamp*1000);
    const day = ChannelManagerService.zeroPad(date.getDate());
    const month = ChannelManagerService.zeroPad(date.getMonth()+1);
    const year = date.getFullYear();
    const sDate =  `${day}/${month}/${year}`;
    const hours = date.getHours();
    const minutes = ChannelManagerService.zeroPad(date.getMinutes());
    return `${hours}.${minutes} - ${sDate}`;
  }
}
