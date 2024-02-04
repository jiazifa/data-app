import { queryBillByOption } from "@/models/finance";
import { QueryFlowPayload } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(
    `[/api/finance/category/query] ${req.method} ${req.url} ${JSON.stringify(
      req.body
    )}`
  );
  const dbReq = (await req.json()) as QueryFlowPayload;
  const budgetInfo = await queryBillByOption(dbReq);
  return NextResponse.json(
    {
      data: budgetInfo,
      code: 200,
    },
    { status: 200 }
  );
};

export { handler as POST };
