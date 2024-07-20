const fpPromise = import("https://fpjscdn.net/v3/6TuYm9Q8YzpfbDVUTUY3").then(
  (FingerprintJS) => FingerprintJS.load()
);

// Get the visitor identifier when you need it.
fpPromise
  .then((fp) => fp.get())
  .then((result) => console.log(result.visitorId));
async function getAndSendVisitorId() {
  // Assuming region and apiKey are defined earlier in your script
  const client = new FingerprintJsServerApiClient({ region, apiKey });

  // Assuming visitorId is obtained earlier in your script
  const visitorHistory = await client.getVisitorHistory(visitorId, {
    limit: 1,
  });

  console.log(visitorHistory);
  // Send the visitorId to your server
  fetch("/visitorid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ visitorId: visitorHistory }),
  });
}

// Attach the function to window's load event
window.addEventListener("load", getAndSendVisitorId);
