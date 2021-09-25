import {Injectable} from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {ConnectableObservable, Observable, ReplaySubject} from 'rxjs';
import {multicast} from 'rxjs/operators';
import {Category} from '../models/category-channel.model';
import {Packet} from '../models/packet.model';
import {Storage} from '@ionic/storage-angular';

export enum RootState{
  loading,
  ready,
  unknown
}
@Injectable({
  providedIn: 'root'
})
export class ChannelManagerService {
  readonly rootKey = 'root_info';
  channelId = 'cd42d2bb0096f8ce4dc0ee74222104b1c2b6fb4e336c85c42bc57cf94d8a92730000000000000000';
  announceId = '89375ced49892f2d65d67f64';
  rootChannel: RootChannel;
  rootObservable: ConnectableObservable<RootChannel>;
  updateRoot: any;
  loadingObservable: Observable<boolean>;
  updateLoading: any;
  private storage: any;
  private rootState = RootState.loading;

  constructor(private ionicStorage: Storage) {
    this.loadingObservable = new Observable(observer => {
      this.updateLoading = (nextValue: boolean) => observer.next(nextValue);
      observer.next(true);
      console.log('loading observable');
    });
    this.rootObservable = new Observable(observer => {
      this.updateRoot = (nextValue: RootChannel) => observer.next(nextValue);
    }).pipe(
      multicast(() => new ReplaySubject<RootChannel>()),
    ) as ConnectableObservable<RootChannel>;
    this.rootObservable.connect();
  }

  private static zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  async init(){
    if (this.storage === undefined){
      this.storage = await this.ionicStorage.create();
    }
    await this.retrieveChannelInfo();
    const rootInfo = new ChannelInfo(this.channelId, this.announceId);
    this.rootChannel = new RootChannel(rootInfo, false, this.rootState);
    await this.readInfo();
  }

  get root(): ConnectableObservable<RootChannel>{
    return this.rootObservable;
  }

  get isRootLoading(){
    return this.rootState === RootState.loading;
  }

  get loadingPopover(): Observable<boolean>{
    return this.loadingObservable;
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

  async updateAll(){
    await this.readInfo();
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

  async setChannelInfo(info: string): Promise<boolean>{
    const regex = /[a-z0-9]+:[a-z0-9]+/;
    if (!new RegExp(regex).test(info)){
      return false;
    }
    const res = await this.storage.set(this.rootKey, info) !== null;
    this.rootState = RootState.loading;
    this.updateLoading(true);
    this.init().catch(e => console.error(e));
    return res;
  }

  private async retrieveChannelInfo(){
    const info: string|null = await this.storage.get(this.rootKey);
    if (info == null){
      return;
    }

    const address = info.split(':');
    if(address.length !== 2){
      return;
    }
    this.channelId = address[0];
    this.announceId = address[1];
  }

  private async readInfo(){
    const success = await this.rootChannel.readInfo();
    this.rootState = success ? RootState.ready : RootState.unknown;
    this.rootChannel.state = this.rootState;
    this.updateLoading(false);
    this.updateRoot(this.rootChannel);
  }
}
