import {Category} from "../model/Category";

export class GetCategoryDto{
    category: Category;

    constructor(category: Category) {
        this.category = category;
    }
}