import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PersistenceService } from "@app/core/persistence";

@Component({
  selector: 'app-profile-change',
  templateUrl: './profile-change.component.html',
  styleUrls: ['./profile-change.component.scss']
})
export class ProfileChangeComponent implements OnInit {

  constructor(
    private router: Router,
    private persistenceService: PersistenceService
  ) { }

  ngOnInit(): void {
    this.persistenceService.reset().then(() => {
      this.router.navigate(['/goods']);
    });
  }

}
