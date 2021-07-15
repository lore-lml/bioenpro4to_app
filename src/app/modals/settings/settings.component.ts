import {Component, OnInit} from '@angular/core';
import {ModalController, PopoverController} from '@ionic/angular';
import {RootChannelInputComponent} from './root-channel-input/root-channel-input.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  title = 'Impostazioni';

  constructor(private modalController: ModalController, private popoverController: PopoverController) {
  }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  async showRootChannelInput() {
    const popover = await this.popoverController.create({
      component: RootChannelInputComponent,
      cssClass: 'my-custom-class',
      translucent: true
    });
    await popover.present();
    await popover.onDidDismiss();
  }
}
