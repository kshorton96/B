/* Static archive viewer. Record text is rendered as text, never HTML. */
(async () => {
  "use strict";
  const $ = (id) => document.getElementById(id),
    el = (tag, text) => {
      const n = document.createElement(tag);
      if (text !== undefined) n.textContent = text;
      return n;
    };
  let records = [],
    map,
    layer,
    selected = null;
  const markers = new Map();
  for (const c of Atlas.categories) {
    const l = el("label"),
      i = el("input");
    i.type = "checkbox";
    i.value = c;
    l.append(i, document.createTextNode(" " + c));
    $("categories").append(l);
  }
  function filters() {
    return {
      q: $("search").value,
      categories: [...$("categories").querySelectorAll("input:checked")].map(
        (i) => i.value,
      ),
      from: Number($("from").value) || null,
      to: Number($("to").value) || null,
      unknown: $("unknown-years").checked,
      demos: $("demos").checked,
      verified: $("verified").checked,
    };
  }
  function link(label, url) {
    const a = el("a", label);
    a.href = url;
    return a;
  }
  function close() {
    const previous = selected;
    selected = null;
    $("detail").hidden = true;
    history.pushState(null, "", location.pathname + location.search);
    render();
    document.querySelector('[data-record-id="' + previous + '"]')?.focus();
  }
  function select(p, update = true) {
    selected = p.id;
    const d = $("detail");
    d.hidden = false;
    d.replaceChildren();
    const b = el("button", "Close record");
    b.onclick = close;
    const tools = el("div");
    tools.className = "reader-tools";
    tools.append(el("span", "Harmon County Historical Atlas"), b);
    const ref = el("p", "Archive record " + p.id);
    ref.className = "archive-ref";
    const context = el(
      "p",
      [p.categories.join(" · "), p.period].filter(Boolean).join(" — "),
    );
    context.className = "record-context";
    const evidence = el(
      "p",
      p.demo
        ? "ILLUSTRATIVE EXAMPLE — names, dates and coordinates are not verified."
        : `Verification: ${p.status} · Historical account: ${p.claimType} · Location: ${p.locationAccuracy}`,
    );
    evidence.className = "evidence";
    const narrative = el("p", p.description);
    narrative.className = "narrative";
    d.append(tools, ref, el("h2", p.name), context, evidence);
    const article = el("section");
    article.append(el("h3", "Historical account"), narrative);
    d.append(article);
    if (p.people.length || p.families.length) {
      const associations = el(
        "p",
        [
          p.people.length ? "People: " + p.people.join(", ") : "",
          p.families.length ? "Families: " + p.families.join(", ") : "",
        ]
          .filter(Boolean)
          .join(" · "),
      );
      d.append(associations);
    }
    const dl = el("dl");
    for (const [k, v] of Object.entries({
      "Other names": p.alternateNames.join(", "),
      Period: p.period,
      Years: `${p.startYear ?? "unknown"} – ${p.endYear ?? "unknown"}`,
      "Location accuracy": p.locationAccuracy,
      Coordinates: p.lat === null ? "Not recorded" : `${p.lat}, ${p.lng}`,
      "Land description": p.legalDescription,
      People: p.people.join(", "),
      Families: p.families.join(", "),
      Contributor: p.contributor,
      "Usage rights": p.rights,
    })) {
      dl.append(el("dt", k), el("dd", v || "Not recorded"));
    }
    const catalog = el("details"),
      catalogTitle = el("summary", "Archival details & location certainty");
    catalog.append(catalogTitle, dl);
    d.append(catalog);
    if (p.media.length) d.append(el("h3", "Photographs & documents"));
    for (const m of p.media) {
      const url = Atlas.safeURL(m.url);
      if (!url) continue;
      const fig = el("figure");
      if (m.type === "image") {
        const img = el("img");
        img.src = url;
        img.alt = m.alt;
        img.loading = "lazy";
        img.onerror = () => {
          img.replaceWith(
            el("p", "Image unavailable. Use the media link below."),
          );
        };
        fig.append(img);
      } else if (m.type === "audio") {
        const audio = el("audio");
        audio.controls = true;
        audio.preload = "none";
        audio.src = url;
        fig.append(audio);
      }
      fig.append(
        link(`Open ${m.type}`, url),
        el(
          "figcaption",
          [
            m.caption,
            m.date,
            m.source,
            m.credit,
            "Rights: " + m.rights,
            m.notes,
          ]
            .filter(Boolean)
            .join(" — "),
        ),
      );
      fig.append(
        link(
          "Do you recognize this photograph?",
          "contribute.html?record=" +
            encodeURIComponent(p.id) +
            "&media=" +
            encodeURIComponent(m.url) +
            "&place=" +
            encodeURIComponent(p.name),
        ),
      );
      if (m.type === "image" && !d.querySelector(".principal-image")) {
        fig.className = "principal-image";
        article.before(fig);
      } else d.append(fig);
    }
    d.append(el("h3", "Citations"));
    if (!p.sources.length)
      d.append(el("p", "No citations supplied; this record is unverified."));
    for (const s of p.sources) {
      const row = el("p");
      row.append(
        s.url ? link(s.title, Atlas.safeURL(s.url)) : el("span", s.title),
      );
      row.append(
        el(
          "span",
          " " +
            [s.author, s.date, s.reference, s.notes]
              .filter(Boolean)
              .join(" — "),
        ),
      );
      d.append(row);
    }
    for (const id of p.relatedIds) {
      const target = records.find((r) => r.id === id);
      if (target) {
        const a = link(
          "Related: " + target.name,
          "#record=" + encodeURIComponent(id),
        );
        d.append(a, el("br"));
      }
    }
    const contributeLink = link(
      p.identificationPrompt ||
        "Do you know more about this place? Share a photograph or story.",
      "contribute.html?record=" +
        encodeURIComponent(p.id) +
        "&place=" +
        encodeURIComponent(p.name),
    );
    contributeLink.className = "record-contribute";
    d.append(contributeLink);
    d.append(el("br"));
    d.append(
      link(
        "Permanent link to this record",
        "#record=" + encodeURIComponent(p.id),
      ),
    );
    if (update)
      history.pushState(null, "", "#record=" + encodeURIComponent(p.id));
    render();
    if (map && markers.has(p.id)) {
      const m = markers.get(p.id);
      if (layer.zoomToShowLayer) layer.zoomToShowLayer(m, () => m.openPopup());
      else {
        map.setView(m.getLatLng(), 13);
        m.openPopup();
      }
    }
    d.scrollTop = 0;
    d.focus({ preventScroll: true });
  }
  function render() {
    const f = filters();
    $("filter-count").textContent =
      f.categories.length ||
      f.from ||
      f.to ||
      f.verified ||
      f.demos ||
      !f.unknown
        ? "· filters active"
        : "";
    const bad = f.from && f.to && f.from > f.to;
    const found = bad ? [] : records.filter((p) => Atlas.matches(p, f));
    $("status").textContent = bad
      ? "From year must be no later than To year."
      : records.every((p) => p.demo)
        ? "The archive is taking shape. No researched records have been published yet."
        : "";
    $("count").textContent = found.length + " records";
    const list = $("record-list");
    list.replaceChildren();
    if (!found.length) {
      if (records.every((p) => p.demo) && !f.demos) {
        const empty = el("div");
        empty.className = "empty-state";
        const tryExamples = el("button", "Explore the illustrative examples");
        tryExamples.onclick = () => {
          $("demos").checked = true;
          render();
        };
        empty.append(
          el("h3", "Help put our history on the map"),
          el(
            "p",
            "Photographs, documents and family recollections will build this atlas, one carefully researched place at a time.",
          ),
          tryExamples,
          link("Share your history", "contribute.html"),
        );
        list.append(empty);
      } else
        list.append(
          el(
            "p",
            "No matching records. Clear filters or adjust your selection.",
          ),
        );
    }
    layer?.clearLayers();
    markers.clear();
    for (const p of found) {
      const b = el("button");
      b.className = "record" + (selected === p.id ? " active" : "");
      b.dataset.recordId = p.id;
      b.setAttribute("aria-pressed", String(selected === p.id));
      b.append(
        el("strong", p.name),
        el("small", p.categories.join(" · ")),
        el(
          "span",
          p.demo
            ? "Illustrative example — unverified"
            : `${p.status} · ${p.locationAccuracy}`,
        ),
      );
      b.onclick = () => select(p);
      list.append(b);
      if (map && Number.isFinite(p.lat)) {
        const m = L.marker([p.lat, p.lng], {
          title: p.name,
          alt: p.name,
          icon: L.divIcon({
            className:
              "atlas-pin" + (p.locationAccuracy === "exact" ? "" : " approx"),
            iconSize: [18, 18],
          }),
        }).bindPopup(el("span", p.name));
        m.on("click", () => select(p));
        layer.addLayer(m);
        markers.set(p.id, m);
      }
    }
    if (selected && !found.some((p) => p.id === selected)) {
      $("detail").hidden = true;
      selected = null;
    }
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("detail").hidden) close();
  });
  function route() {
    const params = new URLSearchParams(location.hash.slice(1));
    if (!params.has("record")) {
      selected = null;
      $("detail").hidden = true;
      render();
      return;
    }
    const p = records.find((p) => p.id === params.get("record"));
    if (!p) {
      $("status").textContent = "Record link not found.";
      return;
    }
    clear();
    if (p.demo) $("demos").checked = true;
    select(p, false);
  }
  function clear() {
    for (const i of document.querySelectorAll(".toolbar input")) {
      if (i.type === "checkbox") i.checked = i.id === "unknown-years";
      else i.value = "";
    }
  }
  if (window.L) {
    map = L.map("map", { scrollWheelZoom: false }).setView([34.74, -99.83], 10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    layer = (
      L.markerClusterGroup ? L.markerClusterGroup() : L.layerGroup()
    ).addTo(map);
    if (!L.markerClusterGroup)
      $("map").after(
        el("p", "Clustering unavailable; showing individual markers."),
      );
  } else
    $("map").append(
      el("p", "Map unavailable. Browse all records using the list."),
    );
  try {
    const r = await fetch("data/records.json");
    if (!r.ok) throw Error("HTTP " + r.status);
    const archive = await r.json(),
      errors = Atlas.validate(archive);
    if (errors.length) throw Error(errors.join("; "));
    records = archive.records;
    render();
    route();
  } catch (e) {
    $("status").textContent =
      "Archive could not load. Use a web server, check data/records.json, and reload. " +
      e.message;
  }
  for (const i of document.querySelectorAll(".toolbar input"))
    i.addEventListener("input", render);
  $("reset").onclick = () => {
    clear();
    close();
  };
  window.addEventListener("hashchange", route);
  window.addEventListener("popstate", () => {
    if (location.hash.startsWith("#record=")) route();
    else {
      selected = null;
      $("detail").hidden = true;
      render();
    }
  });
})();
