const fs = require("fs");

console.log("start");
process.nextTick(() => console.log("nextTick before I/O and after end"));

fs.readFile(__filename, (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("I/O: fs.readFile callback — runs in Poll phase");  
    process.nextTick(() => console.log("nextTick after fs.readFile"))
});
setTimeout(() => {
    console.log("timer"); 
    process.nextTick(() => console.log("nextTick after timer"))
},0);
setImmediate(() => {
    console.log("setImmediate");
    process.nextTick(() => console.log("nextTick after setImmediate"))
});

console.log("end");