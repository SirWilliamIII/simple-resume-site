const fpPromise = import("https://fpjscdn.net/v3/6TuYm9Q8YzpfbDVUTUY3").then(
  (FingerprintJS) => FingerprintJS.load()
);

// Function to get the visitor identifier and send it to the server
async function getAndSendVisitorId() {
  try {
    const fp = await fpPromise;
    const result = await fp.get();
    const visitorId = result.visitorId;

    const response = await fetch("/visitorid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visitorId }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }
    const responseText = await response.text();
    console.log("Raw server response:", responseText);

    // Attempt to parse the response as JSON
    const responseData = JSON.parse(responseText);

    console.log("Server response:", responseData);
  } catch (error) {
    console.error("Error getting or sending visitorId: ", error);
  }
}

// Attach the function to window's load event
window.addEventListener("load", getAndSendVisitorId);
