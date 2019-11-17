import { Association } from './../Objects/Association';
import { Category } from '../Objects/Category';
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class AdminTypeListService {

  // private deleate_url = 'http://192.168.0.186/phpApi/types/delete.php';
  // private create_url = 'http://192.168.0.186/phpApi/types/create.php';
  // private update_url = 'http://192.168.0.186/phpApi/types/update.php';
  // private deleate_ass_url = 'http://192.168.0.186/phpApi/typePostAssociation/delete.php';
  // private create_ass_url = 'http://192.168.0.186/phpApi/typePostAssociation/create.php';

  constructor(private http: HttpClient) { }

  createType(category: Category, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/types/create.php', category)
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

  updateType(category: Category, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/types/update.php', category)
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

  deleateType(id: number, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/types/delete.php', {id})
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

  createAssociation(association: Association, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/typePostAssociation/create.php', association)
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

  deleateAssociation(id: number, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/typePostAssociation/delete.php', {id})
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

}
