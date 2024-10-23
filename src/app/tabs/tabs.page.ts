import { Component } from '@angular/core';
import {SessionService} from '../services/session.service';
import {NotificationsService} from '../services/notifications.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(public session: SessionService, private notification: NotificationsService) {
    console.log('this is user', this.session.getUser());
  }

}
