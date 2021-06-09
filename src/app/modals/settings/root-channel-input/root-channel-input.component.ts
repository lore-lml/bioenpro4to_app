import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-root-channel-input',
  templateUrl: './root-channel-input.component.html',
  styleUrls: ['./root-channel-input.component.scss'],
})
export class RootChannelInputComponent implements OnInit {
  inputValue: string;

  constructor(private popover: PopoverController) {}

  ngOnInit() {
    this.inputValue = '';
  }

  async confirmValue(){
    await this.popover.dismiss(this.inputValue);
  }

  async dismissPopover() {
    await this.popover.dismiss();
  }
}
