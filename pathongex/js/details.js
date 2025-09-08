// js/detail.js
// Renders a single entry page based on the data-slug attribute on this script tag.

document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("entry");
  const selfScript = document.currentScript;
  if (!placeholder || !selfScript) return;

  const slug = selfScript.getAttribute("data-slug");
  const entry = (window.PATHONGEX || []).find((e) => e.slug === slug);

  if (!entry) {
    placeholder.innerHTML = "<p>Entry not found.</p>";
    return;
  }

  const typeClass =
    entry.type === "mold"
      ? "badge--mold"
      : entry.type === "bacteria"
      ? "badge--bacteria"
      : "badge--virus";

  const meta = `
    <div class="entry-title">
      <h1>${entry.name}</h1>
      <span class="badge ${typeClass}">${entry.type}</span>
    </div>
    <div class="entry-meta">
      ${entry.aka?.length ? `Also known as: <em>${entry.aka.join(", ")}</em>` : ""}
    </div>
  `;

  const kv = `
    <div class="kv">
      <div><strong>Typical size:</strong><br>${entry.size_um || "—"}</div>
      <div><strong>Common habitats:</strong><br>${(entry.habitats || []).join(", ") || "—"}</div>
      <div><strong>Category:</strong><br>${entry.type}</div>
    </div>
  `;

  const notes = `
    <div class="section">
      <h2>Field Notes</h2>
      <ul>${(entry.notes || []).map((n) => `<li>${n}</li>`).join("")}</ul>
      <p class="note">Educational building-science reference. For health concerns or regulatory work, follow applicable standards and guidance.</p>
    </div>
  `;

  placeholder.innerHTML = `
    <nav class="breadcrumbs"><a href="../index.html">← Back to search</a></nav>
    <article class="entry-hero">
      ${meta}
      ${kv}
      ${notes}
    </article>
  `;
});