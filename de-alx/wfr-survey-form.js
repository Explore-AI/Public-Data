// /assets/js/form.js
document.addEventListener("DOMContentLoaded", () => {
  const endpoint = "https://wfr-surveys.labutto.workers.dev/";
  const form = document.getElementById("contact-form");
  const status = document.getElementById("status");
  if (!form) {
    console.error("Form not found");
    return;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Sending…";
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries()); // includes cf-turnstile-response
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text(); // read the body
      if (!res.ok) {
        console.error("Server said:", text); // show real error during debug
        status.textContent = text;           // TEMP: surface it to the user
        return;
      }
      status.textContent = "Thanks! We received your message.";
      form.reset();
      if (window.turnstile) turnstile.reset();
    } catch (err) {
      console.error(err);
      status.textContent = "Something went wrong. Please try again.";
    }
  });
});
