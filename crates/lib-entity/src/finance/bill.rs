use std::fmt;

use chrono::NaiveDateTime;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, EnumIter, DeriveActiveEnum, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum FlowInOrOut {
    #[sea_orm(num_value = 0)]
    Unkonwn = 0,
    // 支出
    #[sea_orm(num_value = 1)]
    Out = 1,
    // 收入
    #[sea_orm(num_value = 2)]
    In = 2,
    // 不计收支
    #[sea_orm(num_value = 3)]
    Ignore = 3,
}

impl fmt::Display for FlowInOrOut {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FlowInOrOut::Unkonwn => write!(f, "未知"),
            FlowInOrOut::Out => write!(f, "支出"),
            FlowInOrOut::In => write!(f, "收入"),
            FlowInOrOut::Ignore => write!(f, "不计收支"),
        }
    }
}

#[derive(Debug, EnumIter, DeriveActiveEnum, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum FlowStatus {
    #[sea_orm(num_value = 1)]
    UnChecked = 1,
    #[sea_orm(num_value = 2)]
    Checked = 2,
    #[sea_orm(num_value = 3)]
    Archiver = 3,
}

impl fmt::Display for FlowStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FlowStatus::UnChecked => write!(f, "未检查"),
            FlowStatus::Checked => write!(f, "已检查"),
            FlowStatus::Archiver => write!(f, "已归档"),
        }
    }
}

#[derive(Debug, EnumIter, DeriveActiveEnum, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum PayType {
    #[sea_orm(num_value = 0)]
    Unkonwn = 0,
    #[sea_orm(num_value = 1)]
    AliPay = 1,
    #[sea_orm(num_value = 2)]
    Wechat = 2,
    #[sea_orm(num_value = 3)]
    BankCard = 3,
    #[sea_orm(num_value = 4)]
    Cash = 4,
    #[sea_orm(num_value = 5)]
    CreditCard = 5,
}

impl fmt::Display for PayType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            PayType::Unkonwn => write!(f, "未知"),
            PayType::AliPay => write!(f, "支付宝"),
            PayType::Wechat => write!(f, "微信"),
            PayType::BankCard => write!(f, "银行卡"),
            PayType::Cash => write!(f, "支付宝"),
            PayType::CreditCard => write!(f, "信用卡"),
        }
    }
}

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "flow"
    }
}
#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq, Serialize, Deserialize)]
pub struct Model {
    pub id: i64,
    pub identifier: String, // 唯一标识
    pub title: String,      // 标题
    pub money_fen: i32,     // 金额(分)

    pub budget_idf: Option<String>, // 预算标识

    pub in_or_out: FlowInOrOut,   // 收入或支出
    pub user_idf: Option<String>, // 用户标识

    pub flow_status: Option<FlowStatus>, // 账单状态

    pub pay_type: Option<PayType>,  // 支付类型
    pub pay_detail: Option<String>, // 支付详情(如果是银行卡，支付宝，微信，信用卡，这里存储卡号)

    pub counterparty: Option<String>, // 交易对方(对方账号)
    pub order_id: Option<String>,     // 订单号

    pub product_info: Option<String>,    // 产品信息
    pub spend_at: Option<NaiveDateTime>, // 消费时间
    pub remark: Option<String>,          // 备注
    pub source_raw: Option<String>,      // 原始数据

    pub is_deleted: bool,          // 是否删除
    pub created_at: NaiveDateTime, // 创建时间
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Identifier,
    Title,
    MoneyFen,
    BudgetIdf,
    InOrOut,
    UserIdf,
    FlowStatus,
    PayType,
    PayDetail,
    Counterparty,
    OrderId,
    ProductInfo,
    SpendAt,
    Remark,
    SourceRaw,
    IsDeleted,
    CreatedAt,
}

#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = i64;
    fn auto_increment() -> bool {
        true
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {}

impl ColumnTrait for Column {
    type EntityName = Entity;
    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Identifier => ColumnType::String(Some(32u32)).def().unique(),
            Self::Title => ColumnType::String(Some(32u32)).def(),
            Self::MoneyFen => ColumnType::Integer.def(),
            Self::BudgetIdf => ColumnType::String(Some(32u32)).def().nullable(),

            Self::InOrOut => ColumnType::SmallInteger
                .def()
                .nullable()
                .default(FlowInOrOut::Unkonwn),
            Self::UserIdf => ColumnType::String(Some(32u32)).def().nullable(),

            Self::FlowStatus => ColumnType::SmallInteger
                .def()
                .nullable()
                .default(FlowStatus::UnChecked),
            Self::PayType => ColumnType::SmallInteger
                .def()
                .nullable()
                .default(PayType::Unkonwn),

            Self::PayDetail => ColumnType::Text.def().nullable(),
            Self::Counterparty => ColumnType::Text.def().nullable(),
            Self::OrderId => ColumnType::Text.def().nullable(),
            Self::ProductInfo => ColumnType::Text.def().nullable(),
            Self::Remark => ColumnType::Text.def().nullable(),
            Self::SpendAt => ColumnType::DateTime
                .def()
                .nullable()
                .default(Expr::current_timestamp()),
            Self::SourceRaw => ColumnType::Text.def().nullable(),
            Self::IsDeleted => ColumnType::Boolean.def().nullable().default(false),
            Self::CreatedAt => ColumnType::DateTime
                .def()
                .nullable()
                .default(Expr::current_timestamp()),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        panic!("No RelationDef")
    }
}

impl ActiveModelBehavior for ActiveModel {}
