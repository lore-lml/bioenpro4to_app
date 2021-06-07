import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelManagerService, RootState} from './services/channel-manager.service';
import {LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  sub: Subscription;

  constructor(private channelManager: ChannelManagerService, private loadingController: LoadingController) {}

  async ngOnInit() {
    const load = await this.loadingController.create({message: 'Scaricando i dati ...', cssClass: 'my-loading'});
    await load.present();
    this.sub = this.channelManager.rootObservable.subscribe(root => {
      if(root !== undefined && root.state !== RootState.loading){
        load.dismiss();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub !== undefined){
      this.sub.unsubscribe();
    }
  }
}
