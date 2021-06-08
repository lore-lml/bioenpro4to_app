export enum SortMode{
  descending,
  ascending,
  none
}

export class ChannelList{
  private original: Array<any>;
  private filtered: Array<any>;

  private filterVal = '';
  private readonly sortColumn: any;
  private selectedColumn: any;

  constructor(array: any[any], sortColumn: any[]) {
    this.original = array;
    this.sortColumn = sortColumn;
    this.selectedColumn = 0;
  }

  sortFilterChannels(){
    const col = this.sortColumn[this.selectedColumn];
    const compareTo = this.selectedColumn === 0 ? (a, b) => a.id.localeCompare(b.id) : (a, b) => a.lastUpdate - b.lastUpdate;

    this.filtered = this.filterVal.length === 0 ?
      [...this.original] : this.original.filter(v => v.id.search(this.filterVal) !== -1);
    switch (col.mode){
      case SortMode.ascending:
        this.filtered.sort((a, b) => compareTo(a, b));
        break;
      case SortMode.descending:
        this.filtered.sort((a, b) => compareTo(b, a));
        break;
      case SortMode.none:
        break;
    }
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
    this.sortFilterChannels();
  }

  toggleSortMode(index: number){
    this.selectedCol = index;
    const nextIndex = (index + 1) % 2;
    this.sortColumn[nextIndex].mode = SortMode.none;

    const currCol = this.sortColumn[index];
    currCol.mode = ((currCol.mode as number +1) % 3) as SortMode;
    this.sortFilterChannels();
  }

  get length(): number{
    return this.filtered.length;
  }

  filterChannels(val: string) {
    this.filterVal = val.trim();
    this.sortFilterChannels();
  }
}
