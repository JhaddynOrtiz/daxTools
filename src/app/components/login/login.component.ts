import { Component } from '@angular/core';
import { AuthServiceService } from '../../services/auth-service.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(public authService: AuthServiceService, private router: Router) { }

  email: string = '';
  password: string = '';
  errorMessage: string = '';

  onLogin() {
    this.authService.login(this.email, this.password)
      .then((user) => {
        this.router.navigate(['/convert']);
        console.log('wellcome user', user);
      }).catch((error) => {
        this.errorMessage = error.message;
        console.log('error -> ', error);        
        Swal.fire({
          title: "Error",
          text: "credenciales invalidas",
          icon: "error"
        });
      });

    /* if (credentials[0].code?.includes('invalid')) {
      Swal.fire({
        title: "Error",
        text: "Email y/o passwor erroneos",
        icon: "error"
      });
    } else {
      this.router.navigate(['/convert']);
    } */

  }
}
