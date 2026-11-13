// Any unknown address sends people back to the start of the app.
import { Redirect } from 'expo-router';

export default function NotFound() {
  return <Redirect href="/" />;
}
