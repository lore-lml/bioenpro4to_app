import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Feed} from '../models/feed.model';
import {Category} from '../models/category-channel.model';
import {Packet} from '../models/packet.model';

@Injectable({
  providedIn: 'root'
})
export class HttpChannelManagerService {
  readonly host: string = 'localhost';
  readonly port: number = 8000;
  readonly baseUrl: string = `http://${this.host}:${this.port}`;
  readonly channelManager: string = `${this.baseUrl}/channel-manager`;
  constructor(private http: HttpClient) {}

  private static categoryToString(category: Category): string{
    switch (category){
      case Category.trucks: return 'trucks';
      case Category.scales: return 'weighing_scales';
      case Category.biocells: return 'biocells';
    }
  }

  serverInfo(){
    return this.http.get(this.baseUrl).pipe(
      map(res => JSON.stringify(res, null, 1))
    );
  }

  newsFeed(numMsgs: number): Observable<Feed[]>{
    const path = `${this.channelManager}/actors-last-updates/${numMsgs}`;
    return this.http.get<any[]>(path).pipe(
      map(res => res.map(feed => new Feed(feed.category, feed.actor_id, feed.timestamp)))
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
      map(res => res.map(ch => {
        const f = new Feed(category, actorId, ch.creation_timestamp);
        return {col1: f.date, col2: 5};
      }))
    );
  }

  packetsOf(category: Category, actorId: string, date: string): Observable<Packet[]>{
    date = date.replace(/\//g, '-');
    const path = `${this.channelManager}/categories/${HttpChannelManagerService.categoryToString(category)}/actors/${actorId}/date/${date}`;
    return this.http.get<any[]>(path).pipe(
      map(res => res.map(msg => Packet.fromHttp(msg, '')))
    );
  }
}
