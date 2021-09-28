import { Component, OnInit } from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {RootChannelInputComponent} from '../settings/root-channel-input/root-channel-input.component';
import {UtilsService} from '../../services/utils.service';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss'],
})
export class SetupComponent implements OnInit {
  readonly title: string = 'Configurazione App';
  locked: boolean;

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

  ngOnInit() {}

  sourceChange(ev: any) {
    this.selectedMode = ev.target.value;
  }

  async closeModal(){
    let data;
    if (this.selectedMode === 'tangle'){
      if (!this.utils.checkChannelAddr(this.tangleAddr)){
        return;
      }
      data = {
        selectedMode: this.selectedMode,
        tangleAddr: this.tangleAddr
      };
    }else{
      if (!this.utils.checkServerPort(this.serverPort)){
        return;
      }
      const http = this.secureHttp ? 'https':'http';
      data = {
        selectedMode: this.selectedMode,
        serverAddr: `${http}://${this.serverAddr}:${this.serverPort}`
      };
    }
    await this.modalController.dismiss(data);
  }

  async showRootChannelInput() {
    const popover = await this.popoverController.create({
      component: RootChannelInputComponent,
      cssClass: 'my-custom-class',
      translucent: true
    });
    await popover.present();
    const {data} = await popover.onDidDismiss();
    console.log(data);
  }

  confirm() {
    this.closeModal();
  }
}
