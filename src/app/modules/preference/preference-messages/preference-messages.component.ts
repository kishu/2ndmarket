import { Location } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { AuthService, MessagesService } from '@app/core/http';
import { Persistence2Service } from '@app/core/persistence';
import { MessageExt } from '@app/core/model';

@Component({
  selector: 'app-preference-messages, [app-preference-messages]',
  templateUrl: './preference-messages.component.html',
  styleUrls: ['./preference-messages.component.scss']
})
export class PreferenceMessagesComponent implements OnInit {
  messageExts$ = this.persistenceService.messageExts$;

  constructor(
    private location: Location,
    private renderer: Renderer2,
    private authService: AuthService,
    private messagesService: MessagesService,
    private persistenceService: Persistence2Service
    ) {
  }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }

  onClickMessage(e: Event, target: MessageExt) {
    e.preventDefault();
    if (!target.read) {
      this.messagesService.updateRead(target.id);
    }
  }

  onClickDeleteNotice(target: MessageExt, targetEl: HTMLElement) {
    this.renderer.setStyle(targetEl, 'display', 'none');
    this.messagesService.delete(target.id);
  }

  onClickHistoryBack() {
    this.location.back();
  }
}
