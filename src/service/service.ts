import { Item } from "../interface/interface.model";

let items: Item[] = []

export const findAll = async (): Promise<Item[]> => Object.values(items);
export const find = async (id: string): Promise<Item | undefined> => items.find((_item) => _item.id === id)
export const findIndex = (id: string) => items.findIndex((_item) => _item.id === id)

export const create = async (newItem: Item): Promise<Item> => {
    items.push(newItem)
    return newItem;
};

export const update = async (
    id: string,
    itemUpdate: Item
): Promise<Item | null> => {
    let item = findIndex(id);

    if (!item) {
        return null;
    }
    items[item] = { ...itemUpdate, };

    return items[item];
};

export const remove = async (id: string): Promise<null | void> => {
    const itemId = await find(id);
    console.log(itemId);

    if (!itemId) {
        return null;
    }
    items = items.filter((item) => item !== itemId)
};