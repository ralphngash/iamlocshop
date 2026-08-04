/* I AM Loc Shop — site interactions */

(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  // Sticky header style on scroll
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Lion background fades out over first viewport of scroll (readability)
  const updateLionFade = () => {
    const range = Math.max(window.innerHeight * 0.85, 320);
    const y = window.scrollY || 0;
    // 1 at top → 0 after ~one screen of scroll
    const fade = Math.max(0, Math.min(1, 1 - y / range));
    document.documentElement.style.setProperty("--lion-fade", fade.toFixed(3));
  };
  window.addEventListener("scroll", updateLionFade, { passive: true });
  window.addEventListener("resize", updateLionFade, { passive: true });
  updateLionFade();

  // Mobile nav
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Service category tabs
  const tabs = document.querySelectorAll(".service-tab");
  const panels = document.querySelectorAll(".service-panel");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const id = tab.dataset.tab;
        tabs.forEach((t) => t.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));
        tab.classList.add("active");
        const panel = document.getElementById(id);
        if (panel) panel.classList.add("active");
      });
    });
  }

  // Scroll reveal — show above-the-fold immediately (no post-refresh jump)
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const show = (el) => el.classList.add("visible");
    const reduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced || !("IntersectionObserver" in window)) {
      reveals.forEach(show);
    } else {
      // Paint-critical: anything already in/near viewport starts visible
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.05) show(el);
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "40px 0px 0px 0px" }
      );
      reveals.forEach((el) => {
        if (!el.classList.contains("visible")) io.observe(el);
      });
    }
  }

  // Contact form — open mailto with filled fields
  const form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const first = data.get("first") || "";
      const last = data.get("last") || "";
      const email = data.get("email") || "";
      const phone = data.get("phone") || "";
      const location = data.get("location") || "";
      const message = data.get("message") || "";

      const subject = encodeURIComponent(
        `Service request — ${location || "I AM Loc Shop"}`
      );
      const body = encodeURIComponent(
        [
          `Name: ${first} ${last}`,
          `Email: ${email}`,
          `Phone: ${phone}`,
          `Location: ${location}`,
          "",
          "Message:",
          message,
        ].join("\n")
      );

      window.location.href = `mailto:info@iamnaturalbeauty.com?subject=${subject}&body=${body}`;
    });
  }

  // Current year in footer
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Gallery: show N photos + See more / dropdown
  const galleryGrid = document.getElementById("gallery-grid");
  const seeMoreBtn = document.getElementById("gallery-see-more");
  const pageSizeSelect = document.getElementById("gallery-page-size");
  const shownEl = document.getElementById("gallery-shown");
  const totalEl = document.getElementById("gallery-total");

  if (galleryGrid) {
    const items = Array.from(galleryGrid.querySelectorAll(".gallery-item"));
    let visibleCount = 10;

    const applyVisibility = (count) => {
      const limit = count === "all" ? items.length : Number(count);
      visibleCount = Math.min(limit, items.length);
      items.forEach((item, i) => {
        item.classList.toggle("is-hidden", i >= visibleCount);
      });
      if (shownEl) shownEl.textContent = String(visibleCount);
      if (totalEl) totalEl.textContent = String(items.length);
      if (seeMoreBtn) {
        const done = visibleCount >= items.length;
        seeMoreBtn.classList.toggle("is-done", done);
        seeMoreBtn.textContent = done ? "All photos shown" : "See more";
        seeMoreBtn.disabled = done;
      }
    };

    applyVisibility(10);

    if (pageSizeSelect) {
      pageSizeSelect.addEventListener("change", () => {
        const val = pageSizeSelect.value;
        applyVisibility(val === "all" ? "all" : val);
      });
    }

    if (seeMoreBtn) {
      seeMoreBtn.addEventListener("click", () => {
        const step = 10;
        const next = Math.min(visibleCount + step, items.length);
        applyVisibility(next);
        // keep dropdown in sync when possible
        if (pageSizeSelect) {
          if (next >= items.length) pageSizeSelect.value = "all";
          else if (next === 10 || next === 20 || next === 40) {
            pageSizeSelect.value = String(next);
          }
        }
      });
    }
  }
})();
