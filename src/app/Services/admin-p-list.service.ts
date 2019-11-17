import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Post } from '../Objects/Post';
// import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminPListService {

  constructor(private http: HttpClient) { }

  // Server requests

  createPost(post: Post, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/create.php', post)
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

  uploadFile(fileToUpload: File, ip: String) { // , fileId: string) {
    const formData: FormData = new FormData();
    formData.append('tempFile', fileToUpload);
    return this.http.post('http://' + ip + '/phpApi/uploadFile.php', formData);
  }

  updatePost(post: Post, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/update.php', post)
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }

  deleatePost(id: number, ip: String) {
    return new Promise((resolve, reject) => {
      this.http.post('http://' + ip + '/phpApi/delete.php', {id})
        .toPromise().then(
          data => resolve(data), err => reject(err)
        );
    });
  }
}
