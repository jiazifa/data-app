// service of authentication

use crate::common_schema::PageRequest;
use crate::common_schema::PageResponse;
use crate::error::ErrorInService;
use crate::DBConnection;

use super::schema;
use lib_entity::authentication::*;
use sea_orm::ActiveValue;
use sea_orm::EntityOrSelect;
use sea_orm::EntityTrait;
use sea_orm::QueryFilter;
use sea_orm::QuerySelect;
use sea_orm::Set;
use sea_orm::{entity::*, query::*};

#[derive(Debug)]
pub struct AuthenticationService;

impl AuthenticationService {
    pub async fn create_user(
        payload: schema::CreateUserPayload,
        conn: &DBConnection,
    ) -> Result<user::Model, ErrorInService> {
        // 确定用户是否已经存在
        let is_user_exists = Self::is_user_exists(
            schema::GetUserIsExistsPayload {
                name: Some(payload.name.clone()),
                phone: payload.phone.clone(),
            },
            conn,
        )
        .await?;
        if is_user_exists {
            return Err(ErrorInService::Custom("用户已存在".to_string()));
        }

        let mut new_user = user::ActiveModel {
            phone: ActiveValue::set(payload.phone),
            user_name: ActiveValue::Set(Some(payload.name)),
            gender: Set(payload.gender),
            ..Default::default()
        };

        new_user.identifier = match payload.identifier {
            Some(identifier) => Set(identifier),
            None => Set(uuid::Uuid::new_v4().simple().to_string()),
        };

        let register_user = match user::Entity::insert(new_user)
            .exec_with_returning(conn)
            .await
        {
            Ok(user) => user,
            Err(e) => {
                tracing::error!("error: {:?}", e);
                return Err(ErrorInService::DBError(e));
            }
        };
        Ok(register_user)
    }

    // ! 通过用户的字段得用户实例
    pub async fn get_user_by_options(
        payload: schema::GetUserByOptionsPayload,
        conn: &DBConnection,
    ) -> Result<PageResponse<user::Model>, ErrorInService> {
        let mut select = user::Entity::find();
        if let Some(identifiers) = payload.identifiers {
            select = select.filter(user::Column::Identifier.is_in(identifiers));
        }
        select = select.select();

        let page_info = payload.page.unwrap_or_default();
        let page_size = page_info.page_size;
        let page = page_info.page;

        let pageinator = select
            .order_by_asc(user::Column::Id)
            .paginate(conn, page_size);

        let total_page = pageinator.num_pages().await?;
        let models = pageinator.fetch_page(page - 1).await?;
        let resp = PageResponse::new(total_page, page, page_size, models);
        Ok(resp)
    }

    // !判断用户是否已经存在
    pub async fn is_user_exists(
        payload: schema::GetUserIsExistsPayload,
        conn: &DBConnection,
    ) -> Result<bool, ErrorInService> {
        let mut select = user::Entity::find();
        if let Some(name) = payload.name {
            select = select.filter(user::Column::UserName.eq(name));
        }
        if let Some(phone) = payload.phone {
            select = select.filter(user::Column::Phone.eq(phone));
        }
        select = select.select();
        let count = select.count(conn).await?;
        Ok(count > 0)
    }

    // !更新用户信息
    pub async fn update_user(
        payload: schema::UpdateUserPayload,
        conn: &DBConnection,
    ) -> Result<user::Model, ErrorInService> {
        let old_user = match user::Entity::find()
            .filter(user::Column::Identifier.eq(payload.identifier.clone()))
            .one(conn)
            .await
        {
            Ok(Some(user)) => user,
            Ok(None) => return Err(ErrorInService::RecordNotFound),
            Err(e) => {
                tracing::error!("error: {:?}", e);
                return Err(ErrorInService::DBError(e));
            }
        };
        let new_user = user::ActiveModel {
            id: ActiveValue::set(old_user.id),
            identifier: Set(payload.identifier),
            ..Default::default()
        };
        let updated_user = new_user.update(conn).await?;
        Ok(updated_user)
    }
}

#[derive(Debug)]
pub struct PermissionService {
    pub user_id: i64,
}

impl PermissionService {
    pub fn new(user_id: i64) -> Self {
        Self { user_id }
    }

    pub async fn get_user_roles(
        &self,
        db: &DBConnection,
    ) -> Result<Vec<role::Model>, ErrorInService> {
        let select = role::Entity::find()
            .join_rev(
                JoinType::LeftJoin,
                user_role::Entity::belongs_to(role::Entity)
                    .from(user_role::Column::RoleIdentifier)
                    .to(role::Column::Identifier)
                    .into(),
            )
            .join(
                JoinType::LeftJoin,
                user_role::Entity::belongs_to(user::Entity)
                    .from(user_role::Column::UserId)
                    .to(user::Column::Id)
                    .into(),
            )
            .filter(user::Column::Id.eq(self.user_id))
            .select();
        let roles = select.all(db).await;
        match roles {
            Ok(roles) => Ok(roles),
            Err(e) => {
                tracing::error!("error: {:?}", e);
                Err(ErrorInService::DBError(e))
            }
        }
    }

    pub async fn get_user_permissions(
        &self,
        db: &DBConnection,
    ) -> Result<Vec<permission::Model>, ErrorInService> {
        let select = permission::Entity::find()
            .join_rev(
                JoinType::LeftJoin,
                role_permission::Entity::belongs_to(permission::Entity)
                    .from(role_permission::Column::PermissionIdentifier)
                    .to(permission::Column::Identifier)
                    .into(),
            )
            .join(
                JoinType::LeftJoin,
                role_permission::Entity::belongs_to(role::Entity)
                    .from(role_permission::Column::RoleIdentifier)
                    .to(role::Column::Identifier)
                    .into(),
            )
            .join(
                JoinType::LeftJoin,
                user_role::Entity::belongs_to(role::Entity)
                    .from(user_role::Column::RoleIdentifier)
                    .to(role::Column::Identifier)
                    .into(),
            )
            .join(
                JoinType::LeftJoin,
                user_role::Entity::belongs_to(user::Entity)
                    .from(user_role::Column::UserId)
                    .to(user::Column::Id)
                    .into(),
            )
            .filter(user::Column::Id.eq(self.user_id))
            .select();
        let permissions = select.all(db).await;
        match permissions {
            Ok(permissions) => Ok(permissions),
            Err(e) => {
                tracing::error!("error: {:?}", e);
                Err(ErrorInService::DBError(e))
            }
        }
    }

    pub async fn has_permission(
        &self,
        permission: &str,
        db: &DBConnection,
    ) -> Result<bool, ErrorInService> {
        let permissions = self.get_user_permissions(db).await?;
        let has_permission = permissions.iter().any(|p| p.identifier == permission);
        Ok(has_permission)
    }
}
