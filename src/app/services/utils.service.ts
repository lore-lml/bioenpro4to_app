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
}
