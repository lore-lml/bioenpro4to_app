import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelManagerService} from './services/channel-manager.service';
import {LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {HttpChannelManagerService} from './services/http-channel-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  loading: Subscription;
  loadPopover: HTMLIonLoadingElement;
  constructor(private channelManager: ChannelManagerService,
              private httpChannelManager: HttpChannelManagerService,
              private loadingController: LoadingController) {}

  async ngOnInit() {
    //await this.tangleMode();
    await this.serverMode();
  }

  async serverMode(){
    this.loadPopover = await this.initLoadingPopover();
    this.loading = this.httpChannelManager.loadingObservable.subscribe(isLoading => {
      if (isLoading){
        this.loadPopover.present();
      }else{
        this.loadPopover.dismiss();
        this.initLoadingPopover().then(load => this.loadPopover = load);
      }
    });
  }

  async tangleMode(){
    this.loadPopover = await this.initLoadingPopover();
    this.loading = this.channelManager.loadingObservable.subscribe(isLoading => {
      if (isLoading){
        this.loadPopover.present();
        this.channelManager.init().catch(e => console.log(e));
      }else{
        this.loadPopover.dismiss();
        this.initLoadingPopover().then(load => this.loadPopover = load);
      }
    });
  }

  async ngOnDestroy() {
    if (this.loading !== undefined){
      this.loading.unsubscribe();
    }
    await this.loadPopover.dismiss();
  }

  initLoadingPopover(): Promise<HTMLIonLoadingElement>{
    return this.loadingController.create({message: 'Scaricando i dati ...', cssClass: 'my-loading'});
  }
}
