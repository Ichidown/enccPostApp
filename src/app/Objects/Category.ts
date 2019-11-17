
export class Category {

    id: number;
    title: string;

    constructor() {

    }

    public reset() {
        this.id = 0;
        this.title = '';
    }

    set(category: Category) {
        this.id = category.id;
        this.title = category.title;
    }

    duplicate(): Category {
      const newCategory: Category = new Category();
      newCategory.id = this.id;
      newCategory.title = this.title;
      return newCategory;
    }
}
