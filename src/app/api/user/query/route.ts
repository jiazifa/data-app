import { QueryUserOptions, queryUserByOptions } from "@/models/user";

import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  console.log(
    `[api/user/query] ${req.method} ${req.url} ${JSON.stringify(req.body)}`
  );

  // get request body
  const json = await req.json();
  const data: QueryUserOptions = json.payload;
  console.log(`[api/user/query] data: ${JSON.stringify(data)}`);
  const newUsers = await queryUserByOptions(data);
  return NextResponse.json(
    {
      data: newUsers,
      code: 200,
    },
    { status: 200 }
  );
}

export { handler as POST };
