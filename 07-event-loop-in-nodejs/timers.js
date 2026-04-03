console.log("start");

setTimeout(() => {
    console.log("Timer executed");
}, 0);
setImmediate(() => {
    console.log("Immediate executed");
});

console.log("end");
console.log("Initial phase of the event loop is completed");