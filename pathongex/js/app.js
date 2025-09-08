// js/app.js
// Renders search results for PathonGex on index.html

document.addEventListener("DOMContentLoaded", () => {
  const q = document.getElementById("search");
  const results = document.getElementById("results");

  if (!q || !results) return;

  function tagClass(t) {
    if (t === "mold") return "badge badge--mold";
    if (t === "bacteria") return "badge badge--bacteria";
    if (t === "virus") return "badge badge--virus";
    return "badge";
  }

  function render(list) {
    results.innerHTML = "";
    if (!list.length) {
      results.innerHTML = `<div class="empty">No matches. Try “mold”, “bacteria”, “virus”, or a name like “Stachy”.</div>`;
      return;
    }
    const frag = document.createDocumentFragment();

    list.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";
      card.innerHTML = `
        <div class="card-header">
          <div class="card-title">${item.name}</div>
          <span class="${tagClass(item.type)}">${item.type}</span>
        </div>
        <div class="card-body">${item.blurb}</div>
        <a class="btn" href="entries/${item.slug}.html" aria-label="Open ${item.name}">Open entry</a>
      `;
      frag.appendChild(card);
    });

    results.appendChild(frag);
  }

  function search(query) {
    const s = query.trim().toLowerCase();
    if (!s) return PATHONGEX;
    return PATHONGEX.filter((x) =>
      x.name.toLowerCase().includes(s) ||
      x.slug.toLowerCase().includes(s) ||
      (x.aka && x.aka.join(" ").toLowerCase().includes(s)) ||
      x.type.toLowerCase().includes(s)
    );
  }

  q.addEventListener("input", () => render(search(q.value)));

  // initial render
  render(PATHONGEX);
});