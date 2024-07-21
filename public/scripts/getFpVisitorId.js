

// Function to get the visitor identifier and send it to the server
async function getAndSendVisitorId() {
  try {
    const keyRes = await fetch('/clientApiKey');
    if (!keyRes.ok) throw new Error('Failed to fetch API key');
    const { apiKey } = await keyRes.json();


    const FingerprintJS = await import(`https://fpjscdn.net/v3/${apiKey}`);
    const fp = await FingerprintJS.load();
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

  } catch (error) {
    console.error("Error getting or sending visitorId: ", error);
  }
}

// Attach the function to window's load event
window.addEventListener("DOMContentLoaded", getAndSendVisitorId);
