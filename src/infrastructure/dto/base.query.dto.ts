export class BaseQueryDto {
  sortColumns?: sortTypeColumn;
}

export class sortTypeColumn {
  name: string;
  type: 'ASC' | 'DESC';
}



