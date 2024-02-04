import { Budget } from "./finance";

export interface PageRequest {
  page: number;
  pageSize: number;
}

export function sql_page_option(page: PageRequest) {
  return {
    skip: (page.page - 1) * page.pageSize,
    take: page.pageSize,
  };
}

export interface PageResponse<T> {
  total_page: number;
  cur_page: number;
  page_size: number;
  data: T[];
}

// 基础数据
export interface ID {
  id: number;
}
export interface BudgetWithMoney extends Budget {
  money_fen: number;
}

export * from "./user.d";
export * from "./finance.d";
