export interface BaseItem {
    username: string;
    age: number;
    hobbies: string[];
}

export interface Item extends BaseItem {
    id: number;
}

export interface Items {
    [key: number]: Item;
}


/* export interface User {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
}
 */