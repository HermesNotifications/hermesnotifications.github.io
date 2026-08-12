/* Hermes site — progressive enhancement only. Everything works without it. */
(function () {
  "use strict";

  /* ---- Disclosure toggles (mobile nav, docs sidebar) --------------------- */

  document.querySelectorAll(".nav-toggle[aria-controls]").forEach(function (btn) {
    var target = document.getElementById(btn.getAttribute("aria-controls"));
    if (!target) return;

    btn.addEventListener("click", function () {
      var open = target.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });

    // Close after following an in-page link on small screens.
    target.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.matchMedia("(max-width: 900px)").matches) {
        target.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  /* ---- Copy buttons on code blocks -------------------------------------- */

  document.querySelectorAll(".code-block").forEach(function (block) {
    var code = block.querySelector("code");
    if (!code || !navigator.clipboard) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = "copy";
    btn.setAttribute("aria-label", "Copy code to clipboard");

    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(code.innerText.trim()).then(
        function () {
          btn.textContent = "copied";
          setTimeout(function () { btn.textContent = "copy"; }, 1600);
        },
        function () { btn.textContent = "failed"; }
      );
    });

    block.appendChild(btn);
  });

  /* ---- Docs: sidebar filter + ⌘K ---------------------------------------- */

  var search = document.getElementById("docs-search-input");
  if (search) {
    var sidebar = document.getElementById("docs-sidebar");
    var status = document.getElementById("docs-search-status");
    var groups = sidebar ? Array.prototype.slice.call(sidebar.children) : [];

    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var hits = 0;

      groups.forEach(function (group) {
        var items = group.querySelectorAll("li");
        if (!items.length) return;
        var shown = 0;

        items.forEach(function (li) {
          var match = !q || li.textContent.toLowerCase().indexOf(q) !== -1;
          li.hidden = !match;
          if (match) shown++;
        });

        group.hidden = shown === 0;
        hits += shown;
      });

      if (status) {
        status.textContent = q ? hits + " matching page" + (hits === 1 ? "" : "s") : "";
      }
    });

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (sidebar) sidebar.classList.add("is-open");
        search.focus();
        search.select();
      } else if (e.key === "Escape" && document.activeElement === search) {
        search.value = "";
        search.dispatchEvent(new Event("input"));
        search.blur();
      }
    });
  }

  /* ---- Docs: highlight the current section in the on-page contents ------- */

  var toc = document.querySelector(".docs-toc");
  if (toc && "IntersectionObserver" in window) {
    var links = {};
    toc.querySelectorAll('a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });

    var headings = Object.keys(links)
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    if (headings.length) {
      var visible = new Set();

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
          });

          var active = headings.filter(function (h) { return visible.has(h.id); })[0];
          if (!active) return;

          Object.keys(links).forEach(function (id) {
            links[id].classList.toggle("is-active", id === active.id);
          });
        },
        { rootMargin: "-70px 0px -65% 0px", threshold: 0 }
      );

      headings.forEach(function (h) { observer.observe(h); });
    }
  }
})();
