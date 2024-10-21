export interface BaseItem {
    name: string;
    price: number;
    description: string;
}

export interface Item extends BaseItem {
    id: number;
}