import { deleteBillByIdentifiers } from "@/models/finance";
import { NextRequest, NextResponse } from "next/server";

type RemoveReq = {
  identifiers: string[];
};

const handler = async (req: NextRequest) => {
  console.log(
    `[api/finance/bill/delete] ${req.method} ${req.url} ${JSON.stringify(
      req.body
    )}`
  );

  // get request body
  const data: RemoveReq = (await req.json()).payload as RemoveReq;
  console.log(
    `[api/finance/bill/delete] query_option: ${JSON.stringify(data)}`
  );
  const count = await deleteBillByIdentifiers(data.identifiers);

  return NextResponse.json(
    {
      data: count,
      code: 200,
    },
    { status: 200 }
  );
};

export { handler as POST };
