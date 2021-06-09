import {Component, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {

  title = 'Avvisi';

  constructor(private modalController: ModalController) {}

  ngOnInit() {
  }

  async closeModal() {
    await this.modalController.dismiss({
      dismissed: true
    });
  }

  loadContent(ev) {
    setTimeout(() => ev.target.complete(), 2000);
  }
}
