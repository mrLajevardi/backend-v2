export function getAccept(acceptType: string, version?: string): string {
  const cloudapiVersion = version ?? process.env.VCLOUD_VERSION;
  return `${acceptType}; version=${cloudapiVersion}`;
}
