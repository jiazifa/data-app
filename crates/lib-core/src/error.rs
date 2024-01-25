use sea_orm::DbErr;
use thiserror::Error;
#[derive(Debug, Error)]
pub enum ErrorInService {
    #[error("`{0}`")]
    MultipleRecord(String),

    #[error("资源不存在")]
    RecordNotFound,

    #[error("{0}")]
    ErrorParams(String),

    #[error("`{0}` 错误")]
    DBError(DbErr),
    #[error("自定义错误: `{0}`")]
    Custom(String),
}

impl From<DbErr> for ErrorInService {
    fn from(value: DbErr) -> Self {
        ErrorInService::DBError(value)
    }
}
