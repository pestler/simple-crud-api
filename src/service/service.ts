import { Item } from "../interface/interface.model";

let items: Item[] = [
    {
        id: '11',
        username: 'test',
        age: 18,
        hobbies: ['node js', 'angular']
    },
    {
        id: '22',
        username: 'test2',
        age: 18,
        hobbies: ['ts']
    }
]




export const findAll = async (): Promise<Item[]> => Object.values(items);
export const find = async (id: string): Promise<Item | undefined> => items.find((_item) => _item.id === id)

export const create = async (newItem: Item): Promise<Item> => {
    items.push(newItem)
    return newItem;
};

/* export const update = async (
    id: number,
    itemUpdate: BaseItem
): Promise<Item | null> => {
    const item = await find(id);

    if (!item) {
        return null;
    }

    items[id] = { id, ...itemUpdate };

    return items[id];
}; */

export const remove = async (id: string): Promise<null | void> => {
    const itemId = await find(id);
    console.log(itemId);

    if (!itemId) {
        return null;
    }
    items = items.filter((item) => item !== itemId)
    

};