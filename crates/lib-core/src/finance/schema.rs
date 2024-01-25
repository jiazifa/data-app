use lib_entity::finance::bill::{FlowInOrOut, FlowStatus, PayType};
use sea_orm::FromQueryResult;
use serde::{Deserialize, Serialize};

use crate::common_schema::PageRequest;

#[derive(Debug, Deserialize)]
pub struct AddBudgetPayload {
    pub identifier: Option<String>, // 唯一标识
    pub parent_idf: Option<String>, // 父级
    pub title: String,
    pub remark: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateBudgetPayload {
    pub identifier: String,         // 唯一标识
    pub parent_idf: Option<String>, // 父级
    pub title: String,
    pub remark: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct QueryBudgetPayload {
    pub identifiers: Option<Vec<String>>,

    pub page: Option<PageRequest>,
}

#[derive(Debug, Deserialize)]
pub struct AddFlowPayload {
    pub identifier: Option<String>,
    pub title: String,
    pub money_fen: i32,

    pub budget_idf: Option<String>,

    pub in_or_out: FlowInOrOut,
    pub user_idf: Option<String>,

    pub flow_status: Option<FlowStatus>,

    pub pay_type: Option<PayType>,
    pub pay_detail: Option<String>,

    pub counterparty: Option<String>,
    pub order_id: Option<String>,

    pub product_info: Option<String>,
    pub source_raw: Option<String>,
    pub spend_at: i64,
    pub remark: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFlowPayload {
    pub identifier: String,
    pub title: String,
    pub money_fen: i32,

    pub budget_idf: Option<String>,

    pub in_or_out: FlowInOrOut,
    pub user_idf: Option<String>,

    pub flow_status: Option<FlowStatus>,
    pub pay_type: Option<PayType>,
    pub pay_detail: Option<String>,

    pub counterparty: Option<String>,
    pub order_id: Option<String>,

    pub product_info: Option<String>,
    pub remark: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct QueryFlowPayload {
    pub identifiers: Option<Vec<String>>,
    pub budget_idf: Option<String>,
    pub user_idf: Option<String>,

    pub start_at: Option<i64>,
    pub end_at: Option<i64>,

    pub in_or_out: Option<FlowInOrOut>,
    pub flow_status: Option<FlowStatus>,
    pub pay_type: Option<PayType>,
    pub counterparty: Option<String>,

    pub page: Option<PageRequest>,
}

#[derive(Debug, Deserialize)]
pub struct QueryBudgetPiePayload {
    pub start_at: Option<i64>,
    pub end_at: Option<i64>,
    pub budget_idfs: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromQueryResult)]
pub struct BudgetWithMoney {
    pub identifier: String,
    pub title: String,
    pub remark: Option<String>,
    pub money_fen: i32,
}
