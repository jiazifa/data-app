import { CreateUserReq, addUser } from "@/models/user";
import { User } from "@/types/models";
import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(`[api] ${req.method} ${req.url} ${JSON.stringify(req.body)}`);

  // get request body
  const data: CreateUserReq = await req.json();
  console.log(`[api] data: ${JSON.stringify(data)}`);
  const newUser = await addUser(data);
  // cast to User type, make sure newUser is not null
  const user: User = newUser as User;
  return NextResponse.json(
    {
      user,
    },
    { status: 200 }
  );
};

export { handler as POST, handler as GET };
