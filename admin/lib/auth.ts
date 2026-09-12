import { cookies } from "next/headers";

const COOKIE_NAME = "cresol_admin_auth";
const TOKEN_VALUE = "authenticated";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value === TOKEN_VALUE;
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}

export function getAuthTokenValue() {
  return TOKEN_VALUE;
}
