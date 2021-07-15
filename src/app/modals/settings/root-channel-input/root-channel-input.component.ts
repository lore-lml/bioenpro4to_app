import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {ChannelManagerService} from '../../../services/channel-manager.service';

@Component({
  selector: 'app-root-channel-input',
  templateUrl: './root-channel-input.component.html',
  styleUrls: ['./root-channel-input.component.scss'],
})
export class RootChannelInputComponent implements OnInit {
  inputValue: string;
  showError: boolean;

  constructor(private popover: PopoverController, private channelManager: ChannelManagerService) {}

  ngOnInit() {
    this.showError = false;
    this.inputValue = '';
  }

  async confirmValue(){
    const success = await this.channelManager.setChannelInfo(this.inputValue);
    if (success){
      await this.popover.dismiss();
      return;
    }
    this.showError = true;
  }

  async dismissPopover() {
    await this.popover.dismiss();
  }
}
