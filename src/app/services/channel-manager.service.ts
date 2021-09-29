import {Injectable} from '@angular/core';
import {ChannelInfo} from '../../../streams_lib/pkg';
import {RootChannel} from '../models/root-channel.model';
import {Observable} from 'rxjs';
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

  rootChannel: RootChannel;
  rootObservable: Observable<RootChannel>;
  updateRoot: any;
  loadingObservable: Observable<boolean>;
  updateLoading: any;
  private rootState = RootState.loading;

  constructor() {
    this.loadingObservable = new Observable(observer => {
      this.updateLoading = (nextValue: boolean) => observer.next(nextValue);
      observer.next(true);
      console.log('loading observable');
    });
    this.rootObservable = new Observable(observer => {
      this.updateRoot = (nextValue: RootChannel) => observer.next(nextValue);
    });
  }

  async init(rootInfo: ChannelInfo, mainnet: boolean = false){
    console.log('init');
    this.rootState = RootState.loading;
    this.rootChannel = new RootChannel(rootInfo, mainnet, this.rootState);
    await this.readInfo();
  }

  get root(): Observable<RootChannel>{
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

  private async readInfo(){
    const success = await this.rootChannel.readInfo();
    this.rootState = success ? RootState.ready : RootState.unknown;
    this.rootChannel.state = this.rootState;
    this.updateLoading(false);
    this.updateRoot(this.rootChannel);
  }
}
