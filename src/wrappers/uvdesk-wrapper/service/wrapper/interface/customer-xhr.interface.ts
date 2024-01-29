export interface CustomerXhrDto {
  customers: Customer[];
  pagination_data: PaginationData;
  customer_count: CustomerCount;
}

export interface CustomerCount {
  all: number;
  starred: number;
}

export interface Customer {
  id: number;
  email: string;
  smallThumbnail: null;
  isStarred: boolean;
  isActive: boolean;
  name: string;
  source: string;
  count: number;
}

export interface PaginationData {
  last: number;
  current: number;
  numItemsPerPage: number;
  first: number;
  pageCount: number;
  totalCount: number;
  pageRange: number;
  startPage: number;
  endPage: number;
  pagesInRange: number[];
  firstPageInRange: number;
  lastPageInRange: number;
  currentItemCount: number;
  firstItemNumber: number;
  lastItemNumber: number;
  url: string;
}
