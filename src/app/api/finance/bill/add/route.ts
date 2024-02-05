import { createOrUpdateBill } from "@/models/finance";
import { CreateOrUpdateFlowReq } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(
    `[/api/finance/bill/add] ${req.method} ${req.url} ${JSON.stringify(
      req.body
    )}`
  );
  const dbReq = (await req.json()).payload as CreateOrUpdateFlowReq;
  const entity = await createOrUpdateBill(dbReq);
  return NextResponse.json(
    {
      data: entity,
      code: 200,
    },
    { status: 200 }
  );
};

export { handler as POST };
