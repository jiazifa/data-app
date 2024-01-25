use chrono::NaiveDateTime;
use lib_entity::authentication::user::Gender;
use serde::{Deserialize, Serialize};

use crate::common_schema::PageRequest;

// 创建用户
#[derive(Debug, Deserialize)]
pub struct CreateUserPayload {
    pub identifier: Option<String>,
    pub name: String,
    pub gender: Gender,
    pub phone: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct GetUserByTokenPayload {
    pub token: String,
}

#[derive(Debug, Default, Deserialize)]
pub struct GetUserByOptionsPayload {
    pub identifiers: Option<Vec<String>>,
    pub page: Option<PageRequest>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserPayload {
    pub identifier: String,
    pub birthday: Option<NaiveDateTime>,
    pub email: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct GetUserIsExistsPayload {
    pub name: Option<String>,
    pub phone: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GrantPermissionPayload {
    pub p_id: i64,
    pub grant_to: i64,
}

// prepare some static roles
pub struct Roles;

impl Roles {
    pub const USER: (&'static str, &'static str) = ("role.user", "普通用户");
    pub const ADMIN: (&'static str, &'static str) = ("role.admin", "管理员");
    pub const SUPER_ADMIN: (&'static str, &'static str) = ("role.super_admin", "超级管理员");
}

pub struct Permissions;
impl Permissions {
    pub const USER_VIEW: (&'static str, &'static str) = ("permission.user.view", "用户查看");
    pub const USER_CREATE: (&'static str, &'static str) = ("permission.user.create", "用户创建");
    pub const USER_UPDATE: (&'static str, &'static str) = ("permission.user.update", "用户更新");
    pub const USER_DELETE: (&'static str, &'static str) = ("permission.user.delete", "用户删除");

    pub const ROLE_VIEW: (&'static str, &'static str) = ("permission.role.view", "角色查看");
    pub const ROLE_CREATE: (&'static str, &'static str) = ("permission.role.create", "角色创建");
    pub const ROLE_UPDATE: (&'static str, &'static str) = ("permission.role.update", "角色更新");
    pub const ROLE_DELETE: (&'static str, &'static str) = ("permission.role.delete", "角色删除");

    pub const PERMISSION_MANAGE: (&'static str, &'static str) =
        ("permission.permission.manage", "权限管理");
    pub const PERMISSION_VIEW: (&'static str, &'static str) =
        ("permission.permission.view", "权限查看");
    pub const PERMISSION_CREATE: (&'static str, &'static str) =
        ("permission.permission.create", "权限创建");
    pub const PERMISSION_UPDATE: (&'static str, &'static str) =
        ("permission.permission.update", "权限更新");
    pub const PERMISSION_DELETE: (&'static str, &'static str) =
        ("permission.permission.delete", "权限删除");
}
