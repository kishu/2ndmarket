import { Component, OnInit } from '@angular/core';
import { AuthService, MessagesService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { MessageExt } from '@app/core/model';

@Component({
  selector: 'app-preference-messages, [app-preference-messages]',
  templateUrl: './preference-messages.component.html',
  styleUrls: ['./preference-messages.component.scss']
})
export class PreferenceMessagesComponent implements OnInit {
  messageExts$ = this.persistenceService.messageExts$;

  constructor(
    private authService: AuthService,
    private messagesService: MessagesService,
    private persistenceService: PersistenceService
  ) {
  }

  ngOnInit(): void {
  }

  trackById(index, item) {
    return item.id;
  }

  onClickMessage(e: Event, target: MessageExt) {
    e.preventDefault();
    this.messagesService.updateRead(target.id);
  }

  onClickDeleteNotice(target: MessageExt) {
    this.messagesService.delete(target.id);
    alert('dom 직접 삭제?');
    // this.noticeList$.pipe(
    //   map(nl => nl.filter(n => n.id !== target.id))
    // ).subscribe(nl => this.noticeList$ = of(nl));
  }
}
