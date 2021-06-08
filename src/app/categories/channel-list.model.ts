export enum SortMode{
  descending,
  ascending,
  none
}

export class ChannelList{
  private original: Array<any>;
  private sorted: Array<any>;
  private filtered: Array<any>;

  private sortColumn: any;
  private selectedColumn: any;

  constructor(array: any[any], sortColumn: any[]) {
    this.original = array;
    this.sortColumn = sortColumn;
    this.selectedColumn = 0;
  }

  sortChannels(){
    const col = this.sortColumn[this.selectedColumn];
    const compareTo = this.selectedColumn === 0 ? (a, b) => a.id.localeCompare(b.id) : (a, b) => a.lastUpdate - b.lastUpdate;

    switch (col.mode){
      case SortMode.ascending:
        this.sorted = [...this.original].sort((a, b) => compareTo(a, b));
        break;
      case SortMode.descending:
        this.sorted = [...this.original].sort((a, b) => compareTo(b, a));
        break;
      case SortMode.none:
        this.sorted = [...this.original];
        break;
    }

    this.filtered = this.sorted;
  }

  get channels(){
    return this.filtered;
  }

  get sortingColumn(){
    return this.sortColumn;
  }

  set selectedCol(index: number){
    this.selectedColumn = index;
  }

  setChannels(channels: any[]){
    this.original = channels;
    this.sortChannels();
  }

  toggleSortMode(index: number){
    this.selectedCol = index;
    const nextIndex = (index + 1) % 2;
    this.sortColumn[nextIndex].mode = SortMode.none;

    const currCol = this.sortColumn[index];
    currCol.mode = ((currCol.mode as number +1) % 3) as SortMode;
    this.sortChannels();
  }

  get length(): number{
    return this.filtered.length;
  }

}
