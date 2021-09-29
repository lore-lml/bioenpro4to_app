import { Component, OnInit } from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  readonly title: string = 'Configurazione App';
  locked: boolean;
  data: any;

  selectedMode: string;
  secureHttp: boolean;
  serverAddr: string;
  serverPort: number;
  tangleAddr: string;

  err: string;
  constructor(private modalController: ModalController, private popoverController: PopoverController, private utils: UtilsService) {
    this.selectedMode = 'server';
    this.secureHttp = false;
    this.err = '';
  }

  ngOnInit() {
    if (this.data === undefined){
      return;
    }
    this.selectedMode = this.data.mode;
    if (this.data.mode === 'server'){
      this.secureHttp = this.data.addr.includes('https');
      const match = this.data.addr.match(/https?:\/\/(.*):([0-9]*)/);
      this.serverAddr = match[1];
      this.serverPort = match[2];
    }
  }

  sourceChange(ev: any) {
    this.selectedMode = ev.target.value;
  }

  async closeModal(save: boolean = false){
    if (!save){
      await this.modalController.dismiss();
      return;
    }

    let data;
    if (this.selectedMode === 'tangle'){
      if (!this.utils.checkChannelAddr(this.tangleAddr)){
        return;
      }
      data = {
        mode: this.selectedMode,
        addr: this.tangleAddr
      };
    }else{
      if (!this.utils.checkServerPort(this.serverPort)){
        return;
      }
      const http = this.secureHttp ? 'https':'http';
      data = {
        mode: this.selectedMode,
        addr: `${http}://${this.serverAddr}:${this.serverPort}`
      };
    }
    await this.modalController.dismiss(data);
  }
}
