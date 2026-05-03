const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
  
  async function test() {
    console.log("Test started...");  
    const start = Date.now();
  
    const requests = [];
    let completedRequests = 0;
  
    for (let i = 0; i < 10; i++) {
      requests.push(
        fetch("http://localhost:3000")
          .then(res => res.json())
          .then(data => {
            completedRequests++;
            console.log("Completed:", completedRequests);
            return data;
          })
          .catch(err => {   
            completedRequests++;
            console.log("Catch Completed:", completedRequests);
            console.error("Fetch error:", err);
          })
      );
    }
  
    const results = await Promise.all(requests);
  
    const end = Date.now();
  
    console.log("Total Time:", end - start, "ms");
    console.log("Results:", results.length);
  }
  
  test();