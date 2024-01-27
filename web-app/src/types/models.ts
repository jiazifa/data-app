// 基础数据
export interface ID {
  id: number;
}

export interface Permission {
  id: number;
  name: string;
  remark?: string;
}

export interface Role {
  id: number;
  name: string;
  remark?: string;
}

export interface RoleWithPermission extends Role {
  permissions: Permission[];
}

export enum Gender {
  UNKNOWN = "unknown",
  MALE = "male",
  FEMALE = "female",
}

export const GenderMapTitle = {
  unknown: "未知",
  male: "男",
  female: "女",
};

export interface User {
  id: number;
  identifier: string;
  user_name?: string;
  gender: Gender;
  email?: string;
  phone?: string;
}

// finance
export interface Budget {
  identifier: string; // 唯一标识
  title: string;
  parent_idf?: string; // 父级唯一标识
  remark?: string;
  created_at: Date; // 创建时间
}

export enum FlowInOrOut {
  UNKONWN = "Unkonwn", // 未知
  IN = "In", // 收入
  OUT = "Out", // 支出
  IGNORE = "Ignore", // 不计收支
}

export const FlowInOrOutMapTitle = {
  Unkonwn: "未知",
  In: "收入",
  Out: "支出",
  Ignore: "不计收支",
};

export enum FlowStatus {
  UNCHECKED = "UnChecked", // 未审核
  CHECKED = "Checked", // 已审核
  ARCHIVER = "Archiver", // 已归档
}

export const FlowStatusMapTitle = {
  UnChecked: "未审核",
  Checked: "已审核",
  Archiver: "已归档",
};

export enum PayType {
  UNKONWN = "Unkonwn", // 未知
  ALIPAY = "AliPay", // 支付宝
  WECHAT = "Wechat", // 微信
  CASH = "Cash", // 现金
  BANKCARD = "BankCard", // 银行卡
  CREDITCARD = "CreditCard", // 信用卡
}

export const PayTypeMapTitle = {
  Unkonwn: "未知",
  AliPay: "支付宝",
  Wechat: "微信",
  Cash: "现金",
  BankCard: "银行卡",
  CreditCard: "信用卡",
};

export interface Flow {
  identifier: string; // 唯一标识
  title: string; // 标题
  user_idf: string; // 用户唯一标识
  in_or_out: FlowInOrOut; // 收入或支出
  money_fen: number; // 金额
  budget_idf: string; // 预算唯一标识

  flow_type: FlowInOrOut; // 账单类型
  flow_status: FlowStatus; // 账单状态

  pay_type: PayType; // 支付类型
  pay_detail: string; // 支付详情

  counterparty?: string; // 交易对方
  order_id?: string; // 订单号

  product_info: string; // 产品详情
  source_raw?: string; // 来源原始数据
  remark?: string; // 备注

  spend_at: Date; // 消费时间
}

export interface BudgetWithMoney extends Budget {
  money_fen: number;
}

export interface PageRequest {
  page: number;
  page_size: number;
}

export interface PageResponse<T> {
  total_page: number;
  cur_page: number;
  page_size: number;
  data: T[];
}
