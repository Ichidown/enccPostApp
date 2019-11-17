import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class PostListService {

  constructor(private http: HttpClient) { }

  getPosts(ip: string): Observable<any> {
    return this.http.get('http://' + ip + '/phpApi/getPosts.php');
  }
}
