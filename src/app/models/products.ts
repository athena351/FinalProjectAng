export class Category {
    canDelete? : boolean;
    description! : string;
    id! : number;
    imageUrl! : string;
    name! : string;
    productCount? : number;
}

export class Product {
    id! : number;
    stock! : number;
    name! : string;
    brand! : string;
    model! : string;
    price! : number;
    imageUrl! : string;
    isFavorite? : boolean;
    rating? : number;
    createdAt? : Date;
    canDelete? : boolean;
    category? : ProductCategory;
}

export class ProductCategory {
    id! : number;
    name! : string;
    imageUrl! : string;
    description! : string;
    productCount? : number;
    canDelete? : boolean;
}

export class Filter{
    categoryId? : number;
    rating? : number;
    minPrice? : number;
    maxPrice? : number;
}

