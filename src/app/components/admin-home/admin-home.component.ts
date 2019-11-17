import { Association } from 'src/app/Objects/Association';
import { Category } from 'src/app/Objects/Category';
import { Component, OnInit, ViewChild  } from '@angular/core';
import { PostListService } from 'src/app/Services/post_list.service';
import { AdminPListService } from 'src/app/Services/admin-p-list.service';
import { ErrorIdentifierService } from 'src/app/Services/error-identifier.service';
import { ImageResult, ResizeOptions } from 'ng2-imageupload';
import { ConverterService } from 'src/app/Services/converter.service';

import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Post } from 'src/app/Objects/Post';

// import {Router} from '@angular/router';
import { DownloaderService } from 'src/app/Services/downloader.service';
import { TypeListService } from 'src/app/Services/type_list.service';
import { AdminTypeListService } from 'src/app/Services/admin_type_list.service';
import { FiltererService } from 'src/app/Services/filterer.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss']
})
export class AdminHomeComponent implements OnInit {

  // modal elements
  @ViewChild('formFrame') public formModal;
  @ViewChild('popUpframe') public popUpModal;
  @ViewChild('popUpframe2') public popUpModal2;

  modalTitle = 'no title';
  previewImageContent: any;
  errorMsg: String;
  successMsg: String;

  // Database Ip Adress
  private DB_Ip = '192.168.0.186';

  // form validators
  FormModalTitle: FormControl;
  FormModalDescription: FormControl;
  modalformGroup: FormGroup;

  private isNewPostForm = true; // true == creation ; false == update
  public posts: Post[] = [];
  public associations: Association[] = [];
  public associationCheckList: boolean[] = [];
  public associationCheckListUnchanged: boolean[] = [];
  private currentfoundAssociations: Association[] = [];
  public categories: Category[] = [];
  public post: Post = new Post();
  public filteredPosts: number[] = [];
  // public types;

  private imgFile: File;
  private postFile: File;
  public listId: number;

  public isFileUploaded: Boolean;
  public isImgUploaded: Boolean;
  public isFilePicked: Boolean;
  public isImgPicked: Boolean;

  public isDropDownShown: Boolean;

  private maxFileSize = 100000000; // 100Mb max
  private maxImgSize = 100000000; // 50Mb max

  // image resize options
  resizeOptions: ResizeOptions = {
      resizeMaxHeight: 256,
      resizeMaxWidth: 256,
      resizeType: 'image/jpg'
  };


  constructor(
    private _postListService: PostListService,
    private _adminPListService: AdminPListService,
    private _adminTypeListService: AdminTypeListService,
    private fb: FormBuilder,
    private ErrId: ErrorIdentifierService,
    private _downloader: DownloaderService,
    private _typeListService: TypeListService,
    private _filterer: FiltererService,
    private converter: ConverterService) {
      // text input/area validation rules : valid if not empty / text input length > 0
      this.FormModalTitle = new FormControl('', [Validators.minLength(1), Validators.required]);
      this.FormModalDescription = new FormControl('', [Validators.minLength(1), Validators.required]);
      // form validation rules : valid if FormModalTitle && FormModalDescription are valid
      this.modalformGroup = fb.group({});
      this.modalformGroup.addControl('titleForm', this.FormModalTitle);
      this.modalformGroup.addControl('descriptionForm', this.FormModalDescription);
    }


  // ! On page loaded
  ngOnInit() {
    // Get post list from DB
    this._postListService.getPosts(this.DB_Ip).subscribe(res => {
      if (res.toString().substring(0, 2) !== 'E-') {
        this.posts = res;
      } else {
        this.newPopUpError(res); // error connecting to database
      }
    });

    // get Post / Type Associations
    this._typeListService.getAssociations(this.DB_Ip).subscribe(res => {
      if (res.toString().substring(0, 2) !== 'E-') {
        this.associations = res;
      } else {
        this.newPopUpError(res); // error connecting to database
      }
    });

    // fill category list
    this._typeListService.getTypes(this.DB_Ip).subscribe(res => {
      // "res.toString().length == 3" means we have an error respond
      if (res.toString().substring(0, 2) !== 'E-') {
        // set post list data
        this.categories = res;
      } else {
        console.log(res);
      }
    });


  }

  // ! Modal form open Event
  openModalForm(id: number) {
    // standard modal initialisations
    this.isFileUploaded = false;
    this.isImgUploaded = false;
    this.isFilePicked = false;
    this.isImgPicked = false;

    this.previewImageContent = 'assets/images/image-X.png';

    // empty values if create, set existing data if update
    if (id === -1) { // set create initialisations
      for (let i = 0; i < this.categories.length; i++) {
        this.associationCheckList[i] = false;
      }
      this.post.reset(); // empty post data
      this.initialiseFormModal(true, 'Creation de document', 'selectionnez une image', 'selectionnez un fichier');
      // reset input validators
      this.FormModalTitle.markAsUntouched();
      this.FormModalDescription.markAsUntouched();

    } else { // set update initialisations
      this.listId = id;
      this.post.set(this.posts[id]); // set post values
      this.generateCheckList(this.posts[id].id); // generate category checkList
      this.initialiseFormModal(false, 'Modification de document', this.post.img_path, this.post.file_path);

      this.FormModalTitle.markAsUntouched();
      this.FormModalDescription.markAsUntouched();
    }

    // show modal form
    this.formModal.show();
  }

  generateCheckList(index: number) {
    this.currentfoundAssociations = [];
    // find all associations of the current post
    for (let i = 0; i < this.associations.length; i++) {
      if (this.associations[i].id_post === index) {
        this.currentfoundAssociations.push(this.associations[i]);
      }
    }
    // generate checklist
    for (let i = 0; i < this.categories.length; i++) {
      this.associationCheckList[i] = false;
      for (let j = 0; j < this.currentfoundAssociations.length; j++) {
        if (this.currentfoundAssociations[j].id_post_type === this.categories[i].id) {
          this.associationCheckList[i] = true;
        }
      }
    }
    // save association CheckList before editing
    for (let i = 0; i < this.associationCheckList.length; i++) {
      this.associationCheckListUnchanged[i] = this.associationCheckList[i];
    }
  }

  // ! Post Form modal initialisations
  initialiseFormModal(isNewPostForm: boolean, modalTitle: string, imgLabel: string, fileLabel: string) {
    this.isNewPostForm = isNewPostForm; // true = creation / false = update
    this.modalTitle = modalTitle;
    document.getElementById('ImgPathLabel').innerHTML = imgLabel;
    document.getElementById('FilePathLabel').innerHTML = fileLabel;
  }

  changeCheckbox(index: number) {
    this.associationCheckList[index] = !this.associationCheckList[index];
  }

  // ! Post delete Event
  DeleteEvent(id: number) {
    this._adminPListService.deleatePost(this.posts[id].id, this.DB_Ip).then((res) => {
      if (res.toString().substring(0, 2) !== 'E-' && res != null) {
        this.posts.splice(id, 1); // remove deleated post from postList
        this.newPopUpSuccess('supprimé avec succès');
      } else {
        this.newPopUpError(res);
      }
    }).catch((err) => {
        this.newPopUpError('E-550');
    });
  }

  // ! image Picked Event
  imgPicked(event: ImageResult) {
    // set resized image
    this.previewImageContent = event.resized && event.resized.dataURL || event.dataURL;
    // image too large validation
    if (event.file.size <= this.maxImgSize) {
      this.imgFile = event.file;  // save the picked image
      this.post.img_path = event.file.name; // save img name
      document.getElementById('ImgPathLabel').innerHTML = this.post.img_path; // set label value
      this.isImgPicked = true; // mark img as picked
    } else { this.newPopUpError('E-600'); }
  }

  // ! file Picked Event
  filePicked(event) {
    // get post file reference
    const tempPostFile = <File>event.target.files[0];
    // file too large validation
    if (tempPostFile.size <= this.maxFileSize) {
      this.postFile = tempPostFile; // save the picked file
      this.post.file_path = event.target.files[0].name; // save file name
      this.post.extention = this.post.file_path.slice(this.post.file_path.lastIndexOf('.') + 1); // save file extention
      document.getElementById('FilePathLabel').innerHTML = this.post.file_path; // set label value
      this.isFilePicked = true; // mark file as picked
    } else { this.newPopUpError('E-601'); }
  }

  // ! Submit Event
  submitForm(form: any) {
    if (this.isNewPostForm) { // CREATE
      if (form.valid) {
        if (this.isFilePicked && this.isImgPicked) {
          this.uploadPickedFile(this.postFile, false);
          this.uploadPickedFile(this.imgFile, true);
        } else { this.newPopUpError('E-810'); }
      } else { this.newPopUpError('E-900'); }
    } else { // UPDATE
        if (!this.isFilePicked && !this.isImgPicked) {
          this.trySendRequest();
        } else {
          if (this.isFilePicked) { this.uploadPickedFile(this.postFile, false); }
          if (this.isImgPicked) { this.uploadPickedFile(this.imgFile, true); }
        }
    }
  }

  // ! Upload file
  private uploadPickedFile(file: File, isImg: boolean) {
    this._adminPListService.uploadFile(file, this.DB_Ip).subscribe((res) => {
      if (res.toString().substring(0, 2) !== 'E-') {
        if (isImg) {
          this.post.img_server_path = res.toString();
          this.isImgUploaded = true;
        } else {
          this.post.file_server_path = res.toString();
          this.isFileUploaded = true;
        }
        this.trySendRequest(); // when upload finished try to send data to server
      } else { this.newPopUpError(res); }
    });
  }

  // ! Send request if both file & image are uploaded
  private trySendRequest() {
    if (this.isNewPostForm) { // CREATE
      if (this.isFileUploaded && this.isImgUploaded) {
          this.createRequest(); // send create request
          this.formModal.hide(); // close modal
          this.newPopUpSuccess('crée avec succès');
      }
    } else { // UPDATE : if picked a file/img .. must wait upload
      if ((this.isFileUploaded || this.isImgUploaded) || // img & file uploaded
          (!this.isFilePicked && !this.isImgPicked)) { // img & file not picked
        this.updateRequest(); // send update request
        this.formModal.hide(); // close modal
        this.newPopUpSuccess('modifié avec succès');
      } else { this.newPopUpError('E-810'); }
    }
  }

  // ! New Post request
  private createRequest() {
    this.post.date = new Date().toJSON().slice(0, 10); // update post date

    this._adminPListService.createPost(this.post, this.DB_Ip).then((res) => {
      if (res.toString().substring(0, 2) !== 'E-') {
        this.post.id = <number>res; // set the new post id (generated from DB server)
        this.posts.push(this.post.duplicate()); // add new post to post list
        // create associations
        for (let i = 0; i < this.associationCheckList.length; i++ ) {
          if (this.associationCheckList[i] === true) {
            const newAssociation: Association = new Association(0, this.post.id, this.categories[i].id);
            this._adminTypeListService.createAssociation(newAssociation, this.DB_Ip).then((res2) => {
              if (res2.toString().substring(0, 2) !== 'E-') {
                this.associations.push(newAssociation);
              }
            });
          }
        }
      } else { this.newPopUpError(res); }
    });
  }

  // ! Edit post request
  private updateRequest() {
    // update post date
    this.post.date = new Date().toJSON().slice(0, 10);

    this._adminPListService.updatePost(this.post, this.DB_Ip).then((res) => {
      if (res.toString().substring(0, 2) !== 'E-') {
        this.posts[this.listId] = this.post.duplicate(); // update post list content with updated post

        for (let i = 0; i < this.associationCheckListUnchanged.length; i++ ) {
          if (this.associationCheckListUnchanged[i] !== this.associationCheckList[i]) { // found a change in associations
            if (this.associationCheckList[i] === true) { // create associations
              const newAssociation: Association = new Association(0, this.post.id, this.categories[i].id);
              this._adminTypeListService.createAssociation(newAssociation, this.DB_Ip).then((res2) => {
                if (res2.toString().substring(0, 2) !== 'E-') {
                  this.associations.push(newAssociation);
                }
              });
            } else { // delete associations
              for (let j = 0; j < this.currentfoundAssociations.length; j++ ) {
                if ( this.currentfoundAssociations[j].id_post_type === this.categories[i].id  ) {
                  this._adminTypeListService.deleateAssociation(this.currentfoundAssociations[j].id, this.DB_Ip).then((res2) => {
                    if (res2.toString().substring(0, 2) === 'E-') {
                      this.newPopUpError(res2);
                    }
                  });
                }
              }
            }
          }
        }
      } else { this.newPopUpError(res); }
    });
  }

  public typePickEvent(event) {
    const pickedIndex: string = event.target.value;
    this.filteredPosts = this._filterer.filterPostList(pickedIndex, this.posts, this.associations);
    // show filtered images & hide the rest
    let row: any;
    for (let i = 0; i < this.posts.length; i++) {
      row = document.querySelector('#row_' + i);
      row.hidden = 'true';
      for (let j = 0; j < this.filteredPosts.length; j++) {
        if (this.posts[i].id === this.filteredPosts[j]) {
          row.hidden = null;
        }
      }
    }
  }

  // ! Pop Up error method
  private newPopUpError(msg: any) {
    this.errorMsg = this.ErrId.getErrorMessage(msg);
    this.popUpModal.show();
  }

  private newPopUpSuccess(msg: any) {
    this.successMsg = msg;
    this.popUpModal2.show();
  }

}
