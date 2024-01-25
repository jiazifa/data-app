use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct IDPayload {
    pub id: i64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct IdentifierPayload {
    pub identifier: String,
}

#[derive(Debug, Deserialize)]
pub struct IDsPayload {
    pub ids: Vec<i64>,
}

#[derive(Debug, Deserialize)]
pub struct IdentifiersPayload {
    pub identifiers: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageRequest {
    pub page: u64,
    pub page_size: u64,
}

impl Default for PageRequest {
    fn default() -> Self {
        Self {
            page: 1,
            page_size: u64::MAX,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PageResponse<T> {
    pub total_page: u64,
    pub cur_page: u64,
    pub page_size: u64,
    pub data: Vec<T>,
}

impl<T> PageResponse<T> {
    pub fn new(total_page: u64, cur_page: u64, page_size: u64, data: Vec<T>) -> Self {
        Self {
            total_page,
            cur_page,
            page_size,
            data,
        }
    }
}
