use crate::{api_error::APIError, response::APIResponse, AppState};
use axum::{Extension, Json};
use lib_core::common_schema::{IdentifierPayload, IdentifiersPayload};
use lib_core::finance::schema::{
    AddFlowPayload, QueryBudgetPayload, QueryFlowPayload, UpdateBudgetPayload, UpdateFlowPayload,
};
use lib_core::finance::{schema::AddBudgetPayload, FinanceService};
use lib_core::{
    common_schema::{PageRequest, PageResponse},
    error::ErrorInService,
};
use lib_entity::finance::{bill, bill_category};
use lib_utils::Setting;
use serde_json::json;
use std::sync::Arc;

pub(crate) async fn add_budget(
    app: Extension<Arc<AppState>>,
    Json(req): Json<AddBudgetPayload>,
) -> Result<APIResponse<bill_category::Model>, APIError> {
    let conn = &app.pool;
    let new_user = FinanceService::add_budget(req, conn).await?;
    Ok(APIResponse::<bill_category::Model>::new()
        .with_code(200_i32)
        .with_data(new_user))
}

pub(crate) async fn query_budget(
    app: Extension<Arc<AppState>>,
    Json(req): Json<QueryBudgetPayload>,
) -> Result<APIResponse<PageResponse<bill_category::Model>>, String> {
    let conn = &app.pool;
    let users = FinanceService::query_budget(req, conn).await;
    if let Ok(u) = users {
        Ok(APIResponse::<PageResponse<bill_category::Model>>::new()
            .with_code(200_i32)
            .with_data(u))
    } else {
        return Err("查询数据失败".to_string());
    }
}

pub(crate) async fn delete_budget(
    app: Extension<Arc<AppState>>,
    Json(req): Json<IdentifiersPayload>,
) -> Result<APIResponse<u64>, String> {
    let conn = &app.pool;
    let idfs: Vec<IdentifierPayload> = req
        .identifiers
        .into_iter()
        .map(|i| IdentifierPayload { identifier: i })
        .collect();
    let is_user_exists = FinanceService::delete_budget(idfs, conn).await;
    if let Ok(u) = is_user_exists {
        Ok(APIResponse::<u64>::new().with_code(200_i32).with_data(u))
    } else {
        return Err("查询数据失败".to_string());
    }
}

pub(crate) async fn update_budget(
    app: Extension<Arc<AppState>>,
    Json(req): Json<UpdateBudgetPayload>,
) -> Result<APIResponse<bill_category::Model>, APIError> {
    let conn = &app.pool;
    let user = FinanceService::update_budget(req, conn).await?;

    Ok(APIResponse::<bill_category::Model>::new()
        .with_code(200_i32)
        .with_data(user))
}

pub(crate) async fn add_flow(
    app: Extension<Arc<AppState>>,
    Json(req): Json<AddFlowPayload>,
) -> Result<APIResponse<bill::Model>, APIError> {
    let conn = &app.pool;
    let new_user = FinanceService::add_flow(req, conn).await?;
    Ok(APIResponse::<bill::Model>::new()
        .with_code(200_i32)
        .with_data(new_user))
}

pub(crate) async fn query_flow(
    app: Extension<Arc<AppState>>,
    Json(req): Json<QueryFlowPayload>,
) -> Result<APIResponse<PageResponse<bill::Model>>, String> {
    let conn = &app.pool;
    let users = FinanceService::query_flow(req, conn).await;
    if let Ok(u) = users {
        Ok(APIResponse::<PageResponse<bill::Model>>::new()
            .with_code(200_i32)
            .with_data(u))
    } else {
        return Err("查询数据失败".to_string());
    }
}

pub(crate) async fn delete_flow(
    app: Extension<Arc<AppState>>,
    Json(req): Json<IdentifiersPayload>,
) -> Result<APIResponse<u64>, String> {
    let conn = &app.pool;
    let idfs: Vec<IdentifierPayload> = req
        .identifiers
        .into_iter()
        .map(|i| IdentifierPayload { identifier: i })
        .collect();
    let is_user_exists = FinanceService::delete_flow(idfs, conn).await;
    if let Ok(u) = is_user_exists {
        Ok(APIResponse::<u64>::new().with_code(200_i32).with_data(u))
    } else {
        return Err("查询数据失败".to_string());
    }
}

pub(crate) async fn update_flow(
    app: Extension<Arc<AppState>>,
    Json(req): Json<UpdateFlowPayload>,
) -> Result<APIResponse<bill::Model>, APIError> {
    let conn = &app.pool;
    let user = FinanceService::update_flow(req, conn).await?;

    Ok(APIResponse::<bill::Model>::new()
        .with_code(200_i32)
        .with_data(user))
}
