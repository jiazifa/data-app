use crate::{api_error::APIError, response::APIResponse, AppState};
use axum::{Extension, Json};
use lib_core::{
    common_schema::{PageRequest, PageResponse},
    error::ErrorInService,
    finance::schema::BudgetWithMoney,
};
use lib_core::{finance::schema::QueryBudgetPiePayload, finance::FinanceService};
use lib_entity::authentication::user;
use lib_utils::Setting;
use serde_json::json;
use std::sync::Arc;

pub(crate) async fn get_budget_overview(
    app: Extension<Arc<AppState>>,
    Json(req): Json<QueryBudgetPiePayload>,
) -> Result<APIResponse<Vec<BudgetWithMoney>>, APIError> {
    let conn = &app.pool;
    let new_entity = FinanceService::get_budget_overview(req, conn).await?;
    tracing::info!("查询饼状图数据: {new_entity:?}");
    Ok(APIResponse::<Vec<BudgetWithMoney>>::new()
        .with_code(200_i32)
        .with_data(new_entity))
}
