import { Item } from "../interface/interface.model";

let items: Item[] = [];

export const findAll = async (): Promise<Item[]> => items;

export const find = async (id: string): Promise<Item | undefined> =>
  items.find((item) => item.id === id);

export const findIndex = (id: string): number =>
  items.findIndex((item) => item.id === id);

export const create = async (newItem: Item): Promise<Item> => {
  items.push(newItem);
  console.log(`New item created: ${JSON.stringify(newItem)}`);
  return newItem;
};

export const update = async (id: string, itemUpdate: Item): Promise<Item | null> => {
  const index = findIndex(id);

  if (index === -1) {
    console.warn(`Item with id ${id} not found for update`);
    return null;
  }

  items[index] = { ...items[index], ...itemUpdate };
  console.log(`Item updated: ${JSON.stringify(items[index])}`);
  return items[index];
};

export const remove = async (id: string): Promise<null | void> => {
  const itemToRemove = await find(id);

  if (!itemToRemove) {
    console.warn(`Item with id ${id} not found for removal`);
    return null;
  }

  items = items.filter((item) => item.id !== id);
  console.log(`Item removed with id: ${id}`);
};
