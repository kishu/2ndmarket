import { first, skip } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/core/http';
import { PersistenceService } from '@app/core/persistence';
import { ProfileSelectService } from '@app/core/util';

@Component({
  selector: 'app-profile-change',
  templateUrl: './profile-change.component.html',
  styleUrls: ['./profile-change.component.scss']
})
export class ProfileChangeComponent implements OnInit {

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private persistenceService: PersistenceService,
    private profileSelectService: ProfileSelectService
  ) { }

  ngOnInit(): void {
    const profileId = this.activatedRoute.snapshot.paramMap.get('profileId');
    this.authService.profileExt$.pipe(skip(1), first()).subscribe(p => {
      this.persistenceService.reset(p).then(() => {
        this.router.navigate(['/goods']);
      });
    });

    this.profileSelectService.select(profileId);
  }

}
