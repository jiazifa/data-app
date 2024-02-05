import { removeUserByIdentifier } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

type RemoveUserReq = {
  identifiers: string[];
};

const handler = async (req: NextRequest) => {
  console.log(
    `[api/user/delete] ${req.method} ${req.url} ${JSON.stringify(req.body)}`
  );

  // get request body
  const data: RemoveUserReq = (await req.json()).payload;
  console.log(`[api/user/delete] query_option: ${JSON.stringify(data)}`);
  const count = await removeUserByIdentifier(data.identifiers);
  // cast to User list type, make sure newUser is not null

  return NextResponse.json(
    {
      data: count,
      code: 200,
    },
    { status: 200 }
  );
};

export { handler as POST };
