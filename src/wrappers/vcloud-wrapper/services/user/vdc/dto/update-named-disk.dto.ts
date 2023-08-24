import { RawAxiosRequestHeaders } from 'axios';

export interface UpdateNamedDiskDto {
  urlParams: UpdateNamedDiskUrlParams;
  body: string;
  headers: Partial<RawAxiosRequestHeaders>;
}

interface UpdateNamedDiskUrlParams {
  namedDiskId: string;
}
