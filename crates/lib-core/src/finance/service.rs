use super::schema::{
    AddBudgetPayload, AddFlowPayload, BudgetWithMoney, QueryBudgetPayload, QueryBudgetPiePayload,
    QueryFlowPayload, UpdateBudgetPayload, UpdateFlowPayload,
};
use crate::common_schema::{IdentifierPayload, PageRequest, PageResponse};
use crate::error::ErrorInService;
use crate::DBConnection;
use chrono::NaiveDateTime;
use lib_entity::authentication::user;
use lib_entity::finance::bill::{FlowInOrOut, FlowStatus};
use lib_entity::finance::{bill, bill_category};
use sea_orm::entity::prelude::*;
use sea_orm::query::*;
use sea_orm::sea_query::Func;
use sea_orm::{ActiveModelTrait, ColumnTrait, EntityTrait, IntoActiveModel, QueryFilter, Set};
use uuid::Uuid;

pub struct FinanceService;

impl FinanceService {
    pub async fn add_budget(
        payload: AddBudgetPayload,
        db: &DBConnection,
    ) -> Result<bill_category::Model, ErrorInService> {
        let identifier = match payload.identifier {
            Some(idf) => idf,
            None => Uuid::new_v4().simple().to_string(),
        };
        let new_budget = bill_category::ActiveModel {
            identifier: Set(identifier),
            parent_idf: Set(payload.parent_idf),
            title: Set(payload.title),
            remark: Set(payload.remark),
            ..Default::default()
        };

        let budget = match bill_category::Entity::insert(new_budget)
            .exec_with_returning(db)
            .await
        {
            Ok(b) => b,
            Err(e) => {
                tracing::error!("error: {:?}", e);
                return Err(ErrorInService::DBError(e));
            }
        };

        Ok(budget)
    }

    pub async fn update_budget(
        payload: UpdateBudgetPayload,
        db: &DBConnection,
    ) -> Result<bill_category::Model, ErrorInService> {
        let old_budget = match bill_category::Entity::find()
            .filter(bill_category::Column::Identifier.eq(payload.identifier.clone()))
            .one(db)
            .await
        {
            Ok(Some(budget)) => budget,
            Ok(None) => return Err(ErrorInService::RecordNotFound),
            Err(e) => {
                tracing::error!("error: {:?}", e);
                return Err(ErrorInService::DBError(e));
            }
        };
        let mut new_bduget = old_budget.into_active_model();
        new_bduget.title = Set(payload.title);
        new_bduget.remark = Set(payload.remark);
        new_bduget.parent_idf = Set(payload.parent_idf);
        let updated = new_bduget.update(db).await?;
        Ok(updated)
    }

    pub async fn delete_budget(
        payload: Vec<IdentifierPayload>,
        db: &DBConnection,
    ) -> Result<u64, ErrorInService> {
        let identifiers: Vec<String> = payload.iter().map(|i| i.identifier.clone()).collect();

        let result = bill_category::Entity::delete_many()
            .filter(bill_category::Column::Identifier.is_in(identifiers))
            .exec(db)
            .await?;
        Ok(result.rows_affected)
    }

    pub async fn query_budget(
        payload: QueryBudgetPayload,
        db: &DBConnection,
    ) -> Result<PageResponse<bill_category::Model>, ErrorInService> {
        let mut select = bill_category::Entity::find();
        if let Some(identifiers) = payload.identifiers {
            select = select.filter(bill_category::Column::Identifier.is_in(identifiers));
        }
        select = select.select();

        let page_info = payload.page.unwrap_or_default();
        let page_size = page_info.page_size;
        let page = page_info.page;

        let pageinator = select
            .order_by_asc(bill_category::Column::CreatedAt)
            .paginate(db, page_size);

        let total_page = pageinator.num_pages().await?;
        let models = pageinator.fetch_page(page - 1).await?;
        let resp = PageResponse::new(total_page, page, page_size, models);
        Ok(resp)
    }
}

impl FinanceService {
    pub async fn add_flow(
        payload: AddFlowPayload,
        db: &DBConnection,
    ) -> Result<bill::Model, ErrorInService> {
        let identifier = match payload.identifier {
            Some(idf) => idf,
            None => Uuid::new_v4().simple().to_string(),
        };

        let new_flow = bill::ActiveModel {
            identifier: Set(identifier),
            title: Set(payload.title),
            money_fen: Set(payload.money_fen),
            counterparty: Set(payload.counterparty),
            budget_idf: Set(payload.budget_idf),
            in_or_out: Set(payload.in_or_out),
            user_idf: Set(payload.user_idf),
            order_id: Set(payload.order_id),
            flow_status: Set(payload.flow_status),
            pay_type: Set(payload.pay_type),
            pay_detail: Set(payload.pay_detail),
            product_info: Set(payload.product_info),
            source_raw: Set(payload.source_raw),
            spend_at: Set(NaiveDateTime::from_timestamp_millis(payload.spend_at)),
            remark: Set(payload.remark),
            ..Default::default()
        };

        let flow = match bill::Entity::insert(new_flow).exec_with_returning(db).await {
            Ok(b) => b,
            Err(e) => {
                tracing::error!("error: {:?}", e);
                return Err(ErrorInService::DBError(e));
            }
        };

        Ok(flow)
    }

    pub async fn update_flow(
        payload: UpdateFlowPayload,
        db: &DBConnection,
    ) -> Result<bill::Model, ErrorInService> {
        let old_flow = match bill::Entity::find()
            .filter(bill::Column::Identifier.eq(payload.identifier.clone()))
            .one(db)
            .await
        {
            Ok(Some(flow)) => flow,
            Ok(None) => return Err(ErrorInService::RecordNotFound),
            Err(e) => {
                tracing::error!("error: {:?}", e);
                return Err(ErrorInService::DBError(e));
            }
        };

        let mut new_flow = old_flow.into_active_model();
        new_flow.title = Set(payload.title);
        new_flow.money_fen = Set(payload.money_fen);
        new_flow.budget_idf = Set(payload.budget_idf);

        new_flow.in_or_out = Set(payload.in_or_out);
        new_flow.user_idf = Set(payload.user_idf);

        new_flow.flow_status = Set(payload.flow_status);
        new_flow.pay_type = Set(payload.pay_type);
        new_flow.pay_detail = Set(payload.pay_detail);

        new_flow.counterparty = Set(payload.counterparty);
        new_flow.order_id = Set(payload.order_id);

        new_flow.product_info = Set(payload.product_info);
        new_flow.remark = Set(payload.remark);

        let updated = new_flow.update(db).await?;
        Ok(updated)
    }

    pub async fn delete_flow(
        payload: Vec<IdentifierPayload>,
        db: &DBConnection,
    ) -> Result<u64, ErrorInService> {
        let identifiers: Vec<String> = payload.iter().map(|i| i.identifier.clone()).collect();
        let update = bill::ActiveModel {
            is_deleted: Set(true),
            ..Default::default()
        };
        let result = bill::Entity::update_many()
            .set(update)
            .filter(bill::Column::Identifier.is_in(identifiers))
            .exec(db)
            .await?;
        Ok(result.rows_affected)
    }

    pub async fn query_flow(
        payload: QueryFlowPayload,
        db: &DBConnection,
    ) -> Result<PageResponse<bill::Model>, ErrorInService> {
        let mut select = bill::Entity::find()
            .join_rev(
                sea_orm::JoinType::LeftJoin,
                user::Entity::belongs_to(bill::Entity)
                    .from(user::Column::Identifier)
                    .to(bill::Column::UserIdf)
                    .into(),
            )
            .join_rev(
                sea_orm::JoinType::LeftJoin,
                bill_category::Entity::belongs_to(bill::Entity)
                    .from(bill_category::Column::Identifier)
                    .to(bill::Column::BudgetIdf)
                    .into(),
            );
        if let Some(identifiers) = payload.identifiers {
            if identifiers.len() > 0 {
                select = select.filter(bill::Column::Identifier.is_in(identifiers));
            }
        }
        if let Some(budget_idf) = payload.budget_idf {
            // 根据 消费条目筛选，根据条目 所属的 条目以及子集条目 来筛选
            // 例如 A 条目有子集 B C D，那么如果选择 A 条目，那么就会筛选出 A B C D 的分类，进而筛选出 BudgetIdf 为 A B C D 的账单
            // 通过一个子查询 来筛选出 所有的子集， 然后 判断 BudgetIdf 是否在 子集中
            select = select.filter(
                bill_category::Column::Identifier.is_in(
                    bill_category::Entity::find()
                        .filter(bill_category::Column::ParentIdf.eq(budget_idf))
                        .select_only()
                        .column(bill_category::Column::Identifier)
                        .into_model::<bill_category::Model>()
                        .all(db)
                        .await?
                        .iter()
                        .map(|b| b.identifier.clone())
                        .collect::<Vec<String>>(),
                ),
            );
        }
        if let Some(user_idf) = payload.user_idf {
            select = select.filter(bill::Column::UserIdf.eq(user_idf));
        }
        if let Some(in_or_out) = payload.in_or_out {
            select = select.filter(bill::Column::InOrOut.eq(in_or_out));
        }
        if let Some(flow_status) = payload.flow_status {
            select = select.filter(bill::Column::FlowStatus.eq(flow_status));
        }
        if let Some(pay_type) = payload.pay_type {
            select = select.filter(bill::Column::PayType.eq(pay_type));
        }
        if let Some(counterparty) = payload.counterparty {
            select = select.filter(bill::Column::Counterparty.eq(counterparty));
        }

        if let Some(start_at) = payload.start_at {
            select = select
                .filter(bill::Column::SpendAt.gt(NaiveDateTime::from_timestamp_millis(start_at)));
        }
        if let Some(end_at) = payload.end_at {
            select = select
                .filter(bill::Column::SpendAt.lt(NaiveDateTime::from_timestamp_millis(end_at)));
        }

        select = select.select();

        let page_info = payload.page.unwrap_or_default();
        let page_size = page_info.page_size;
        let page = page_info.page;

        let pageinator = select
            .order_by_desc(bill::Column::SpendAt)
            .paginate(db, page_size);

        let total_page = pageinator.num_pages().await?;
        let models = pageinator.fetch_page(page - 1).await?;
        let resp = PageResponse::new(total_page, page, page_size, models);
        Ok(resp)
    }

    pub async fn is_flow_exist_by_order_id(
        order_id: String,
        db: &DBConnection,
    ) -> Result<bool, ErrorInService> {
        let count = bill::Entity::find()
            .filter(bill::Column::OrderId.eq(order_id))
            .count(db)
            .await?;
        Ok(count > 0)
    }
}

// board_service.rs
impl FinanceService {
    pub async fn get_budget_overview(
        payload: QueryBudgetPiePayload,
        db: &DBConnection,
    ) -> Result<Vec<BudgetWithMoney>, ErrorInService> {
        let mut select = bill::Entity::find()
            .join_rev(
                sea_orm::JoinType::LeftJoin,
                user::Entity::belongs_to(bill::Entity)
                    .from(user::Column::Identifier)
                    .to(bill::Column::UserIdf)
                    .into(),
            )
            .join_rev(
                sea_orm::JoinType::LeftJoin,
                bill_category::Entity::belongs_to(bill::Entity)
                    .from(bill_category::Column::Identifier)
                    .to(bill::Column::BudgetIdf)
                    .into(),
            );
        // 只查询出 每个条目的 费用
        select = select
            .select_only()
            .columns([
                bill_category::Column::Id,
                bill_category::Column::Title,
                bill_category::Column::Identifier,
            ])
            .column(bill::Column::CreatedAt)
            .expr_as(
                Func::sum(
                    Expr::case(
                        Expr::col(bill::Column::InOrOut).eq(FlowInOrOut::In),
                        Expr::val(0).sub(Expr::col(bill::Column::MoneyFen)),
                    )
                    .case(
                        Expr::col(bill::Column::InOrOut).eq(FlowInOrOut::Out),
                        Func::abs(Expr::col(bill::Column::MoneyFen)),
                    )
                    .finally(0),
                ),
                "money_fen",
            )
            .clone()
            .group_by(bill_category::Column::Identifier);

        select = select.filter(bill::Column::IsDeleted.eq(false));
        // bill 的审核状态
        select = select.filter(bill::Column::FlowStatus.ne(FlowStatus::UnChecked));

        if let Some(start_at) = payload.start_at {
            select = select
                .filter(bill::Column::SpendAt.gt(NaiveDateTime::from_timestamp_millis(start_at)));
        }
        if let Some(end_at) = payload.end_at {
            select = select
                .filter(bill::Column::SpendAt.lt(NaiveDateTime::from_timestamp_millis(end_at)));
        }

        if let Some(budget_idfs) = payload.budget_idfs {
            if budget_idfs.len() > 0 {
                select = select.filter(bill_category::Column::Identifier.is_in(budget_idfs));
            }
        }

        select = select.select();

        let models = select.into_model::<BudgetWithMoney>().all(db).await?;
        return Ok(models);
    }
}
