export type RecipeObject = {
    _id: string;
    title: string;
    ingredients: string[];
    tags: string[];
    category: number;
    uri: string;
};

export type RecipeCompareObject = {
    _id: string
};

export type UserObject = {
    _id: string,
    ingredient: string
};