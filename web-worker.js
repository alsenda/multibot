self.onmessage = (e) => {
  const jobs = e.data;

  for (const job of jobs) {
    let count = 0;
    for (let i = 0; i < job; i++) {
      count++;
    }
  }

  self.postMessage("done");
};