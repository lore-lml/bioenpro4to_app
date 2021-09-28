import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, mergeMap, reduce, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Feed} from '../models/feed.model';
import {Category} from '../models/category-channel.model';
import {Packet} from '../models/packet.model';

@Injectable({
  providedIn: 'root'
})
export class HttpChannelManagerService {
  loadingObservable: Observable<boolean>;
  private baseUrl: string;
  private channelManager: string;
  private feedLoading: boolean;
  private updateLoading: any;

  constructor(private http: HttpClient) {
    this.feedLoading = true;
    this.loadingObservable = new Observable(observer => {
      this.updateLoading = (nextValue: boolean) => observer.next(nextValue);
      this.updateLoading(true);
    });
  }

  private static categoryToString(category: Category): string{
    switch (category){
      case Category.trucks: return 'trucks';
      case Category.scales: return 'weighing_scales';
      case Category.biocells: return 'biocells';
    }
  }

  set serverURL(url: string){
   this.baseUrl = url;
   this.channelManager = `${this.baseUrl}/channel-manager`;
  }

  serverInfo(){
    return this.http.get(this.baseUrl).pipe(
      map(res => JSON.stringify(res, null, 1))
    );
  }

  newsFeed(numMsgs: number): Observable<Feed[]>{
    if (this.updateLoading === undefined){
      console.log('error');
      return of(undefined);
    }
    const path = `${this.channelManager}/actors-last-updates/${numMsgs}`;
    return this.http.get<any[]>(path).pipe(
      map(res => res.map(feed => new Feed(feed.category, feed.actor_id, feed.timestamp))),
      tap(() => {
        this.feedLoading = false;
        this.updateLoading(false);
      })
    );
  }

  actorsOfCategory(category: Category): Observable<any[]>{
    const path = `${this.channelManager}/categories/${HttpChannelManagerService.categoryToString(category)}/actors`;
    return this.http.get<any[]>(path).pipe(
      map(res => res.map(actor => ({col1: actor.actor_id, col2: actor.num_channels})))
    );
  }

  dailyChannelsOfActor(category: Category, actorId: string): Observable<any[]>{
    const path = `${this.channelManager}/categories/${HttpChannelManagerService.categoryToString(category)}/actors/${actorId}`;
    return this.http.get<any[]>(path).pipe(
      mergeMap(res => res.map(ch => {
        const d = new Date(ch.creation_timestamp * 1000);
        return {day: d.getDate(), month: d.getMonth()+1, year: d.getFullYear()};
      })),
      reduce((acc, cur) => {
        const key = `${cur.month}-${cur.year}`;
        const prev = acc.has(key) ? acc.get(key) : [];
        prev.push(cur);
        acc.set(key, prev);
        return acc;
      }, new Map<string, any[]>()),
      map(acc => {
        const res = [];
        acc.forEach((value, _) => res.push(value));
        return res;
      })
    );
  }

  packetsOf(category: Category, actorId: string, date: string): Observable<Packet[]>{
    date = date.replace(/\//g, '-');
    const path = `${this.channelManager}/categories/${HttpChannelManagerService.categoryToString(category)}/actors/${actorId}/date/${date}`;
    return this.http.get<any[]>(path).pipe(
      map(res => res.map(msg => Packet.fromHttp(msg, '')))
    );
  }

  get isLoading(){
    return this.feedLoading;
  }

  get loadingObs(){
    return this.loadingObservable;
  }
}
