// /assets/js/style-to-add.js
(function ready(run) {
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run, { once: true });
})(function run() {
  // ---------- Contact form (single implementation) ----------
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
          if (status) status.textContent = text; // TEMP: surface error for debug
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
  function generateMarkdown(rootEl) {
    const items = rootEl.querySelectorAll('.checklist__item input[type="checkbox"]');
    let out = "";
    items.forEach((cb) => {
      const label = rootEl.querySelector(`label[for="${cb.id}"]`);
      const text = ((label && (label.textContent || label.innerText)) || "").replace(/\s+/g, " ").trim();
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

  function showStatus(container, msg) {
    const copyStatus = container.querySelector(".checklist__status");
    if (copyStatus) {
      copyStatus.textContent = msg;
      copyStatus.style.visibility = "visible";
      clearTimeout(copyStatus._t);
      copyStatus._t = setTimeout(() => {
        copyStatus.style.visibility = "hidden";
      }, 1500);
    }
  }

  function doCopy(container) {
    const payload = generateMarkdown(container);
    if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(payload)
        .then(() => showStatus(container, "✔ Copied"))
        .catch(() => {
          if (legacyCopy(payload)) showStatus(container, "✔ Copied");
          else {
            downloadText("checklist.md", payload);
            showStatus(container, "✔ Downloaded");
          }
        });
      return;
    }
    if (legacyCopy(payload)) {
      showStatus(container, "✔ Copied");
      return;
    }
    downloadText("checklist.md", payload);
    showStatus(container, "✔ Downloaded");
  }

  // Delegated listeners (works for any number of forms)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const container = btn.closest(".checklist[data-checklist]");
    if (!container) return;

    const action = btn.getAttribute("data-action");
    if (action === "copy") {
      e.preventDefault();
      doCopy(container);
    } else if (action === "clear") {
      setTimeout(() => {
        const status = container.querySelector(".checklist__status");
        if (status) status.style.visibility = "hidden";
      }, 0);
    }
  });

  document.addEventListener("reset", (e) => {
    const container = e.target.closest(".checklist[data-checklist]");
    if (!container) return;
    const status = container.querySelector(".checklist__status");
    if (status) status.style.visibility = "hidden";
  });
});
