import { Injectable } from '@angular/core';
import { auth, database } from 'firebase';

/*Firebase*/
import { authConfig, databaseConfig } from './../../../environments/firebase.config';
import { initializeApp } from 'firebase';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {
  name: any;
  originalUsername: string;
  
  login = (email, password) => new Promise((resolve, reject) => {
    let fbAuth = initializeApp(authConfig);
    let fbDatabase = initializeApp(databaseConfig);

    fbAuth.auth().signInWithEmailAndPassword(email, password)
    .then(res => {
      if(fbAuth.auth().currentUser.emailVerified) {
        let email = fbAuth.auth().currentUser.email;
        let uid = fbAuth.auth().currentUser.uid;

        let that = this;
        fbDatabase.database().ref('/users/' + uid)
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
  })

  logout = () => new Promise((resolve, reject) => {
    let fbAuth = initializeApp(authConfig);

    fbAuth.auth().signOut()
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
  })

  signup = (email, repeatEmail, password, firstUsername) => new Promise((resolve, reject) => {
    let fbAuth = initializeApp(authConfig);
    let fbDatabase = initializeApp(databaseConfig);

    let username;
    let emailToUsername;
    let newUsername;
    let res;
    
    if(email === repeatEmail) {
      //Checking if signing up email is already registered
      fbDatabase.database().ref('/users')
      .orderByChild('email')
      .equalTo(email)
      .once('value')
      .then(snap => {
        if(snap.val() != null) {
          resolve("E-mail registered yet");
        } else {
          console.log(username);
          if(firstUsername === "") {
            emailToUsername = email.split('@');
            username = emailToUsername[0];
          } else {
            username = firstUsername;
          }

          console.log(username);
          
          //Checking if signing up usernam exists
          fbDatabase.database().ref('/users')
          .orderByChild('username')
          .equalTo(username)
          .once('value')
          .then(snap => {
            if(snap.val() != null) {
              this.originalUsername = username;
              this.signupCheckingUsername(email, password, username, 0);
            } else {
              fbAuth.auth().createUserWithEmailAndPassword(email, password)
              .then(res => {
                let uid = fbAuth.auth().currentUser.uid;

                fbDatabase.database().ref('users').child(uid).set({
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
    let fbAuth = initializeApp(authConfig);
    
    fbAuth.auth().fetchProvidersForEmail(email)
    .then(res => {
      if(res.length > 0) {
        fbAuth.auth().sendPasswordResetEmail(email);

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
    let fbAuth = initializeApp(authConfig);
    let fbDatabase = initializeApp(databaseConfig);

    let newUsername;
    let newNumber;
    
    fbDatabase.database().ref('/users')
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
