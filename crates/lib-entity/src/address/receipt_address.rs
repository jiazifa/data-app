use std::fmt;

use chrono::NaiveDateTime;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, EnumIter, DeriveActiveEnum, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "i32", db_type = "Integer", enum_name = "gender")]
pub enum AuditStatus {
    UNKNOWN = 0,
    AUDITING = 1,
    PASS = 2,
    REJECT = 3,
}

impl fmt::Display for AuditStatus {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::UNKNOWN => write!(f, "未知"),
            Self::AUDITING => write!(f, "审核中"),
            Self::PASS => write!(f, "审核通过"),
            Self::REJECT => write!(f, "审核拒绝"),
        }
    }
}

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "receipt_address"
    }
    fn schema_name(&self) -> Option<&str> {
        // Some("dasv")
        None
    }
}
#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq, Serialize, Deserialize)]
pub struct Model {
    pub id: i64,
    pub identifier: String,                // 唯一标识
    pub recipt_name: String,               // 收货人姓名
    pub recipt_phone: String,              // 收货人电话
    pub address: String,                   // 所在地
    pub detail_address: Option<String>,    // 详细地址
    pub audit_status: Option<AuditStatus>, // 审核状态
    pub is_default: bool,                  // 是否默认
    pub created_at: NaiveDateTime,         // 创建时间
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Identifier,
    ReciptName,
    ReciptPhone,
    Address,
    DetailAddress,
    AuditStatus,
    IsDefault,
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
            Self::ReciptName => ColumnType::String(Some(32u32)).def(),
            Self::ReciptPhone => ColumnType::String(Some(32u32)).def(),
            Self::Address => ColumnType::String(Some(32u32)).def(),
            Self::DetailAddress => ColumnType::String(Some(32u32)).def().nullable(),
            Self::AuditStatus => ColumnType::SmallInteger
                .def()
                .nullable()
                .default(AuditStatus::UNKNOWN),
            Self::IsDefault => ColumnType::Boolean.def().default(false),

            Self::CreatedAt => ColumnType::DateTime
                .def()
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
