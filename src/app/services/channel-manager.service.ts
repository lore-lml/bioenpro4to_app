import {Injectable} from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {ConnectableObservable, Observable, ReplaySubject} from 'rxjs';
import {multicast} from 'rxjs/operators';
import {Category} from '../models/category-channel.model';
import {Packet} from '../models/packet.model';

export enum RootState{
  loading,
  ready,
  unknown
}
@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly channelId = '952100d0e404eebfcf48c75bad3f4828dedabf68f939abc5e61f7b065664f4960000000000000000';
  readonly announceId = '96ec81ca1324ad9c54076bf1';
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

  getDailyChannels(actorId: string, category: Category): Array<any>{
    return this.rootChannel.getDailyChannels(actorId, category);
  }

  getPacketsOf(actorId: string, date: string, category: Category): Packet[]{
    return this.rootChannel.getPacketsOf(actorId, date, category);
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
