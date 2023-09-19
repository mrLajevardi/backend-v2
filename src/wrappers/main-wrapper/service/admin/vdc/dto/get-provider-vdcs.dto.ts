export interface GetProviderVdcsDto {
  resultTotal: number;
  pageCount: number;
  page: number;
  pageSize: number;
  associations: Association[];
  values: Value[];
}

export interface Association {
  entityId: string;
  associationId: string;
}

export interface Value {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  maxSupportedHwVersion: string;
  creationStatus?: string;
  nsxTManager: NsxTManager;
  vimServer: NsxTManager;
}

export interface NsxTManager {
  name: string;
  id: string;
}
