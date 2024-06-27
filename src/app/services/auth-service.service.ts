import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(public fbAuth: AngularFireAuth) { }

  emailUser: string = '';

  autentication(email: string, password: string) {
    const auth = getAuth();
    const response: any[] = [];
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {;
        const user = userCredential.user;
        console.log('user', user);
        response.push(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        response.push(error);
      });
    return response
  }

  isAuth() {
    const auth = getAuth();
    const response: any[] = [];
    onAuthStateChanged(auth, (user) => {
      console.log('auth');
      
      if (user) {
        /* const uid = user.uid;
        const email = user.email;
        this.emailUser = email ? email : ''; */
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
