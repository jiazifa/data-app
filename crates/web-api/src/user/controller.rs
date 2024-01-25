use crate::{api_error::APIError, response::APIResponse, AppState};
use axum::{Extension, Json};
use lib_core::authentication::{
    schema::{
        CreateUserPayload, GetUserByOptionsPayload, GetUserIsExistsPayload, UpdateUserPayload,
    },
    AuthenticationService,
};
use lib_core::{
    common_schema::{PageRequest, PageResponse},
    error::ErrorInService,
};
use lib_entity::authentication::user;
use lib_utils::Setting;
use serde_json::json;
use std::sync::Arc;

/// 创建/更新用户
///
/// 1. 如果用户不存在，则创建用户
pub(crate) async fn add_user(
    app: Extension<Arc<AppState>>,
    Json(req): Json<CreateUserPayload>,
) -> Result<APIResponse<user::Model>, APIError> {
    let conn = &app.pool;
    let new_user = AuthenticationService::create_user(req, conn).await?;
    Ok(APIResponse::<user::Model>::new()
        .with_code(200_i32)
        .with_data(new_user))
}

pub(crate) async fn get_user_by_options(
    app: Extension<Arc<AppState>>,
    Json(req): Json<GetUserByOptionsPayload>,
) -> Result<APIResponse<PageResponse<user::Model>>, String> {
    let conn = &app.pool;
    let users = AuthenticationService::get_user_by_options(req, conn).await;
    if let Ok(u) = users {
        Ok(APIResponse::<PageResponse<user::Model>>::new()
            .with_code(200_i32)
            .with_data(u))
    } else {
        return Err("查询数据失败".to_string());
    }
}

pub(crate) async fn is_user_exists(
    app: Extension<Arc<AppState>>,
    Json(req): Json<GetUserIsExistsPayload>,
) -> Result<APIResponse<bool>, String> {
    let conn = &app.pool;
    let is_user_exists = AuthenticationService::is_user_exists(req, conn).await;
    if let Ok(u) = is_user_exists {
        Ok(APIResponse::<bool>::new().with_code(200_i32).with_data(u))
    } else {
        return Err("查询数据失败".to_string());
    }
}

pub(crate) async fn update_user(
    app: Extension<Arc<AppState>>,
    Json(req): Json<UpdateUserPayload>,
) -> Result<APIResponse<user::Model>, APIError> {
    let conn = &app.pool;
    let user = AuthenticationService::update_user(req, conn).await?;

    Ok(APIResponse::<user::Model>::new()
        .with_code(200_i32)
        .with_data(user))
}
