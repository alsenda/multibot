const jobs = Array.from({ length: 100 }, () => 25*1e7);
const { Worker } = require("worker_threads");

function chunkify(array, n) {
  let chunks = [];

  for (let i = n; i > 0; i--) {
    chunks.push(array.splice(0, Math.ceil(array.length / i)));
  }

  return chunks;
}

function run(jobs, concurrentWorkers) {
  const tick = performance.now();

  let completedWorkers = 0;

  const chunks = chunkify(jobs, concurrentWorkers);

  chunks.forEach((data, i) => {
    const worker = new Worker("./worker.js");
    worker.postMessage(data);

    worker.on("message", (result) => {
      console.log(`Worker ${i} finished with result: ${result}`);
      completedWorkers++;
      if (completedWorkers === concurrentWorkers) {
        const tock = performance.now();
        console.log(`All workers completed. Time taken: ${(tock - tick).toFixed(2)} ms`);
        process.exit(0);
      }
    });
  });
}

run(jobs, 12);