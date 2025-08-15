// /assets/js/form.js
document.addEventListener("DOMContentLoaded", () => {
  // ---------- Contact form ----------
  const endpoint = "https://wfr-surveys.labutto.workers.dev/";
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("status");
  const setStatus = (msg) => { if (statusEl) statusEl.textContent = msg; };

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      setStatus("Sending…");

      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries()); // includes cf-turnstile-response

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text(); // read body for debugging / messages
        if (!res.ok) {
          console.error("Server said:", text);
          setStatus(text); // TEMP: surface error to user during debug
          return
        }

        setStatus("Thanks! We received your message.");
        form.reset();
        if (window.turnstile) turnstile.reset();
      } catch (err) {
        console.error(err);
        setStatus("Something went wrong. Please try again.");
      }
    });
  } else {
    // Not an error: this JS may be shared across pages.
    // console.warn("contact-form not found on this page");
  }

  // ---------- Checklist (copy / clear buttons) ----------
  (function ready(run) {
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run, { once: true });
})(function run() {
  // ---------- Contact form (optional; never blocks the rest) ----------
  const endpoint = "https://wfr-surveys.labutto.workers.dev/";
  const form = document.getElementById("contact-form");
  const status = document.getElementById("status");

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (status) status.textContent = "Sending…";

      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries()); // includes cf-turnstile-response

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        if (!res.ok) {
          console.error("Server said:", text);
          if (status) status.textContent = text; // TEMP: surface real error while debugging
          return;
        }
        if (status) status.textContent = "Thanks! We received your message.";
        form.reset();
        if (window.turnstile) turnstile.reset();
      } catch (err) {
        console.error(err);
        if (status) status.textContent = "Something went wrong. Please try again.";
      }
    });
  }

  // ---------- Train checklist ----------
  const container = document.getElementById("train-checklist");
  if (!container) return; // checklist not on this page; exit quietly

  const copyBtn = document.getElementById("copy-checklist");
  const clearBtn = document.getElementById("clear-checklist");
  const copyStatus = document.getElementById("copy-status");

  function generateMarkdown(rootEl = container) {
    const items = rootEl.querySelectorAll('input[type="checkbox"]');
    let out = "";
    items.forEach((cb) => {
      const label = rootEl.querySelector(`label[for="${cb.id}"]`);
      const text = (label?.innerText || "").replace(/\s+/g, " ").trim();
      const mark = cb.checked ? "x" : " ";
      out += `- [${mark}] ${text}\n`;
    });
    return out;
  }

  function legacyCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }

  function downloadText(filename, text) {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.remove();
    }, 0);
  }

  async function handleCopy(e) {
    e?.preventDefault?.();
    const payload = generateMarkdown();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(payload);
        if (copyStatus) {
          copyStatus.textContent = "✔ Copied";
          copyStatus.style.visibility = "visible";
        }
        return;
      }
      throw new Error("Clipboard API unavailable");
    } catch {
      if (legacyCopy(payload)) {
        if (copyStatus) {
          copyStatus.textContent = "✔ Copied";
          copyStatus.style.visibility = "visible";
        }
        return;
      }
      downloadText("checklist.md", payload);
      if (copyStatus) {
        copyStatus.textContent = "✔ Downloaded";
        copyStatus.style.visibility = "visible";
      }
    }
  }

  function handleClear(e) {
    e?.preventDefault?.();
    container.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.checked = false;
    });
  }

  if (copyBtn) copyBtn.addEventListener("click", handleCopy);
  if (clearBtn) clearBtn.addEventListener("click", handleClear);
});
