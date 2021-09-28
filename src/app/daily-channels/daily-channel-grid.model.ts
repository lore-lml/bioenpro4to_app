export interface ChannelDateFormat{
  day: number;
  month: number;
  year: number;
}
export class DailyChannelGrid{
  readonly nCol: number = 3;
  nRows: number;
  private dateListPr: ChannelDateFormat[];

  constructor(dateList: ChannelDateFormat[]) {
   this.dateList = dateList;
  }

  getRow(index: number): ChannelDateFormat[]{
    if (index === null || index >= this.nRows){
      return null;
    }
    return this.dateListPr.slice(index*this.nCol, (index+1)*this.nCol);
  }

  get dateList(){
    return this.dateListPr;
  }

  set dateList(dateList: ChannelDateFormat[]){
    this.dateListPr = dateList.sort((a, b) => {
      const k1 = new Date(a.year, a.month, a.day);
      const k2 = new Date(b.year, b.month, b.day);
      return k2.getTime() - k1.getTime();
    });
    this.nRows = Math.floor(dateList.length / this.nCol)+1;
  };

  rowCounter(): number[]{
    return [...new Array(this.nRows).keys()];
  }

  get listLength(){
    return this.dateListPr.length;
  }

  monthYear(i: number): number[]{
    if (this.listLength===0){
      return null;
    }
    if (i >= this.listLength){
      return [];
    }
    return [this.dateListPr[i].month, this.dateListPr[i].year];
  }
}
