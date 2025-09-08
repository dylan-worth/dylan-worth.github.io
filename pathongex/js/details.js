// js/detail.js
// Robust single-entry renderer for PathonGex

(function () {
  function getSlug() {
    // Prefer an explicitly-tagged script
    const tagged = document.querySelector('script[data-slug]');
    if (tagged && tagged.getAttribute('data-slug')) {
      return tagged.getAttribute('data-slug');
    }
    // Fallback: derive from URL /entries/<slug>.html
    const m = (location.pathname.match(/\/entries\/([^/]+)\.html$/) || []);
    return m[1] || null;
  }

  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  const slug = getSlug();

  ready(() => {
    const placeholder = document.getElementById("entry");
    if (!placeholder) {
      console.error("PathonGex: Missing #entry container on page.");
      return;
    }

    // dataset: prefer window.PATHONGEX, fallback to global if present
    const dataset =
      (typeof window !== "undefined" && window.PATHONGEX) ||
      (typeof PATHONGEX !== "undefined" ? PATHONGEX : []);

    const entry = dataset.find((e) => e.slug === slug);

    if (!entry) {
      placeholder.innerHTML = `<p>Entry not found${slug ? ` for slug “${slug}”` : ""}.</p>`;
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
})();