import { db, initDB } from './db.js';
import { nanoid } from 'nanoid';
import bcrypt from 'bcryptjs';

async function seed() {
  await initDB();
  await db.read();

  if (!db.data.products || db.data.products.length === 0) {
    db.data.products = [
      {
        id: nanoid(),
        name: 'Wireless Headphones',
        description: 'Bluetooth over-ear headphones with noise isolation.',
        price: 59.99,
        imageUrl: 'https://picsum.photos/seed/headphones/640/400'
      },
      {
        id: nanoid(),
        name: 'Smart Watch',
        description: 'Fitness tracking, notifications, long battery life.',
        price: 79.99,
        imageUrl: 'https://picsum.photos/seed/smartwatch/640/400'
      },
      {
        id: nanoid(),
        name: 'USB-C Power Bank',
        description: '10000mAh fast-charging portable battery.',
        price: 24.99,
        imageUrl: 'https://picsum.photos/seed/powerbank/640/400'
      },
      {
        id: nanoid(),
        name: 'Mechanical Keyboard',
        description: 'Compact 60% mechanical keyboard for productivity.',
        price: 49.99,
        imageUrl: 'https://picsum.photos/seed/keyboard/640/400'
      }
    ];
  }

  // create demo user if missing
  const demoEmail = 'test@example.com';
  const exists = db.data.users.find(u => u.email === demoEmail);
  if (!exists) {
    db.data.users.push({
      id: nanoid(),
      name: 'Demo User',
      email: demoEmail,
      passwordHash: bcrypt.hashSync('test1234', 10),
      createdAt: new Date().toISOString()
    });
  }

  await db.write();
  console.log('Seed complete.');
}

seed();
