export default class Category {
    id?: number;
    title: string;
    color: string;

    constructor(category: any) {
        this.id = Number(category.id);
        this.title = category.title;
        this.color = category.color;
    }
}
