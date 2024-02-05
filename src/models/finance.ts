import {
  CreateOrUpdateBudgetReq as CreateOrUpdateCategoryReq,
  CreateOrUpdateFlowReq,
  PageResponse,
  QueryBudgetPayload,
  QueryFlowPayload as QueryBillPayload,
  sql_page_option,
} from "@/types";
import { getDB } from "./db";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import { Bill, Category } from "@prisma/client";

export async function addOrUpdateCategory(
  req: CreateOrUpdateCategoryReq
): Promise<Category> {
  const db = getDB();
  const uuid = uuidv4();
  const simplifiedUuid = uuid.replace(/-/g, "");

  // find category by identifier
  let category: Category | null = null;
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
        parentIdf: req.parentIdf,
        remark: req.remark,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } else {
    // create category
    return await db.category.create({
      data: {
        identifier: simplifiedUuid,
        title: req.title,
        parentIdf: req.parentIdf,
        remark: req.remark,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  }
}

export async function queryCategoryByOption(
  option: QueryBudgetPayload
): Promise<PageResponse<Category>> {
  const db = getDB();
  const page = sql_page_option(option.page ?? { page: 1, pageSize: 10 });
  const categories = await db.category.findMany({
    where: {
      identifier: {
        in: option.identifiers,
      },
    },
    ...page,
  });
  const pageTotal = await db.category.count({
    where: {
      identifier: {
        in: option.identifiers,
      },
    },
  });
  return {
    data: categories,
    total_page: pageTotal,
    page_size: page.take,
    cur_page: option.page?.page ?? 1,
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

export async function createOrUpdateBill(
  req: CreateOrUpdateFlowReq
): Promise<Bill> {
  const db = getDB();
  const uuid = uuidv4();
  const simplifiedUuid = uuid.replace(/-/g, "");
  const spendAt = dayjs(req.spend_at).toDate();
  return await db.bill.create({
    data: {
      identifier: simplifiedUuid,
      title: req.title,
      moneyFen: req.money_fen,
      budgetIdf: req.root_budget_idf,
      inOrOut: req.in_or_out,
      flowStatus: req.flow_status,
      payType: req.pay_type,
      payDetail: req.pay_detail,
      counterparty: req.counterparty,
      orderId: req.order_id,
      productInfo: req.product_info,
      sourceRaw: req.source_raw,
      remark: req.remark,
      spendAt,
      isDeleted: false, // Add this line
      createdAt: new Date(), // Add this line
    },
  });
}

export async function queryBillByOption(
  opt: QueryBillPayload
): Promise<PageResponse<Bill>> {
  const db = getDB();
  const page = sql_page_option(opt.page ?? { page: 1, pageSize: 10 });
  const bills = await db.bill.findMany({
    where: {
      identifier: {
        in: opt.identifiers,
      },
    },
    ...page,
  });
  const pageTotal = await db.bill.count({
    where: {
      identifier: {
        in: opt.identifiers,
      },
    },
  });
  return {
    data: bills,
    total_page: pageTotal,
    page_size: page.take,
    cur_page: opt.page.page ?? 1,
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
      isDeleted: true,
    },
  });
  return payload.count;
}
