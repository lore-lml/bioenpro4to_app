import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  storage: Storage;
  modeReady: Subject<boolean>;
  constructor(private ionicStorage: Storage) {
    this.modeReady = new Subject<boolean>();
  }

  async getValue(key: string){
    await this.initStorage();
    return await this.storage.get(key);
  }

  async storeValue(key: string, value: any){
    await this.initStorage();
    return await this.storage.set(key, value);
  }

  checkChannelAddr(addr: string) {
    const regex = /[a-z0-9]+:[a-z0-9]+/;
    return new RegExp(regex).test(addr);
  }

  checkServerPort(port: number){
    return port > 0 && port < 65536;
  }

  zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  timestampToHoursDate(timestamp: number){
    const date = new Date(timestamp*1000);
    const day = this.zeroPad(date.getDate());
    const month = this.zeroPad(date.getMonth()+1);
    const year = date.getFullYear();
    const sDate =  `${day}/${month}/${year}`;
    const hours = date.getHours();
    const minutes = this.zeroPad(date.getMinutes());
    return `${hours}.${minutes} - ${sDate}`;
  }

  monthToString(month: number): string{
    switch (month) {
      case 1: return 'Gennaio';
      case 2: return 'Febbraio';
      case 3: return 'Marzo';
      case 4: return 'Aprile';
      case 5: return 'Maggio';
      case 6: return 'Giugno';
      case 7: return 'Luglio';
      case 8: return 'Agosto';
      case 9: return 'Settembre';
      case 10: return 'Ottobre';
      case 11: return 'Novembre';
      case 12: return 'Dicembre';
      default: return 'err';
    }
  }

  private async initStorage(){
    if (this.storage === undefined){
      this.storage = await this.ionicStorage.create();
    }
  }
}
