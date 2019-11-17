
export class Post {

    id: number;
    title: string;
    description: string;
    date: string;
    img_path: string;
    file_path: string;
    extention: string;
    img_server_path: string;
    file_server_path: string;

    constructor() {

    }

    public reset() {
        this.id = 0;
        this.title = '';
        this.description = '';
        this.date = '0000-00-00';
        this.img_path = '';
        this.file_path = '';
        this.extention = '';
        this.img_server_path = '';
        this.file_server_path = '';

    }

    set(post: Post) { // : Post {
        this.id = post.id;
        this.title = post.title;
        this.description = post.description;
        this.date = post.date;
        this.img_path = post.img_path;
        this.file_path = post.file_path;
        this.extention = post.extention;
        this.img_server_path = '';
        this.file_server_path = '';

        // return this;
    }

    duplicate(): Post {

      const newPost: Post = new Post();

        newPost.id = this.id;
        newPost.title = this.title;
        newPost.description = this.description;
        newPost.date = this.date;
        newPost.img_path = this.img_path;
        newPost.file_path = this.file_path;
        newPost.extention = this.extention;
        newPost.img_server_path = this.img_server_path;
        newPost.file_server_path = this.file_server_path;

      return newPost;
    }
}
