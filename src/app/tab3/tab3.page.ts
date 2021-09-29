import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SetupComponent} from '../modals/setup/setup.component';
import {UtilsService} from '../services/utils.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  readonly modeKey: string = 'network_mode';
  title = 'Profile';
  constructor(private modalController: ModalController, private utils: UtilsService) {}

  async showSettings(){
    const data = await this.utils.getValue(this.modeKey);
    const modal = await this.modalController.create({
      component: SetupComponent,
      cssClass: 'settings',
      showBackdrop: true,
      componentProps: {
        locked: false,
        data
      }
    });
    await modal.present();
  }

}
