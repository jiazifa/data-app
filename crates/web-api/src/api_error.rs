use lib_core::error::ErrorInService;
use thiserror::Error;

#[allow(dead_code)]
#[derive(Debug, Error)]
pub enum APIError {
    #[error("Internal Error")]
    Internal,

    #[error("{0}")]
    ErrorParams(String),

    #[error("{0}")]
    Toast(String),
}

impl From<ErrorInService> for APIError {
    fn from(e: ErrorInService) -> Self {
        match e {
            ErrorInService::Custom(s) => APIError::Toast(s),
            ErrorInService::DBError(_s) => APIError::Internal,
            ErrorInService::ErrorParams(s) => APIError::ErrorParams(s),
            ErrorInService::MultipleRecord(s) => APIError::Toast(s),
            ErrorInService::RecordNotFound => APIError::Toast("资源不存在".to_string()),
        }
    }
}
