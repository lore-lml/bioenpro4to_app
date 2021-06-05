import {Component, OnInit} from '@angular/core';
import {ChannelManagerService} from '../services/channel-manager.service';
import {LoadingController} from '@ionic/angular';
import {RootChannel} from '../models/root-channel.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  title = 'Monitoraggio';
  categoryOpts = {
    freeMode: true,
    slidesPerView: 2.5
  };
  categoryInfo = [
    {title: 'Camion',imgSrc: 'assets/categories/trucks.svg'},
    {title: 'Pesate', imgSrc: 'assets/categories/scales.svg'},
    {title: 'Biocelle', imgSrc: 'assets/categories/biocells.svg'},
  ];
  lastUpdate = [
    {imgSrc: 'assets/categories/trucks.svg', title: 'Actor1', timestamp: '10.55 - 21/05/2012'},
    {imgSrc: 'assets/categories/trucks.svg', title: 'Actor2', timestamp: '9.55 - 20/05/2012'},
    {imgSrc: 'assets/categories/scales.svg', title: 'Actor3', timestamp: '8.55 - 19/05/2012'},
    {imgSrc: 'assets/categories/biocells.svg', title: 'Actor4', timestamp: '7.55 - 18/05/2012'},
    {imgSrc: 'assets/categories/biocells.svg', title: 'Actor5', timestamp: '6.55 - 17/05/2012'},
    {imgSrc: 'assets/categories/scales.svg', title: 'Actor6', timestamp: '5.55 - 16/05/2012'},
  ];

  isLoading = true;
  root: RootChannel;

  constructor(private channelManager: ChannelManagerService, private loadingController: LoadingController) {}

  ngOnInit(): void {
    let load;
    this.loadingController.create({message: 'Scaricando i dati ...', cssClass: 'my-loading'})
      .then(loading => {
        load = loading;
        return loading.present();
      })
      .catch(err => console.error(err));

    let counter = 0;
    this.channelManager.rootObservable.subscribe(root => {
      if (root === undefined) {
        counter++;
      }
      if(root !== undefined || counter >= 2){
        load.dismiss();
        this.isLoading = false;
      }
    });
    }
}
