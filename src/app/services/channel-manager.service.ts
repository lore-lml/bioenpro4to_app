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
  channelId = '98e6fd8c7e3ea271a236ea5bad91dbba0573832213bd00c12987fd22181622af0000000000000000';
  announceId = '806376f72ee149d6cf435a3e';
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
    });
    this.rootObservable = new Observable(observer => {
      this.updateRoot = (nextValue: RootChannel) => observer.next(nextValue);
      this.init().catch(e => console.error(e));
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
