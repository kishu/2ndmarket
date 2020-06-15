import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GroupService } from '@app/core/http';

@Component({
  selector: 'app-groups-add',
  templateUrl: './groups-add.component.html',
  styleUrls: ['./groups-add.component.scss']
})
export class GroupsAddComponent implements OnInit {

  submitting = false;
  domains$: Observable<string[]>;
  emailForm = this.fb.group({
    account: ['kishu'],
    domain: [''],
  });

  get accountCtl() { return this.emailForm.get('account'); }
  get domainCtl() { return this.emailForm.get('domain'); }

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService,
  ) {
    this.domains$ = this.groupService
    .getAll([['created', 'desc']])
    .pipe(
      first(),
      map(groups => groups.reduce((acc, group) => acc.concat(group.domains), []).sort())
    );
  }

  ngOnInit(): void {
  }

  onSubmit() {

  }

}
