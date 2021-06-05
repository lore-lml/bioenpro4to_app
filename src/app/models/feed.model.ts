import {Category} from './category-channel.model';

export class Feed {
  category: Category;
  actorId: string;
  timestamp: number;

  constructor(category: Category, actorId: string, timestamp: number) {
    this.category = category;
    this.actorId = actorId;
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
}
