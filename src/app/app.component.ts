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
  rootSub: Subscription;
  loadPopover: HTMLIonLoadingElement;
  constructor(private channelManager: ChannelManagerService,
              private loadingController: LoadingController,
              private httpChannelManager: HttpChannelManagerService) {}

  async ngOnInit() {
    this.loadPopover = await this.initLoadingPopover();
    this.loading = this.channelManager.loadingObservable.subscribe(isLoading => {
      if (isLoading){
        this.loadPopover.present();
      }else{
        this.loadPopover.dismiss();
        this.initLoadingPopover().then(load => this.loadPopover = load);
      }
    });
    // just to trigger the observable and the init method of the service;
    this.rootSub = this.channelManager.root.subscribe(() => {});
    this.httpChannelManager.serverInfo()
      .subscribe(res => console.log(res));
  }

  async ngOnDestroy() {
    if (this.loading !== undefined){
      this.loading.unsubscribe();
    }
    if (this.rootSub !== undefined){
      this.rootSub.unsubscribe();
    }
    await this.loadPopover.dismiss();
  }

  initLoadingPopover(): Promise<HTMLIonLoadingElement>{
    return this.loadingController.create({message: 'Scaricando i dati ...', cssClass: 'my-loading'});
  }
}
