const logEl = document.getElementById("log");
const btn = document.getElementById("run");

function log(line) {
  logEl.textContent += line + "\n";
}

function chunkify(array, n) {
  const chunks = Array.from({ length: n }, () => []);
  for (let i = 0; i < array.length; i++) {
    chunks[i % n].push(array[i]);
  }
  return chunks;
}

function run(jobs, concurrentWorkers) {
  logEl.textContent = "";
  const tick = performance.now();

  let completedWorkers = 0;

  const chunks = chunkify(jobs, concurrentWorkers);

  chunks.forEach((data, i) => {
    const worker = new Worker("./web-worker.js", { type: "module" });

    worker.postMessage(data);

    worker.onmessage = (e) => {
      log(`Worker ${i} finished with result: ${e.data}`);
      worker.terminate();

      completedWorkers++;
      if (completedWorkers === concurrentWorkers) {
        const tock = performance.now();
        log(`All workers completed. Time taken: ${(tock - tick).toFixed(2)} ms`);
      }
    };
  });
}

btn.addEventListener("click", () => {
  const jobs = Array.from({ length: 100 }, () => 25 * 1e7);
  run(jobs, navigator.hardwareConcurrency || 4);
});
