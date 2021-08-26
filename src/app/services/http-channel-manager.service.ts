import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpChannelManagerService {
  readonly host: string = 'localhost';
  readonly port: number = 8000;
  readonly baseUrl: string = `http://${this.host}:${this.port}`;

  constructor(private http: HttpClient) {}

  serverInfo(){
    return this.http.get(this.baseUrl).pipe(
      map(res => JSON.stringify(res, null, 1))
    );
  }
}
