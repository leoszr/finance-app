import { createAccountsRepository, type AccountRecord } from '@/db/repositories/accountsRepository';
import { createCategoriesRepository, type CategoryRecord } from '@/db/repositories/categoriesRepository';
import { createTransactionsRepository } from '@/db/repositories/transactionsRepository';

export const DEMO_PREFIX = '[Demo]';
const DEMO_ACCOUNT_NAME = `${DEMO_PREFIX} Conta corrente`;
const DEMO_INCOME_CATEGORY_NAME = `${DEMO_PREFIX} Salário`;
const DEMO_EXPENSE_CATEGORY_NAME = `${DEMO_PREFIX} Mercado`;
const DEMO_INCOME_DESCRIPTION = `${DEMO_PREFIX} Salário mensal`;
const DEMO_EXPENSE_DESCRIPTION = `${DEMO_PREFIX} Compra no mercado`;

type AccountsRepository = ReturnType<typeof createAccountsRepository>;
type CategoriesRepository = ReturnType<typeof createCategoriesRepository>;
type TransactionsRepository = ReturnType<typeof createTransactionsRepository>;

type DemoRepositories = {
  accountsRepository?: AccountsRepository;
  categoriesRepository?: CategoriesRepository;
  transactionsRepository?: TransactionsRepository;
};

function getRepositories(repositories: DemoRepositories = {}) {
  return {
    accountsRepository: repositories.accountsRepository ?? createAccountsRepository(),
    categoriesRepository: repositories.categoriesRepository ?? createCategoriesRepository(),
    transactionsRepository: repositories.transactionsRepository ?? createTransactionsRepository(),
  };
}

function isDemoAccount(account: AccountRecord) {
  return account.name === DEMO_ACCOUNT_NAME;
}

function isDemoCategory(category: CategoryRecord) {
  return category.name === DEMO_INCOME_CATEGORY_NAME || category.name === DEMO_EXPENSE_CATEGORY_NAME;
}

function demoDate(day: number) {
  const now = new Date();
  const safeDay = Math.min(day, new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate());
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(safeDay).padStart(2, '0')}`;
}

export async function clearDemoData(repositories?: DemoRepositories) {
  const { accountsRepository, categoriesRepository, transactionsRepository } = getRepositories(repositories);
  const transactions = await transactionsRepository.getTransactions();
  const demoAccountIds = new Set((await accountsRepository.getAccounts()).filter(isDemoAccount).map((account) => account.id));
  const demoCategoryIds = new Set((await categoriesRepository.getCategories()).filter(isDemoCategory).map((category) => category.id));

  for (const transaction of transactions) {
    const isSeededTransaction = transaction.description === DEMO_INCOME_DESCRIPTION || transaction.description === DEMO_EXPENSE_DESCRIPTION;
    if (isSeededTransaction && demoAccountIds.has(transaction.accountId) && demoCategoryIds.has(transaction.categoryId)) {
      const result = await transactionsRepository.deleteTransaction(transaction.id);
      if (!result.ok) return result;
    }
  }

  for (const category of await categoriesRepository.getCategories()) {
    if (isDemoCategory(category)) {
      const result = await categoriesRepository.deleteCategory(category.id);
      if (!result.ok) return result;
    }
  }

  for (const account of await accountsRepository.getAccounts()) {
    if (isDemoAccount(account)) {
      const result = await accountsRepository.deleteAccount(account.id);
      if (!result.ok) return result;
    }
  }

  return { ok: true as const, value: null };
}

export async function seedDemoData(repositories?: DemoRepositories) {
  const repos = getRepositories(repositories);
  const cleared = await clearDemoData(repos);
  if (!cleared.ok) return cleared;

  const account = await repos.accountsRepository.createAccount({ name: DEMO_ACCOUNT_NAME, type: 'checking', initialBalanceCents: 250000 });
  if (!account.ok) return account;

  const salary = await repos.categoriesRepository.createCategory({ name: DEMO_INCOME_CATEGORY_NAME, type: 'income', color: '#0f766e' });
  if (!salary.ok) return salary;

  const groceries = await repos.categoriesRepository.createCategory({ name: DEMO_EXPENSE_CATEGORY_NAME, type: 'expense', color: '#dc2626' });
  if (!groceries.ok) return groceries;

  const income = await repos.transactionsRepository.createTransaction({
    accountId: account.value.id,
    categoryId: salary.value.id,
    type: 'income',
    amountCents: 520000,
    description: DEMO_INCOME_DESCRIPTION,
    transactionDate: demoDate(5),
  });
  if (!income.ok) return income;

  return repos.transactionsRepository.createTransaction({
    accountId: account.value.id,
    categoryId: groceries.value.id,
    type: 'expense',
    amountCents: 8345,
    description: DEMO_EXPENSE_DESCRIPTION,
    transactionDate: demoDate(10),
  });
}
