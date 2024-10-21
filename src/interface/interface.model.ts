export interface BaseItem {
    name: string;    
    description: string;
}

export interface Item extends BaseItem {
    id: number;
}

export interface Items {
    [key: number]: Item;
}