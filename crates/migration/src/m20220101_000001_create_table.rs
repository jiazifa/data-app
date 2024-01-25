use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        create_user_table(manager).await?;
        create_budget_table(manager).await?;
        create_flow_table(manager).await?;
        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .drop_table(Table::drop().table(Alias::new("user")).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Alias::new("budget")).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Alias::new("flow")).to_owned())
            .await?;
        Ok(())
    }
}

async fn create_user_table(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    manager
        .create_table(
            Table::create()
                .table(Alias::new("user"))
                .if_not_exists()
                .col(
                    ColumnDef::new(Alias::new("id"))
                        .not_null()
                        .primary_key()
                        .auto_increment()
                        .integer(),
                )
                .col(
                    ColumnDef::new(Alias::new("identifier"))
                        .string_len(32u32)
                        .not_null(),
                )
                .col(
                    ColumnDef::new(Alias::new("user_name"))
                        .string_len(32u32)
                        .null(),
                )
                .col(ColumnDef::new(Alias::new("birthday")).date_time().null())
                .col(
                    ColumnDef::new(Alias::new("gender"))
                        .small_integer()
                        .null()
                        .default(0i8),
                )
                // password
                .col(
                    ColumnDef::new(Alias::new("password"))
                        .string_len(32u32)
                        .null(),
                )
                // email
                .col(ColumnDef::new(Alias::new("email")).string_len(32u32).null())
                // phone
                .col(ColumnDef::new(Alias::new("phone")).string_len(32u32).null())
                .col(
                    ColumnDef::new(Alias::new("created_at"))
                        .default(Expr::current_timestamp())
                        .date_time(),
                )
                .col(
                    ColumnDef::new(Alias::new("updated_at"))
                        .default(Expr::current_timestamp())
                        .date_time(),
                )
                .to_owned(),
        )
        .await
}

async fn create_budget_table(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    manager
        .create_table(
            Table::create()
                .table(Alias::new("budget"))
                .if_not_exists()
                .col(
                    ColumnDef::new(Alias::new("id"))
                        .not_null()
                        .primary_key()
                        .auto_increment()
                        .integer(),
                )
                .col(
                    ColumnDef::new(Alias::new("identifier"))
                        .string_len(32u32)
                        .not_null(),
                )
                .col(ColumnDef::new(Alias::new("title")).string_len(32u32).null())
                .col(
                    ColumnDef::new(Alias::new("parent_idf"))
                        .string_len(32u32)
                        .null(),
                )
                // remark
                .col(ColumnDef::new(Alias::new("remark")).text().null())
                .col(
                    ColumnDef::new(Alias::new("created_at"))
                        .default(Expr::current_timestamp())
                        .date_time(),
                )
                .to_owned(),
        )
        .await
}

async fn create_flow_table(manager: &SchemaManager<'_>) -> Result<(), DbErr> {
    manager
        .create_table(
            Table::create()
                .table(Alias::new("flow"))
                .if_not_exists()
                .col(
                    ColumnDef::new(Alias::new("id"))
                        .not_null()
                        .primary_key()
                        .auto_increment()
                        .integer(),
                )
                .col(
                    ColumnDef::new(Alias::new("identifier"))
                        .string_len(32u32)
                        .not_null(),
                )
                .col(ColumnDef::new(Alias::new("title")).string_len(32u32).null())
                // money_fen
                .col(ColumnDef::new(Alias::new("money_fen")).integer().null())
                .col(
                    ColumnDef::new(Alias::new("budget_idf"))
                        .string_len(32u32)
                        .null(),
                )
                // in_or_out
                .col(
                    ColumnDef::new(Alias::new("in_or_out"))
                        .small_integer()
                        .default(0i8)
                        .null(),
                )
                // user_idf
                .col(
                    ColumnDef::new(Alias::new("user_idf"))
                        .string_len(32u32)
                        .null(),
                )
                // flow_status
                .col(
                    ColumnDef::new(Alias::new("flow_status"))
                        .small_integer()
                        .default(1i8)
                        .null(),
                )
                // pay_type
                .col(
                    ColumnDef::new(Alias::new("pay_type"))
                        .small_integer()
                        .default(0i8)
                        .null(),
                )
                // pay_detail
                .col(ColumnDef::new(Alias::new("pay_detail")).text().null())
                // counterparty
                .col(ColumnDef::new(Alias::new("counterparty")).text().null())
                // order_id
                .col(ColumnDef::new(Alias::new("order_id")).text().null())
                // product_info
                .col(ColumnDef::new(Alias::new("product_info")).text().null())
                // remark
                .col(ColumnDef::new(Alias::new("remark")).text().null())
                // spend_at
                .col(ColumnDef::new(Alias::new("spend_at")).date_time().null())
                // source_raw
                .col(ColumnDef::new(Alias::new("source_raw")).text().null())
                // is_deleted
                .col(
                    ColumnDef::new(Alias::new("is_deleted"))
                        .boolean()
                        .default(false)
                        .null(),
                )
                .col(
                    ColumnDef::new(Alias::new("created_at"))
                        .default(Expr::current_timestamp())
                        .date_time(),
                )
                .to_owned(),
        )
        .await
}
