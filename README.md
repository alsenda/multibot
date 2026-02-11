# multibot

A small demo that runs the same CPU-bound “jobs” workload using:

- **Node.js worker threads** (`worker_threads`)
- **Browser Web Workers**

The workload is intentionally heavy (a tight loop) so you can see the difference between running on the main thread vs spreading work across multiple workers.

## Files

- `index.js` — Node entry point. Spawns `worker_threads` workers that run `worker.js`.
- `worker.js` — Node worker code (receives a chunk of jobs, runs them, replies `"done"`).
- `index.html` — Browser demo page.
- `main.js` — Browser entry point. Spawns Web Workers that run `web-worker.js`.
- `web-worker.js` — Browser worker code (receives a chunk of jobs, runs them, replies `"done"`).

## Run (Node.js)

Prereq: **Node 18+** (for the global `performance` API).

```bash
node index.js
```

You should see logs like:

- `Worker 0 finished with result: done`
- `All workers completed. Time taken: ... ms`

To change the number of workers, edit the last line in `index.js`:

```js
run(jobs, 12);
```

## Run (Browser Web Workers)

Because this uses ES modules (`type="module"`) and module workers, you should run it from a local web server (opening the HTML file directly from disk may be blocked by the browser).

From the project folder, start a simple static server, for example:

```bash
npx serve .
```

Then open the printed URL in your browser and click **“Run web workers”**.

The browser version uses `navigator.hardwareConcurrency` (or falls back to 4) to pick the worker count.

## Notes

- This is a CPU-bound demo; high values (like `25 * 1e7`) will peg your CPU while it runs.
- The Node and browser workers both return `"done"` after finishing their assigned chunk.
