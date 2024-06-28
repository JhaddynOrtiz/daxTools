import { Component, OnInit } from '@angular/core';
import { AuthServiceService, User } from '../../services/auth-service.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {
  user$: Observable<User | any>;

  constructor(private authService: AuthServiceService, private router: Router) {
    this.user$ = this.authService.user$;
  }

  userInfo: any = '';
  /* user$!: Observable<any>; */
  ngOnInit() {
    /* this.user$ = this.authService.getUser(); */
    console.log('user xXx', this.user$);
    
  }

  singOut() {
    this.authService.logout().then(() => {
      this.router.navigate(['login']);
    });
  }
}
