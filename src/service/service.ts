import { Item } from "../interface/interface.model";

let items: Item[] = [

]




export const findAll = async (): Promise<Item[]> => Object.values(items);
export const find = async (id: string): Promise<Item | undefined> => items.find((_item) => _item.id === id)

export const create = async (newItem: Item): Promise<Item> => {
    items.push(newItem)
    return newItem;
};

export const update = async (
    id: string,
    itemUpdate: Item
): Promise<Item | null> => {
    console.log(id);
    let item = await find(id);
    console.log(item);

    if (!item) {
        return null;
    }
    console.log(itemUpdate);
    item = { ...itemUpdate };

    return item;
};

export const remove = async (id: string): Promise<null | void> => {
    const itemId = await find(id);
    console.log(itemId);

    if (!itemId) {
        return null;
    }
    items = items.filter((item) => item !== itemId)


};