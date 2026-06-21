export const transactionTypes = ['income', 'expense'] as const;
export type TransactionType = (typeof transactionTypes)[number];

export const accountTypes = ['checking', 'savings', 'cash', 'credit', 'investment', 'other'] as const;
export type AccountType = (typeof accountTypes)[number];

export type MoneyCents = number;
