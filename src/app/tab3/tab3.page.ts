import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SetupComponent} from '../modals/setup/setup.component';
import {UtilsService} from '../services/utils.service';
import {ChannelManagerService} from '../services/channel-manager.service';
import {HttpChannelManagerService} from '../services/http-channel-manager.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  readonly keyMode: string = 'network_mode';
  title = 'Profile';
  constructor(private modalController: ModalController, private utils: UtilsService) {}

  async showSettings(){
    const mode = await this.utils.getValue(this.keyMode);
    const modal = await this.modalController.create({
      component: SetupComponent,
      cssClass: 'settings',
      showBackdrop: true,
      componentProps: {
        locked: false,
        data: mode
      }
    });
    await modal.present();
    const {data} = await modal.onDidDismiss();

    if (data === null || data === undefined){
      return;
    }
    const res = await this.storeModeConfiguration(data);
    this.utils.switchMode.next(res);
  }

  async storeModeConfiguration(data: any){
    const res = {mode: data.mode, addr: data.addr};
    await this.utils.storeValue(this.keyMode, res);
    return res;
  }

}
