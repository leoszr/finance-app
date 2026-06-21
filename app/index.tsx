import { Redirect, type Href } from 'expo-router';

const dashboardHref = '/dashboard' as Href;

export default function IndexRoute() {
  return <Redirect href={dashboardHref} />;
}
