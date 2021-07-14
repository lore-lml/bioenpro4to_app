import {Category} from './category-channel.model';

export class Feed {
  category: Category;
  actorId: string;
  creationDate: string;
  timestamp: number;

  constructor(category: Category, actorId: string, creationDate: string, timestamp: number) {
    this.category = category;
    this.actorId = actorId;
    this.creationDate = creationDate;
    this.timestamp = timestamp;
  }

  get hourDate(){
    const date = new Date(this.timestamp*1000);
    const day = Feed.zeroPad(date.getDate());
    const month = Feed.zeroPad(date.getMonth()+1);
    const year = date.getFullYear();
    const sDate = `${day}/${month}/${year}`;

    const hours = date.getHours();
    const minutes = Feed.zeroPad(date.getMinutes());
    return `${hours}.${minutes} - ${sDate}`;
  }

  private static zeroPad(value: number): string{
    return value >= 10 ? ''+value : '0'+value;
  }

  get timeAgo(): string{
    const now: number = Math.trunc(Date.now() / 1000);
    const diff = now - this.timestamp;
    if (diff > 3600 * 24){
      const time = Math.trunc(diff / (3600 * 24) + 1 );
      return `${time} giorni fa`;
    }else if (diff > 3600){
      const time = Math.trunc(diff / 3600 + 1);
      return `${time} ore fa`;
    }else if (diff > 60){
      const time = Math.trunc(diff / 60 + 1);
      return `${time} minuti fa`;
    }else{
      return `Pochi secondi fa`;
    }
  }
}
