import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {ChannelManagerService} from '../services/channel-manager.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryGuard implements CanActivate {
  constructor(private channelManager: ChannelManagerService, private router: Router) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (!this.channelManager.rootReady){
      this.router.navigate(['/']).catch(e => console.error(e));
      return false;
    }
    return true;
  }
}
