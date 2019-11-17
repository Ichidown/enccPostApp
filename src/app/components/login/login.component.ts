import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import {Router} from '@angular/router';
import { ErrorIdentifierService } from 'src/app/Services/error-identifier.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('popUpframe') public popUpModal;

  errorMsg: String;
  private DB_Ip = '192.168.0.186';

  constructor(private Auth: AuthService,
              private router: Router,
              private ErrId: ErrorIdentifierService,
              ) { }

  ngOnInit() { }

  loginEvent(username: string, password: string) {
    this.Auth.getUserDetails(username, password, this.DB_Ip).then((res: any) => {
      if (res.toString().substring(0, 2) !== 'E-') { // login successful : no errors
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(res));
        // redirect user to admin page
        this.router.navigate(['/admin']);
      } else { // login failed
        this.newPopUpError(this.ErrId.getErrorMessage(res));
      }
    }).catch((err) => {
      // redirect to login page
      this.router.navigate(['/login']);
    });
  }

  // create pop up message
  private newPopUpError(msg: String) {
    this.errorMsg = msg;
    this.popUpModal.show();
  }

}
