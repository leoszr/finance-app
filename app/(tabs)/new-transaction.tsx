import { Redirect, type Href } from 'expo-router';

const transactionsHref = '/transactions' as Href;

export default function NewTransactionRoute() {
  return <Redirect href={transactionsHref} />;
}
