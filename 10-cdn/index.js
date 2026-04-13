function fetchFromOrigin() {
    return new Promise((resolve) => {
      console.log("Fetching from main server (far)...");
      setTimeout(() => resolve("Data from origin"), 2000);
    });
}

let cdnCache = null;

async function fetchFromCDN() {
  if (cdnCache) {
    console.log("Serving from CDN (near) ⚡");
    return cdnCache;
  }

  console.log("CDN MISS ❌");
  const data = await fetchFromOrigin();
  cdnCache = data;
  return data;
}

async function run() {
  console.time("First Request");
  await fetchFromCDN(); // MISS → slow
  console.timeEnd("First Request");

  console.time("Second Request");
  await fetchFromCDN(); // HIT → fast
  console.timeEnd("Second Request");
}

run();