export function encodePassword(login: string): string {
  const basicAuth = btoa(`${login}:${process.env.ZAMMAD_USER_PASSWORD}`);
  return 'Basic ' + basicAuth;
}
