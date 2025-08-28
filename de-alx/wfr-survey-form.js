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
 ****** Downloadable Worksheet - GLOBAL ******
 **********************************************/

// MOVED OUTSIDE THE IIFE SO THEY'RE GLOBALLY ACCESSIBLE

// Add new row to a table - IMPROVED VERSION
function addRow(tableId) {
  const table = document.querySelector(`[data-table-id="${tableId}"] tbody`);
  if (!table) return;

  // Find the first row that contains input elements (not headers)
  const rows = table.querySelectorAll("tr");
  let templateRow = null;

  for (let row of rows) {
    if (row.querySelector("input, textarea, select")) {
      templateRow = row;
      break;
    }
  }

  if (!templateRow) {
    console.error("No template row with input elements found");
    return;
  }

  const newRow = templateRow.cloneNode(true);

  // Clear all inputs in the new row
  newRow.querySelectorAll("input, textarea, select").forEach((field) => {
    if (field.tagName === "SELECT") {
      field.selectedIndex = 0;
    } else {
      field.value = "";
    }
    // Remove any IDs to avoid duplicates
    if (field.id) {
      field.removeAttribute("id");
    }
  });

  table.appendChild(newRow);
}

// Remove a row from table - IMPROVED VERSION
function removeRow(button) {
  const row = button.closest("tr");
  const tbody = row.closest("tbody");

  // Count only rows with input elements (not header rows)
  const inputRows = Array.from(tbody.querySelectorAll("tr")).filter((tr) => tr.querySelector("input, textarea, select"));

  // Keep at least one input row
  if (inputRows.length > 1) {
    row.remove();
  } else {
    // Clear the last row instead of removing it
    row.querySelectorAll("input, textarea, select").forEach((field) => {
      if (field.tagName === "SELECT") {
        field.selectedIndex = 0;
      } else {
        field.value = "";
      }
    });
  }
}

// Clear a specific table - FIXED VERSION
let clearClickTimeout = {};
function clearTable(tableId) {
  // Double-click protection
  if (clearClickTimeout[tableId]) {
    // Second click - actually clear
    clearTimeout(clearClickTimeout[tableId]);
    delete clearClickTimeout[tableId];

    const table = document.querySelector(`[data-table-id="${tableId}"]`);
    if (!table) return;

    const tbody = table.querySelector("tbody");
    if (!tbody) return;

    // Find the first row that contains input elements (not headers)
    const rows = tbody.querySelectorAll("tr");
    let templateRow = null;

    for (let row of rows) {
      if (row.querySelector("input, textarea, select")) {
        templateRow = row;
        break;
      }
    }

    if (!templateRow) {
      // If no template row found, just clear all existing inputs
      tbody.querySelectorAll("input, textarea, select").forEach((field) => {
        if (field.tagName === "SELECT") {
          field.selectedIndex = 0;
        } else {
          field.value = "";
        }
      });
      showWorksheetStatus("✓ Table cleared!");
      return;
    }

    // Clone the template row to get structure
    const emptyRow = templateRow.cloneNode(true);

    // Clear all values in the cloned row
    emptyRow.querySelectorAll("input, textarea, select").forEach((field) => {
      if (field.tagName === "SELECT") {
        field.selectedIndex = 0;
      } else {
        field.value = "";
      }
      // Remove any IDs to avoid duplicates
      if (field.id) {
        field.removeAttribute("id");
      }
    });

    // Remove all rows with input elements and add one empty row
    const headerRows = [];
    const inputRows = [];

    rows.forEach((row) => {
      if (row.querySelector("input, textarea, select")) {
        inputRows.push(row);
      } else {
        headerRows.push(row);
      }
    });

    // Remove only input rows
    inputRows.forEach((row) => row.remove());

    // Add one empty row
    tbody.appendChild(emptyRow);

    showWorksheetStatus("✓ Table cleared!");
  } else {
    // First click - show warning
    showWorksheetStatus("⚠️ Click Clear again to confirm");
    clearClickTimeout[tableId] = setTimeout(() => {
      delete clearClickTimeout[tableId];
      showWorksheetStatus("");
    }, 2000);
  }
}

// Copy worksheet content to clipboard
function copyWorksheet(button) {
  const worksheet = button.closest(".worksheet-container");
  const title = worksheet.querySelector(".worksheet-header h2").textContent;
  let output = title.toUpperCase() + "\n";
  output += "=".repeat(50) + "\n\n";

  // Process each table section
  worksheet.querySelectorAll(".table-section").forEach((section) => {
    const sectionTitle = section.querySelector(".section-title").textContent;
    output += sectionTitle + "\n";
    output += "-".repeat(40) + "\n\n";

    const table = section.querySelector(".worksheet-table");
    const headers = Array.from(table.querySelectorAll("thead th"))
      .filter((th) => !th.textContent.trim().match(/^$/))
      .map((th) => th.textContent.trim());

    const rows = table.querySelectorAll("tbody tr");
    let entryCount = 1;

    rows.forEach((row) => {
      // Skip rows that don't have input elements (header rows in tbody)
      if (!row.querySelector("input, textarea, select")) return;

      const cells = row.querySelectorAll("td");
      let hasContent = false;
      let rowOutput = `Entry ${entryCount}:\n`;

      cells.forEach((cell, cellIndex) => {
        if (cellIndex < headers.length) {
          const input = cell.querySelector("input, textarea, select");
          if (input) {
            const value = input.value.trim();
            if (value) hasContent = true;
            rowOutput += `  ${headers[cellIndex]}: ${value || "[Not filled]"}\n`;
          }
        }
      });

      if (hasContent) {
        output += rowOutput + "\n";
        entryCount++;
      }
    });
    output += "\n";
  });

  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(output).then(() => showWorksheetStatus("✓ Copied to clipboard!"));
  } else {
    fallbackCopy(output);
  }
}

// Fallback copy method
function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showWorksheetStatus("✓ Copied to clipboard!");
  } catch (err) {
    showWorksheetStatus("⚠ Copy failed. Please try again.");
  }
  document.body.removeChild(textarea);
}

// Show status message
function showWorksheetStatus(message) {
  const status = document.getElementById("worksheetStatus");
  if (!status) return;

  status.textContent = message;
  status.style.display = "block";

  // Change color based on message type
  if (message.includes("⚠️")) {
    status.style.background = "#f6ad55";
  } else {
    status.style.background = "#48bb78";
  }

  if (message) {
    setTimeout(() => {
      status.style.display = "none";
    }, 2000);
  } else {
    status.style.display = "none";
  }
}

// Auto-save to localStorage (optional feature)
function enableAutoSave() {
  document.querySelectorAll(".worksheet-container").forEach((worksheet) => {
    const id = worksheet.dataset.worksheet;

    // Load saved data
    const saved = localStorage.getItem(`worksheet_${id}`);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        Object.keys(data).forEach((fieldId) => {
          const field = worksheet.querySelector(`[data-field-id="${fieldId}"]`);
          if (field) field.value = data[fieldId];
        });
      } catch (e) {
        console.error("Error loading saved worksheet data:", e);
      }
    }

    // Save on input
    worksheet.addEventListener("input", (e) => {
      if (e.target.matches("input, textarea, select")) {
        const data = {};
        worksheet.querySelectorAll("input, textarea, select").forEach((field, index) => {
          field.dataset.fieldId = field.dataset.fieldId || `field_${index}`;
          data[field.dataset.fieldId] = field.value;
        });
        localStorage.setItem(`worksheet_${id}`, JSON.stringify(data));
      }
    });
  });
}

// Optional: Enable auto-save
// enableAutoSave();
