type CatalogMediaRecord = {
  id: string;
  taskId: string;
  name: string;
  isBusy: boolean;
  storageB: number;
  status: string;
  creationDate: string;
};

export class CatalogMedia {
  total: number;
  page: number;
  pageSize: number;
  records: CatalogMediaRecord[];
}
