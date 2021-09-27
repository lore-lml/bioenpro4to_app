import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-daily-channel-item',
  templateUrl: './daily-channel-item.component.html',
  styleUrls: ['./daily-channel-item.component.scss'],
})
export class DailyChannelItemComponent implements OnInit {
  @Input() day: number;
  @Input() month: number;
  @Input() year: number;
  constructor() {
    const d = new Date();
    this.day = d.getDate();
    this.month = d.getMonth() + 1;
    this.year = d.getFullYear();
  }
  ngOnInit() {}

  monthString(): string{
    switch (this.month) {
      case 1: return 'Gen';
      case 2: return 'Feb';
      case 3: return 'Mar';
      case 4: return 'Apr';
      case 5: return 'Mag';
      case 6: return 'Giu';
      case 7: return 'Lug';
      case 8: return 'Ago';
      case 9: return 'Set';
      case 10: return 'Ott';
      case 11: return 'Nov';
      case 12: return 'Dec';
      default: return 'err';
    }
  }
}
