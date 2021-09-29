import {Component, OnDestroy, OnInit} from '@angular/core';
import {ChannelManagerService} from './services/channel-manager.service';
import {LoadingController, ModalController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {HttpChannelManagerService} from './services/http-channel-manager.service';
import {UtilsService} from './services/utils.service';
import {SetupComponent} from './modals/setup/setup.component';
import {Router} from '@angular/router';
import {ChannelInfo} from '../../streams_lib/pkg';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy{
  readonly keyMode: string = 'network_mode';
  loading: Subscription;
  loadPopover: HTMLIonLoadingElement;
  configDone = false;
  constructor(private channelManager: ChannelManagerService,
              private httpChannelManager: HttpChannelManagerService,
              private utils: UtilsService,
              private modalController: ModalController,
              private loadingController: LoadingController,
              private router: Router) {}

  async ngOnInit() {
    //await this.tangleMode();
    let res = await this.utils.getValue(this.keyMode);

    if (res === null){
      const {data} = await this.showSetupModal();
      res = await this.storeModConfiguration(data);
    }

    if (res.mode === 'server'){
      await this.serverMode(res.addr);
    }else{
      await this.tangleMode(res.addr);
    }
  }

  async storeModConfiguration(data){
    const res = {mode: data.mode, addr: data.addr};
    await this.utils.storeValue(this.keyMode, res);
    return res;
  }

  async serverMode(serverURL: string){
    this.httpChannelManager.serverURL = serverURL;
    this.loadPopover = await this.initLoadingPopover();
    this.loading = this.httpChannelManager.loadingObservable.subscribe(isLoading => {
      if (!this.configDone) {
        this.utils.modeReady.next(true);
        setTimeout(() => this.utils.modeReady.next(true), 2000);
        this.configDone = true;
      }
      if (isLoading){
        this.loadPopover.present();
      }else{
        this.loadPopover.dismiss();
        this.initLoadingPopover().then(load => this.loadPopover = load);
      }
    });
    await this.router.navigate(['./tabs', 'tab1']);
  }

  async tangleMode(rootAddr: string){
    const addr = rootAddr.split(':');
    this.loadPopover = await this.initLoadingPopover();
    this.loading = this.channelManager.loadingObservable.subscribe(isLoading => {
      if (!this.configDone) {
        this.utils.modeReady.next(true);
        setTimeout(() => this.utils.modeReady.next(true), 2000);
        this.configDone = true;
      }
      if (isLoading){
        this.loadPopover.present();
        this.channelManager.init(new ChannelInfo(addr[0], addr[1])).catch(e => console.log(e));
      }else{
        this.loadPopover.dismiss();
        this.initLoadingPopover().then(load => this.loadPopover = load);
      }
    });
  }

  async showSetupModal(){
    const modal = await this.modalController.create({
      component: SetupComponent,
      cssClass: 'setup',
      backdropDismiss: false,
      componentProps: {
        locked: true
      }
    });
    await modal.present();
    return await modal.onDidDismiss();
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
