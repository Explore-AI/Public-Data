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

/*********************************************
 ********** Worksheet w/ Copy+Clear **********
 **********************************************/
// Helpers
function textify(n) {
  return (n && (n.textContent || "")).replace(/\s+/g, " ").trim();
}
function mdEscape(s) {
  return String(s || "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, "<br>")
    .trim();
}

function getLabelFor(el) {
  const id = el.id && String(el.id);
  const lab = id ? el.ownerDocument.querySelector('label[for="' + id + '"]') : null;
  if (lab) return textify(lab);
  if (el.getAttribute("aria-label")) return el.getAttribute("aria-label");
  const prev = el.previousElementSibling;
  if (prev && prev.tagName === "LABEL") return textify(prev);
  if (el.placeholder) return el.placeholder;
  if (el.name) return el.name;
  return "Field";
}

// Collect non-table fields first
function gatherFieldsMD(ws) {
  const all = Array.from(ws.querySelectorAll("input, textarea, select")).filter((el) => !el.closest("table.worksheet-table"));
  const seenRadio = new Set();
  const lines = [];
  for (const el of all) {
    const tag = el.tagName.toLowerCase();
    const type = tag === "input" ? (el.type || "text").toLowerCase() : tag;
    if (type === "radio") {
      if (seenRadio.has(el.name)) continue;
      seenRadio.add(el.name);
      const checked = ws.querySelector('input[type="radio"][name="' + CSS.escape(el.name) + '"]:checked');
      const value = checked ? checked.value || textify(checked.closest("label")) : "";
      const label = getLabelFor(el) || el.name || "Choice";
      lines.push(`- [x] ${label}: ${value || "—"}`);
      continue;
    }
    if (type === "checkbox") {
      const label = getLabelFor(el);
      lines.push(`- [x] ${label}: ${el.checked ? "Yes" : "No"}`);
      continue;
    }
    const label = getLabelFor(el);
    let value = "";
    if (tag === "select") {
      value = Array.from(el.selectedOptions || [])
        .map((o) => textify(o))
        .join(", ");
    } else {
      value = (el.value || "").trim();
    }
    lines.push(`- [x] ${label}: ${value || "—"}`);
  }
  return lines.join("\n");
}

function tableToMarkdown(table) {
  const ths = Array.from(table.querySelectorAll("thead th")).map((th) => textify(th));
  const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => Array.from(tr.cells).map((td) => mdEscape(textify(td))));
  let out = "| " + ths.join(" | ") + " |\n| " + ths.map(() => "---").join(" | ") + " |\n";
  if (rows.length === 0) {
    out += "| " + ths.map(() => " ").join(" | ") + " |\n";
  } else {
    rows.forEach((r) => {
      out += "| " + r.join(" | ") + " |\n";
    });
  }
  return out;
}

function worksheetToMarkdown(ws) {
  const title = ws.querySelector(".worksheet-header h2") ? textify(ws.querySelector(".worksheet-header h2")) : "Worksheet";
  const subtitle = ws.querySelector(".worksheet-description") ? textify(ws.querySelector(".worksheet-description")) : "";
  let md = `## ${title}\n`;
  if (subtitle) md += `*${subtitle}*\n\n`;
  const fields = gatherFieldsMD(ws);
  if (fields) md += fields + "\n\n";
  const tables = ws.querySelectorAll("table.worksheet-table");
  tables.forEach((tbl, i) => {
    const wrap = tbl.closest("[data-table]");
    const tTitle = wrap && wrap.querySelector(".section-title") ? textify(wrap.querySelector(".section-title")) : `Table ${i + 1}`;
    md += `### ${tTitle}\n`;
    md += tableToMarkdown(tbl) + "\n";
  });
  return md.trim();
}

// Robust copy (handles blocked Clipboard API via fallback)
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

async function copyWorksheet(ws) {
  const status = ws.querySelector(".worksheet-status");
  const md = worksheetToMarkdown(ws);

  let copied = false;
  if (navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(md);
      copied = true;
    } catch (err) {
      copied = false;
      console.warn("Clipboard API failed:", err && err.name);
    }
  }
  if (!copied) {
    copied = legacyCopy(md);
  }

  if (status) {
    status.style.display = "inline-block";
    status.textContent = copied ? "✔ Copied" : "✖ Copy blocked by browser";
    clearTimeout(status._t);
    status._t = setTimeout(() => {
      status.style.display = "none";
    }, 1400);
  }
}

function addRow(tableWrap) {
  const table = tableWrap.querySelector("table.worksheet-table");
  if (!table) return;
  const tbody = table.querySelector("tbody");
  const ths = table.querySelectorAll("thead th");
  const tr = document.createElement("tr");
  ths.forEach((th) => {
    const td = document.createElement("td");
    td.setAttribute("contenteditable", "true");
    td.setAttribute("role", "textbox");
    td.setAttribute("aria-label", textify(th));
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
  const first = tr.querySelector("td");
  if (first) first.focus();
}

function clearWorksheet(ws) {
  if (typeof ws.reset === "function") ws.reset();
  ws.querySelectorAll("table.worksheet-table td[contenteditable]").forEach((td) => (td.textContent = ""));
}

// Delegation (multi‑worksheet)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-action]");
  if (!btn) return;
  const ws = btn.closest("[data-worksheet]");
  const tableWrap = btn.closest("[data-table]");
  const action = btn.getAttribute("data-action");

  if (action === "add-row" && tableWrap) {
    e.preventDefault();
    addRow(tableWrap);
    return;
  }
  if (action === "copy-worksheet" && ws) {
    e.preventDefault();
    copyWorksheet(ws);
    return;
  }
  if (action === "clear-worksheet" && ws) {
    e.preventDefault();
    clearWorksheet(ws);
    return;
  }
});

// === Minimal non-UI tests (run from console) ===
// window.__worksheetTests.copyFirst() -> Promise<boolean>
// window.__worksheetTests.legacyCopy() -> boolean
// window.__worksheetTests.canUseClipboardAPI() -> boolean
window.__worksheetTests = {
  async copyFirst() {
    const ws = document.querySelector("[data-worksheet]");
    if (!ws) return false;
    try {
      await copyWorksheet(ws);
      return true;
    } catch {
      return false;
    }
  },
  legacyCopy() {
    return legacyCopy("test " + Date.now());
  },
  canUseClipboardAPI() {
    return !!(navigator.clipboard && window.isSecureContext && navigator.clipboard.writeText);
  },
};
