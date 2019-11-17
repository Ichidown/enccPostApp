import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DownloaderService {

  constructor(private http: HttpClient) { }


  downloadFile(id: number, ip: string) {
    return this.http.post('http://' + ip + '/phpApi/downloadFile.php', {id});
  }

  downloadImage(id: number, ip: string) {
    return this.http.post('http://' + ip + '/phpApi/downloadImage.php', {id});
  }

}
