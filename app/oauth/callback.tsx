import { Redirect } from "expo-router";

/** Firebase AuthSession completes its native callback inside the auth hook. */
export default function OAuthCallbackRedirect() {
  return <Redirect href="/" />;
}
