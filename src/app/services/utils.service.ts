import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {}

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
}
