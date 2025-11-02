// /assets/js/style-to-add.js - Consolidated contact form implementation

// Run now if DOM is ready, else wait.
// This avoids the "DOMContentLoaded listener added too late" problem.
(function ready(run) {
  if (document.readyState !== "loading") run();
  else document.addEventListener("DOMContentLoaded", run, { once: true });
})(function run() {
  // --- Ensure critical globals exist for inline handlers even if sections are not present ---
  if (typeof window !== "undefined") {
    if (!window.showLinkPreviewPopup) {
      window.showLinkPreviewPopup = function (linkElement, event) {
        const popupElement = document.getElementById("link-preview-popup-main");
        if (!popupElement || !linkElement) return;
        const titleElement = popupElement.querySelector(".link-preview-popup-title");
        const descElement = popupElement.querySelector(".link-preview-popup-description");
        const title = linkElement.getAttribute("data-link-preview-title");
        const desc = linkElement.getAttribute("data-link-preview-desc");
        if (!title || !desc) return;
        if (titleElement) titleElement.textContent = title;
        if (descElement) descElement.textContent = desc;
        window.updateLinkPreviewPopupPosition(event);
        popupElement.classList.add("link-preview-popup-visible");
      };
    }
    if (!window.hideLinkPreviewPopup) {
      window.hideLinkPreviewPopup = function () {
        const popupElement = document.getElementById("link-preview-popup-main");
        if (popupElement) popupElement.classList.remove("link-preview-popup-visible");
      };
    }
    if (!window.updateLinkPreviewPopupPosition) {
      window.updateLinkPreviewPopupPosition = function (event) {
        const popupElement = document.getElementById("link-preview-popup-main");
        if (!popupElement || !event) return;
        const x = event.clientX;
        const y = event.clientY;
        const popupRect = popupElement.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let left = x + 15;
        let top = y + 15;
        if (left + popupRect.width > windowWidth - 20) left = x - popupRect.width - 15;
        if (top + popupRect.height > windowHeight - 20) top = y - popupRect.height - 15;
        popupElement.style.left = left + "px";
        popupElement.style.top = top + "px";
      };
    }
    if (!window.openLessonInfoPopup) {
      window.openLessonInfoPopup = function (popupId) {
        const el = document.getElementById(popupId);
        if (!el) return;
        el.classList.add("lesson-info-popup-overlay-active");
        document.body.style.overflow = "hidden";
      };
    }
    if (!window.closeLessonInfoPopup) {
      window.closeLessonInfoPopup = function (popupId) {
        const el = document.getElementById(popupId);
        if (!el) return;
        el.classList.remove("lesson-info-popup-overlay-active");
        document.body.style.overflow = "";
      };
    }
    if (!window.closeLessonInfoPopupOnOverlay) {
      window.closeLessonInfoPopupOnOverlay = function (event, popupId) {
        if (event && event.target && event.target.id === popupId) {
          window.closeLessonInfoPopup(popupId);
        }
      };
    }
  }
  // ---------- Contact form (consolidated implementation) ----------
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
  // If checklist container does not exist, skip checklist init but continue running the rest of the script

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

/////////////////////////////////////////////////////
//////////// Prompt Generator/Builder ///////////////
/////////////////////////////////////////////////////
// ================================================================
// WORKSHEET 1 STORAGE MECHANISM - CLEAN DATA CAPTURE ONLY
// ================================================================
// This is the ONLY worksheet handling system in the codebase.
// It captures data from worksheets with data-atlas-input attributes.
// Data persistence is handled by the Atlas system.
// Uses the same mechanism as worksheet 1 - clean key:value pairs only.
(function () {
  function updateSliderOutput(e) {
    const t = e.target;
    if (t && t.type === "range") {
      const o = t.nextElementSibling;
      if (o && o.tagName === "OUTPUT") {
        o.value = t.value;
      }
    }
  }

  function init() {
    const forms = document.querySelectorAll("form.worksheet-container[data-worksheet]");
    forms.forEach((f) => {
      // Enable dynamic table row addition with unique data keys (one row per click)
      f.querySelectorAll('[data-action="add-row"]').forEach((btn) => {
        if (btn._atlasAddRowBound) return; // prevent multiple bindings
        btn._atlasAddRowBound = true;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Simple click-throttle to avoid duplicate inserts from double-fire
          const now = Date.now();
          if (btn._lastAddTs && now - btn._lastAddTs < 300) return;
          btn._lastAddTs = now;
          const section = btn.closest("[data-table]");
          if (!section) return;
          const table = section.querySelector("table.worksheet-table");
          if (!table) return;
          const tbody = table.querySelector("tbody");
          if (!tbody) return;

          // Use the first row as a template
          const templateRow = tbody.querySelector("tr");
          if (!templateRow) return;

          // Ensure first row has -row1 suffix on its data-atlas-input keys
          const firstRow = templateRow;
          let normalizedFirstRow = false;
          firstRow.querySelectorAll("[data-atlas-input]").forEach((el) => {
            const baseKey = el.getAttribute("data-atlas-input") || "";
            if (!/-row\d+$/i.test(baseKey)) {
              el.setAttribute("data-atlas-input", `${baseKey}-row1`);
              normalizedFirstRow = true;
            }
          });

          // Attach prompt update listeners to first row if it was normalized
          if (normalizedFirstRow && typeof updateAutogen === "function") {
            const containerEl = btn.closest('[data-atlas-capture="true"]');
            if (containerEl) {
              firstRow.querySelectorAll("input, textarea, select").forEach((input) => {
                ["input", "change"].forEach((eventType) => {
                  input.addEventListener(eventType, () => {
                    updateAutogen(containerEl);
                  });
                });
              });
            }
          }

          // Determine next row index based on existing rows
          const nextIndex = tbody.querySelectorAll("tr").length + 1;

          const newRow = templateRow.cloneNode(true);
          // Clear values and assign unique data-atlas-input keys per cell
          newRow.querySelectorAll("[data-atlas-input]").forEach((el) => {
            const baseKey = el.getAttribute("data-atlas-input") || "";
            const normalizedBase = baseKey.replace(/-row\d+$/i, "");
            const newKey = `${normalizedBase}-row${nextIndex}`;
            el.setAttribute("data-atlas-input", newKey);

            if (el.tagName === "INPUT") {
              if (el.type === "checkbox" || el.type === "radio") {
                el.checked = false;
              } else {
                el.value = "";
              }
            } else if (el.tagName === "TEXTAREA") {
              el.value = "";
            } else if (el.tagName === "SELECT") {
              el.value = "";
            }
          });

          tbody.appendChild(newRow);

          // Attach listeners to the newly added inputs so edits persist
          const containerEl = btn.closest('[data-atlas-capture="true"]');
          if (typeof atlasSystem !== "undefined" && containerEl) {
            const statusIndicator = atlasSystem.createAtlasStatusIndicator(containerEl);
            newRow.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach((input) => {
              ["input", "change", "blur"].forEach((eventType) => {
                input.addEventListener(eventType, () => {
                  atlasSystem.debouncedAtlasSave(containerEl, statusIndicator);
                });
              });
            });

            // If we normalized the first row, trigger a save to persist structure
            if (normalizedFirstRow) {
              atlasSystem.debouncedAtlasSave(containerEl, statusIndicator);
            }

            // Trigger save after appending a new row as well
            atlasSystem.debouncedAtlasSave(containerEl, statusIndicator);
          }
        });
      });

      // Initialize slider outputs
      const ranges = f.querySelectorAll('input[type="range"]');
      ranges.forEach((r) => {
        const o = r.nextElementSibling;
        if (o && o.tagName === "OUTPUT") {
          o.value = r.value;
        }
      });

      // Add basic event listeners - WORKSHEET 1 MECHANISM ONLY
      f.addEventListener("input", updateSliderOutput);

      // Clear-worksheet handler: clear DOM and delete saved item from DB
      f.querySelectorAll('[data-action="clear-worksheet"]').forEach((btn) => {
        if (btn._atlasClearBound) return;
        btn._atlasClearBound = true;
        btn.addEventListener("click", async (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Clear all form fields visually
          f.querySelectorAll("input, textarea, select").forEach((el) => {
            if (el.tagName === "INPUT") {
              if (el.type === "checkbox" || el.type === "radio") {
                el.checked = false;
              } else {
                el.value = "";
              }
            } else if (el.tagName === "TEXTAREA") {
              el.value = "";
            } else if (el.tagName === "SELECT") {
              el.value = "";
            }
          });

          // Delete from DB
          const containerEl = f.closest('[data-atlas-capture="true"]');
          if (containerEl && typeof atlasSystem !== "undefined") {
            const id = containerEl.getAttribute("data-atlas-id");
            if (id && atlasSystem.deleteFromAtlasDB) {
              try {
                await atlasSystem.deleteFromAtlasDB(id);
                await atlasSystem.updateAtlasDashboard();
                if (atlasSystem.showContentTable) {
                  atlasSystem.showContentTable();
                }
              } catch (err) {
                console.error("Failed to clear worksheet from DB:", err);
              }
            }
          }
        });
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
// ================================================================
// END OF SIMPLE WORKSHEET SYSTEM
// ================================================================

/////////////////////////////////////////////////////
////////// Worksheet Autogen Prompt (WS 2 & 3) //////
/////////////////////////////////////////////////////
(function () {
  // Ensure autogen UI elements exist (preview + hidden capture)
  function ensureAutogenElements(container) {
    const id = container.getAttribute("data-atlas-id");
    if (!id) return;

    // Check if autogen section already exists (from HTML template)
    const existingSection = container.querySelector(".worksheet-autogen");
    if (existingSection) {
      // Use existing HTML structure
      return;
    }

    // Otherwise, create it dynamically (backward compatibility)
    // Check if already added
    if (container.querySelector(".worksheet-autogen")) return;

    // Create preview section
    const autogenSection = document.createElement("section");
    autogenSection.className = "worksheet-autogen";
    autogenSection.style.cssText = "margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e0e0e0;";

    const heading = document.createElement("h3");
    heading.textContent = "Generated Prompt";
    heading.style.cssText = "margin: 0 0 10px 0; font-size: 16px; color: #002b56;";

    const resultDiv = document.createElement("div");
    resultDiv.className = "autogen-result";
    resultDiv.id = `${id}-autogen`;
    resultDiv.style.cssText = "white-space: pre-wrap; font-family: monospace; font-size: 13px; line-height: 1.6; color: #333; min-height: 40px;";
    resultDiv.textContent = "(Fill in fields above to generate prompt)";

    autogenSection.appendChild(heading);
    autogenSection.appendChild(resultDiv);

    // Insert before footer controls
    const footer = container.querySelector(".worksheet-controls");
    if (footer) {
      footer.parentNode.insertBefore(autogenSection, footer);
    } else {
      container.appendChild(autogenSection);
    }

    // Create hidden textarea for Atlas capture
    const hiddenTextarea = document.createElement("textarea");
    hiddenTextarea.setAttribute("data-atlas-input", "generated");
    hiddenTextarea.style.display = "none";
    container.appendChild(hiddenTextarea);
  }

  // Build prompt from worksheet fields
  function buildWorksheetPrompt(container, templateEl = null) {
    if (!templateEl) {
      templateEl = container.querySelector("[data-prompt-template]");
    }

    if (templateEl) {
      // Use HTML template with individual field placeholders
      let template = templateEl.textContent.trim();

      // Find all inputs with data-atlas-input
      const inputs = container.querySelectorAll("[data-atlas-input]");

      // Collect grouped values for checkboxes and radio buttons
      const groupedValues = new Map();

      inputs.forEach((input) => {
        const key = input.getAttribute("data-atlas-input");
        if (key === "generated") return; // skip hidden field

        // Handle checkboxes with same name (e.g., ws2-tags)
        if (input.type === "checkbox" && input.checked) {
          if (!groupedValues.has(key)) {
            groupedValues.set(key, []);
          }
          groupedValues.get(key).push(input.value || "Yes");
        }
        // Handle radio buttons
        else if (input.type === "radio" && input.checked) {
          groupedValues.set(key, input.value);
        }
        // Handle other inputs
        else if (input.type !== "checkbox" && input.type !== "radio") {
          const value = getInputValue(input);
          if (value) {
            groupedValues.set(key, value);
          }
        }
      });

      // Aggregate row values for table inputs (e.g., key-row1, key-row2 -> key)
      const aggregatedValues = new Map(groupedValues);
      groupedValues.forEach((value, key) => {
        const baseMatch = key.match(/^(.*?)-row\d+$/i);
        if (baseMatch) {
          const baseKey = baseMatch[1];
          if (!aggregatedValues.has(baseKey)) {
            aggregatedValues.set(baseKey, []);
          }
          const existing = aggregatedValues.get(baseKey);
          if (Array.isArray(existing)) {
            existing.push(value);
          } else {
            aggregatedValues.set(baseKey, [existing, value]);
          }
        }
      });

      // Replace placeholders
      aggregatedValues.forEach((value, key) => {
        const placeholder = `[[${key}]]`;
        const displayValue = Array.isArray(value) ? value.join(", ") : value;
        template = template.replace(new RegExp(escapeRegExp(placeholder), "g"), displayValue || "(not provided)");
      });

      return template;
    } else {
      // Fallback to auto-generation (current behavior)
      return buildAutoPrompt(container);
    }
  }

  // Helper to get input value based on type
  function getInputValue(input) {
    if (input.tagName === "INPUT") {
      if (input.type === "checkbox") {
        return input.checked ? input.value || "Yes" : "";
      } else if (input.type === "radio") {
        return input.checked ? input.value : "";
      } else {
        return input.value.trim();
      }
    } else if (input.tagName === "TEXTAREA") {
      return input.value.trim();
    } else if (input.tagName === "SELECT") {
      return input.value.trim();
    }
    return "";
  }

  // Helper to escape special regex characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Refactor existing logic into buildAutoPrompt
  function buildAutoPrompt(container) {
    const id = container.getAttribute("data-atlas-id");
    const title = container.getAttribute("data-atlas-title") || "Worksheet";

    let prompt = `# ${title}\n\n`;

    // Gather all inputs with data-atlas-input
    const inputs = container.querySelectorAll("[data-atlas-input]");
    const sections = new Map(); // group by section/table

    inputs.forEach((input) => {
      const key = input.getAttribute("data-atlas-input");
      if (key === "generated" || key.startsWith("generated-")) return; // skip our hidden fields

      let value = "";
      let label = getLabelText(input, key);

      // Extract value based on input type
      if (input.tagName === "INPUT") {
        if (input.type === "checkbox") {
          if (!input.checked) return;
          value = input.value || "Yes";
        } else if (input.type === "radio") {
          if (!input.checked) return;
          value = input.value;
        } else {
          value = input.value.trim();
        }
      } else if (input.tagName === "TEXTAREA") {
        value = input.value.trim();
      } else if (input.tagName === "SELECT") {
        value = input.value.trim();
      } else {
        value = input.textContent.trim();
      }

      if (!value) return; // skip empty

      // Determine section
      const section = findSectionName(input);
      if (!sections.has(section)) {
        sections.set(section, []);
      }
      sections.get(section).push({ label, value });
    });

    // Build prompt text
    if (sections.size === 0) {
      return "(Fill in fields above to generate prompt)";
    }

    sections.forEach((items, sectionName) => {
      if (items.length === 0) return;
      prompt += `## ${sectionName}\n\n`;
      items.forEach((item) => {
        prompt += `**${item.label}:** ${item.value}\n\n`;
      });
    });

    return prompt.trim();
  }

  // Helper: get label text for input
  function getLabelText(input, fallback) {
    // Try label[for]
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent.trim();
    }

    // Try parent label
    const parentLabel = input.closest("label");
    if (parentLabel) {
      const clone = parentLabel.cloneNode(true);
      clone.querySelectorAll("input, select, textarea").forEach((el) => el.remove());
      return clone.textContent.trim();
    }

    // Try previous sibling label
    let prev = input.previousElementSibling;
    if (prev && prev.tagName === "LABEL") {
      return prev.textContent.trim();
    }

    // Try fieldset legend (for radios)
    const fieldset = input.closest("fieldset");
    if (fieldset) {
      const legend = fieldset.querySelector("legend");
      if (legend) return legend.textContent.trim();
    }

    // Fallback to cleaned key
    return fallback
      .replace(/^ws\d+-/, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Helper: find section name for grouping
  function findSectionName(input) {
    // Check if in table
    const tableSection = input.closest("[data-table]");
    if (tableSection) {
      const title = tableSection.querySelector(".section-title");
      if (title) return title.textContent.trim();
      return "Table Data";
    }

    // Check if in section
    const section = input.closest("section");
    if (section && section !== input.closest(".worksheet-autogen")) {
      const heading = section.querySelector("h3, h4");
      if (heading) return heading.textContent.trim();
    }

    return "Worksheet Fields";
  }

  // Update autogen prompt and trigger save
  function updateAutogen(container) {
    const id = container.getAttribute("data-atlas-id");

    // Find all prompt sections within this worksheet (both .worksheet-autogen and standalone)
    const promptSections = container.querySelectorAll(".worksheet-autogen");

    // Also find standalone prompt templates not in .worksheet-autogen containers
    const standaloneTemplates = container.querySelectorAll("[data-prompt-template]");

    // Process .worksheet-autogen sections
    promptSections.forEach((section) => {
      const templateEl = section.querySelector("[data-prompt-template]");
      const resultDiv = section.querySelector(".pb-output");
      const hiddenTextarea = section.querySelector('textarea[data-atlas-input^="generated"]');

      if (!templateEl || !resultDiv) return;

      // Build prompt for this specific section
      const prompt = buildWorksheetPrompt(container, templateEl);
      resultDiv.textContent = prompt;

      if (hiddenTextarea) {
        hiddenTextarea.value = prompt;
      }
    });

    // Process standalone prompt templates (like good/bad prompts)
    standaloneTemplates.forEach((templateEl) => {
      // Skip if already processed in .worksheet-autogen sections
      if (templateEl.closest(".worksheet-autogen")) return;

      const resultDiv = templateEl.parentElement.querySelector(".pb-output");
      if (!resultDiv) return;

      // Build prompt for this specific template
      const prompt = buildWorksheetPrompt(container, templateEl);
      resultDiv.textContent = prompt;
    });

    // Trigger Atlas save if available
    if (typeof atlasSystem !== "undefined") {
      const statusIndicator = atlasSystem.createAtlasStatusIndicator(container);
      atlasSystem.debouncedAtlasSave(container, statusIndicator);
    }
  }

  // Initialize autogen for target worksheets
  function initAutogen() {
    // Auto-detect all worksheet containers that have prompt templates
    const containers = document.querySelectorAll('[data-atlas-type="worksheet"]');

    containers.forEach((container) => {
      // Only initialize if this worksheet has a prompt template
      const hasPromptTemplate = container.querySelector("[data-prompt-template]");
      if (!hasPromptTemplate) return;

      // Ensure UI elements exist
      ensureAutogenElements(container);

      // Attach listeners to all inputs
      const inputs = container.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        ["input", "change"].forEach((eventType) => {
          input.addEventListener(eventType, () => {
            updateAutogen(container);
          });
        });
      });

      // Initial build (in case data was restored by Atlas)
      setTimeout(() => {
        updateAutogen(container);
      }, 500);
    });
  }

  // Run after DOM ready and after Atlas has restored
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initAutogen, 1000);
    });
  } else {
    setTimeout(initAutogen, 1000);
  }
})();

/////////////////////////////////////////////////////
////////// Tripod Diagram Interaction ///////////////
/////////////////////////////////////////////////////
const tripodNarrativeBox = document.getElementById("tripod-narrative");
const tripodLegGroups = ["tripod-needs-group", "tripod-strengths-group", "tripod-values-group"];
function tripodClearSelection() {
  tripodLegGroups.forEach((id) => {
    const leg = document.querySelector(`#${id} .tripod-leg`);
    if (leg) leg.classList.remove("tripod-selected");
  });
}
function tripodShowNarrative(id) {
  const group = document.getElementById(id);
  const leg = group.querySelector(".tripod-leg");
  const isSelected = leg.classList.contains("tripod-selected");
  if (isSelected) {
    tripodClearSelection();
    tripodNarrativeBox.classList.remove("tripod-show");
    tripodNarrativeBox.textContent = "";
  } else {
    tripodClearSelection();
    leg.classList.add("tripod-selected");
    tripodNarrativeBox.textContent = group.getAttribute("data-tripod-narrative");
    tripodNarrativeBox.classList.add("tripod-show");
  }
}
function tripodHideNarrative() {
  tripodClearSelection();
  tripodNarrativeBox.classList.remove("tripod-show");
  tripodNarrativeBox.textContent = "";
}
tripodLegGroups.forEach((id) => {
  const group = document.getElementById(id);
  if (group) {
    group.addEventListener("click", (event) => {
      event.stopPropagation();
      tripodShowNarrative(id);
    });
  }
});
const tripodCenterNode = document.getElementById("tripod-center-node");
if (tripodCenterNode) {
  tripodCenterNode.addEventListener("click", (event) => {
    event.stopPropagation();
    tripodHideNarrative();
  });
}

/////////////////////////////////////////////////////
///////////// Interactive Quadrant Map //////////////
/////////////////////////////////////////////////////
function mapQuadrantAllowDrop(ev) {
  ev.preventDefault();
}
function mapQuadrantDrag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}
function mapQuadrantDrop(ev) {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  const task = document.getElementById(data);
  const target = ev.target.closest(".map-quadrant-quadrant");
  if (target) target.appendChild(task);
}
function mapQuadrantAddTask() {
  const text = document.getElementById("map-quadrant-new-task").value.trim();
  if (text === "") return;
  const id = "map-quadrant-task-" + Math.random().toString(36).substr(2, 9);
  const div = document.createElement("div");
  div.id = id;
  div.className = "map-quadrant-task";
  div.draggable = true;
  div.ondragstart = mapQuadrantDrag;

  const taskContent = document.createElement("div");
  taskContent.textContent = text;

  const tagInput = document.createElement("input");
  tagInput.className = "map-quadrant-tag-input";
  tagInput.placeholder = "Add tag...";
  tagInput.type = "text";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "map-quadrant-delete-btn";
  deleteBtn.innerHTML = "×";
  deleteBtn.title = "Delete task";
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    mapQuadrantDeleteTask(id);
  };

  div.appendChild(taskContent);
  div.appendChild(tagInput);
  div.appendChild(deleteBtn);
  document.getElementById("map-quadrant-1").appendChild(div);
  document.getElementById("map-quadrant-new-task").value = "";
}

// Delete individual task from quadrant map
function mapQuadrantDeleteTask(taskId) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.remove();
    console.log("🗑️ Task deleted:", taskId);

    // Auto-save after deletion to update storage
    setTimeout(() => {
      saveQuadrantMap();
    }, 100);
  }
}

// Clear all tasks from quadrant map HTML
function clearQuadrantMapHTML() {
  console.log("🧹 Clearing quadrant map HTML...");

  // Clear all tasks from all quadrants
  for (let i = 1; i <= 4; i++) {
    const quadrant = document.getElementById(`map-quadrant-${i}`);
    if (quadrant) {
      // Remove all tasks but keep the h3 title
      quadrant.querySelectorAll(".map-quadrant-task").forEach((task) => task.remove());
    }
  }

  console.log("✅ Quadrant map HTML cleared");
}

function saveQuadrantMap() {
  const container = document.querySelector('[data-atlas-id="quadrant-map-001"]');
  if (!container) {
    console.error("Quadrant map container not found");
    return;
  }

  // Capture data from all four quadrants
  const quadrantData = {};

  for (let i = 1; i <= 4; i++) {
    const quadrant = document.getElementById(`map-quadrant-${i}`);
    if (quadrant) {
      const quadrantName = quadrant.querySelector("h3")?.textContent?.trim() || `Quadrant ${i}`;
      const tasks = [];

      // Get all tasks in this quadrant
      quadrant.querySelectorAll(".map-quadrant-task").forEach((taskEl) => {
        const taskText = taskEl.querySelector("div")?.textContent?.trim() || "";
        const tagInput = taskEl.querySelector(".map-quadrant-tag-input");
        const tag = tagInput ? tagInput.value.trim() : "";

        if (taskText) {
          tasks.push(tag ? `${taskText} [${tag}]` : taskText);
        }
      });

      quadrantData[quadrantName] = tasks;
    }
  }

  // Store the quadrant data in hidden inputs for Atlas to capture
  // Remove existing hidden inputs first
  container.querySelectorAll('[data-atlas-input^="quadrant-"]').forEach((el) => el.remove());

  // Create hidden inputs for each quadrant
  Object.entries(quadrantData).forEach(([quadrantName, tasks]) => {
    const input = document.createElement("textarea");
    input.setAttribute("data-atlas-input", `quadrant-${quadrantName.replace(/\s+/g, "-").toLowerCase()}`);
    input.value = tasks.join("\n");
    input.style.display = "none";
    container.appendChild(input);
  });

  // Trigger Atlas save
  if (typeof atlasSystem !== "undefined" && atlasSystem.saveAtlasContainer) {
    const statusIndicator = atlasSystem.createAtlasStatusIndicator(container);
    atlasSystem.saveAtlasContainer(container, statusIndicator);

    // Show temporary save confirmation
    const saveBtn = document.getElementById("map-quadrant-save-btn");
    if (saveBtn) {
      const originalText = saveBtn.textContent;
      saveBtn.textContent = "✔ Saved";
      saveBtn.style.background = "#27ae60";
      setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = "";
      }, 2000);
    }

    console.log("✅ Quadrant map saved to Atlas:", quadrantData);

    // Restore the data to ensure consistency
    setTimeout(() => {
      restoreQuadrantMap();
    }, 500);
  } else {
    console.error("Atlas system not available");
  }
}

// Restore quadrant map data from Atlas storage
async function restoreQuadrantMap() {
  const container = document.querySelector('[data-atlas-id="quadrant-map-001"]');
  if (!container) {
    console.error("Quadrant map container not found");
    return;
  }

  try {
    // Get the Atlas ID from the container
    const atlasId = container.getAttribute("data-atlas-id");
    if (!atlasId) {
      console.log("No Atlas ID found for quadrant map");
      return;
    }

    // Find the saved data in Atlas
    const savedData = await atlasSystem.findCaptureById(atlasId);
    if (!savedData || !savedData.inputs) {
      console.log("No saved quadrant data found");
      return;
    }

    console.log("🔄 Restoring quadrant map from Atlas:", savedData);

    // Clear existing tasks from all quadrants
    for (let i = 1; i <= 4; i++) {
      const quadrant = document.getElementById(`map-quadrant-${i}`);
      if (quadrant) {
        // Remove all tasks but keep the h3 title
        quadrant.querySelectorAll(".map-quadrant-task").forEach((task) => task.remove());
      }
    }

    // Restore tasks to their respective quadrants
    Object.entries(savedData.inputs).forEach(([key, value]) => {
      if (value && value.toString().trim()) {
        // Extract quadrant number from key (e.g., "quadrant-quadrant-1" -> "1")
        const quadrantMatch = key.match(/quadrant-(\d+)/i);
        if (quadrantMatch) {
          const quadrantNum = quadrantMatch[1];
          const quadrant = document.getElementById(`map-quadrant-${quadrantNum}`);

          if (quadrant) {
            const tasks = value.split("\n").filter((t) => t.trim());

            tasks.forEach((taskText) => {
              // Parse task and tag from format "Task text [tag]" or just "Task text"
              const tagMatch = taskText.match(/^(.+?)\s*\[(.+?)\]$/);
              const task = tagMatch ? tagMatch[1].trim() : taskText.trim();
              const tag = tagMatch ? tagMatch[2].trim() : "";

              if (task) {
                // Create task element
                const id = "map-quadrant-task-" + Math.random().toString(36).substr(2, 9);
                const div = document.createElement("div");
                div.id = id;
                div.className = "map-quadrant-task";
                div.draggable = true;
                div.ondragstart = mapQuadrantDrag;

                const taskContent = document.createElement("div");
                taskContent.textContent = task;

                const tagInput = document.createElement("input");
                tagInput.className = "map-quadrant-tag-input";
                tagInput.placeholder = "Add tag...";
                tagInput.type = "text";
                tagInput.value = tag;

                const deleteBtn = document.createElement("button");
                deleteBtn.className = "map-quadrant-delete-btn";
                deleteBtn.innerHTML = "×";
                deleteBtn.title = "Delete task";
                deleteBtn.onclick = (e) => {
                  e.stopPropagation();
                  mapQuadrantDeleteTask(id);
                };

                div.appendChild(taskContent);
                div.appendChild(tagInput);
                div.appendChild(deleteBtn);
                quadrant.appendChild(div);
              }
            });
          }
        }
      }
    });

    console.log("✅ Quadrant map restored successfully");
  } catch (error) {
    console.error("Error restoring quadrant map:", error);
  }
}
////////////////////////////////////////////////////////
////// Atlas System - Personal Learning Portfolio //////
////////////////////////////////////////////////////////
// ALX Atlas System - Your Personal Learning Portfolio
// © 2025 ALX - Powered by Atlas
class AtlasSystem {
  constructor() {
    // Initialize Atlas
    this.initializeAtlasConfig();
    this.dbName = `Atlas_${this.courseId}`;
    this.dbVersion = 2; // Increased for better structure
    this.db = null;
    this.saveDebounceTimers = new Map();
    this.observer = null;
    this.headerHTML = null;
    this.footerHTML = null;

    console.log(`🗺️ ALX Atlas: Initializing for course "${this.courseName}" (${this.courseId})`);
    this.init();
  }

  initializeAtlasConfig() {
    // Look for Atlas configuration element INSIDE the body
    const configElement = document.querySelector('[data-atlas-config="true"]');

    if (configElement) {
      this.courseName = configElement.getAttribute("data-course-name") || "DefaultCourse";
      this.courseId = configElement.getAttribute("data-course-id") || "default-course";
      this.currentModule = configElement.getAttribute("data-module") || "1";
      this.currentLesson = configElement.getAttribute("data-lesson") || "1";
      this.currentSection = configElement.getAttribute("data-section") || "A";
    } else {
      console.warn("⚠️ ALX Atlas: No configuration found. Using defaults.");
      this.courseName = "DefaultCourse";
      this.courseId = "default-course";
      this.currentModule = "1";
      this.currentLesson = "1";
      this.currentSection = "A";
    }

    // Store Atlas context
    this.atlasContext = {
      courseName: this.courseName,
      courseId: this.courseId,
      module: this.currentModule,
      lesson: this.currentLesson,
      section: this.currentSection,
    };
  }

  async init() {
    try {
      // Show loading overlay
      const overlay = document.getElementById("atlasLoadingOverlay");
      if (overlay) overlay.classList.add("show");

      console.log("🗺️ ALX Atlas: Initializing database...");
      await this.initDatabase();
      await this.loadMetadata();
      this.captureHeaderFooter();
      this.setupMutationObserver();

      // CRITICAL: Restore all saved data
      await this.restoreAllContainers();

      this.attachExistingContainers();
      await this.updateAtlasDashboard();
      console.log("✅ ALX Atlas: System initialized successfully");
    } catch (error) {
      console.error("❌ ALX Atlas initialization error:", error);
    } finally {
      // Hide loading overlay
      const overlay = document.getElementById("atlasLoadingOverlay");
      if (overlay) overlay.classList.remove("show");
    }
  }

  // Database initialization with better structure for queries
  async initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error("❌ ALX Atlas: Database error", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log("✅ ALX Atlas: Database connected");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Main Atlas captures store with indexes for querying
        if (!db.objectStoreNames.contains("atlas_captures")) {
          const store = db.createObjectStore("atlas_captures", { keyPath: "id" });

          // Indexes for complex queries
          store.createIndex("courseId", "courseId", { unique: false });
          store.createIndex("module", "module", { unique: false });
          store.createIndex("lesson", "lesson", { unique: false });
          store.createIndex("section", "section", { unique: false });
          store.createIndex("type", "type", { unique: false });

          // Compound indexes for efficient queries
          store.createIndex("course_module", ["courseId", "module"], { unique: false });
          store.createIndex("course_module_lesson", ["courseId", "module", "lesson"], { unique: false });
          store.createIndex("course_module_lesson_section", ["courseId", "module", "lesson", "section"], { unique: false });
        }

        // Metadata store
        if (!db.objectStoreNames.contains("atlas_metadata")) {
          db.createObjectStore("atlas_metadata", { keyPath: "key" });
        }

        console.log("✅ ALX Atlas: Database schema created/updated");
      };
    });
  }

  // Load metadata on init
  async loadMetadata() {
    try {
      const metadata = await this.getMetadata();
      metadata.forEach((item) => {
        if (item.key === "headerHTML") this.headerHTML = item.value;
        if (item.key === "footerHTML") this.footerHTML = item.value;
      });
    } catch (error) {
      console.log("📝 ALX Atlas: No existing metadata found");
    }
  }

  // CRITICAL: Restore all containers from Atlas database
  async restoreAllContainers() {
    console.log("🔄 ALX Atlas: Restoring saved content...");
    const captures = await this.getAllCaptures();
    const captureMap = new Map(captures.map((c) => [c.id, c]));

    let restoredCount = 0;
    document.querySelectorAll('[data-atlas-capture="true"]').forEach((container) => {
      const id = container.getAttribute("data-atlas-id");
      const savedData = captureMap.get(id);

      if (savedData && savedData.inputs) {
        this.restoreContainer(container, savedData);
        restoredCount++;
      }
    });

    if (restoredCount > 0) {
      console.log(`✅ ALX Atlas: Restored ${restoredCount} containers`);
    }

    // Restore quadrant map data if it exists
    setTimeout(() => {
      restoreQuadrantMap();
    }, 1000);
  }

  // Restore a single container
  restoreContainer(container, savedData) {
    // Rebuild table rows before restoring values so -rowN keys exist in DOM
    try {
      this._recreateWorksheetTableRows(container, savedData);
    } catch (e) {
      console.warn("Row reconstruction skipped:", e);
    }
    // Restore checkbox data first
    if (savedData.checkboxData) {
      Object.entries(savedData.checkboxData).forEach(([inputId, data]) => {
        const checkbox = container.querySelector(`[data-atlas-input="${inputId}"]`);
        if (checkbox && checkbox.type === "checkbox") {
          checkbox.checked = data.checked;
        }
      });
    }

    // Restore all inputs
    if (savedData.inputs) {
      Object.entries(savedData.inputs).forEach(([inputId, value]) => {
        const input = container.querySelector(`[data-atlas-input="${inputId}"]`);
        if (input) {
          if (input.tagName === "INPUT" && input.type === "checkbox") {
            // Find all checkboxes with this data-atlas-input (for grouped checkboxes)
            const allCheckboxes = container.querySelectorAll(`[data-atlas-input="${inputId}"]`);
            if (allCheckboxes.length > 1 && typeof value === "string") {
              // Multiple checkboxes with same data-atlas-input = checkbox group
              // Split comma-separated values
              const selectedValues = value
                .split(",")
                .map((v) => v.trim())
                .filter((v) => v);
              allCheckboxes.forEach((cb) => {
                cb.checked = selectedValues.includes(cb.value);
              });
            } else {
              // Single checkbox - restore boolean
              input.checked = value;
            }
          } else if (input.tagName === "INPUT" && input.type === "radio") {
            // Restore radio by matching value within the same group (name attribute)
            const name = input.getAttribute("name");
            if (name) {
              const group = container.querySelectorAll(`input[name="${name}"][data-atlas-input="${inputId}"]`);
              group.forEach((el) => {
                el.checked = el.value === value;
              });
            } else {
              input.checked = input.value === value;
            }
          } else if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
            input.value = value;
            // Update placeholder to show saved content
            if (value) {
              input.setAttribute("placeholder", "Your saved content is loaded above");
            }
          } else if (input.tagName === "SELECT") {
            input.value = value;
          } else if (input.contentEditable === "true") {
            input.innerHTML = value;
          } else {
            // For div elements like autogen-result
            input.textContent = value;
          }
        }
      });
    }

    // Update prompts after data is restored
    setTimeout(() => {
      if (typeof updateAutogen === "function") {
        updateAutogen(container);
      }
    }, 100);
  }

  // Capture header and footer
  captureHeaderFooter() {
    const header = document.querySelector('[data-atlas-header="true"]');
    const footer = document.querySelector('[data-atlas-footer="true"]');

    if (header) {
      this.headerHTML = header.outerHTML;
      this.saveMetadata("headerHTML", this.headerHTML);
    }

    if (footer) {
      this.footerHTML = footer.outerHTML;
      this.saveMetadata("footerHTML", this.footerHTML);
    }
  }

  // Setup MutationObserver
  setupMutationObserver() {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) {
            // Element node
            this.checkAndAttachContainer(node);
            if (node.querySelectorAll) {
              node.querySelectorAll('[data-atlas-capture="true"]').forEach((container) => {
                this.checkAndAttachContainer(container);
              });
            }
          }
        });
      });
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Check and attach to container
  checkAndAttachContainer(element) {
    if (element.getAttribute("data-atlas-capture") === "true" && !element.hasAttribute("data-atlas-attached")) {
      this.attachAtlasListeners(element);
      element.setAttribute("data-atlas-attached", "true");
    }
  }

  // Attach to existing containers
  attachExistingContainers() {
    document.querySelectorAll('[data-atlas-capture="true"]').forEach((container) => {
      if (!container.hasAttribute("data-atlas-attached")) {
        this.attachAtlasListeners(container);
        container.setAttribute("data-atlas-attached", "true");
      }
    });
  }

  // Attach Atlas listeners
  attachAtlasListeners(container) {
    const id = container.getAttribute("data-atlas-id");
    if (!id) return;

    // Create save status indicator
    const statusIndicator = this.createAtlasStatusIndicator(container);

    // Attach listeners to all inputs
    const inputs = container.querySelectorAll('input, textarea, select, [contenteditable="true"]');
    inputs.forEach((input) => {
      ["input", "change", "blur"].forEach((eventType) => {
        input.addEventListener(eventType, () => {
          this.debouncedAtlasSave(container, statusIndicator);
        });
      });
    });
  }

  // Create Atlas status indicator
  createAtlasStatusIndicator(container) {
    const existing = container.querySelector(".atlas-save-status");
    if (existing) return existing;

    const indicator = document.createElement("span");
    indicator.className = "atlas-save-status";
    indicator.innerHTML = '<span class="status-icon">✓</span> <span class="status-text">Saved</span>';

    const title = container.querySelector("h1, h2, h3, h4, h5, h6");
    if (title) {
      title.appendChild(indicator);
    }

    return indicator;
  }

  // Debounced Atlas save
  debouncedAtlasSave(container, statusIndicator) {
    const id = container.getAttribute("data-atlas-id");

    if (this.saveDebounceTimers.has(id)) {
      clearTimeout(this.saveDebounceTimers.get(id));
    }

    if (statusIndicator) {
      statusIndicator.classList.add("visible", "saving");
      statusIndicator.classList.remove("saved", "error");
      statusIndicator.querySelector(".status-text").textContent = "Saving...";
    }

    const timer = setTimeout(() => {
      this.saveAtlasContainer(container, statusIndicator);
      this.saveDebounceTimers.delete(id);
    }, 500);

    this.saveDebounceTimers.set(id, timer);
  }

  // Save Atlas container
  async saveAtlasContainer(container, statusIndicator) {
    const id = container.getAttribute("data-atlas-id");
    const type = container.getAttribute("data-atlas-type") || "unclassified";
    const title = container.getAttribute("data-atlas-title") || "Untitled";

    // Get module/lesson/section from container or config
    const module = container.getAttribute("data-atlas-module") || this.currentModule;
    const lesson = container.getAttribute("data-atlas-lesson") || this.currentLesson;
    const section = container.getAttribute("data-atlas-section") || this.currentSection;

    // Capture field order first
    const fieldOrder = [];
    container.querySelectorAll("[data-atlas-input]").forEach((element) => {
      const inputId = element.getAttribute("data-atlas-input");
      if (!fieldOrder.includes(inputId)) {
        fieldOrder.push(inputId);
      }
    });

    // Capture all input values
    const inputs = {};
    const checkboxData = {};
    const worksheetCheckboxGroups = {}; // inputId -> array of checked values (for worksheets only)
    container.querySelectorAll("[data-atlas-input]").forEach((element) => {
      const inputId = element.getAttribute("data-atlas-input");
      if (element.tagName === "INPUT" && element.type === "checkbox") {
        if (type === "worksheet") {
          if (!worksheetCheckboxGroups[inputId]) worksheetCheckboxGroups[inputId] = [];
          if (element.checked) {
            const valueLabel = element.value || (element.nextElementSibling ? element.nextElementSibling.textContent.trim() : "Checked");
            worksheetCheckboxGroups[inputId].push(valueLabel);
          }
          // Do not set inputs[inputId] here for worksheets; we will finalize after loop
        } else {
          // Non-worksheet (e.g., checklist) retain per-checkbox state
          inputs[inputId] = element.checked;
          checkboxData[inputId] = {
            checked: element.checked,
            label: element.nextElementSibling ? element.nextElementSibling.textContent.trim() : "",
          };
        }
      } else if (element.tagName === "INPUT" && element.type === "radio") {
        // Only capture the selected radio option for the group
        if (element.checked) {
          inputs[inputId] = element.value || "";
        }
      } else if (element.tagName === "INPUT" || element.tagName === "TEXTAREA") {
        // WORKSHEET 1 MECHANISM - Capture actual form values only
        inputs[inputId] = element.value || "";
      } else if (element.tagName === "SELECT") {
        inputs[inputId] = element.value || "";
      } else if (element.contentEditable === "true") {
        inputs[inputId] = element.innerHTML || "";
      } else {
        inputs[inputId] = element.textContent || "";
      }
    });

    // Finalize worksheet checkbox group values as comma-separated strings
    if (type === "worksheet") {
      Object.keys(worksheetCheckboxGroups).forEach((groupKey) => {
        const arr = worksheetCheckboxGroups[groupKey];
        inputs[groupKey] = arr.length ? arr.join(", ") : "";
      });
    }

    // Atlas data structure optimized for queries
    const atlasData = {
      id,
      type,
      title,
      courseId: this.courseId,
      courseName: this.courseName,
      module,
      lesson,
      section,
      inputs,
      checkboxData,
      fieldOrder,
      htmlStructure: this.captureStructure(container),
      autogen: false,
      timestamp: new Date().toISOString(),
      pageUrl: window.location.href,
      pageTitle: document.title,
    };

    try {
      await this.saveToAtlasDB(atlasData);

      if (statusIndicator) {
        statusIndicator.classList.remove("saving");
        statusIndicator.classList.add("saved");
        statusIndicator.querySelector(".status-text").textContent = "Saved";

        setTimeout(() => {
          statusIndicator.classList.remove("visible");
        }, 2000);
      }

      this.updateAtlasDashboard();
      // If content library is present, refresh to reflect latest changes
      const contentList = document.getElementById("atlasContentList");
      if (contentList) {
        this.showContentTable();
      }
    } catch (error) {
      console.error("❌ ALX Atlas save error:", error);
      if (statusIndicator) {
        statusIndicator.classList.remove("saving");
        statusIndicator.classList.add("error");
        statusIndicator.querySelector(".status-text").textContent = "Error";
      }
    }
  }

  // Capture structure
  captureStructure(container) {
    const clone = container.cloneNode(true);
    clone.querySelectorAll(".atlas-save-status").forEach((el) => el.remove());
    clone.removeAttribute("data-atlas-attached");
    return clone.innerHTML;
  }

  // Recreate worksheet table rows based on savedData inputs (idempotent)
  _recreateWorksheetTableRows(container, savedData) {
    if (!savedData || !savedData.inputs) return;
    const inputs = savedData.inputs;

    // Group keys by base prefix without -rowN
    const rowInfoByTable = new Map(); // tableSection -> { basePrefix -> maxRow }

    Object.keys(inputs).forEach((key) => {
      const match = key.match(/^(.*?)-row(\d+)$/i);
      if (!match) return;
      const base = match[1];
      const rowNum = parseInt(match[2], 10) || 1;

      // Find which table section contains inputs with this base (heuristic by querying)
      const tableSections = container.querySelectorAll("[data-table]");
      tableSections.forEach((section) => {
        if (section.querySelector(`[data-atlas-input^="${base}"]`)) {
          if (!rowInfoByTable.has(section)) rowInfoByTable.set(section, new Map());
          const map = rowInfoByTable.get(section);
          map.set(base, Math.max(map.get(base) || 1, rowNum));
        }
      });
    });

    // For each table, ensure first row has -row1 and clone to reach maxRow across bases
    rowInfoByTable.forEach((baseToMaxRow, section) => {
      const table = section.querySelector("table.worksheet-table");
      const tbody = table ? table.querySelector("tbody") : null;
      const templateRow = tbody ? tbody.querySelector("tr") : null;
      if (!tbody || !templateRow) return;

      // Normalize first row keys to -row1
      templateRow.querySelectorAll("[data-atlas-input]").forEach((el) => {
        const baseKey = el.getAttribute("data-atlas-input") || "";
        if (!/-row\d+$/i.test(baseKey)) {
          el.setAttribute("data-atlas-input", `${baseKey}-row1`);
        }
      });

      // Determine max row needed across all bases present in this table
      let maxRowNeeded = 1;
      baseToMaxRow.forEach((maxRow) => {
        if (maxRow > maxRowNeeded) maxRowNeeded = maxRow;
      });

      // Current rows in DOM
      const currentRows = tbody.querySelectorAll("tr").length;
      for (let i = currentRows + 1; i <= maxRowNeeded; i++) {
        const newRow = templateRow.cloneNode(true);
        newRow.querySelectorAll("[data-atlas-input]").forEach((el) => {
          const baseKey = el.getAttribute("data-atlas-input") || "";
          const normalizedBase = baseKey.replace(/-row\d+$/i, "");
          el.setAttribute("data-atlas-input", `${normalizedBase}-row${i}`);
          if (el.tagName === "INPUT") {
            if (el.type === "checkbox" || el.type === "radio") {
              el.checked = false;
            } else {
              el.value = "";
            }
          } else if (el.tagName === "TEXTAREA") {
            el.value = "";
          } else if (el.tagName === "SELECT") {
            el.value = "";
          }
        });
        tbody.appendChild(newRow);

        // Attach listeners so edits persist
        const statusIndicator = this.createAtlasStatusIndicator(container);
        newRow.querySelectorAll('input, textarea, select, [contenteditable="true"]').forEach((input) => {
          ["input", "change", "blur"].forEach((eventType) => {
            input.addEventListener(eventType, () => {
              this.debouncedAtlasSave(container, statusIndicator);
            });
          });
        });

        // Also attach prompt update listeners if this worksheet has autogen
        if (typeof updateAutogen === "function") {
          newRow.querySelectorAll("input, textarea, select").forEach((input) => {
            ["input", "change"].forEach((eventType) => {
              input.addEventListener(eventType, () => {
                updateAutogen(container);
              });
            });
          });
        }
      }
    });
  }

  // Save to Atlas database
  async saveToAtlasDB(data) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["atlas_captures"], "readwrite");
      const store = transaction.objectStore("atlas_captures");
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Save metadata
  async saveMetadata(key, value) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["atlas_metadata"], "readwrite");
      const store = transaction.objectStore("atlas_metadata");
      const request = store.put({ key, value });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Get all captures
  async getAllCaptures() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["atlas_captures"], "readonly");
      const store = transaction.objectStore("atlas_captures");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // QUERY ATLAS DATA - For external programs/apps
  async queryAtlas(queryType, module, lesson, section) {
    const transaction = this.db.transaction(["atlas_captures"], "readonly");
    const store = transaction.objectStore("atlas_captures");
    let request;

    switch (queryType) {
      case "all":
        request = store.index("courseId").getAll(this.courseId);
        break;
      case "module":
        request = store.index("course_module").getAll([this.courseId, module]);
        break;
      case "lesson":
        request = store.index("course_module_lesson").getAll([this.courseId, module, lesson]);
        break;
      case "section":
        request = store.index("course_module_lesson_section").getAll([this.courseId, module, lesson, section]);
        break;
      default:
        request = store.getAll();
    }

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const results = request.result;
        console.log(`🗺️ ALX Atlas Query: Found ${results.length} saved items`);
        console.table(
          results.map((r) => ({
            id: r.id,
            type: r.type,
            module: r.module,
            lesson: r.lesson,
            section: r.section,
          }))
        );
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Update Atlas dashboard
  async updateAtlasDashboard() {
    const captures = await this.getAllCaptures();
    const prompts = captures.filter((c) => c.type === "prompt");
    const notes = captures.filter((c) => c.type !== "prompt");

    const totalEl = document.getElementById("atlasTotalCaptured");
    const promptEl = document.getElementById("atlasPromptCount");
    const notesEl = document.getElementById("atlasNotesCount");
    const lastSaveEl = document.getElementById("atlasLastSave");

    if (totalEl) totalEl.textContent = captures.length;
    if (promptEl) promptEl.textContent = prompts.length;
    if (notesEl) notesEl.textContent = notes.length;
    if (lastSaveEl) {
      if (captures.length > 0) {
        const lastSaveDate = new Date(Math.max(...captures.map((c) => new Date(c.timestamp))));
        const dateStr = lastSaveDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const timeStr = lastSaveDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        lastSaveEl.textContent = `${dateStr} at ${timeStr}`;
        lastSaveEl.style.fontSize = "14px"; // Make it smaller to fit
      } else {
        lastSaveEl.textContent = "--";
      }
    }
  }

  // Build export content
  buildExportContent(item) {
    let content = "";
    content += `<h3>${item.title}</h3>\n`;

    if (item.inputs) {
      content += `<div class="parameters" style="margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 4px;">\n`;
      content += `<strong>Parameters used:</strong><br>\n`;
      Object.entries(item.inputs).forEach(([key, value]) => {
        if (key !== "generated" && key !== "main-content" && value) {
          content += `${key}: ${value}<br>\n`;
        }
      });
      content += `</div>\n`;
    }

    return content;
  }

  // Export functions
  async exportPromptLibrary() {
    const captures = await this.getAllCaptures();
    const prompts = captures.filter((c) => c.type === "prompt");
    this.generateAtlasExport(prompts, "Atlas Prompt Library", "atlas-prompt-library");
  }

  async exportCourseNotes() {
    const captures = await this.getAllCaptures();
    const notes = captures.filter((c) => c.type !== "prompt");
    this.generateAtlasExport(notes, "Atlas Course Notes", "atlas-course-notes");
  }

  async exportAsJSON() {
    const captures = await this.getAllCaptures();
    const metadata = await this.getMetadata();
    const exportData = {
      atlasVersion: "1.0",
      courseName: this.courseName,
      courseId: this.courseId,
      institution: "ALX",
      branding: {
        header: "https://raw.githubusercontent.com/Explore-AI/Pictures/master/alx-courses/aice/assets/Content_page_banner_blue_dots.png",
        footer: "https://raw.githubusercontent.com/Explore-AI/Pictures/refs/heads/master/ALX_banners/ALX_Navy.png",
      },
      captures,
      metadata,
      exportDate: new Date().toISOString(),
      exportedBy: "Atlas Learning Portfolio System",
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    this.downloadFile(blob, `atlas-export-${this.courseId}.json`);
  }

  async exportAsMarkdown() {
    const captures = await this.getAllCaptures();
    let markdown = `# Atlas Export - ${this.courseName}\n\n`;
    markdown += `![ALX Content Header](https://raw.githubusercontent.com/Explore-AI/Pictures/master/alx-courses/aice/assets/Content_page_banner_blue_dots.png)\n\n`;
    markdown += `*Exported on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}*\n\n`;
    markdown += `---\n\n`;

    const grouped = this.groupByModule(captures);

    for (const [module, items] of Object.entries(grouped)) {
      markdown += `## ${module}\n\n`;
      items.forEach((item) => {
        markdown += `### ${item.title}\n\n`;

        if (item.inputs) {
          markdown += `*Parameters:*\n`;
          Object.entries(item.inputs).forEach(([key, value]) => {
            if (key !== "generated" && key !== "main-content" && value) {
              markdown += `- ${key}: ${value}\n`;
            }
          });
          markdown += "\n";
        }
      });
    }

    markdown += `\n---\n\n`;
    markdown += `<div align="center">\n\n`;
    markdown += `![ALX](https://raw.githubusercontent.com/Explore-AI/Pictures/refs/heads/master/ALX_banners/ALX_Navy.png)\n\n`;
    markdown += `© ${new Date().getFullYear()} ALX - Powered by Atlas Learning Portfolio System\n\n`;
    markdown += `</div>`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    this.downloadFile(blob, `atlas-export-${this.courseId}.md`);
  }

  async exportAsCSV() {
    const captures = await this.getAllCaptures();
    let csv = `"Atlas Export - ${this.courseName}"\n`;
    csv += `"Exported on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}"\n`;
    csv += `"© ${new Date().getFullYear()} ALX - Powered by Atlas"\n\n`;
    csv += "ID,Type,Title,Module,Lesson,Section,Content,Timestamp\n";

    captures.forEach((item) => {
      let content = "";
      if (item.inputs && item.inputs["main-content"]) {
        content = item.inputs["main-content"];
      } else if (item.inputs) {
        content = Object.entries(item.inputs)
          .filter(([k, v]) => v && k !== "generated")
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ");
      }

      content = content.replace(/"/g, '""');
      csv += `"${item.id}","${item.type}","${item.title}","${item.module}","${item.lesson}","${item.section}","${content}","${item.timestamp}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    this.downloadFile(blob, `atlas-export-${this.courseId}.csv`);
  }

  // Import from JSON
  async importFromJSON() {
    const fileInput = document.getElementById("atlasImportFile");
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);

        if (data.captures) {
          for (const capture of data.captures) {
            await this.saveToAtlasDB(capture);
          }
        }

        if (data.metadata) {
          for (const meta of data.metadata) {
            await this.saveMetadata(meta.key, meta.value);
          }
        }

        alert("ALX Atlas import successful! Page will reload to show imported data.");
        window.location.reload();
      } catch (error) {
        alert("ALX Atlas import failed: " + error.message);
      }
    };
    fileInput.click();
  }

  // Generate Atlas HTML export
  generateAtlasExport(items, title, filename) {
    const grouped = this.groupByModule(items);

    let html = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <title>${title} - Atlas Export</title>
                        <style>
                            body {
                                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 900px;
                                margin: 0 auto;
                                padding: 20px;
                            }
                            .atlas-brand-header {
                                width: 100%;
                                margin-bottom: 30px;
                            }
                            .atlas-brand-header img {
                                width: 100%;
                                height: auto;
                                display: block;
                            }
                            .atlas-brand-footer {
                                text-align: center;
                                margin-top: 50px;
                                padding-top: 30px;
                                border-top: 1px solid #e0e0e0;
                            }
                            .atlas-brand-footer img {
                                width: 200px;
                                height: auto;
                            }
                            .atlas-toc {
                                background: #f5f5f5;
                                padding: 20px;
                                border-radius: 8px;
                                margin: 20px 0;
                            }
                            .atlas-toc a {
                                color: #3498db;
                                text-decoration: none;
                            }
                            .atlas-section {
                                margin: 30px 0;
                                padding: 20px;
                                background: white;
                                border: 1px solid #e0e0e0;
                                border-radius: 8px;
                            }
                            .atlas-module-header {
                                color: #2c3e50;
                                border-bottom: 2px solid #3498db;
                                padding-bottom: 10px;
                            }
                            .atlas-item {
                                margin: 20px 0;
                                padding: 15px;
                                background: #f9f9f9;
                                border-left: 4px solid #3498db;
                            }
                            .generated-content {
                                padding: 10px;
                                background: #e3f2fd;
                                border-radius: 4px;
                                margin: 10px 0;
                            }
                            .parameters {
                                font-size: 0.9em;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body>
                `;

    // Add ALX branding header
    html += `
                    <div class="atlas-brand-header">
                        <img src="https://raw.githubusercontent.com/Explore-AI/Pictures/master/alx-courses/aice/assets/Content_page_banner_blue_dots.png" alt="ALX Content Header" />
                    </div>
                `;

    html += `<h1>${title}</h1>`;
    html += `<p><strong>Course:</strong> ${this.courseName} | <strong>Exported:</strong> ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })}</p>`;

    // Table of contents
    html += '<div class="atlas-toc"><h2>Table of Contents</h2><ul>';
    Object.keys(grouped).forEach((module, i) => {
      html += `<li><a href="#module-${i}">${module}</a></li>`;
    });
    html += "</ul></div>";

    // Content
    Object.entries(grouped).forEach(([module, moduleItems], i) => {
      html += `<div class="atlas-section" id="module-${i}">`;
      html += `<h2 class="atlas-module-header">${module}</h2>`;

      moduleItems.forEach((item) => {
        html += '<div class="atlas-item">';
        html += this.buildExportContent(item);
        html += "</div>";
      });

      html += "</div>";
    });

    // Add ALX branding footer
    html += `
                    <div class="atlas-brand-footer">
                        <img src="https://raw.githubusercontent.com/Explore-AI/Pictures/refs/heads/master/ALX_banners/ALX_Navy.png" alt="ALX" style="width:200px" />
                        <p style="font-size: 80%; color: #666; margin-top: 10px;">
                            © ${new Date().getFullYear()} ALX - Powered by Atlas Learning Portfolio System
                        </p>
                    </div>
                `;

    html += "</body></html>";

    const blob = new Blob([html], { type: "text/html" });
    this.downloadFile(blob, `${filename}.html`);
  }

  // Helper functions
  groupByModule(items) {
    const grouped = {};
    items.forEach((item) => {
      const key = `Module ${item.module} - Lesson ${item.lesson}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return grouped;
  }

  async getMetadata() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["atlas_metadata"], "readonly");
      const store = transaction.objectStore("atlas_metadata");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Show Content Table - Display all saved content in collapsible tree
  async showContentTable() {
    const listDiv = document.getElementById("atlasContentList");
    listDiv.innerHTML = '<div style="text-align: center; padding: 20px;">🔄 Loading Atlas content library...</div>';

    try {
      // Get all Atlas databases
      const allDatabases = await this.getAllAtlasDatabases();

      if (allDatabases.length === 0) {
        listDiv.innerHTML = '<div class="atlas-no-content">No Atlas content found. Start capturing content to see it here!</div>';
        return;
      }

      let html = '<div class="atlas-content-table">';
      let totalItems = 0;
      let totalPrompts = 0;
      let totalNotes = 0;
      let totalWorksheets = 0;
      let courseCount = 0;
      let courseId = 0;
      for (const dbInfo of allDatabases) {
        const captures = await this.getCapturesFromDatabase(dbInfo.name);
        if (captures.length > 0) {
          courseCount++;
          totalItems += captures.length;
          // Count types
          captures.forEach((item) => {
            if (item.type === "prompt") {
              totalPrompts++;
            } else if (item.type === "worksheet") {
              totalWorksheets++;
            } else if (item.type === "quadrant") {
              // Don't count quadrants in notes
            } else {
              totalNotes++;
            }
          });
          const courseName = dbInfo.courseName || dbInfo.name.replace("Atlas_", "");
          const isCurrent = dbInfo.name === this.dbName;
          // Course header (collapsible)
          html += `<div class="atlas-content-course">
                                <div class="atlas-content-course-header" onclick="atlasSystem.toggleCourse('course-${courseId}')">
                                    <span>
                                        <span class="atlas-collapsible-icon" id="icon-course-${courseId}">▶</span>
                                        📚 ${courseName} ${isCurrent ? '<span style="color: #3498db;">(Current)</span>' : ""}
                                    </span>
                                    <span class="atlas-content-count">${captures.length} item${captures.length !== 1 ? "s" : ""}</span>
                                </div>`;
          // Course content (modules)
          html += `<div class="atlas-content-modules" id="course-${courseId}">`;
          // Group by module
          const grouped = this.groupByModule(captures);
          // Sort modules
          const sortedModules = Object.entries(grouped).sort((a, b) => {
            const aNum = parseInt(a[0].match(/\d+/)?.[0] || 0);
            const bNum = parseInt(b[0].match(/\d+/)?.[0] || 0);
            return aNum - bNum;
          });
          let moduleId = 0;
          for (const [module, items] of sortedModules) {
            const moduleKey = `course-${courseId}-module-${moduleId}`;
            // Module header (collapsible)
            html += `<div class="atlas-module-header" onclick="atlasSystem.toggleModule('${moduleKey}')">
                                    <span class="atlas-collapsible-icon" id="icon-${moduleKey}">▶</span>
                                    📂 ${module}
                                    <span style="font-size: 11px; color: #95a5a6;">(${items.length})</span>
                                </div>`;
            // Module items
            html += `<div class="atlas-module-items" id="${moduleKey}">`;
            // Sort items by timestamp (most recent first)
            items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            items.forEach((item, itemIndex) => {
              const itemKey = `${moduleKey}-item-${itemIndex}`;
              const date = new Date(item.timestamp);
              const dateStr = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              // Get content preview
              let preview = "";
              // === WORKSHEET 1 PREVIEW MECHANISM (shows in sidebar) ===
              if (item.type === "worksheet") {
                if (item.inputs) {
                  // Show ALL data immediately when expanded - NO LIMITS
                  for (const k in item.inputs) {
                    const v = item.inputs[k];
                    if (typeof v === "string" && v.trim()) {
                      // Show ALL data immediately when expanded - NO LIMITS
                      const labelText = this.getLabelTextFromHTML(item, k);
                      preview += `<div><b>${labelText}</b>: ${v.length > 45 ? v.slice(0, 45) + "..." : v}</div>`;
                    }
                  }
                  if (!preview) preview = "<i>(no content yet)</i>";
                } else {
                  preview = "<i>(no content yet)</i>";
                }
              } else if (item.type === "quadrant" && item.inputs) {
                // Show quadrant data summary
                let taskCount = 0;
                for (const k in item.inputs) {
                  if (item.inputs[k]) {
                    const tasks = item.inputs[k].split("\n").filter((t) => t.trim());
                    taskCount += tasks.length;
                  }
                }
                preview = `<div style="font-size: 12px; color: #3498db; font-weight: 600;">📊 ${taskCount} task${
                  taskCount !== 1 ? "s" : ""
                } across 4 quadrants</div>`;
              } else if (item.type === "checklist" && item.checkboxData) {
                const completed = Object.values(item.checkboxData).filter((d) => d.checked).length;
                const total = Object.keys(item.checkboxData).length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                preview = `<div style="font-size: 12px; color: #27ae60; font-weight: 600; margin-top: 5px;">✓ ${completed}/${total} completed (${percentage}%)</div>`;
                preview += `<div style="margin-top: 8px; font-size: 11px;">`;
                Object.entries(item.checkboxData).forEach(([id, data]) => {
                  const icon = data.checked ? "✅" : "⬜";
                  preview += `<div style="margin: 3px 0;">${icon} ${data.label}</div>`;
                });
                preview += `</div>`;
              } else if (item.inputs && item.inputs["main-content"]) {
                preview = item.inputs["main-content"].substring(0, 100);
                if (item.inputs["main-content"].length > 100) preview += "...";
              }
              html += `<div class="atlas-content-item" onclick="atlasSystem.toggleItem('${itemKey}')" data-item-data='${JSON.stringify(item)}'>
                                        <div class="atlas-content-item-header">
                                            <span class="atlas-collapsible-icon" id="icon-${itemKey}">▶</span>
                                            <div class="atlas-content-item-title">
                                                ${item.title}
                                                <span class="atlas-content-type ${item.type}">${
                item.type === "prompt"
                  ? "💡 Prompt"
                  : item.type === "checklist"
                  ? "☑️ Checklist"
                  : item.type === "worksheet"
                  ? "📋 Worksheet"
                  : item.type === "quadrant"
                  ? "📊 Quadrant Map"
                  : "📝 Notes"
              }</span>
                                            </div>
                                        </div>
                                        <div class="atlas-content-item-details" id="${itemKey}">
                                            <div class="atlas-content-item-meta">
                                                <span>📍 Lesson ${item.lesson}, Section ${item.section}</span>
                                                <span>📅 ${dateStr}</span>
                                            </div>
                                            ${preview ? `<div class="atlas-content-preview">${preview}</div>` : ""}
                                        </div>
                                    </div>`;
            });
            html += "</div>"; // Close module items
            moduleId++;
          }
          html += "</div>"; // Close course modules
          html += "</div>"; // Close course
          courseId++;
        }
      }
      // Add summary at top
      if (totalItems > 0) {
        html =
          `<div style="padding: 10px; background: #e8f4fd; border-radius: 6px; margin-bottom: 15px;"><div style="font-weight: 600; margin-bottom: 5px;">📈 Atlas Library Summary</div><div style="font-size: 13px; line-height: 1.6;"><strong>${totalItems}</strong> total items across <strong>${courseCount}</strong> course${
            courseCount !== 1 ? "s" : ""
          }<br>💡 ${totalPrompts} Prompt${totalPrompts !== 1 ? "s" : ""} • 📋 ${totalWorksheets} Worksheet${
            totalWorksheets !== 1 ? "s" : ""
          } • 📝 ${totalNotes} Note${totalNotes !== 1 ? "s" : ""}</div></div>` + html;
      } else {
        html = '<div class="atlas-no-content">No content saved yet. Start adding notes and prompts to see them here!</div>';
      }
      html += "</div>";
      // Add refresh button at bottom
      html += `<div style="text-align: center; margin-top: 10px;">
                                <button onclick="atlasSystem.showContentTable()" style="padding: 5px 15px; background: #ecf0f1; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                                    🔄 Refresh Library
                                </button>
                             </div>`;
      listDiv.innerHTML = html;

      // Note: Delete button event delegation is now handled by the consolidated setup in enhanceAtlasSystem()
    } catch (error) {
      console.error("Error loading Atlas content:", error, error && error.stack);
      listDiv.innerHTML = `<div class="atlas-no-content">
                    ⚠️ Error loading content.<br><pre style="font-size:11px;white-space:pre-line;max-height:120px;overflow:auto">${
                      error && error.stack ? error.stack : error && error.message ? error.message : error
                    }</pre><br>Please try again.
                    <br><button onclick="atlasSystem.showContentTable()" style="margin-top: 10px; padding: 5px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button></div>`;
    }
  }
  // Toggle course visibility
  toggleCourse(courseId) {
    const element = document.getElementById(courseId);
    const icon = document.getElementById("icon-" + courseId);
    if (element.classList.contains("expanded")) {
      element.classList.remove("expanded");
      icon.classList.remove("expanded");
      icon.textContent = "▶";
    } else {
      element.classList.add("expanded");
      icon.classList.add("expanded");
      icon.textContent = "▼";
    }
  }
  // Toggle module visibility
  toggleModule(moduleId) {
    const element = document.getElementById(moduleId);
    const icon = document.getElementById("icon-" + moduleId);
    if (element.classList.contains("expanded")) {
      element.classList.remove("expanded");
      icon.classList.remove("expanded");
      icon.textContent = "▶";
    } else {
      element.classList.add("expanded");
      icon.classList.add("expanded");
      icon.textContent = "▼";
    }
    event.stopPropagation();
  }
  // Toggle item details
  async toggleItem(itemId) {
    const detailsEl = document.getElementById(itemId);
    if (!detailsEl) return;
    const itemEl = detailsEl.closest(".atlas-content-item");
    const icon = document.getElementById("icon-" + itemId);

    if (detailsEl.classList.contains("expanded")) {
      detailsEl.classList.remove("expanded");
      if (icon) {
        icon.classList.remove("expanded");
        icon.textContent = "▶";
      }
    } else {
      detailsEl.classList.add("expanded");
      if (icon) {
        icon.classList.add("expanded");
        icon.textContent = "▼";
      }

      // Load full worksheet or quadrant content once
      if (itemEl && !detailsEl.querySelector(".atlas-worksheet-full-content") && !detailsEl.querySelector(".atlas-quadrant-full-content")) {
        const dataStr = itemEl.getAttribute("data-item-data");
        if (dataStr) {
          try {
            const data = JSON.parse(dataStr);
            if (data && data.type === "worksheet") {
              await this.loadFullWorksheetContent(itemId, detailsEl);
            } else if (data && data.type === "quadrant") {
              await this.loadFullQuadrantContent(itemId, detailsEl);
            }
          } catch (_) {
            // ignore malformed data
          }
        }
      }
    }
    event.stopPropagation();
  }

  // Load and display full worksheet content - WORKS FOR ALL WORKSHEETS
  async loadFullWorksheetContent(itemId, detailsDiv) {
    try {
      // Get the item data from the data attribute
      const itemElement = document.getElementById(itemId).closest(".atlas-content-item");
      const itemDataStr = itemElement ? itemElement.getAttribute("data-item-data") : null;
      let targetItem = itemDataStr ? JSON.parse(itemDataStr) : null;

      // Get fresh data from DB if available
      if (targetItem && targetItem.id) {
        const fresh = await this.findCaptureById(targetItem.id);
        if (fresh) {
          targetItem = fresh;
        }
      }

      if (targetItem && targetItem.type === "worksheet") {
        const fullContent = this.generateWorksheetHTML(targetItem);

        // Replace the preview div with full content
        const previewDiv = detailsDiv.querySelector(".atlas-content-preview");
        if (previewDiv) {
          previewDiv.outerHTML = `<div class="atlas-worksheet-full-content">${fullContent}</div>`;
        } else {
          const metaDiv = detailsDiv.querySelector(".atlas-content-item-meta");
          if (metaDiv) {
            metaDiv.insertAdjacentHTML("afterend", `<div class="atlas-worksheet-full-content">${fullContent}</div>`);
          }
        }
      }
    } catch (error) {
      console.error("Error loading full worksheet content:", error);
    }
  }

  // Generate HTML for worksheet content - WORKS FOR ALL WORKSHEETS
  generateWorksheetHTML(item) {
    let html = '<div class="atlas-worksheet-content">';

    // Show all inputs as simple key:value pairs - WORKS FOR ALL WORKSHEETS
    if (item.inputs && Object.keys(item.inputs).length > 0) {
      html += '<div class="atlas-worksheet-section">';
      html += "<h4>📝 Worksheet Data</h4>";
      html += '<div class="atlas-worksheet-keyvalue">';

      // Sort inputs for consistent display
      let sortedInputs;
      if (item.fieldOrder && Array.isArray(item.fieldOrder)) {
        // Sort by field order from saved metadata
        sortedInputs = item.fieldOrder.map((key) => [key, item.inputs[key]]).filter(([key, value]) => value !== undefined);
      } else {
        // Fallback to alphabetical for legacy data
        sortedInputs = Object.entries(item.inputs).sort((a, b) => a[0].localeCompare(b[0]));
      }

      sortedInputs.forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          // Get the actual label text from the HTML structure
          let cleanKey = this.getLabelTextFromHTML(item, key);

          html += `<div class="atlas-worksheet-pair">`;
          html += `<span class="atlas-worksheet-key">${cleanKey}:</span> `;
          html += `<span class="atlas-worksheet-value">${value}</span>`;
          html += `</div>`;
        }
      });

      html += "</div>";
      html += "</div>";
    }

    html += "</div>";
    return html;
  }

  // Get label text from HTML structure for a given input key
  getLabelTextFromHTML(item, inputKey) {
    if (!item.htmlStructure) {
      // Fallback to cleaned key if no HTML structure available
      return inputKey.replace(/[_-]/g, " ");
    }

    try {
      // Create a temporary DOM element to parse the HTML structure
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = item.htmlStructure;

      // Find the input element with the matching data-atlas-input attribute
      const inputElement = tempDiv.querySelector(`[data-atlas-input="${inputKey}"]`);
      if (!inputElement) {
        return inputKey.replace(/[_-]/g, " ");
      }

      // Try different methods to find the label text
      let labelText = null;

      // Method 1: Look for a label with 'for' attribute pointing to this input's id
      if (inputElement.id) {
        const label = tempDiv.querySelector(`label[for="${inputElement.id}"]`);
        if (label) {
          labelText = label.textContent.trim();
        }
      }

      // Method 2: Look for a parent fieldset with legend (for radio buttons)
      if (!labelText) {
        const fieldset = inputElement.closest("fieldset");
        if (fieldset) {
          const legend = fieldset.querySelector("legend");
          if (legend) {
            labelText = legend.textContent.trim();
          }
        }
      }

      // Method 3: Look for a parent label element (for wrapped inputs)
      if (!labelText) {
        const parentLabel = inputElement.closest("label");
        if (parentLabel) {
          labelText = parentLabel.textContent.trim();
        }
      }

      // Method 4: Look for a previous sibling label
      if (!labelText) {
        let prevSibling = inputElement.previousElementSibling;
        while (prevSibling) {
          if (prevSibling.tagName === "LABEL") {
            labelText = prevSibling.textContent.trim();
            break;
          }
          prevSibling = prevSibling.previousElementSibling;
        }
      }

      // Method 5: Look for a next sibling label
      if (!labelText) {
        let nextSibling = inputElement.nextElementSibling;
        while (nextSibling) {
          if (nextSibling.tagName === "LABEL") {
            labelText = nextSibling.textContent.trim();
            break;
          }
          nextSibling = nextSibling.nextElementSibling;
        }
      }

      // Return the found label text or fallback to cleaned key
      return labelText || inputKey.replace(/[_-]/g, " ");
    } catch (error) {
      console.warn(`Error parsing HTML structure for input ${inputKey}:`, error);
      return inputKey.replace(/[_-]/g, " ");
    }
  }

  // Load and display full quadrant content
  async loadFullQuadrantContent(itemId, detailsDiv) {
    try {
      console.log("Loading full quadrant content for:", itemId);

      // Get the item data from the data attribute (may be stale)
      const itemElement = document.getElementById(itemId).closest(".atlas-content-item");
      const itemDataStr = itemElement ? itemElement.getAttribute("data-item-data") : null;
      let targetItem = itemDataStr ? JSON.parse(itemDataStr) : null;

      // Prefer fresh capture from DB using the ID, if available
      if (targetItem && targetItem.id) {
        const fresh = await this.findCaptureById(targetItem.id);
        if (fresh) {
          targetItem = fresh;
        }
      }

      if (targetItem && targetItem.type === "quadrant") {
        const fullContent = this.generateFullQuadrantHTML(targetItem);

        // Replace the preview div with full content
        const previewDiv = detailsDiv.querySelector(".atlas-content-preview");
        if (previewDiv) {
          previewDiv.outerHTML = `<div class="atlas-quadrant-full-content">${fullContent}</div>`;
        } else {
          // If no preview div, add the full content after the meta div
          const metaDiv = detailsDiv.querySelector(".atlas-content-item-meta");
          if (metaDiv) {
            metaDiv.insertAdjacentHTML("afterend", `<div class="atlas-quadrant-full-content">${fullContent}</div>`);
          }
        }
      }
    } catch (error) {
      console.error("Error loading full quadrant content:", error);
    }
  }

  // Generate full HTML for quadrant content
  generateFullQuadrantHTML(item) {
    let html = '<div class="atlas-quadrant-content">';

    if (item.inputs && Object.keys(item.inputs).length > 0) {
      html += '<div class="atlas-quadrant-section">';
      html += "<h4>📊 Quadrant Map Data</h4>";
      html += '<div class="atlas-quadrant-keyvalue">';

      // Sort by quadrant name for consistent display
      const sortedQuadrants = Object.entries(item.inputs).sort((a, b) => a[0].localeCompare(b[0]));

      sortedQuadrants.forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          const cleanKey = key.replace(/^quadrant-/i, "Quadrant ").replace(/-/g, " ");
          const tasks = value.split("\n").filter((t) => t.trim());

          html += `<div class="atlas-quadrant-item">`;
          html += `<div class="atlas-quadrant-key">${cleanKey}:</div>`;
          html += `<div class="atlas-quadrant-tasks">`;

          if (tasks.length > 0) {
            tasks.forEach((task) => {
              html += `<div class="atlas-quadrant-task-display">• ${task}</div>`;
            });
          } else {
            html += `<div class="atlas-quadrant-task-display" style="color:#999;font-style:italic;">No tasks</div>`;
          }

          html += `</div>`;
          html += `</div>`;
        }
      });

      html += "</div>";
      html += "</div>";
    } else {
      html += "<i>(no quadrant data saved yet)</i>";
    }

    html += "</div>";
    return html;
  }

  // Get all Atlas databases
  async getAllAtlasDatabases() {
    // Check if databases() is available (Chrome 71+, Edge 79+, Opera 58+)
    if (indexedDB.databases) {
      try {
        const databases = await indexedDB.databases();
        const atlasDatabases = databases
          .filter((db) => db.name && db.name.startsWith("Atlas_"))
          .map((db) => ({
            name: db.name,
            courseName: db.name
              .replace("Atlas_", "")
              .replace(/-/g, " ")
              .replace(/_/g, " ")
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          }));
        return atlasDatabases;
      } catch (error) {
        console.log("Using fallback method to find databases");
      }
    }
    // Fallback: At least return the current database
    // In browsers without databases(), we can only access the current course
    return [
      {
        name: this.dbName,
        courseName: this.courseName,
      },
    ];
  }
  // Get captures from a specific database
  async getCapturesFromDatabase(dbName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName);
      request.onsuccess = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("atlas_captures")) {
          // ===== Patch: Heal DB if captures store missing =====
          db.close();
          // Delete and re-create DB
          const deleteRequest = indexedDB.deleteDatabase(dbName);
          deleteRequest.onsuccess = () => {
            // On deletion, try opening again (will create new)
            const newRequest = indexedDB.open(dbName, 2);
            newRequest.onupgradeneeded = (event) => {
              const db = event.target.result;
              if (!db.objectStoreNames.contains("atlas_captures")) {
                db.createObjectStore("atlas_captures", { keyPath: "id" });
              }
            };
            newRequest.onsuccess = () => {
              newRequest.result.close();
              resolve([]); // Return empty but DB now healed
            };
            newRequest.onerror = () => {
              reject(newRequest.error);
            };
          };
          deleteRequest.onerror = () => reject(deleteRequest.error);
          return;
        }
        const transaction = db.transaction(["atlas_captures"], "readonly");
        const store = transaction.objectStore("atlas_captures");
        const getAllRequest = store.getAll();
        getAllRequest.onsuccess = () => {
          db.close();
          resolve(getAllRequest.result || []);
        };
        getAllRequest.onerror = () => {
          db.close();
          reject(getAllRequest.error);
        };
      };
      request.onerror = () => reject(request.error);
    });
  }
  // Export Panel Controls
  toggleExportPanel() {
    const panel = document.querySelector(".atlas-export-panel");
    const overlay = document.querySelector(".atlas-export-panel-overlay");
    if (panel.classList.contains("active")) {
      this.closeExportPanel();
    } else {
      panel.classList.add("active");
      overlay.classList.add("active");
      // Load content library automatically when panel opens
      this.showContentTable();
    }
  }
  closeExportPanel() {
    const panel = document.querySelector(".atlas-export-panel");
    const overlay = document.querySelector(".atlas-export-panel-overlay");
    panel.classList.remove("active");
    overlay.classList.remove("active");
  }
  downloadFile(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }
  // Helper: find a capture by ID across all Atlas databases
  async findCaptureById(captureId) {
    try {
      const allDatabases = await this.getAllAtlasDatabases();
      for (const dbInfo of allDatabases) {
        const captures = await this.getCapturesFromDatabase(dbInfo.name);
        const found = captures.find((c) => c.id === captureId);
        if (found) return found;
      }
    } catch (_) {
      // ignore lookup errors
    }
    return null;
  }

  // ========== EXPORT MODAL (POPUP) ========== //
  showExportConfirm(exportType, exportFn) {
    // Remove existing if present
    const old = document.getElementById("atlasExportConfirm");
    if (old) old.remove();
    // Modal HTML
    const msg =
      {
        prompts: "Export the entire Prompt Library as CSV?",
        notes: "Export Course Notes as CSV?",
        json: "Export ALL Atlas content for this course as JSON?",
        markdown: "Export ALL Atlas content for this course as Markdown?",
        csv: "Export ALL Atlas content for this course as CSV?",
      }[exportType] || "Export data?";
    const modal = document.createElement("div");
    modal.id = "atlasExportConfirm";
    modal.className = "atlas-clear-confirm";
    modal.style.zIndex = 10010;
    modal.innerHTML = `
      <h3>Export Data?</h3>
      <div style="margin: 12px 0 20px 0; font-size:15px;">${msg}<br><small style='color:#666'>A download will begin on confirmation</small></div>
      <div class="atlas-clear-confirm-buttons">
        <button class="confirm">Export</button>
        <button class="cancel">Cancel</button>
      </div>
      <div class="atlas-clear-status" style="margin-top:10px;font-size:13px;min-height:18px;"></div>
    `;
    document.body.appendChild(modal);
    const ok = modal.querySelector(".confirm");
    const cancel = modal.querySelector(".cancel");
    const status = modal.querySelector(".atlas-clear-status");
    ok.onclick = async () => {
      ok.disabled = cancel.disabled = true;
      status.textContent = "Preparing file...";
      try {
        await exportFn();
        status.textContent = "Download started!";
        setTimeout(() => {
          if (modal.parentNode) {
            modal.remove();
          }
        }, 1500);
      } catch (err) {
        status.textContent = "Export failed: " + String(err.message || err);
        ok.disabled = cancel.disabled = false;
      }
    };
    cancel.onclick = () => modal.remove();
  }

  // Patch export trigger methods to always require confirmation modal
  async confirmExportPromptLibrary() {
    this.showExportConfirm("prompts", () => this.exportPromptLibrary());
  }
  async confirmExportCourseNotes() {
    this.showExportConfirm("notes", () => this.exportCourseNotes());
  }
  async confirmExportAsJSON() {
    this.showExportConfirm("json", () => this.exportAsJSON());
  }

  async openExportSelectionModal() {
    const old = document.getElementById("atlasExportSelectModal");
    if (old) old.remove();

    const allCaptures = await this.getAllCaptures();
    const sorted = [...allCaptures].sort((a, b) => {
      if (a.module !== b.module) return (a.module || "").localeCompare(b.module || "");
      if (a.lesson !== b.lesson) return (a.lesson || "").localeCompare(b.lesson || "");
      return (a.title || "").localeCompare(b.title || "");
    });

    const label = (cap) =>
      `<b>${cap.title || "(Untitled)"}</b><br><small style='color:#666'>Module ${cap.module || "-"}, Lesson ${cap.lesson || "-"}, Section ${
        cap.section || "-"
      }</small>`;

    // Build modal structure
    const modal = document.createElement("div");
    modal.id = "atlasExportSelectModal";
    modal.className = "atlas-clear-confirm";
    modal.innerHTML = `
      <h3>Select Items to Export</h3>
      <div style="max-height:200px; overflow-y:auto; background:#f8f9fa; border-radius:6px; border: 1px solid #E5E5E5; margin: 10px 0 16px 0; padding: 8px 8px 6px 8px;">
        <label style="font-weight:600;color:#307AD1;"><input type="checkbox" id="exportSelectAll" checked style="margin-right:5px;">Select all</label>
        <div id="atlasExportChkList" style="margin-top:5px;"></div>
      </div>
      <div style="margin-bottom: 14px; color: #ED4337; display:none;" id="atlasExportNoneWarn">Please select at least one item to export.</div>
      <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
        <button class="confirm" id="atlasExportMdBtn" style="min-width:120px;">Markdown (Notion)</button>
        <button class="confirm" id="atlasExportHtmlBtn" style="min-width:85px;">HTML</button>
        <button class="confirm secondary" id="atlasExportCsvBtn" style="min-width:70px;">CSV</button>
        <button class="confirm secondary" id="atlasExportJsonBtn" style="min-width:70px;">JSON</button>
        <button class="cancel">Cancel</button>
      </div>
      <div class="atlas-clear-status" style="margin-top:10px;font-size:13px;min-height:18px;"></div>
    `;
    document.body.appendChild(modal);
    const chkList = modal.querySelector("#atlasExportChkList");
    sorted.forEach((c, i) => {
      const box = document.createElement("label");
      box.style.display = "block";
      box.style.fontWeight = 400;
      box.style.marginBottom = "7px";
      box.innerHTML = `<input type='checkbox' class='atlasExportItemChk' value='${c.id}' checked style='margin-right:8px;'>${label(c)}`;
      chkList.appendChild(box);
    });
    // Select all logic
    const allBox = modal.querySelector("#exportSelectAll");
    allBox.onchange = () => {
      const v = allBox.checked;
      modal.querySelectorAll(".atlasExportItemChk").forEach((chk) => {
        chk.checked = v;
      });
      modal.querySelector("#atlasExportNoneWarn").style.display = "none";
    };
    chkList.onchange = () => {
      const chks = modal.querySelectorAll(".atlasExportItemChk");
      const anyChecked = Array.from(chks).some((x) => x.checked);
      allBox.checked = Array.from(chks).every((x) => x.checked);
      modal.querySelector("#atlasExportNoneWarn").style.display = anyChecked ? "none" : "block";
      toggleExportBtns(anyChecked);
    };
    function toggleExportBtns(ok) {
      ["atlasExportMdBtn", "atlasExportHtmlBtn", "atlasExportCsvBtn", "atlasExportJsonBtn"].forEach((id) => {
        const b = modal.querySelector("#" + id);
        if (b) {
          b.disabled = !ok;
        }
      });
    }
    toggleExportBtns(true);
    // On cancel
    modal.querySelector(".cancel").onclick = () => modal.remove();
    // Export handler factory
    function confirmDo(type, fn) {
      return async () => {
        const sel = Array.from(modal.querySelectorAll(".atlasExportItemChk:checked")).map((x) => x.value);
        if (!sel.length) {
          modal.querySelector("#atlasExportNoneWarn").style.display = "block";
          return;
        }
        // Confirm again
        modal.innerHTML = `<h3>Export as ${type}?</h3><div style='margin:12px 0 18px 0;font-size:15px;'>${sel.length} item(s) will be downloaded as ${type}.</div><div class='atlas-clear-confirm-buttons'><button class='confirm'>Export</button><button class='cancel'>Cancel</button></div><div class='atlas-clear-status' style='margin-top:10px;font-size:13px;min-height:18px;'></div>`;
        modal.querySelector(".cancel").onclick = () => modal.remove();
        const go = modal.querySelector(".confirm");
        const status = modal.querySelector(".atlas-clear-status");
        go.onclick = async () => {
          go.disabled = true;
          status.textContent = "Preparing file...";
          try {
            await fn(sel, status);
            status.textContent = "Download started!";
            setTimeout(() => {
              if (modal.parentNode) modal.remove();
            }, 1200);
          } catch (e) {
            status.textContent = "Export failed: " + (e.message || e);
            go.disabled = false;
          }
        };
      };
    }
    // THE EXPORT BUTTONS
    modal.querySelector("#atlasExportMdBtn").onclick = confirmDo("Markdown", async (ids) => {
      const items = sorted.filter((x) => ids.includes(x.id));
      let md = "# Atlas Export — " + this.courseName + "\n\n";
      items.forEach((item, i) => {
        md +=
          "---\n## " +
          (item.title || "Untitled") +
          "\n*Module " +
          (item.module || "") +
          " — Lesson " +
          (item.lesson || "") +
          " — Section " +
          (item.section || "") +
          "*\nCreated: " +
          (item.timestamp || "").replace(/T.*/, "") +
          "\n";
        md += "\n";
        if (item.type === "prompt") md += "**Prompt:**\n\n" + (item.inputs["main-content"] || "") + "\n";
        else if (item.type === "worksheet") {
          for (const k in item.inputs)
            md +=
              "- **" +
              k
                .replace(/[_-]/g, " ")
                .replace(/^ws\\d+/, "")
                .trim() +
              ":** " +
              item.inputs[k] +
              "\n";
        }
        if (item.checkboxData && Object.keys(item.checkboxData).length) {
          for (const k in item.checkboxData) {
            md += "- [" + (item.checkboxData[k].checked ? "x" : " ") + "] " + item.checkboxData[k].label + "\n";
          }
        }
        md += "\n";
      });
      const blob = new Blob([md], { type: "text/markdown" });
      this.downloadFile(blob, `atlas-export-${this.courseId}.md`);
    });
    modal.querySelector("#atlasExportHtmlBtn").onclick = confirmDo("HTML", async (ids) => {
      const items = sorted.filter((x) => ids.includes(x.id));
      let html =
        "<html><head><meta charset='utf-8'><title>Atlas Export – " +
        this.courseName +
        "</title>" +
        "<style>body{font-family:sans-serif;background:#f4f6fa;color:#213;padding:2em;}h1{color:#307AD1;}h2{margin-top:1em;}</style></head><body>" +
        "<h1>Atlas Export — " +
        this.courseName +
        "</h1>";
      items.forEach((item, i) => {
        html +=
          "<hr><h2>" +
          (item.title || "Untitled") +
          "</h2><div style='color:#307AD1'>Module " +
          (item.module || "") +
          " — Lesson " +
          (item.lesson || "") +
          " — Section " +
          (item.section || "") +
          "</div><small>" +
          (item.timestamp || "").replace(/T.*/, "") +
          "</small><pre style='background:#f8f9fa;border:1px solid #eee;padding:1em;'>";
        if (item.type === "prompt") html += "Prompt:\n\n" + (item.inputs["main-content"] || "") + "\n";
        else if (item.type === "worksheet") {
          for (const k in item.inputs)
            html +=
              "- <b>" +
              k
                .replace(/[_-]/g, " ")
                .replace(/^ws\\d+/, "")
                .trim() +
              ":</b> " +
              item.inputs[k] +
              "<br>";
        }
        if (item.checkboxData && Object.keys(item.checkboxData).length) {
          for (const k in item.checkboxData) {
            html += "- [" + (item.checkboxData[k].checked ? "x" : " ") + "] " + item.checkboxData[k].label + "<br>";
          }
        }
        html += "</pre>";
      });
      html += "</body></html>";
      const blob = new Blob([html], { type: "text/html" });
      this.downloadFile(blob, `atlas-export-${this.courseId}.html`);
    });
    modal.querySelector("#atlasExportCsvBtn").onclick = confirmDo("CSV", async (ids) => {
      const items = sorted.filter((x) => ids.includes(x.id));
      let csv = "ID,Type,Title,Module,Lesson,Section,Timestamp,Content\n";
      items.forEach((item) => {
        let content = "";
        if (item.type === "prompt") content = item.inputs["main-content"] || "";
        else if (item.type === "worksheet")
          content = Object.keys(item.inputs)
            .map((k) => `${k}: ${item.inputs[k]}`)
            .join("; ");
        else if (item.checkboxData && Object.keys(item.checkboxData).length)
          content = Object.keys(item.checkboxData)
            .map((k) => `${item.checkboxData[k].label}: ${item.checkboxData[k].checked ? "Checked" : "Unchecked"}`)
            .join("; ");
        csv += `"${item.id}","${item.type}","${item.title}","${item.module}","${item.lesson}","${item.section}","${
          item.timestamp
        }","${content.replace(/"/g, '""')}"\n`;
      });
      const blob = new Blob([csv], { type: "text/csv" });
      this.downloadFile(blob, `atlas-export-${this.courseId}.csv`);
    });
    modal.querySelector("#atlasExportJsonBtn").onclick = confirmDo("JSON", async (ids) => {
      const items = sorted.filter((x) => ids.includes(x.id));
      const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json" });
      this.downloadFile(blob, `atlas-export-${this.courseId}.json`);
    });
  }
}
// Initialize ALX Atlas System
const atlasSystem = new AtlasSystem();
(function () {
  console.log("✅ Atlas Checklist Extension: Checkbox capture and restore enhanced");
})();
(function () {
  const originalShowContent = AtlasSystem.prototype.showContentTable;
  AtlasSystem.prototype.showContentTable = async function () {
    const listDiv = document.getElementById("atlasContentList");
    listDiv.innerHTML = '<div style="text-align: center; padding: 20px;">🔄 Loading Atlas content library...</div>';
    try {
      const allDatabases = await this.getAllAtlasDatabases();
      if (allDatabases.length === 0) {
        listDiv.innerHTML = '<div class="atlas-no-content">No Atlas content found. Start capturing content to see it here!</div>';
        return;
      }
      let html = '<div class="atlas-content-table">';
      let totalItems = 0;
      let totalPrompts = 0;
      let totalNotes = 0;
      let totalWorksheets = 0;
      let courseCount = 0;
      let courseId = 0;
      for (const dbInfo of allDatabases) {
        const captures = await this.getCapturesFromDatabase(dbInfo.name);
        if (captures.length > 0) {
          courseCount++;
          totalItems += captures.length;
          captures.forEach((item) => {
            if (item.type === "prompt") {
              totalPrompts++;
            } else if (item.type === "worksheet") {
              totalWorksheets++;
            } else if (item.type === "quadrant") {
              // Don't count quadrants in notes
            } else {
              totalNotes++;
            }
          });
          const courseName = dbInfo.courseName || dbInfo.name.replace("Atlas_", "");
          const isCurrent = dbInfo.name === this.dbName;
          html += `<div class="atlas-content-course"><div class="atlas-content-course-header" onclick="atlasSystem.toggleCourse('course-${courseId}')"><span><span class="atlas-collapsible-icon" id="icon-course-${courseId}">▶</span>📚 ${courseName} ${
            isCurrent ? '<span style="color: #3498db;">(Current)</span>' : ""
          }</span><span class="atlas-content-count">${captures.length} item${captures.length !== 1 ? "s" : ""}</span></div>`;
          html += `<div class="atlas-content-modules" id="course-${courseId}">`;
          const grouped = this.groupByModule(captures);
          const sortedModules = Object.entries(grouped).sort((a, b) => {
            const aNum = parseInt(a[0].match(/\d+/)?.[0] || 0);
            const bNum = parseInt(b[0].match(/\d+/)?.[0] || 0);
            return aNum - bNum;
          });
          let moduleId = 0;
          for (const [module, items] of sortedModules) {
            const moduleKey = `course-${courseId}-module-${moduleId}`;
            html += `<div class="atlas-module-header" onclick="atlasSystem.toggleModule('${moduleKey}')"><span class="atlas-collapsible-icon" id="icon-${moduleKey}">▶</span>📂 ${module}<span style="font-size: 11px; color: #95a5a6;">(${items.length})</span></div>`;
            html += `<div class="atlas-module-items" id="${moduleKey}">`;
            items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            items.forEach((item, itemIndex) => {
              const itemKey = `${moduleKey}-item-${itemIndex}`;
              const date = new Date(item.timestamp);
              const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              let preview = "";
              // === WORKSHEET 1 PREVIEW MECHANISM (shows in sidebar) ===
              if (item.type === "worksheet") {
                if (item.inputs) {
                  // Show ALL data immediately when expanded - NO LIMITS
                  for (const k in item.inputs) {
                    const v = item.inputs[k];
                    if (typeof v === "string" && v.trim()) {
                      // Show ALL data immediately when expanded - NO LIMITS
                      const labelText = this.getLabelTextFromHTML(item, k);
                      preview += `<div><b>${labelText}</b>: ${v.length > 45 ? v.slice(0, 45) + "..." : v}</div>`;
                    }
                  }
                  if (!preview) preview = "<i>(no content yet)</i>";
                } else {
                  preview = "<i>(no content yet)</i>";
                }
              } else if (item.type === "quadrant" && item.inputs) {
                // Show quadrant data summary
                let taskCount = 0;
                for (const k in item.inputs) {
                  if (item.inputs[k]) {
                    const tasks = item.inputs[k].split("\n").filter((t) => t.trim());
                    taskCount += tasks.length;
                  }
                }
                preview = `<div style="font-size: 12px; color: #3498db; font-weight: 600;">📊 ${taskCount} task${
                  taskCount !== 1 ? "s" : ""
                } across 4 quadrants</div>`;
              } else if (item.type === "checklist" && item.checkboxData) {
                const completed = Object.values(item.checkboxData).filter((d) => d.checked).length;
                const total = Object.keys(item.checkboxData).length;
                const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                preview = `<div style="font-size: 12px; color: #27ae60; font-weight: 600; margin-top: 5px;">✓ ${completed}/${total} completed (${percentage}%)</div>`;
                preview += `<div style="margin-top: 8px; font-size: 11px;">`;
                Object.entries(item.checkboxData).forEach(([id, data]) => {
                  const icon = data.checked ? "✅" : "⬜";
                  preview += `<div style="margin: 3px 0;">${icon} ${data.label}</div>`;
                });
                preview += `</div>`;
              } else if (item.inputs && item.inputs["main-content"]) {
                preview = item.inputs["main-content"].substring(0, 100);
                if (item.inputs["main-content"].length > 100) preview += "...";
              }
              html += `<div class="atlas-content-item" onclick="atlasSystem.toggleItem('${itemKey}')" data-item-data='${JSON.stringify(
                item
              )}'><div class="atlas-content-item-header"><span class="atlas-collapsible-icon" id="icon-${itemKey}">▶</span><div class="atlas-content-item-title">${
                item.title
              }<span class="atlas-content-type ${item.type}">${
                item.type === "prompt"
                  ? "💡 Prompt"
                  : item.type === "checklist"
                  ? "☑️ Checklist"
                  : item.type === "worksheet"
                  ? "📋 Worksheet"
                  : item.type === "quadrant"
                  ? "📊 Quadrant Map"
                  : "📝 Notes"
              }</span></div></div><div class="atlas-content-item-details" id="${itemKey}"><div class="atlas-content-item-meta"><span>📍 Lesson ${
                item.lesson
              }, Section ${item.section}</span><span>📅 ${dateStr}</span></div>${
                preview ? `<div class="atlas-content-preview">${preview}</div>` : ""
              }</div></div>`;
            });
            html += "</div>";
            moduleId++;
          }
          html += "</div>";
          html += "</div>";
          courseId++;
        }
      }
      if (totalItems > 0) {
        html =
          `<div style="padding: 10px; background: #e8f4fd; border-radius: 6px; margin-bottom: 15px;"><div style="font-weight: 600; margin-bottom: 5px;">📈 Atlas Library Summary</div><div style="font-size: 13px; line-height: 1.6;"><strong>${totalItems}</strong> total items across <strong>${courseCount}</strong> course${
            courseCount !== 1 ? "s" : ""
          }<br>💡 ${totalPrompts} Prompt${totalPrompts !== 1 ? "s" : ""} • 📋 ${totalWorksheets} Worksheet${
            totalWorksheets !== 1 ? "s" : ""
          } • 📝 ${totalNotes} Note${totalNotes !== 1 ? "s" : ""}</div></div>` + html;
      } else {
        html = '<div class="atlas-no-content">No content saved yet. Start adding notes and prompts to see them here!</div>';
      }
      html += "</div>";
      html += `<div style="text-align: center; margin-top: 10px;"><button onclick="atlasSystem.showContentTable()" style="padding: 5px 15px; background: #ecf0f1; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">🔄 Refresh Library</button></div>`;
      listDiv.innerHTML = html;

      // Note: Delete button event delegation is now handled by the consolidated setup in enhanceAtlasSystem()
    } catch (error) {
      console.error("Error loading Atlas content:", error, error && error.stack);
      listDiv.innerHTML = `<div class="atlas-no-content">⚠️ Error loading content.<br><pre style="font-size:11px;white-space:pre-line;max-height:120px;overflow:auto">${
        error && error.stack ? error.stack : error && error.message ? error.message : error
      }</pre><br>Please try again.
                    <br><button onclick="atlasSystem.showContentTable()" style="margin-top: 10px; padding: 5px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button></div>`;
    }
  };

  ////////////////////////////////////////////////////////
  ///////////// Universal Worksheet System //////////////
  ////////////////////////////////////////////////////////
  // SINGLE MECHANISM FOR ALL WORKSHEETS
  // This system handles ALL worksheets uniformly:
  // 1. UI interactions (sliders, prompt generation, copy)
  // 2. Data capture via Atlas system (save, restore, display)
  // 3. No worksheet-specific code needed - works for any worksheet
  // Enhanced Atlas functionality for clearing and deleting

  (function () {
    // Wait for Atlas to be initialized
    const waitForAtlas = setInterval(() => {
      if (typeof atlasSystem !== "undefined" && atlasSystem.db) {
        clearInterval(waitForAtlas);
        enhanceAtlasSystem();
      }
    }, 100);

    function enhanceAtlasSystem() {
      // Add method to delete individual item
      atlasSystem.deleteAtlasItem = async function (itemId) {
        // Custom modal confirmation matching clearAllData
        const confirmDialog = document.createElement("div");
        confirmDialog.className = "atlas-clear-confirm";
        confirmDialog.innerHTML = `
                <h3>🗑️ Delete Item</h3>
                <p>This will permanently delete this item from your Atlas library.</p>
                <p><strong>This action cannot be undone!</strong></p>
                <div class="atlas-clear-confirm-buttons">
                    <button class="cancel" onclick="this.parentElement.parentElement.remove()">Cancel</button>
                    <button class="confirm" onclick="atlasSystem.confirmDeleteItem(this, '${itemId}')">Delete Item</button>
                </div>
            `;
        document.body.appendChild(confirmDialog);
      };

      // Confirm deleting an individual item
      atlasSystem.confirmDeleteItem = async function (button, itemId) {
        button.parentElement.parentElement.remove();
        try {
          await this.deleteFromAtlasDB(itemId);

          // Clear the corresponding container on page if it exists
          const container = document.querySelector(`[data-atlas-id="${itemId}"]`);
          if (container) {
            container
              .querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea')
              .forEach((input) => (input.value = ""));
            container.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
            container.querySelectorAll("select").forEach((select) => (select.selectedIndex = 0));
            container.querySelectorAll('[contenteditable="true"]').forEach((el) => (el.innerHTML = ""));
          }

          // If deleting the quadrant map, clear the quadrant HTML
          if (itemId === "quadrant-map-001") {
            clearQuadrantMapHTML();
          }

          await this.updateAtlasDashboard();
          await this.showContentTable();
          console.log(`✅ ALX Atlas: Item ${itemId} deleted`);
        } catch (error) {
          console.error("❌ ALX Atlas delete error:", error);
          alert("Failed to delete item. Please try again.");
        }
      };

      // Add method to delete from database
      atlasSystem.deleteFromAtlasDB = function (itemId) {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(["atlas_captures"], "readwrite");
          const store = transaction.objectStore("atlas_captures");
          const request = store.delete(itemId);

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      };

      // Set up single, consolidated event delegation for delete buttons
      // This will handle all delete button clicks across the entire document
      function setupDeleteButtonDelegation() {
        // Remove any existing event listeners to prevent duplicates
        const existingHandler = document.atlasDeleteHandler;
        if (existingHandler) {
          document.removeEventListener("click", existingHandler);
        }

        // Create new consolidated handler
        const deleteHandler = function (e) {
          // Check if the clicked element or its parent has the delete button class
          const deleteBtn = e.target.closest(".atlas-delete-btn");
          if (deleteBtn) {
            e.stopPropagation();
            e.preventDefault();

            const itemId = deleteBtn.getAttribute("data-item-id");
            console.log("Delete button clicked for item:", itemId);
            console.log("Atlas system available:", typeof atlasSystem !== "undefined");
            console.log("Delete function available:", typeof atlasSystem?.deleteAtlasItem);

            if (itemId && typeof atlasSystem !== "undefined" && atlasSystem.deleteAtlasItem) {
              atlasSystem.deleteAtlasItem(itemId);
            } else {
              console.error(
                "Delete function not available or item ID missing. Item ID:",
                itemId,
                "Atlas system:",
                typeof atlasSystem,
                "Delete function:",
                typeof atlasSystem?.deleteAtlasItem
              );
            }
          }
        };

        // Store reference to handler for potential removal later
        document.atlasDeleteHandler = deleteHandler;

        // Add single event listener to document for delegation
        document.addEventListener("click", deleteHandler);

        console.log("✅ Atlas Delete Button Delegation: Single event listener established");
      }

      // Set up the consolidated event delegation
      setupDeleteButtonDelegation();

      // Set up mutation observer to handle dynamically added delete buttons
      const deleteButtonObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach(function (node) {
              if (node.nodeType === 1) {
                // Element node
                // Check if the added node or its children contain delete buttons
                const deleteButtons = node.querySelectorAll ? node.querySelectorAll(".atlas-delete-btn") : [];
                if (node.classList && node.classList.contains("atlas-delete-btn")) {
                  console.log("New delete button detected:", node);
                }
                if (deleteButtons.length > 0) {
                  console.log("New delete buttons detected:", deleteButtons.length);
                }
              }
            });
          }
        });
      });

      // Start observing
      deleteButtonObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Ensure the delete handler is properly set up
      console.log("✅ Atlas Delete Button Delegation: Event delegation ready");

      // Add method to clear all data
      atlasSystem.clearAllData = async function () {
        // Create confirmation dialog
        const confirmDialog = document.createElement("div");
        confirmDialog.className = "atlas-clear-confirm";
        confirmDialog.innerHTML = `
                <h3>⚠️ Clear All Data</h3>
                <p>This will permanently delete all saved content for the course "${this.courseName}".</p>
                <p><strong>This action cannot be undone!</strong></p>
                <div class="atlas-clear-confirm-buttons">
                    <button class="cancel" onclick="this.parentElement.parentElement.remove()">Cancel</button>
                    <button class="confirm" onclick="atlasSystem.confirmClearAll(this)">Delete Everything</button>
                </div>
            `;
        document.body.appendChild(confirmDialog);
      };

      // Confirm clear all
      atlasSystem.confirmClearAll = async function (button) {
        button.parentElement.parentElement.remove();

        try {
          // Clear all captures
          await this.clearAllCaptures();

          // Clear all inputs on page
          document.querySelectorAll('[data-atlas-capture="true"]').forEach((container) => {
            // Clear all inputs
            container.querySelectorAll('input[type="checkbox"]').forEach((cb) => (cb.checked = false));
            container
              .querySelectorAll('input[type="text"], input[type="email"], input[type="number"], textarea')
              .forEach((input) => (input.value = ""));
            container.querySelectorAll("select").forEach((select) => (select.selectedIndex = 0));
            container.querySelectorAll('[contenteditable="true"]').forEach((el) => (el.innerHTML = ""));
          });

          // Clear quadrant map HTML
          clearQuadrantMapHTML();

          await this.updateAtlasDashboard();
          await this.showContentTable();
          alert("All data has been cleared successfully.");
        } catch (error) {
          console.error("❌ ALX Atlas clear all error:", error);
          alert("Failed to clear all data. Please try again.");
        }
      };

      // Clear all captures from database
      atlasSystem.clearAllCaptures = function () {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction(["atlas_captures"], "readwrite");
          const store = transaction.objectStore("atlas_captures");
          const request = store.clear();

          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      };

      // Override showContentTable to add delete buttons with proper item IDs
      const originalShowContent = atlasSystem.showContentTable;
      atlasSystem.showContentTable = async function () {
        console.log("🔄 showContentTable called - generating delete buttons...");
        const listDiv = document.getElementById("atlasContentList");
        listDiv.innerHTML = '<div style="text-align: center; padding: 20px;">🔄 Loading Atlas content library...</div>';

        try {
          const allDatabases = await this.getAllAtlasDatabases();

          if (allDatabases.length === 0) {
            listDiv.innerHTML = '<div class="atlas-no-content">No Atlas content found. Start capturing content to see it here!</div>';
            return;
          }

          let html = '<div class="atlas-content-table">';
          let totalItems = 0;
          let totalPrompts = 0;
          let totalNotes = 0;
          let totalWorksheets = 0;
          let courseCount = 0;
          let courseId = 0;

          for (const dbInfo of allDatabases) {
            const captures = await this.getCapturesFromDatabase(dbInfo.name);
            if (captures.length > 0) {
              courseCount++;
              totalItems += captures.length;
              captures.forEach((item) => {
                if (item.type === "prompt") {
                  totalPrompts++;
                } else {
                  totalNotes++;
                }
              });

              const courseName = dbInfo.courseName || dbInfo.name.replace("Atlas_", "");
              const isCurrent = dbInfo.name === this.dbName;

              html += `<div class="atlas-content-course">
                            <div class="atlas-content-course-header" onclick="atlasSystem.toggleCourse('course-${courseId}')">
                                <span>
                                    <span class="atlas-collapsible-icon" id="icon-course-${courseId}">▶</span>
                                    📚 ${courseName} ${isCurrent ? '<span style="color: #3498db;">(Current)</span>' : ""}
                                </span>
                                <span class="atlas-content-count">${captures.length} item${captures.length !== 1 ? "s" : ""}</span>
                            </div>`;

              html += `<div class="atlas-content-modules" id="course-${courseId}">`;

              const grouped = this.groupByModule(captures);
              const sortedModules = Object.entries(grouped).sort((a, b) => {
                const aNum = parseInt(a[0].match(/\d+/)?.[0] || 0);
                const bNum = parseInt(b[0].match(/\d+/)?.[0] || 0);
                return aNum - bNum;
              });

              let moduleId = 0;
              for (const [module, items] of sortedModules) {
                const moduleKey = `course-${courseId}-module-${moduleId}`;

                html += `<div class="atlas-module-header" onclick="atlasSystem.toggleModule('${moduleKey}')">
                                <span class="atlas-collapsible-icon" id="icon-${moduleKey}">▶</span>
                                📂 ${module}
                                <span style="font-size: 11px; color: #95a5a6;">(${items.length})</span>
                            </div>`;

                html += `<div class="atlas-module-items" id="${moduleKey}">`;

                items.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                items.forEach((item, itemIndex) => {
                  const itemKey = `${moduleKey}-item-${itemIndex}`;
                  const date = new Date(item.timestamp);
                  const dateStr = date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });

                  // Debug: Log item details
                  console.log("Generating delete button for item:", {
                    id: item.id,
                    title: item.title,
                    type: item.type,
                  });

                  let preview = "";
                  // === Simple worksheet preview logic (shows in sidebar) ===
                  if (item.type === "worksheet") {
                    if (item.inputs) {
                      // Pull up to two nonempty input fields for summary
                      const keysShown = [];
                      for (const k in item.inputs) {
                        const v = item.inputs[k];
                        if (typeof v === "string" && v.trim() && keysShown.length < 2) {
                          const labelText = this.getLabelTextFromHTML(item, k);
                          preview += `<div><b>${labelText}</b>: ${v.length > 45 ? v.slice(0, 45) + "..." : v}</div>`;
                          keysShown.push(k);
                        }
                      }
                      if (!preview) preview = "<i>(no content yet)</i>";
                    } else {
                      preview = "<i>(no content yet)</i>";
                    }
                  } else if (item.type === "checklist" && item.checkboxData) {
                    const completed = Object.values(item.checkboxData).filter((d) => d.checked).length;
                    const total = Object.keys(item.checkboxData).length;
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                    preview = `<div style="font-size: 12px; color: #27ae60; font-weight: 600; margin-top: 5px;">✓ ${completed}/${total} completed (${percentage}%)</div>`;
                    preview += `<div style="margin-top: 8px; font-size: 11px;">`;
                    Object.entries(item.checkboxData).forEach(([id, data]) => {
                      const icon = data.checked ? "✅" : "⬜";
                      preview += `<div style="margin: 3px 0;">${icon} ${data.label}</div>`;
                    });
                    preview += `</div>`;
                  } else if (item.inputs && item.inputs["main-content"]) {
                    preview = item.inputs["main-content"].substring(0, 100);
                    if (item.inputs["main-content"].length > 100) preview += "...";
                  }

                  html += `<div class="atlas-content-item" onclick="atlasSystem.toggleItem('${itemKey}')" data-item-data='${JSON.stringify(item)}'>
                                    <div class="atlas-content-item-header">
                                        <span class="atlas-collapsible-icon" id="icon-${itemKey}">▶</span>
                                        <div class="atlas-content-item-title">
                                            ${item.title}
                                            <span class="atlas-content-type ${item.type}">
                                                ${
                                                  item.type === "prompt"
                                                    ? "💡 Prompt"
                                                    : item.type === "checklist"
                                                    ? "☑️ Checklist"
                                                    : item.type === "worksheet"
                                                    ? "📋 Worksheet"
                                                    : "📝 Notes"
                                                }
                                            </span>
                                        </div>
                                        <button class="atlas-delete-btn" data-item-id="${item.id}" title="Delete item: ${item.id}">
                                            🗑️ Delete
                                        </button>
                                    </div>
                                    <div class="atlas-content-item-details" id="${itemKey}">
                                        <div class="atlas-content-item-meta">
                                            <span>📍 Lesson ${item.lesson}, Section ${item.section}</span>
                                            <span>📅 ${dateStr}</span>
                                        </div>
                                        ${preview ? `<div class="atlas-content-preview">${preview}</div>` : ""}
                                    </div>
                                </div>`;
                });
                html += "</div>";
                moduleId++;
              }
              html += "</div>";
              html += "</div>";
              courseId++;
            }
          }

          if (totalItems > 0) {
            html =
              `<div style="padding: 10px; background: #e8f4fd; border-radius: 6px; margin-bottom: 15px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">📈 Atlas Library Summary</div>
                        <div style="font-size: 13px; line-height: 1.6;">
                            <strong>${totalItems}</strong> total items across <strong>${courseCount}</strong> course${
                courseCount !== 1 ? "s" : ""
              }<br>
                            💡 ${totalPrompts} Prompt${totalPrompts !== 1 ? "s" : ""} • 
                            📋 ${totalWorksheets} Worksheet${totalWorksheets !== 1 ? "s" : ""} • 
                            📝 ${totalNotes} Note${totalNotes !== 1 ? "s" : ""}
                        </div>
                    </div>` + html;
          } else {
            html = '<div class="atlas-no-content">No content saved yet. Start adding notes and prompts to see them here!</div>';
          }

          html += "</div>";
          html += `<div style="text-align: center; margin-top: 10px;">
                    <button onclick="atlasSystem.showContentTable()" style="padding: 5px 15px; background: #ecf0f1; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        🔄 Refresh Library
                    </button>
                </div>`;

          listDiv.innerHTML = html;
          console.log("✅ Atlas Content Table: Enhanced with delete buttons");
          console.log("✅ Delete buttons generated:", listDiv.querySelectorAll(".atlas-delete-btn").length);

          // Ensure event delegation is working for the newly generated buttons
          const deleteButtons = listDiv.querySelectorAll(".atlas-delete-btn");
          deleteButtons.forEach((btn) => {
            console.log("Delete button found with ID:", btn.getAttribute("data-item-id"));

            // Add direct event listener as backup
            btn.addEventListener("click", function (e) {
              e.stopPropagation();
              e.preventDefault();

              const itemId = this.getAttribute("data-item-id");
              console.log("Direct delete button click for item:", itemId);

              if (itemId && typeof atlasSystem !== "undefined" && atlasSystem.deleteAtlasItem) {
                atlasSystem.deleteAtlasItem(itemId);
              } else {
                console.error("Direct delete: Function not available or item ID missing");
              }
            });
          });

          // Note: Delete button event delegation is now handled by the consolidated setup in enhanceAtlasSystem()
        } catch (error) {
          console.error("Error loading Atlas content:", error, error && error.stack);
          listDiv.innerHTML = `<div class="atlas-no-content">⚠️ Error loading content.<br><pre style="font-size:11px;white-space:pre-line;max-height:120px;overflow:auto">${
            error && error.stack ? error.stack : error && error.message ? error.message : error
          }</pre><br>Please try again.
                    <br><button onclick="atlasSystem.showContentTable()" style="margin-top: 10px; padding: 5px 15px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Retry</button></div>`;
        }
      };

      // Add clear buttons to prompt containers
      function addPromptClearButtons() {
        document.querySelectorAll('[data-atlas-type="prompt"]').forEach((container) => {
          const textarea = container.querySelector("textarea[data-atlas-input]");
          if (textarea && !container.querySelector(".prompt-clear-btn")) {
            const clearBtn = document.createElement("button");
            clearBtn.className = "prompt-clear-btn";
            clearBtn.textContent = "Clear";
            clearBtn.style.cssText = `
                        margin-top: 8px;
                        padding: 6px 12px;
                        /* background color now controlled by CSS vars via stylesheet */
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    `;

            // Remove JS hover handlers; CSS :hover will handle color change

            clearBtn.addEventListener("click", async function () {
              const containerId = container.getAttribute("data-atlas-id");

              // Clear the textarea
              textarea.value = "";

              // Delete from database
              try {
                await atlasSystem.deleteFromAtlasDB(containerId);
                await atlasSystem.updateAtlasDashboard();
                console.log(`✅ ALX Atlas: Prompt ${containerId} cleared`);

                // Show temporary confirmation
                const originalText = clearBtn.textContent;
                clearBtn.textContent = "✔ Cleared";
                // Temporarily set success color
                const prevInlineBg = clearBtn.style.background;
                clearBtn.style.background = "#27ae60";
                setTimeout(() => {
                  clearBtn.textContent = originalText;
                  // Revert to CSS-driven background (remove inline)
                  clearBtn.style.background = prevInlineBg || "";
                }, 2000);
              } catch (error) {
                console.error("❌ ALX Atlas clear prompt error:", error);
              }
            });

            textarea.parentElement.insertBefore(clearBtn, textarea.nextSibling);
          }
        });
      }

      // Add prompt clear buttons on page load
      addPromptClearButtons();

      // Watch for new prompt containers
      const observer = new MutationObserver(() => {
        addPromptClearButtons();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Enhance clear buttons for checklists (keep existing functionality)
      document.querySelectorAll(".checklist__clear").forEach((clearBtn) => {
        clearBtn.addEventListener("click", async function (e) {
          e.preventDefault();

          const form = this.closest("form");
          const container = this.closest('[data-atlas-capture="true"]');
          const id = container.getAttribute("data-atlas-id");

          // Clear checkboxes immediately
          form.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
            cb.checked = false;
          });

          if (id) {
            try {
              await atlasSystem.deleteFromAtlasDB(id);
              await atlasSystem.updateAtlasDashboard();
              console.log(`✅ ALX Atlas: Checklist ${id} cleared from database`);

              // Show temporary status
              const status = form.querySelector(".checklist__status");
              if (status) {
                status.textContent = "✔ Cleared";
                status.style.opacity = "1";
                setTimeout(() => {
                  status.style.opacity = "0";
                }, 2000);
              }
            } catch (error) {
              console.error("❌ ALX Atlas clear checklist error:", error);
            }
          }
        });
      });
      async function handleDeleteButtonClick() {
        try {
          const form = this.closest("form");
          const container = this.closest('[data-atlas-capture="true"]');
          const id = container.getAttribute("data-atlas-id");

          if (id) {
            await atlasSystem.deleteFromAtlasDB(id);
            await atlasSystem.updateAtlasDashboard();
            console.log(`✅ ALX Atlas: Checklist ${id} cleared from database`);
          }
        } catch (error) {
          console.error("❌ ALX Atlas clear checklist error:", error);
        }
      }

      console.log("✅ Atlas Clear/Delete Enhancement: Functions added");
    }
  })();

  /////////////////////////////////////////////////////
  ///////// Drag and Drop Functionality ///////////////
  /////////////////////////////////////////////////////
  document.querySelectorAll(".quiz-module:not(.mcq-module)").forEach((quizModule) => {
    initQuiz(quizModule);
  });
  function initQuiz(quizModule) {
    let draggedElement = null;
    const draggables = quizModule.querySelectorAll(".draggable");
    const dropZones = quizModule.querySelectorAll(".drop-zone");
    const checkBtn = quizModule.querySelector(".check-btn");
    const resetBtn = quizModule.querySelector(".reset-btn");
    const feedback = quizModule.querySelector(".quiz-feedback");
    const draggableContainer = quizModule.querySelector(".draggable-items");
    const isTableQuiz = quizModule.querySelector(".quiz-table") !== null || quizModule.querySelectorAll("[data-column]").length > 0;
    draggables.forEach((draggable) => {
      draggable.addEventListener("dragstart", (e) => {
        draggedElement = e.target.closest(".draggable");
        draggedElement.classList.add("dragging");
      });
      draggable.addEventListener("dragend", (e) => {
        const elem = e.target.closest(".draggable");
        if (elem) elem.classList.remove("dragging");
      });
    });
    dropZones.forEach((zone) => {
      zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.classList.add("drag-over");
      });
      zone.addEventListener("dragleave", (e) => {
        zone.classList.remove("drag-over");
      });
      zone.addEventListener("drop", (e) => {
        e.preventDefault();
        zone.classList.remove("drag-over");
        if (draggedElement) {
          if (isTableQuiz) {
            zone.appendChild(draggedElement);
            draggedElement.classList.add("placed", "in-dropzone");
            draggedElement.classList.remove("correct", "incorrect");
            zone.classList.add("filled");
          } else {
            const existingItem = zone.querySelector(".draggable");
            if (existingItem) {
              draggableContainer.appendChild(existingItem);
              existingItem.classList.remove("placed", "in-dropzone");
            }
            zone.appendChild(draggedElement);
            draggedElement.classList.add("placed", "in-dropzone");
            zone.classList.add("filled");
          }
          feedback.classList.remove("show");
          zone.classList.remove("correct", "incorrect");
        }
      });
    });
    checkBtn.addEventListener("click", () => {
      if (isTableQuiz) {
        let correct = 0;
        let total = 0;
        const allScenarios = quizModule.querySelectorAll("[data-correct]");
        total = allScenarios.length;
        dropZones.forEach((zone) => {
          const columnName = zone.dataset.column;
          const itemsInZone = zone.querySelectorAll(".draggable");
          itemsInZone.forEach((item) => {
            const correctColumn = item.dataset.correct;
            if (correctColumn === columnName) {
              item.classList.add("correct");
              item.classList.remove("incorrect");
              correct++;
            } else {
              item.classList.add("incorrect");
              item.classList.remove("correct");
            }
          });
        });
        feedback.classList.add("show");
        if (correct === total) {
          feedback.className = "quiz-feedback show success";
          feedback.innerHTML = `<div class="quiz-score">Perfect! ${correct}/${total} correct</div>All scenarios are in the correct columns!`;
        } else {
          feedback.className = "quiz-feedback show partial";
          feedback.innerHTML = `<div class="quiz-score">${correct}/${total} correct</div>Some scenarios are in the wrong column. Try again or reset to start over.`;
        }
      } else {
        let correct = 0;
        let total = dropZones.length;
        let answers = {};
        dropZones.forEach((zone) => {
          const correctAnswer = zone.dataset.answer;
          const item = zone.querySelector(".draggable");
          if (item) {
            const userAnswer = item.dataset.value;
            answers[correctAnswer] = userAnswer;
            if (userAnswer === correctAnswer) {
              zone.classList.add("correct");
              zone.classList.remove("incorrect");
              correct++;
            } else {
              zone.classList.add("incorrect");
              zone.classList.remove("correct");
            }
          }
        });
        feedback.classList.add("show");
        if (correct === total) {
          feedback.className = "quiz-feedback show success";
          feedback.innerHTML = `<div class="quiz-score">Perfect! ${correct}/${total} correct</div>All answers are correct!`;
        } else {
          feedback.className = "quiz-feedback show partial";
          feedback.innerHTML = `<div class="quiz-score">${correct}/${total} correct</div>Try again or reset to start over.`;
        }
      }
    });
    resetBtn.addEventListener("click", () => {
      const allDraggables = quizModule.querySelectorAll(".draggable");
      allDraggables.forEach((draggable) => {
        draggableContainer.appendChild(draggable);
        draggable.classList.remove("placed", "in-dropzone", "correct", "incorrect");
      });
      dropZones.forEach((zone) => {
        zone.classList.remove("filled", "correct", "incorrect");
      });
      feedback.classList.remove("show");
    });
  }
  document.querySelectorAll(".mcq-module").forEach((quizModule) => {
    initMCQQuiz(quizModule);
  });

  // Initialize MCQ Slider modules
  document.querySelectorAll(".mcq-slider-module").forEach((quizModule) => {
    initMCQSlider(quizModule);
  });
  function initMCQQuiz(quizModule) {
    const questions = quizModule.querySelectorAll(".mcq-question");
    const checkBtn = quizModule.querySelector(".check-btn");
    const resetBtn = quizModule.querySelector(".reset-btn");
    const feedback = quizModule.querySelector(".quiz-feedback");
    questions.forEach((question) => {
      const options = question.querySelectorAll(".mcq-option");
      options.forEach((option) => {
        option.addEventListener("click", () => {
          const input = option.querySelector("input");
          if (input.type === "radio") {
            options.forEach((opt) => opt.classList.remove("selected"));
            if (input.checked) {
              option.classList.add("selected");
            }
          } else if (input.type === "checkbox") {
            if (input.checked) {
              option.classList.add("selected");
            } else {
              option.classList.remove("selected");
            }
          }
        });
      });
    });
    checkBtn.addEventListener("click", () => {
      let correctCount = 0;
      let totalQuestions = questions.length;
      questions.forEach((question) => {
        question.classList.add("checked");
        const questionId = question.dataset.questionId;
        const correctAnswer = question.dataset.correctAnswer;
        const correctAnswers = question.dataset.correctAnswers;
        if (correctAnswer) {
          const selectedOption = question.querySelector('input[name="' + questionId + '"]:checked');
          if (selectedOption) {
            const userAnswer = selectedOption.value;
            const optionElement = selectedOption.closest(".mcq-option");
            if (userAnswer === correctAnswer) {
              optionElement.classList.add("correct");
              optionElement.classList.remove("incorrect");
              correctCount++;
            } else {
              optionElement.classList.add("incorrect");
              optionElement.classList.remove("correct");
              const correctOptionInput = question.querySelector('input[value="' + correctAnswer + '"]');
              if (correctOptionInput) {
                correctOptionInput.closest(".mcq-option").classList.add("show-correct");
              }
            }
          }
        } else if (correctAnswers) {
          const correctAnswersArray = correctAnswers.split(",");
          const selectedOptions = question.querySelectorAll('input[name="' + questionId + '"]:checked');
          const userAnswers = Array.from(selectedOptions).map((opt) => opt.value);
          const isCorrect = userAnswers.length === correctAnswersArray.length && userAnswers.every((ans) => correctAnswersArray.includes(ans));
          if (isCorrect) {
            correctCount++;
          }
          const allOptions = question.querySelectorAll('input[name="' + questionId + '"]');
          allOptions.forEach((option) => {
            const optionElement = option.closest(".mcq-option");
            const isCorrectAnswer = correctAnswersArray.includes(option.value);
            const isSelected = option.checked;
            if (isCorrectAnswer && isSelected) {
              optionElement.classList.add("correct");
            } else if (isCorrectAnswer && !isSelected) {
              optionElement.classList.add("show-correct");
            } else if (!isCorrectAnswer && isSelected) {
              optionElement.classList.add("incorrect");
            }
          });
        }
      });
      feedback.classList.add("show");
      if (correctCount === totalQuestions) {
        feedback.className = "quiz-feedback show success";
        feedback.innerHTML = `<div class="quiz-score">Perfect! ${correctCount}/${totalQuestions} correct</div>All answers are correct!`;
      } else {
        feedback.className = "quiz-feedback show partial";
        feedback.innerHTML = `<div class="quiz-score">${correctCount}/${totalQuestions} correct</div>Review the highlighted answers and try again.`;
      }
    });
    resetBtn.addEventListener("click", () => {
      questions.forEach((question) => {
        question.classList.remove("checked");
        const inputs = question.querySelectorAll("input");
        inputs.forEach((input) => {
          input.checked = false;
        });
        const options = question.querySelectorAll(".mcq-option");
        options.forEach((option) => {
          option.classList.remove("selected", "correct", "incorrect", "show-correct");
        });
      });
      feedback.classList.remove("show");
    });
  }

  /////////////////////////////////////////////////////
  //////// Hover Flip Circle Functionality ////////////
  /////////////////////////////////////////////////////
  document.querySelectorAll(".hover-flip-circle-button").forEach((circle) => {
    const originalText = circle.dataset.original;
    const flipText = circle.dataset.flip;
    circle.addEventListener("mouseenter", () => {
      circle.textContent = flipText;
    });
    circle.addEventListener("mouseleave", () => {
      circle.textContent = originalText;
    });
  });

  /////////////////////////////////////////////////////
  ///////// Content/Page Tabs Functionality ///////////
  /////////////////////////////////////////////////////
  var currentTabIndex = 0;
  function getTotalTabs() {
    try {
      var panels = document.getElementsByClassName("content-tabs-panel");
      return Math.max(1, panels.length || 1);
    } catch (_) {
      return 1;
    }
  }
  function showContentTab(evt, tabId) {
    var panels = document.getElementsByClassName("content-tabs-panel");
    for (var i = 0; i < panels.length; i++) {
      panels[i].className = panels[i].className.replace(" content-tabs-panel-active", "");
    }
    var buttons = document.getElementsByClassName("content-tabs-button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].className = buttons[i].className.replace(" content-tabs-button-active", "");
    }
    document.getElementById(tabId).className += " content-tabs-panel-active";
    evt.currentTarget.className += " content-tabs-button-active";
    currentTabIndex = parseInt(tabId.replace("tab", "")) - 1;
    updateNavigationButtons();
  }
  function navigateTab(direction) {
    var newIndex = currentTabIndex + direction;
    var totalTabs = getTotalTabs();
    if (newIndex >= 0 && newIndex < totalTabs) {
      currentTabIndex = newIndex;
      var tabId = "tab" + (currentTabIndex + 1);
      var panels = document.getElementsByClassName("content-tabs-panel");
      for (var i = 0; i < panels.length; i++) {
        panels[i].className = panels[i].className.replace(" content-tabs-panel-active", "");
      }
      var buttons = document.getElementsByClassName("content-tabs-button");
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].className = buttons[i].className.replace(" content-tabs-button-active", "");
      }
      document.getElementById(tabId).className += " content-tabs-panel-active";
      buttons[currentTabIndex].className += " content-tabs-button-active";
      updateNavigationButtons();
      window.scrollTo({
        top: document.querySelector(".content-tabs-body").offsetTop - 10,
        behavior: "smooth",
      });
    }
  }
  function updateNavigationButtons() {
    var prevButton = document.getElementById("prevButton");
    var nextButton = document.getElementById("nextButton");
    var pageIndicator = document.getElementById("pageIndicator");
    var totalTabs = getTotalTabs();
    prevButton.disabled = currentTabIndex === 0;
    nextButton.disabled = currentTabIndex === totalTabs - 1;
    pageIndicator.textContent = "Section " + (currentTabIndex + 1) + " of " + totalTabs;
  }
  updateNavigationButtons();

  // Expose tab controls globally for inline handlers
  if (typeof window !== "undefined") {
    if (!window.showContentTab) window.showContentTab = showContentTab;
    if (!window.navigateTab) window.navigateTab = navigateTab;
  }

  /////////////////////////////////////////////////////
  ////////////// Popup Functionality //////////////////
  /////////////////////////////////////////////////////

  // Lesson Info Popup Functionality

  function openLessonInfoPopup(popupId) {
    document.getElementById(popupId).classList.add("lesson-info-popup-overlay-active");
    document.body.style.overflow = "hidden";
  }
  function closeLessonInfoPopup(popupId) {
    document.getElementById(popupId).classList.remove("lesson-info-popup-overlay-active");
    document.body.style.overflow = "";
  }
  function closeLessonInfoPopupOnOverlay(event, popupId) {
    if (event.target.id === popupId) {
      closeLessonInfoPopup(popupId);
    }
  }

  // Expose popup helpers globally for inline onclick usage
  if (typeof window !== "undefined") {
    window.openLessonInfoPopup = openLessonInfoPopup;
    window.closeLessonInfoPopup = closeLessonInfoPopup;
    window.closeLessonInfoPopupOnOverlay = closeLessonInfoPopupOnOverlay;
  }

  // Link Preview Popup Functionality
  function showLinkPreviewPopup(linkElement, event) {
    const popupElement = document.getElementById("link-preview-popup-main");
    const titleElement = popupElement.querySelector(".link-preview-popup-title");
    const descElement = popupElement.querySelector(".link-preview-popup-description");
    const title = linkElement.getAttribute("data-link-preview-title");
    const desc = linkElement.getAttribute("data-link-preview-desc");
    if (!title || !desc) return;
    titleElement.textContent = title;
    descElement.textContent = desc;
    updateLinkPreviewPopupPosition(event);
    popupElement.classList.add("link-preview-popup-visible");
  }
  function hideLinkPreviewPopup() {
    const popupElement = document.getElementById("link-preview-popup-main");
    popupElement.classList.remove("link-preview-popup-visible");
  }
  function updateLinkPreviewPopupPosition(event) {
    const popupElement = document.getElementById("link-preview-popup-main");
    const x = event.clientX;
    const y = event.clientY;
    const popupRect = popupElement.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    let left = x + 15;
    let top = y + 15;
    if (left + popupRect.width > windowWidth - 20) {
      left = x - popupRect.width - 15;
    }
    if (top + popupRect.height > windowHeight - 20) {
      top = y - popupRect.height - 15;
    }
    popupElement.style.left = left + "px";
    popupElement.style.top = top + "px";
  }

  // Expose link preview helpers globally for inline on* handlers
  if (typeof window !== "undefined") {
    window.showLinkPreviewPopup = showLinkPreviewPopup;
    window.hideLinkPreviewPopup = hideLinkPreviewPopup;
    window.updateLinkPreviewPopupPosition = updateLinkPreviewPopupPosition;
  }

  // ================================================================
  // ENVIRONMENT DETECTION AND DATA MANAGEMENT FOR CURSOR
  // ================================================================
  // Environment detection and storage management
  (function () {
    // Detect if we're in Cursor environment (no window.indexedDB or limited storage)
    const isCursorEnvironment =
      typeof window !== "undefined" && (typeof indexedDB === "undefined" || !indexedDB || typeof localStorage === "undefined" || !localStorage);

    // In-memory storage for Cursor environment
    const cursorStorage = new Map();

    // Enhanced clear function for all environments
    window.clearAtlasData = async function (options = {}) {
      const { worksheetId, courseId, allData } = options;

      if (isCursorEnvironment) {
        // Cursor environment - use in-memory storage
        if (allData) {
          cursorStorage.clear();
          console.log("✅ Cleared all Atlas data (Cursor environment)");
        } else if (worksheetId) {
          // Remove specific worksheet
          let found = false;
          for (const [key, value] of cursorStorage.entries()) {
            if (value && value.id === worksheetId) {
              cursorStorage.delete(key);
              found = true;
              break;
            }
          }
          if (found) {
            console.log(`✅ Cleared data for ${worksheetId} (Cursor environment)`);
          } else {
            console.log(`❌ No data found for ${worksheetId} (Cursor environment)`);
          }
        }

        // Refresh the content library
        if (typeof atlasSystem !== "undefined" && atlasSystem.showContentTable) {
          atlasSystem.showContentTable();
        }
        return true;
      } else {
        // Browser environment - use Atlas system
        if (typeof atlasSystem !== "undefined" && atlasSystem.deleteAtlasItem) {
          if (allData) {
            // Clear all data - this would require clearing all Atlas databases
            console.log("✅ Use browser developer tools to clear all site data");
            return true;
          } else if (worksheetId) {
            const result = await atlasSystem.deleteAtlasItem(worksheetId);
            if (result) {
              console.log(`✅ Cleared data for ${worksheetId}`);
              if (atlasSystem.showContentTable) {
                atlasSystem.showContentTable();
              }
              return true;
            } else {
              console.log(`❌ No data found for ${worksheetId}`);
              return false;
            }
          }
        } else {
          console.error("Atlas system not available");
          return false;
        }
      }
    };

    // Helper function for Cursor environment
    window.clearWorksheetData = async function (worksheetId) {
      return await window.clearAtlasData({ worksheetId });
    };

    // Instructions for user
    console.log("🔧 Atlas Data Management:");
    if (isCursorEnvironment) {
      console.log("📍 Cursor Environment Detected");
      console.log("💾 Using in-memory storage");
      console.log("🗑️  Use clearAtlasData() or clearWorksheetData() to clear data");
    } else {
      console.log("🌐 Browser Environment Detected");
      console.log("💾 Using IndexedDB storage");
      console.log("🗑️  Use clearAtlasData() or browser dev tools to clear data");
    }
  })();

  /////////////////////////////////////////////////////
  ///////// MCQ Slider Functionality /////////////////
  /////////////////////////////////////////////////////
  function initMCQSlider(quizModule) {
    const slides = quizModule.querySelectorAll(".mcq-question-slide");
    const totalQuestions = slides.length;
    let currentSlide = 0;
    let answers = {};
    let correctAnswers = 0;

    // Get DOM elements
    const progressFill = quizModule.querySelector(".mcq-progress-fill");
    const currentQuestionSpan = quizModule.querySelector(".mcq-current-question");
    const totalQuestionsSpan = quizModule.querySelector(".mcq-total-questions");
    const prevBtn = quizModule.querySelector(".mcq-prev-btn");
    const checkBtn = quizModule.querySelector(".mcq-check-btn");
    const nextBtn = quizModule.querySelector(".mcq-next-btn");
    const finishBtn = quizModule.querySelector(".mcq-finish-btn");
    const finalResults = quizModule.querySelector(".mcq-final-results");
    const restartBtn = quizModule.querySelector(".mcq-restart-btn");

    // Initialize
    totalQuestionsSpan.textContent = totalQuestions;
    updateProgress();
    updateNavigation();

    // Add event listeners to options
    slides.forEach((slide, index) => {
      const options = slide.querySelectorAll(".mcq-option");
      options.forEach((option) => {
        option.addEventListener("click", () => {
          const input = option.querySelector("input");
          const questionId = slide.dataset.questionId;

          if (input.type === "radio") {
            // Clear other selections for radio buttons
            options.forEach((opt) => opt.classList.remove("selected"));
            option.classList.add("selected");
            answers[questionId] = input.value;
          } else if (input.type === "checkbox") {
            // Toggle selection for checkboxes
            if (input.checked) {
              option.classList.add("selected");
            } else {
              option.classList.remove("selected");
            }

            // Update answers array for checkboxes
            if (!answers[questionId]) answers[questionId] = [];
            if (input.checked) {
              if (!answers[questionId].includes(input.value)) {
                answers[questionId].push(input.value);
              }
            } else {
              answers[questionId] = answers[questionId].filter((val) => val !== input.value);
            }
          }

          updateNavigation();
        });
      });
    });

    // Navigation button event listeners
    prevBtn.addEventListener("click", () => {
      if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
        updateProgress();
        updateNavigation();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentSlide < totalQuestions - 1) {
        currentSlide++;
        showSlide(currentSlide);
        updateProgress();
        updateNavigation();
      }
    });

    checkBtn.addEventListener("click", () => {
      const currentSlideElement = slides[currentSlide];
      const questionId = currentSlideElement.dataset.questionId;
      const correctAnswer = currentSlideElement.dataset.correctAnswer;
      const correctAnswers = currentSlideElement.dataset.correctAnswers;
      const feedback = currentSlideElement.querySelector(".mcq-question-feedback");

      let isCorrect = false;
      let feedbackText = "";

      if (correctAnswer) {
        // Single correct answer
        const userAnswer = answers[questionId];
        isCorrect = userAnswer === correctAnswer;
        feedbackText = isCorrect
          ? "✅ Correct! Well done!"
          : `❌ Incorrect. The correct answer is: ${getCorrectAnswerText(currentSlideElement, correctAnswer)}`;
      } else if (correctAnswers) {
        // Multiple correct answers
        const correctAnswersArray = correctAnswers.split(",");
        const userAnswers = answers[questionId] || [];
        isCorrect = userAnswers.length === correctAnswersArray.length && userAnswers.every((ans) => correctAnswersArray.includes(ans));
        feedbackText = isCorrect
          ? "✅ Correct! All answers are right!"
          : `❌ Incorrect. The correct answers are: ${getCorrectAnswersText(currentSlideElement, correctAnswersArray)}`;
      }

      // Show feedback
      feedback.textContent = feedbackText;
      feedback.className = `mcq-question-feedback show ${isCorrect ? "correct" : "incorrect"}`;

      // Update button states
      checkBtn.disabled = true;
      if (currentSlide < totalQuestions - 1) {
        nextBtn.disabled = false;
      } else {
        finishBtn.disabled = false;
      }
    });

    finishBtn.addEventListener("click", () => {
      calculateFinalScore();
      showFinalResults();
    });

    restartBtn.addEventListener("click", () => {
      restartQuiz();
    });

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove("active", "prev");
        if (i === index) {
          slide.classList.add("active");
        } else if (i < index) {
          slide.classList.add("prev");
        }
      });
    }

    function updateProgress() {
      const progress = ((currentSlide + 1) / totalQuestions) * 100;
      progressFill.style.width = `${progress}%`;
      currentQuestionSpan.textContent = currentSlide + 1;
    }

    function updateNavigation() {
      const currentSlideElement = slides[currentSlide];
      const questionId = currentSlideElement.dataset.questionId;
      const hasAnswer = answers[questionId] && (Array.isArray(answers[questionId]) ? answers[questionId].length > 0 : true);
      const isChecked = currentSlideElement.querySelector(".mcq-question-feedback.show");

      // Previous button
      prevBtn.disabled = currentSlide === 0;

      // Check button
      checkBtn.disabled = !hasAnswer || isChecked;

      // Next button
      nextBtn.disabled = !isChecked || currentSlide === totalQuestions - 1;

      // Finish button
      finishBtn.disabled = !isChecked || currentSlide !== totalQuestions - 1;
    }

    function getCorrectAnswerText(slide, correctAnswer) {
      const correctOption = slide.querySelector(`input[value="${correctAnswer}"]`);
      return correctOption ? correctOption.closest(".mcq-option").querySelector(".mcq-option-label").textContent : correctAnswer;
    }

    function getCorrectAnswersText(slide, correctAnswersArray) {
      return correctAnswersArray.map((answer) => getCorrectAnswerText(slide, answer)).join(", ");
    }

    function calculateFinalScore() {
      correctAnswers = 0;
      slides.forEach((slide) => {
        const questionId = slide.dataset.questionId;
        const correctAnswer = slide.dataset.correctAnswer;
        const correctAnswersData = slide.dataset.correctAnswers;

        if (correctAnswer) {
          if (answers[questionId] === correctAnswer) {
            correctAnswers++;
          }
        } else if (correctAnswersData) {
          const correctAnswersArray = correctAnswersData.split(",");
          const userAnswers = answers[questionId] || [];
          if (userAnswers.length === correctAnswersArray.length && userAnswers.every((ans) => correctAnswersArray.includes(ans))) {
            correctAnswers++;
          }
        }
      });
    }

    function showFinalResults() {
      const percentage = Math.round((correctAnswers / totalQuestions) * 100);
      const scoreNumber = quizModule.querySelector(".mcq-score-number");
      const scoreMessage = quizModule.querySelector(".mcq-score-message");
      const scorePercentage = quizModule.querySelector(".mcq-score-percentage");

      scoreNumber.textContent = correctAnswers;
      scorePercentage.textContent = `${percentage}%`;

      if (percentage === 100) {
        scoreMessage.textContent = "Perfect! Outstanding work!";
      } else if (percentage >= 80) {
        scoreMessage.textContent = "Excellent! Great job!";
      } else if (percentage >= 60) {
        scoreMessage.textContent = "Good work! Keep it up!";
      } else {
        scoreMessage.textContent = "Keep practicing! You'll get there!";
      }

      // Hide quiz content and show results
      quizModule.querySelector(".mcq-progress").style.display = "none";
      quizModule.querySelector(".mcq-slider-container").style.display = "none";
      quizModule.querySelector(".mcq-navigation").style.display = "none";
      finalResults.style.display = "block";
    }

    function restartQuiz() {
      // Reset variables
      currentSlide = 0;
      answers = {};
      correctAnswers = 0;

      // Reset all slides
      slides.forEach((slide) => {
        const options = slide.querySelectorAll(".mcq-option");
        const inputs = slide.querySelectorAll("input");
        const feedback = slide.querySelector(".mcq-question-feedback");

        options.forEach((option) => option.classList.remove("selected"));
        inputs.forEach((input) => (input.checked = false));
        feedback.className = "mcq-question-feedback";
        feedback.textContent = "";
      });

      // Show first slide
      showSlide(0);
      updateProgress();
      updateNavigation();

      // Show quiz content and hide results
      quizModule.querySelector(".mcq-progress").style.display = "block";
      quizModule.querySelector(".mcq-slider-container").style.display = "block";
      quizModule.querySelector(".mcq-navigation").style.display = "flex";
      finalResults.style.display = "none";
    }
  }
})();

// Custom Dropdown Functionality - Global scope
function toggleCustomDropdown(trigger, event) {
  if (event) {
    event.stopPropagation();
  }
  const menu = trigger.nextElementSibling;
  menu.classList.toggle("show");
}
document.addEventListener("click", function (e) {
  if (!e.target.closest(".custom-dropdown")) {
    document.querySelectorAll(".custom-dropdown-menu.show").forEach((m) => m.classList.remove("show"));
  }
});

/*********************************************
 ********** Worksheet w/ Copy+Clear **********
 *********************************************/
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

function getCellValue(td) {
  // Prefer form control values if present; else fallback to text
  const ctrls = td.querySelectorAll("input, textarea, select");
  if (ctrls.length) {
    // Radios: only include checked
    const checkedRadios = td.querySelectorAll('input[type="radio"]:checked');
    if (checkedRadios.length) {
      return Array.from(checkedRadios)
        .map((el) => (el.value || "").trim())
        .filter(Boolean)
        .join(", ");
    }
    // Checkboxes: include values of checked; if none checked and only one exists, mark No
    const checkboxes = td.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length) {
      const picked = Array.from(checkboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value || "Yes");
      return picked.length ? picked.join(", ") : checkboxes.length === 1 ? "No" : "";
    }
    // Select(s), textarea, text-like inputs
    const vals = Array.from(ctrls)
      .map((el) => {
        const tag = el.tagName.toLowerCase();
        if (tag === "select") {
          const opts = Array.from(el.selectedOptions || []);
          return opts.map((o) => (o.textContent || "").trim()).join(", ");
        }
        if (tag === "textarea") return (el.value || "").trim();
        if (tag === "input") {
          const t = (el.type || "text").toLowerCase();
          if (t === "number" && el.value !== "") return String(el.value);
          return (el.value || "").trim();
        }
        return "";
      })
      .filter(Boolean);
    return vals.join(", ");
  }
  // contenteditable or plain text
  if (td.hasAttribute("contenteditable")) return textify(td);
  return textify(td);
}

function tableToMarkdown(table) {
  const ths = Array.from(table.querySelectorAll("thead th")).map((th) => textify(th));
  const rows = Array.from(table.querySelectorAll("tbody tr")).map((tr) => Array.from(tr.cells).map((td) => mdEscape(getCellValue(td))));
  // Build markdown with explicit newlines (no raw newlines in strings)
  let out = "| " + ths.join(" | ") + " |" + "\n";
  out += "| " + ths.map(() => "---").join(" | ") + " |" + "\n";
  if (rows.length === 0) {
    out += "| " + ths.map(() => " ").join(" | ") + " |" + "\n";
  } else {
    rows.forEach((r) => {
      out += "| " + r.join(" | ") + " |" + "\n";
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
  const proto = tbody.querySelector("tr");
  let tr;
  if (proto) {
    // Clone existing structure (supports inputs/selects/textareas)
    tr = proto.cloneNode(true);
    tr.querySelectorAll("input, textarea").forEach((el) => {
      const t = (el.type || "text").toLowerCase();
      if (t === "checkbox" || t === "radio") el.checked = false;
      else el.value = "";

      // Preserve data-atlas-input attribute for prompt generation
      if (el.hasAttribute("data-atlas-input")) {
        const originalAttr = el.getAttribute("data-atlas-input");
        el.setAttribute("data-atlas-input", originalAttr);
      }
    });
    tr.querySelectorAll("select").forEach((sel) => {
      sel.selectedIndex = 0;

      // Preserve data-atlas-input attribute for prompt generation
      if (sel.hasAttribute("data-atlas-input")) {
        const originalAttr = sel.getAttribute("data-atlas-input");
        sel.setAttribute("data-atlas-input", originalAttr);
      }
    });
    tr.querySelectorAll("[contenteditable]").forEach((el) => {
      el.textContent = "";
    });
  } else {
    // No prototype row: create contenteditable cells from header count
    tr = document.createElement("tr");
    const ths = table.querySelectorAll("thead th");
    ths.forEach((th) => {
      const td = document.createElement("td");
      td.setAttribute("contenteditable", "true");
      td.setAttribute("role", "textbox");
      td.setAttribute("aria-label", textify(th));
      tr.appendChild(td);
    });
  }
  tbody.appendChild(tr);
  const focusable = tr.querySelector("input, textarea, select, td[contenteditable]");
  if (focusable) focusable.focus();
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
  tableMD() {
    const tbl = document.querySelector("table.worksheet-table");
    if (!tbl) return "";
    return tableToMarkdown(tbl);
  },
};

/* =============================================
     POPUP ELEMENT (HTML + minimal JS)
     ============================================= */
// Guard to avoid redeclaration when script is included multiple times
if (typeof window !== "undefined" && !window.PopupDialog) {
  class PopupDialog extends HTMLElement {
    constructor() {
      super();
      this.overlay = document.createElement("div");
      this.overlay.className = "popup-overlay";
      this.overlay.setAttribute("aria-hidden", "true");
      this.panel = document.createElement("div");
      this.panel.className = "popup-panel";
      const header = document.createElement("div");
      header.className = "popup-header";
      this.titleEl = document.createElement("h2");
      this.titleEl.className = "popup-title";
      this.titleEl.textContent = "Popup";
      const closeButton = document.createElement("button");
      closeButton.className = "popup-close-button";
      closeButton.textContent = "Close";
      closeButton.addEventListener("click", () => this.close());
      header.append(this.titleEl, closeButton);
      this.body = document.createElement("div");
      this.body.className = "popup-body";
      this.panel.append(header, this.body);
      this.overlay.append(this.panel);
      document.body.append(this.overlay);
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) this.close();
      });
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.close();
      });
    }
    open(options = {}) {
      const { title = "Popup", width, fullWidth = false, scrollable = false, html = "", node = null } = options;
      this.titleEl.textContent = title;
      if (fullWidth) this.panel.style.width = "100vw";
      else if (width) this.panel.style.width = width;
      else this.panel.style.width = "min(90vw, 900px)";
      this.body.classList.toggle("scrollable", !!scrollable);
      this.body.innerHTML = "";
      if (node) this.body.append(node);
      else if (html) this.body.innerHTML = html;
      this.overlay.setAttribute("aria-hidden", "false");
    }
    close() {
      this.overlay.setAttribute("aria-hidden", "true");
    }
  }
  // expose once on window and define custom element once
  window.PopupDialog = PopupDialog;
  if (!customElements.get("popup-dialog")) {
    customElements.define("popup-dialog", PopupDialog);
  }
}

// Lesson Info Popup Functionality
// Guard lesson info trigger in case it doesn't exist on this page
(function () {
  const trigger = document.getElementById("lesson-info-trigger");
  if (!trigger) return;
  trigger.addEventListener("click", () => {
    const tpl = document.getElementById("estimated-time-template");
    if (!tpl) return;
    const section = tpl.content.cloneNode(true);
    const dlg = document.getElementById("demo-popup");
    if (dlg && typeof dlg.open === "function") {
      dlg.open({ title: "Lesson Info", html: "", node: section, scrollable: false, width: "min(90vw, 720px)" });
    }
  });
})();

// SEO Preview functionality
(function setupHoverOnlySeoPreview() {
  const wrap = document.getElementById("seo-preview");
  if (!wrap) return;

  const link = wrap.querySelector(".preview-link");
  const hostEl = wrap.querySelector("#preview-hostname");
  const titleEl = wrap.querySelector("#preview-title");
  const descEl = wrap.querySelector("#preview-desc");
  const favicon = wrap.querySelector("#preview-favicon");
  let initialized = false;

  function deriveTitleFromUrl(url) {
    try {
      const u = new URL(url);
      return decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || u.hostname)
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    } catch {
      return "Preview";
    }
  }

  function hydrate() {
    if (initialized) return;
    const url = link.getAttribute("data-preview-url");
    try {
      hostEl.textContent = "Preview: " + new URL(url).hostname;
    } catch {
      hostEl.textContent = "Preview";
    }
    titleEl.textContent = link.getAttribute("data-preview-title") || deriveTitleFromUrl(url);
    descEl.textContent = link.getAttribute("data-preview-description") || "Static preview. Provide data-preview-description to customize.";
    try {
      favicon.textContent = new URL(url).hostname[0].toUpperCase();
    } catch {
      favicon.textContent = "🌐";
    }
    initialized = true;
  }

  wrap.addEventListener("mouseenter", hydrate, { once: true });
})();
