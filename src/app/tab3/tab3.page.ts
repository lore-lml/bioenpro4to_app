import { Component } from '@angular/core';
import {ModalController} from '@ionic/angular';
import {SettingsComponent} from '../modals/settings/settings.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  title = 'Profile';
  constructor(public modalController: ModalController) {}

  async showSettings(){
    const modal = await this.modalController.create({
      component: SettingsComponent,
      cssClass: 'settings'
    });
    await modal.present();
  }

}
