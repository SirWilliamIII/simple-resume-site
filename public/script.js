// Initialize the agent at application startup.
const fpPromise =
    import ("https://openfpcdn.io/fingerprintjs/v4").then(
        (FingerprintJS) => FingerprintJS.load()
    );

// Get the visitor identifier when you need it.
fpPromise
    .then((fp) => fp.get())
    .then((result) => {
        // This is the visitor identifier:
        const visitorId = result.visitorId;
        console.log(visitorId);
    })
    .catch((error) => console.error(error));

document.querySelector(".hamburger").addEventListener("click", function() {
    this.classList.toggle("active");
    document.querySelector(".nav-links").classList.toggle("active");
});