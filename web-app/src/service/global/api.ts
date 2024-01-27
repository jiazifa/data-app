export const GETFetcher = async <Data>(url: string) => {
  const response = await fetch(url, {
    method: "GET",
    headers: getDefaultHeaders(),
  });
  const data = response.json();
  return data as Data;
};

export const POSTFetcher = async <Data>(url: string, body?: any) => {
  const response = await fetch(url, {
    method: "POST",
    headers: getDefaultHeaders(),
    body: JSON.stringify(body),
  });
  const data = response.json();
  return data as Data;
};

export function getDefaultHeaders() {
  const headers = new Headers();
  // set content-type
  headers.set("Content-Type", "application/json");
  // get Timestamp
  const timestamp = new Date().getTime();
  headers.set("TS", timestamp.toString());
  // get LANG
  const lang = navigator.language;
  headers.set("LANG", lang);
  // get OS
  const os = "web";
  headers.set("OS", os);

  // get VN
  const vn = "1.0.0";
  headers.set("VN", vn);

  // get md5
  const encodeRaw = `${os}${timestamp}${lang}${vn}`;

  const crypto = require("crypto");
  var cryptoServer = crypto;

  const hash = cryptoServer.createHash("md5");
  hash.update(encodeRaw);
  const encodeMd5 = hash.digest("hex");
  headers.set("VC", encodeMd5);

  return headers;
}
