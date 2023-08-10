export class PaginationReturnDto<T> {
  total: number;
  page: number;
  pageSize: number;
  record: T[];
}
