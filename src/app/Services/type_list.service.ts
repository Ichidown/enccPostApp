import { Category } from './../Objects/Category';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class TypeListService {

  constructor(private http: HttpClient) { }

  getTypes(ip: string): Observable<any> {
    return this.http.get('http://' + ip + '/phpApi/types/getTypes.php');
  }

  getAssociations(ip: string): Observable<any> {
    return this.http.get('http://' + ip + '/phpApi/typePostAssociation/getAssociations.php');
  }
}
