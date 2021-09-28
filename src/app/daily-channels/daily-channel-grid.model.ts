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
   this.dateListPr = dateList;
   this.nRows = Math.floor(dateList.length / this.nCol)+1;
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
    this.dateListPr = dateList;
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
