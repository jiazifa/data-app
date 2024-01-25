use std::{env, sync::OnceLock};

use config::{Config, ConfigError, Environment};
use serde::Deserialize;
use std::cell::OnceCell;

#[derive(Debug, Clone, Deserialize)]
#[allow(unused)]
pub struct Database {
    pub uri: String,
}

#[derive(Debug, Clone, Deserialize)]
#[allow(unused)]
pub struct Web {
    pub address: String,
    pub compression: Option<bool>,
}

impl Default for Web {
    fn default() -> Self {
        Self {
            address: "0.0.0.0:3000".to_string(),
            compression: Some(true),
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[allow(unused)]
pub struct Log {
    pub dir: Option<String>,
    pub level: Option<String>,
}

impl Default for Log {
    fn default() -> Self {
        Self {
            dir: Some("logs".to_string()),
            level: Some("info".to_string()),
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[allow(unused)]
pub struct Setting {
    pub debug: bool,
    pub database: Database,
    pub web: Web,
    pub log: Log,
}

impl Default for Setting {
    fn default() -> Self {
        Self {
            debug: true,
            database: Database {
                uri: "sqlite::memory:?mode=rwc".to_string(),
            },
            web: Web::default(),
            log: Log::default(),
        }
    }
}

#[cfg(test)]
impl Setting {
    pub fn test() -> Setting {
        Setting::default()
    }
}

static SHARED_SETTING: OnceLock<Setting> = OnceLock::new();

impl Setting {
    pub fn global() -> Setting {
        assert!(SHARED_SETTING.get().is_some());
        SHARED_SETTING.get().expect("配置文件未加载").clone()
    }

    pub fn from_config(file: String) -> Result<Setting, ConfigError> {
        let mut cfg = load_configure(file);
        let setting = cfg.try_deserialize::<Setting>()?;
        Ok(setting)
    }

    pub fn set_global(setting: Setting) {
        SHARED_SETTING.set(setting.clone()).expect("配置文件未加载");
        let cloned = setting.clone();
        SHARED_SETTING.get_or_init(|| cloned);
    }
}

fn load_configure<T: AsRef<str>>(file: T) -> Config {
    let mut builder = Config::builder();
    let cfg_file = file.as_ref();
    // set debug to true
    builder = builder.set_default("debug", true).unwrap();

    builder = builder.set_default("web.address", "0.0.0.0:8888").unwrap();
    builder = builder.set_default("web.compression", true).unwrap();

    builder = builder.set_default("log.level", "info").unwrap();
    builder = builder.set_default("log.dir", "logs").unwrap();

    builder = builder.set_default("jwt.secret", "secret").unwrap();
    builder = builder.set_default("jwt.exp", 3600 * 24 * 30).unwrap();

    builder = builder
        .set_default("database.uri", "sqlite://data.db?mode=rwc")
        .unwrap();

    if std::path::Path::new(&cfg_file).exists() {
        builder = builder.add_source(config::File::with_name(cfg_file).required(false));
    } else {
        println!("配置文件不存在，将使用默认配置{}运行", cfg_file);
    }
    builder = builder.add_source(Environment::with_prefix("APP"));

    builder.build().expect("配置文件加载失败")
}
