import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{

  @ViewChild('loginUserName') loginUserName;
  @ViewChild('loginPassword') loginPassword;

  constructor(private store: Store, private router: Router) {
  }

  login() {
    console.log('UserName', this.loginUserName.nativeElement.value);
    console.log('Password', this.loginPassword.nativeElement.value);
  }

  returnToRoot() {
    this.router.navigate(['']);
  }
}
