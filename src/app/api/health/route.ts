import { NextRequest, NextResponse } from "next/server";

const handler = async (req: NextRequest) => {
  console.log(
    `[/api/health] ${req.method} ${req.url} ${JSON.stringify(req.body)}`
  );

  // get request body
  return NextResponse.json(
    {
      data: "ok",
      code: 200,
    },
    { status: 200 }
  );
};

export { handler as POST, handler as GET };
