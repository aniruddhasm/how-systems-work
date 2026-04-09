const cache = {};

function fetchFromDB(id) {
  return new Promise((resolve) => {
    console.log("Fetching from DB...");
    setTimeout(() => {
      resolve({ id, data: "User Data " + id });
    }, 2000);
  });
}

async function getData(id) {
  if (cache[id]) {
    console.log("Cache HIT ⚡");
    return cache[id];
  }

  console.log("Cache MISS ❌");
  const data = await fetchFromDB(id);

  cache[id] = data;

  return data;
}

async function run() {
  console.time("First Call");
  await getData(1);
  console.timeEnd("First Call");

  console.time("Second Call");
  await getData(1);
  console.timeEnd("Second Call");
}

run();