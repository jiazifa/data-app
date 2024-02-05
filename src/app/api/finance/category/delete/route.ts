import { removeCategoryByIdentifiers } from "@/models/finance";
import { NextRequest, NextResponse } from "next/server";

type RemoveCategoryReq = {
  identifiers: string[];
};

const handler = async (req: NextRequest) => {
  console.log(
    `[api/finance/category/delete] ${req.method} ${req.url} ${JSON.stringify(
      req.body
    )}`
  );

  // get request body
  const data: RemoveCategoryReq = (await req.json())
    .payload as RemoveCategoryReq;
  console.log(
    `[api/finance/category/delete] query_option: ${JSON.stringify(data)}`
  );
  const count = await removeCategoryByIdentifiers(data.identifiers);
  // cast to User list type, make sure newUser is not null

  return NextResponse.json(
    {
      data: count,
    },
    { status: 200 }
  );
};

export { handler as POST };
