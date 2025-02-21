'use server'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
export async function getData(fetchUrl : string) {
  try{
    const fetchData = await fetch(fetchUrl, {
      mode: "no-cors",
      integrity : "",
      headers: {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive"
      }
    });
    return await fetchData.json();
  }
  catch (e) {
    console.log(e);
    return [];
  }
}