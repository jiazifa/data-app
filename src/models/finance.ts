import {
  CreateOrUpdateBudgetReq as CreateOrUpdateCategoryReq,
  CreateOrUpdateFlowReq,
  QueryBudgetPayload,
  QueryFlowPayload as QueryBillPayload,
  sql_page_option,
} from "@/types";
import { getDB } from "./db";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export async function addOrUpdateCategory(req: CreateOrUpdateCategoryReq) {
  const db = getDB();
  const uuid = uuidv4();
  const simplifiedUuid = uuid.replace(/-/g, "");

  // find category by identifier
  let category = null;
  if (req.identifier) {
    category = await db.category.findUnique({
      where: {
        identifier: req.identifier,
      },
    });
  }

  if (category) {
    // update category
    return await db.category.update({
      where: {
        identifier: req.identifier,
      },
      data: {
        title: req.title,
        parent_idf: req.parent_idf,
        remark: req.remark,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  } else {
    // create category
    return await db.category.create({
      data: {
        identifier: simplifiedUuid,
        title: req.title,
        parent_idf: req.parent_idf,
        remark: req.remark,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }
}

export async function queryCategoryByOption(option: QueryBudgetPayload) {
  const db = getDB();
  const page = sql_page_option(option.page ?? { page: 1, pageSize: 10 });
  const categories = await db.category.findMany({
    where: {
      ...(option.identifiers && {
        identifier: {
          in: option.identifiers,
        },
      }),
    },
    ...page,
  });
  const pageTotal = await db.category.count({
    where: {
      ...(option.identifiers && {
        identifier: {
          in: option.identifiers,
        },
      }),
    },
  });
  return {
    data: categories,
    total_page: pageTotal,
    page_size: page.take,
    cur_page: option.page?.page || 1,
  };
}

export async function removeCategoryByIdentifiers(
  identifiers: string[]
): Promise<number> {
  const db = getDB();
  const payload = await db.category.deleteMany({
    where: {
      identifier: {
        in: identifiers,
      },
    },
  });
  return payload.count;
}

export async function createOrUpdateBill(req: CreateOrUpdateFlowReq) {
  const db = getDB();
  const uuid = uuidv4();
  const simplifiedUuid = uuid.replace(/-/g, "");
  const spendAt = dayjs(req.spend_at).toDate();
  let bill = null;
  if (req.identifier) {
    bill = await db.bill.findUnique({
      where: {
        identifier: req.identifier,
      },
    });
  }
  if (bill) {
    return await db.bill.update({
      where: {
        identifier: req.identifier,
      },
      data: {
        title: req.title,
        money_fen: req.money_fen,
        budget_idf: req.budget_idf || req.root_budget_idf,
        user_idf: req.user_idf,
        in_or_out: req.in_or_out,
        flow_status: req.flow_status,
        pay_type: req.pay_type,
        pay_detail: req.pay_detail,
        counterparty: req.counterparty,
        order_id: req.order_id,
        product_info: req.product_info,
        source_raw: req.source_raw,
        remark: req.remark,
        spend_at: spendAt,
        created_at: new Date(), // Add this line
      },
    });
  } else {
    return await db.bill.create({
      data: {
        identifier: simplifiedUuid,
        title: req.title,
        money_fen: req.money_fen,
        user_idf: req.user_idf,
        budget_idf: req.budget_idf || req.root_budget_idf,
        in_or_out: req.in_or_out,
        flow_status: req.flow_status,
        pay_type: req.pay_type,
        pay_detail: req.pay_detail,
        counterparty: req.counterparty,
        order_id: req.order_id,
        product_info: req.product_info,
        source_raw: req.source_raw,
        remark: req.remark,
        spend_at: spendAt,
        is_deleted: false, // Add this line
        created_at: new Date(), // Add this line
      },
    });
  }
}

export async function queryBillByOption(opt: QueryBillPayload) {
  const db = getDB();
  const page = sql_page_option(opt.page ?? { page: 1, pageSize: 10 });
  const bills = await db.bill.findMany({
    where: {
      ...(opt.identifiers && {
        identifier: {
          in: opt.identifiers,
        },
      }),
    },
    ...page,
  });
  const pageTotal = await db.bill.count({
    where: {
      ...(opt.identifiers && {
        identifier: {
          in: opt.identifiers,
        },
      }),
    },
  });
  return {
    data: bills,
    total_page: pageTotal,
    page_size: page.take,
    cur_page: opt.page.page || 1,
  };
}

export async function deleteBillByIdentifiers(
  identifiers: string[]
): Promise<number> {
  const db = getDB();
  const payload = await db.bill.updateMany({
    where: {
      identifier: {
        in: identifiers,
      },
    },
    data: {
      is_deleted: true,
    },
  });
  return payload.count;
}
