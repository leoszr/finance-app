import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { AccountType, TransactionType } from '@/types/finance';

const timestamps = {
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
};

export const accounts = sqliteTable('accounts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').$type<AccountType>().notNull(),
  currency: text('currency').notNull().default('BRL'),
  initialBalanceCents: integer('initial_balance_cents').notNull().default(0),
  ...timestamps,
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type', { enum: ['income', 'expense'] }).$type<TransactionType>().notNull(),
  color: text('color'),
  icon: text('icon'),
  ...timestamps,
});

export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  accountId: integer('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  type: text('type', { enum: ['income', 'expense'] }).$type<TransactionType>().notNull(),
  amountCents: integer('amount_cents').notNull(),
  description: text('description'),
  transactionDate: text('transaction_date').notNull(),
  ...timestamps,
});

export const settings = sqliteTable('settings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  ...timestamps,
});

export const schema = {
  accounts,
  categories,
  transactions,
  settings,
};
