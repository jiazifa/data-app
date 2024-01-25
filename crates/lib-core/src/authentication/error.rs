use thiserror::Error;

#[derive(Debug, Error)]
pub enum ErrorUserAuthorized {
    #[error("`{0}` Used")]
    UserExists(String),

    #[error("{0} 登录验证错误")]
    LoginValidError(String),

    #[error("token验证错误")]
    TokenValidError,

    #[error("用户不存在")]
    UserNotFound,

    #[error("权限验证错误")]
    PermissionValidError,
    #[error("无权限")]
    NoPermission,
}
