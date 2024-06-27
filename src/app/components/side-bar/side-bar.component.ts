import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  constructor(private authService: AuthServiceService, private router: Router) { }

  userInfo: any = '';
  user$!: Observable<any>;
  ngOnInit() {
    this.user$ = this.authService.getUser();
  }

  singOut() {
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    });
  }
}
