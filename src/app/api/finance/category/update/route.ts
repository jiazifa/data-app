import { addOrUpdateCategory } from "@/models/finance";
import { CreateOrUpdateBudgetReq } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(
    `[/api/finance/category/update] ${req.method} ${req.url} ${JSON.stringify(
      req.body
    )}`
  );
  const dbReq = (await req.json()).payload as CreateOrUpdateBudgetReq;
  const budget = await addOrUpdateCategory(dbReq);
  return NextResponse.json(
    {
      data: budget,
      code: 200,
    },
    { status: 200 }
  );
};
export { handler as POST };
