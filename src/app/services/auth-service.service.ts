import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, Auth } from "firebase/auth";
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private auth: Auth;

  constructor(private fbAuth: AngularFireAuth, private router: Router) {
    this.auth = getAuth();
  }

  emailUser: string = '';

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        throw error;
      });
  }

  async logout(): Promise<void> {
    return this.fbAuth.signOut()
      .catch(error => console.error("Logout error: ", error));
  }

  getUser(): Observable<any> {
    return this.fbAuth.authState;
  }

  isAuth(userData: string): any {
    const auth = getAuth();
    const response: any[] = [];
    if (userData == '') {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log('user ', user);
          response.push(user);

        } else {
          response.push({
            "message": "not found user"
          });
        }
      });
      return response;
    }
  }
}
