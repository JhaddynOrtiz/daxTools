import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, Auth } from "firebase/auth";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

export interface User {
  uid: string;
  apifyToken: string;
  apifyUserId: string;
  userName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private auth: Auth;
  user$: Observable<User | any>;

  constructor(private fbAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.auth = getAuth();

    this.user$ = this.fbAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          //this.setToken()
          const infoUser = this.afs.doc<User>(`user/${user.uid}`).valueChanges();
          /* infoUser.subscribe(myUser => {
            console.log('user', myUser);
          }); */
          return infoUser;
        } else {
          return of(null);
        }
      })
    );
  }


  emailUser: string = '';

  login(email: string, password: string): Promise<any> {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        this.user$.subscribe(myUser => {
          this.setToken(myUser.apifyToken, myUser.prodToken);
        });
        return user;
      })
      .catch((error) => {
        throw error;
      });
  }

  async logout(): Promise<void> {
    localStorage.removeItem('authToken');
    
    return this.fbAuth.signOut()
      .catch(error => console.error("Logout error: ", error));

  }

  getUser(): Observable<any> {
    const userx = this.fbAuth.authState;
    console.log('userx', userx);

    return userx;
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

  setToken(token: any, prodToken: any): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('prodToken', prodToken);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getTokenProd(): string | null {
    return localStorage.getItem('prodToken');
  }
  /* removeToken(): void {
    localStorage.removeItem('authToken');
  } */
}
