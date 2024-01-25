use chrono::NaiveDateTime;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, EnumIter, DeriveActiveEnum, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[sea_orm(rs_type = "i32", db_type = "Integer", enum_name = "gender")]
#[serde(rename_all = "lowercase")]
pub enum Gender {
    #[sea_orm(num_value = 0)]
    Unknown = 0,
    #[sea_orm(num_value = 1)]
    Male = 1,
    #[sea_orm(num_value = 2)]
    Female = 2,
}

#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "user"
    }
    fn schema_name(&self) -> Option<&str> {
        // Some("dasv")
        None
    }
}
#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel, Eq, Serialize, Deserialize)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    pub identifier: String,              // 唯一标识
    pub user_name: Option<String>,       // 用户名
    pub birthday: Option<NaiveDateTime>, // 生日
    pub gender: Gender,                  // 性别
    pub password: Option<String>,        // 密码
    pub email: Option<String>,           // 邮箱
    pub phone: Option<String>,           // 手机号
    pub created_at: NaiveDateTime,       // 创建时间
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Identifier,
    UserName,
    Birthday,
    Gender,
    Password,
    Email,
    Phone,
    CreatedAt,
    UpdatedAt,
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
            Self::Identifier => ColumnType::String(Some(32u32)).def().unique().indexed(),
            Self::UserName => ColumnType::String(Some(32u32)).def().nullable(),
            Self::Birthday => ColumnType::DateTime.def().nullable(),
            Self::Gender => ColumnType::SmallInteger.def().nullable().default(0i8),
            Self::Password => ColumnType::String(Some(32u32)).def().nullable(),
            Self::Email => ColumnType::String(Some(32u32)).def().nullable(),
            Self::Phone => ColumnType::String(Some(32u32)).def().nullable(),

            Self::CreatedAt => ColumnType::DateTime
                .def()
                .default(Expr::current_timestamp()),
            Self::UpdatedAt => ColumnType::DateTime.def().nullable(),
        }
    }
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        panic!("No RelationDef")
    }
}

impl ActiveModelBehavior for ActiveModel {}
