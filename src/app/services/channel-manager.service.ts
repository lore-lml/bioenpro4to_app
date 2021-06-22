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
  readonly channelId = '0c49909d042373997c04fad0a0bd8a89083f0a811ef51f8326c9d3454ac127aa0000000000000000';
  readonly announceId = '56efdae80eaff27980e4f724';
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
