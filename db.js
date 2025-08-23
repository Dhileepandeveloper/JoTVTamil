import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'node:path';

const file = join(process.cwd(), 'data', 'db.json');
const adapter = new JSONFile(file);
export const db = new Low(adapter, { users: [], products: [], orders: [] });

export async function initDB() {
  await db.read();
  if (!db.data) {
    db.data = { users: [], products: [], orders: [] };
  }
  // ensure arrays exist
  db.data.users ||= [];
  db.data.products ||= [];
  db.data.orders ||= [];
  await db.write();
}

export function findUserByEmail(email) {
  return db.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id) {
  return db.data.users.find((u) => u.id === id);
}

export function findProductById(id) {
  return db.data.products.find((p) => p.id === id);
}
