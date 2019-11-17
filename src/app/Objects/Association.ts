
export class Association {

    id: number;
    id_post: number;
    id_post_type: number;

    constructor(id: number, id_post: number, id_post_type: number) {
        this.id = id;
        this.id_post = id_post;
        this.id_post_type = id_post_type;
    }

    public reset() {
        this.id = 0;
        this.id_post = 0;
        this.id_post_type = 0;
    }

    set(association: Association) {
        this.id = association.id;
        this.id_post = association.id_post;
        this.id_post_type = association.id_post_type;
    }

    duplicate(): Association {
      // const newAssociation: Association = new Association( this.id, this.id_post, this.id_post_type);
      // newAssociation.id = this.id;
      // newAssociation.id_post = this.id_post;
      // newAssociation.id_post_type = this.id_post_type;
      // return newAssociation;
      return new Association( this.id, this.id_post, this.id_post_type);
    }
}
