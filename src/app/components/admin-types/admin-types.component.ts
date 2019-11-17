import { AdminTypeListService } from 'src/app/Services/admin_type_list.service';
import { Category } from 'src/app/Objects/Category';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { TypeListService } from 'src/app/Services/type_list.service';
import { ErrorIdentifierService } from 'src/app/Services/error-identifier.service';

@Component({
  selector: 'app-admin-types',
  templateUrl: './admin-types.component.html',
  styleUrls: ['./admin-types.component.scss']
})
export class AdminTypesComponent implements OnInit {

  private DB_Ip = '192.168.0.186';
  isNewTypeForm = true; // true == creation ; false == update
  modalformGroup: FormGroup;
  FormModalName: FormControl;
  categories = [];
  public category: Category = new Category();
  errorMsg: String;
  successMsg: String;
  modalTitle = 'no title';
  public listId: number;

  // modal elements
  @ViewChild('popUpframe') public popUpModal;
  @ViewChild('popUpframe2') public popUpModal2;
  @ViewChild('formFrame') public formModal;

  constructor(private _typeListService: TypeListService,
              private _adminTypeListService: AdminTypeListService,
              private fb: FormBuilder,
              private ErrId: ErrorIdentifierService) {

    this.FormModalName = new FormControl('', [Validators.required, Validators.minLength(1)]);
    this.modalformGroup = fb.group({});
    this.modalformGroup.addControl('titleForm', this.FormModalName);
  }

  ngOnInit() {
    this._typeListService.getTypes(this.DB_Ip).subscribe(res => {
      // "res.toString().length == 3" means we have an error respond
      if (res.toString().substring(0, 2) !== 'E-') {
        // set post list data
        this.categories = res;
      } else {
        console.log(this.ErrId.getErrorMessage(res));
      }
    });
  }

  // ! Post delete Event
  DeleteEvent(id: number) {
    this._adminTypeListService.deleateType(this.categories[id].id, this.DB_Ip).then((res) => {
      if (res.toString().substring(0, 2) !== 'E-' && res != null) {
        this.categories.splice(id, 1); // remove deleated post from postList
        this.newPopUpSuccess('supprimée avec succès');
      } else {
        this.newPopUpError(this.ErrId.getErrorMessage(res));
      }
    }).catch((err) => {
        this.newPopUpError(this.ErrId.getErrorMessage('E-550'));
    });
  }


    // ! Modal form open Event
    openModalForm(id: number) {
      // empty values if create, set existing data if update
      if (id === -1) { // set create initialisations
        this.category.reset();
        this.isNewTypeForm = true;
        this.modalTitle = 'Creation de categorie';
      } else { // set update initialisations
        this.listId = id;
        this.category.set(this.categories[id]); // set post values
        this.isNewTypeForm = false;
        this.modalTitle = 'Modification de categorie';
      }
      // reset input validators
      this.FormModalName.markAsUntouched();
      // show modal form
      this.formModal.show();
    }

    submitForm(form: any) {
      if (form.valid) {
        if (this.isNewTypeForm) { // CREATE
            this.createRequest(); // send create request
        } else { // UPDATE : if picked a file/img .. must wait upload
            this.updateRequest(); // send update request
        }
        this.formModal.hide(); // close modal
      } else { this.newPopUpError(this.ErrId.getErrorMessage('E-900')); }
    }


      // ! New Post request
  private createRequest() {
    this._adminTypeListService.createType(this.category, this.DB_Ip).then((res) => {
      if (res.toString().substring(0, 2) !== 'E-') {
        this.category.id = <number>res; // set the new type id (generated from DB server)
        this.categories.push(this.category.duplicate()); // add new post to post list
        this.newPopUpSuccess('crée avec succès');
      } else { this.newPopUpError(this.ErrId.getErrorMessage(res)); }
    });
  }

  // ! Edit post request
  private updateRequest() {
    this._adminTypeListService.updateType(this.category, this.DB_Ip).then((res) => {
      if (res === 1) {
        this.categories[this.listId] = this.category.duplicate(); // update type list content with updated post
        this.newPopUpSuccess('modifié avec succès');
      } else { this.newPopUpError(this.ErrId.getErrorMessage(res)); }
    });
  }


  // ! Pop Up error method
  private newPopUpError(msg: String) {
    this.errorMsg = msg;
    this.popUpModal.show();
  }

  private newPopUpSuccess(msg: any) {
    this.successMsg = msg;
    this.popUpModal2.show();
  }
}
