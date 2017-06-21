import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/*Firebase*/
import { fbAuth } from './../../../environments/firebase-auth.config';
import { fbDatabase } from './../../../environments/firebase-database.config';

import { environment } from './../../../environments/environment';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {
  auth: any;
  headersToAuth: Headers;
  name: any;
  optionsToAuth: RequestOptions;
  originalUsername: string;
  url = environment.urlToOauthToken;
  urlToApi = environment.urlToApi;
  
  constructor(private http: Http) { }
  
  login = (source, login, password) => new Promise((resolve, reject) => {
    switch(source) {
      case 'firebase':
        fbAuth.signInWithEmailAndPassword(login, password)
        .then(res => {
          if(fbAuth.currentUser.emailVerified) {
            let email = fbAuth.currentUser.email;
            let uid = fbAuth.currentUser.uid;

            let that = this;
            fbDatabase.ref('/users/' + uid)
            .once('value')
            .then(function(snapshot) {
              that.name = snapshot.val().username;
            });
            
            resolve({
              cod: "l-01",
              message: "Login successful"
            });
          } else {
            resolve({
              cod: "l-02",
              message: "Authentication not validated."
            })
          }
        })
        .catch(rej => {
          reject({
            cod: "l-03",
            message: rej
          })
        })
      break;

      case 'laravel':
        let temp;

        this.headersToAuth = new Headers({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });

        this.optionsToAuth = new RequestOptions({
          'headers': this.headersToAuth
        })

        this.http
        .post(
          this.url,
          {
            "client_secret": "HNqY94tgnGEqY3WxcAhXmzY3pJQ0fkcYhtu6JBlA",
            "client_id": 2,
            "grant_type": "password",
            "username": login,
            "password": password
          },
          this.optionsToAuth
        )
        .subscribe(res => {
          if(res.ok) {
            temp = JSON.parse(res['_body']);
            
            sessionStorage.setItem('access_token', 'Bearer ' + temp.access_token);

            resolve({
              cod: "l-01",
              message: "Login successful"
            });
          }
        })
      break;

      default:
        console.log("Faltando source")
    }
  })

  logout = () => new Promise((resolve, reject) => {
    if(sessionStorage.getItem('access_token')) {
      sessionStorage.clear();
    } else {
      fbAuth.signOut()
      .then(res => {
        resolve({
          cod: "lo-01",
          message: res
        })
      })
      .catch(rej => {
        reject({
          cod: "lo-02",
          message: rej
        })
      })
    }
  })

  signup = (email, repeatEmail, password, firstUsername) => new Promise((resolve, reject) => {
    let username;
    let emailToUsername;
    let newUsername;
    let res;
    
    if(email === repeatEmail) {
      //Checking if signing up email is already registered
      fbDatabase.ref('/users')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snap => {
        if(snap.val() != null) {
          resolve("E-mail registered yet");
        } else {
          if(firstUsername === "") {
            emailToUsername = email.split('@');
            username = emailToUsername[0];
          } else {
            username = firstUsername;
          }
          
          //Checking if signing up usernam exists
          fbDatabase.ref('/users')
          .orderByChild('username')
          .equalTo(username)
          .once('value')
          .then(snap => {
            if(snap.val() != null) {
              this.originalUsername = username;
              this.signupCheckingUsername(email, password, username, 0);
            } else {
              fbAuth.createUserWithEmailAndPassword(email, password)
              .then(res => {
                let uid = fbAuth.currentUser.uid;

                fbDatabase.ref('users').child(uid).set({
                  email: email,
                  username: username
                })

                resolve({
                  cod: "s-01",
                  message: res
                });
              })
              .catch(rej => {
                reject({
                  cod: "s-02",
                  message: rej
                });
              })
            }
          })
        }
      })
    } else {
      resolve("Email was not repeated correctly");
    }
  })

  recoverPasswordEmail = (email) => new Promise((resolve, reject) => {
    fbAuth.fetchProvidersForEmail(email)
    .then(res => {
      if(res.length > 0) {
        fbAuth.sendPasswordResetEmail(email);

        resolve({
          cod: "rpe-01",
          message: "E-mail enviado. Cheque e finalize o processo."
        })
      } else {
        resolve({
          cod: "rpe-02",
          message: "E-mail não cadastrado."
        })
      }
    });
  })
  
  signupCheckingUsername = (email, password, username, number) => new Promise((resolve, reject) => {
    let newUsername;
    let newNumber;
    
    fbDatabase.ref('/users')
    .orderByChild('username')
    .equalTo(username)
    .once('value')
    .then(snap => {
      if(snap.val() != null) {
        newNumber = number + 1;
        newUsername = this.originalUsername + newNumber;
        
        this.signupCheckingUsername(email, password, newUsername, newNumber);
      } else {
        this.signup(email, email, password, username)
      }
    })
  })
}
