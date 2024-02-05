import { UpdateUserReq, updateUserByIdentifier } from "@/models/user";
import { User } from "@/types";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(`[api] ${req.method} ${req.url} ${JSON.stringify(req.body)}`);

  // get request body
  const data: UpdateUserReq = (await req.json()).payload;
  console.log(`[api] data: ${JSON.stringify(data)}`);
  const newUser = await updateUserByIdentifier(data);
  // cast to User type, make sure newUser is not null
  const user: User = newUser as User;
  return NextResponse.json(
    {
      data: user,
      code: 200,
    },
    { status: 200 }
  );
};

export { handler as POST };
