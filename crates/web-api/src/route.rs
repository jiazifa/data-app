use axum::{
    routing::{get, post},
    Router,
};
use axum_extra::routing::RouterExt;

use crate::{board, finance, user};

fn build_user_routes() -> Router {
    Router::new()
        // 订阅源
        .route_with_tsr("/add", post(user::controller::add_user))
        .route_with_tsr("/query", post(user::controller::get_user_by_options))
        .route_with_tsr("/update", post(user::controller::update_user))
        .route_with_tsr("/exsits", post(user::controller::is_user_exists))
}

fn build_finance_routes() -> Router {
    Router::new()
        // 账单分类
        .route_with_tsr("/budget/add", post(finance::controller::add_budget))
        .route_with_tsr("/budget/query", post(finance::controller::query_budget))
        .route_with_tsr("/budget/update", post(finance::controller::update_budget))
        .route_with_tsr("/budget/delete", post(finance::controller::delete_budget))
        // 账单
        .route_with_tsr("/bill/add", post(finance::controller::add_flow))
        .route_with_tsr("/bill/query", post(finance::controller::query_flow))
        .route_with_tsr("/bill/update", post(finance::controller::update_flow))
        .route_with_tsr("/bill/delete", post(finance::controller::delete_flow))
        // get_budget_overview
        .route_with_tsr("/overview", post(board::controller::get_budget_overview))
}

pub fn build_routes() -> Router {
    Router::new()
        .nest("/user", build_user_routes())
        .nest("/finance", build_finance_routes())
}
