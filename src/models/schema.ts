import { boolean, integer, pgEnum, pgTable, primaryKey, text, timestamp } from 'drizzle-orm/pg-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const users = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  image: text('image'),
  currency: text('currency').default('USD'),
  monthlyIncome: integer('monthlyIncome').default(0).notNull(),
  monthlyBudget: integer('monthlyBudget').default(0).notNull(),
  savingsGoal: integer('savingsGoal').default(0).notNull(),
  initialSavings: integer('initialSavings').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type UserRecord = typeof users.$inferSelect

export const accounts = pgTable(
  'auth_account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
)

export const sessions = pgTable('auth_session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const verificationTokens = pgTable(
  'auth_verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', { mode: 'date' }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
)

export const authenticators = pgTable(
  'auth_authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: boolean('credentialBackedUp').notNull(),
    transports: text('transports'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  }),
)

export const recurringTypes = ['one-time', 'weekly', 'fortnightly', 'monthly', 'yearly', 'custom'] as const
export type RecurringType = (typeof recurringTypes)[number]
export const recurringTypeEnum = pgEnum('recurring_type', recurringTypes)

export const transactionTypes = ['expense', 'income'] as const
export type TransactionType = (typeof transactionTypes)[number]
export const transactionTypeEnum = pgEnum('transaction_type', transactionTypes)

export const expenseCategories = [
  'housing',
  'utilities',
  'food',
  'transportation',
  'insurances',
  'health',
  'subscriptions',
  'lifestyle',
  'investments',
  // 'revenue', // TODO support in the future, to add revenues/incomes in the settings page or another one
  // 'income',
  'other',
] as const
export type ExpenseCategory = (typeof expenseCategories)[number]
export const expenseCategoryEnum = pgEnum('expense_category', expenseCategories)

export const transactions = pgTable('transaction', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  logo: text('logo'),
  amount: integer('amount').notNull(),
  category: expenseCategoryEnum('category').default('other').notNull(),
  transactionType: transactionTypeEnum('transaction_type').default('expense').notNull(),

  // recurring options:
  recurringType: recurringTypeEnum('recurring_type').default('monthly').notNull(),
  monthlyDay: integer('monthly_day').default(1).notNull(),
  monthlyCustomRecurringMonths: integer('monthly_recurring_months'),
  startingMonth: integer('starting_month').default(0).notNull(), // 0 for January, 11 for December
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  // end recurring options
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Transactionx = typeof transactions.$inferSelect
export type Transaction = {
  id: any
  userId: any
  title: any
  logo: any
  amount: any
  category: any
  recurringType: any
  monthlyDay: any
  monthlyCustomRecurringMonths: any
  startingMonth: any
  startDate: any
  endDate: any
  createdAt: any
  updatedAt: any
}
