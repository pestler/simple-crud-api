import { BaseItem, Item, Items } from "../interface/interface.model";

let items: Items = {
    1: {
        id: 11,
        username: 'test',
        age: 18,
        hobbies: ['node js', 'angular']
    },
    2: {
        id: 22,
        username: 'test2',
        age: 18,
        hobbies: ['ts']
    }
}


export const findAll = async (): Promise<Item[]> => Object.values(items);
export const find = async (id: number): Promise<Item> => items[id];

export const create = async (newItem: BaseItem): Promise<Item> => {
    const id = new Date().valueOf();
    items[id] = {
        id,
        ...newItem,
    };    
    return items[id];
};

export const update = async (
    id: number,
    itemUpdate: BaseItem
): Promise<Item | null> => {
    const item = await find(id);

    if (!item) {
        return null;
    }

    items[id] = { id, ...itemUpdate };

    return items[id];
};

export const remove = async (id: number): Promise<null | void> => {    
    const item = await find(id);
    console.log(item);

    if (!item) {
        return null;
    }
    delete items[id];
};