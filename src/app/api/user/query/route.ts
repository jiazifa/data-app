import { QueryUserOptions, query_user_by_options } from "@/models/user";
import { User } from "@/types";

import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(
    `[api/user/query] ${req.method} ${req.url} ${JSON.stringify(req.body)}`
  );

  // get request body
  const data: QueryUserOptions = await req.json();
  console.log(`[api/user/query] query_option: ${JSON.stringify(data)}`);
  const newUsers = await query_user_by_options(data);
  // cast to User list type, make sure newUser is not null
  const users: User[] = newUsers as User[];
  return NextResponse.json(
    {
      data: users,
    },
    { status: 200 }
  );
};

export { handler as POST };
