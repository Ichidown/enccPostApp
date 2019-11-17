import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // post username & password to Api server & returns full username if verified else return ""
  getUserDetails(username: string, password: string, ip: string) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/login.php', {username, password})
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }
}
