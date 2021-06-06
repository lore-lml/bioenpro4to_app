import {Component, OnInit} from '@angular/core';
import {ChannelManagerService} from './services/channel-manager.service';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  constructor(private channelManager: ChannelManagerService, private loadingController: LoadingController) {}

  ngOnInit(): void {
    let load;
    this.loadingController.create({message: 'Scaricando i dati ...', cssClass: 'my-loading'})
      .then(loading => {
        load = loading;
        return loading.present();
      })
      .catch(err => console.error(err));

    const sub = this.channelManager.rootObservable.subscribe(root => {
      if(root !== undefined){
        load.dismiss();
        sub.unsubscribe();
      }
    });
  }
}
