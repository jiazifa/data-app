import { NextRequest, NextResponse } from "next/server";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  console.log("[Manager Route] params ", params);

  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "ok" }, { status: 200 });
  }

  const headers = new Headers();
  // write default headers
  req.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  const subpath = params.path.join("/");

  const url = `http://127.0.0.1:8001/8bd86ee64/${subpath}/`;

  let reqBody = {};
  if (req.method === "POST") {
    const body = await req.json();
    reqBody = body;
    console.log("reqBody is not null");
  }
  console.log(`[Manager Route] url [${req.method}] ${url}`);
  console.log("[Manager Route] reqBody ", reqBody);
  try {
    const resp = await fetch(url, {
      method: req.method,
      headers,
      body: JSON.stringify(reqBody),
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (e) {
    console.log("[Manager Route] error in Request ", e);
    return NextResponse.json(
      { code: 99999, msg: e, data: null },
      { status: 200 }
    );
  }
}
export const GET = handle;
export const POST = handle;

export const runtime = "edge";
