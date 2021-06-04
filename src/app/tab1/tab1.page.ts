import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  title = 'Monitora';
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
  constructor() {}

}
