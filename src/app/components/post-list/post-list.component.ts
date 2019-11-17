import { Association } from 'src/app/Objects/Association';
import { Category } from 'src/app/Objects/Category';
import { Post } from 'src/app/Objects/Post';
import { Component, OnInit } from '@angular/core';
import { PostListService } from 'src/app/Services/post_list.service';
import { DownloaderService } from 'src/app/Services/downloader.service';
import { ErrorIdentifierService } from 'src/app/Services/error-identifier.service';
import { ConverterService } from 'src/app/Services/converter.service';
import { saveAs } from 'file-saver';
import { TypeListService } from 'src/app/Services/type_list.service';
import { FiltererService } from 'src/app/Services/filterer.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  private DB_Ip = '192.168.0.186';

  public posts: Post[] = [];
  public filteredPosts: number[] = [];
  // public imagesPathList: string[] = [];
  public categories: Category[] = [];
  public associations: Association[] = [];
  public imageElements: any = [];

  constructor(private _postListService: PostListService,
              private _typeListService: TypeListService,
              private _downloader: DownloaderService,
              private _ErrId: ErrorIdentifierService,
              private _filterer: FiltererService,
              private _convert: ConverterService) { }

  ngOnInit() {
    // download & render all file image previews
    this._postListService.getPosts(this.DB_Ip).subscribe(res => {
      // "res.toString().length == 3" means we have an error respond
      if (res.toString().substring(0, 2) !== 'E-') {
        // set post list data

        this.posts = res;
        // this.filteredPosts = res;
        // this.posts = this.unfilteredPosts;
        // download & set set server-stored images
        this.download_Thumbnails();
      } else {
        console.log(this._ErrId.getErrorMessage(res));
      }
    });

    // fill category list
    this._typeListService.getTypes(this.DB_Ip).subscribe(res => {
      // "res.toString().length == 3" means we have an error respond
      if (res.toString().substring(0, 2) !== 'E-') {
        // set post list data
        this.categories = res;
      } else {
        console.log(this._ErrId.getErrorMessage(res));
      }
    });

    // get Post / Type Associations
    this._typeListService.getAssociations(this.DB_Ip).subscribe(res => {
      if (res.toString().substring(0, 2) !== 'E-') {
        this.associations = res;
      } else {
        console.log(this._ErrId.getErrorMessage(res)); // error connecting to database
      }
    });
  }

  private download_Thumbnails() {
    for (let index = 0; index < this.posts.length; index++) {
      this._downloader.downloadImage(this.posts[index].id, this.DB_Ip).subscribe((res) => {
        // no error received
        const img: any = document.querySelector('#img_' + index); // HTML img element
        if (res.toString().substring(0, 2) !== 'E-') {
          // _convert from Base64 to Blob
          const downBlob = this._convert.b64toBlob(res , 512);
          // create local URL for the img
          const imageUrl: string = URL.createObjectURL(downBlob);
          // set img value
          img.style = 'background-image: url(\'' + imageUrl + '\'); background-size: cover; background-position: center;';
          // console.log(img.style);
        } else {
          // set img error value
          img.style = 'background-image: url(\'assets/images/image-X.png\'); background-size: cover; background-position: center;';
        }
      });
    }
  }

  private downloadEvent(i: number) {
    this._downloader.downloadFile(this.posts[i].id, this.DB_Ip).subscribe((res) => {
      if (res.toString().substring(0, 2) !== 'E-') {
        // _convert from Base64 to Blob
        const downBlob = this._convert.b64toBlob(res , 512);
        // _convert from Blob to File
        const downFile = this._convert.blobToFile(downBlob , this.posts[i].file_path);
        // triger the "save downloaded file" browser event
        saveAs(downFile);
      } else { // refresh page if file not found
        console.log(this._ErrId.getErrorMessage(res));
      }
    });
  }

  public typePickEvent(event) {
    // let img: any;
    const fireboxFix = event.target || event.srcElement;
    const indexToFind = (<HTMLSelectElement>fireboxFix).value;
    this.filteredPosts = this._filterer.filterPostList(indexToFind, this.posts, this.associations);
    // redownload images
    let card: any; // HTML img element
    for (let i = 0; i < this.posts.length; i++) {
      card = document.querySelector('#card_' + i);
      card.style.display = 'none';
      for (let j = 0; j < this.filteredPosts.length; j++) {
        if (this.posts[i].id === this.filteredPosts[j]) {
          /*img = document.querySelector('#img_' + j); // HTML img element
          img.src = this.imagesPathList[i];*/
          card.style.display = 'block';
        }
      }
    }
  }

}
