const revealNodes = document.querySelectorAll(".reveal");
const projectShell = document.getElementById("project-shell");
const form = document.getElementById("consultation-form");
const menuToggle = document.getElementById("menu-toggle");
const primaryNav = document.getElementById("primary-nav");
const navLinks = primaryNav ? Array.from(primaryNav.querySelectorAll('a[href^="#"]')) : [];
const explodingSection = document.getElementById("exploded-journey");
const explodingVideo = document.getElementById("exploding-video");
const explodingSteps = explodingSection
  ? Array.from(explodingSection.querySelectorAll(".explode-step"))
  : [];
const explodingProgress = document.getElementById("explode-progress-fill");
let explodingDuration = 0;
let activeExplodeStep = -1;
let lastExplodeProgress = -1;
const explodeSeekThreshold = 1 / 12;
const explodeScrubFps = 8;
let lastExplodeSeekTime = -1;
let lastExplodeFrameTs = 0;
const explodeFrameIntervalMs = 48;

const projectData = [
  {
    title: "The North Canal Penthouse",
    summary:
      "A layered residence with veined limestone walls, floating bronze shelves, and concealed perimeter lighting.",
    image: "https://picsum.photos/seed/penthouse-sculptural/1200/900",
    category: "residential",
    featured: true
  },
  {
    title: "Somerset Private Club",
    summary:
      "Muted oak, vellum-like wall finishes, and low-slung lounge geometry for quiet social rituals.",
    image: "https://picsum.photos/seed/private-club-lounge/1000/760",
    category: "hospitality",
    featured: false
  },
  {
    title: "Harborline Executive Suite",
    summary:
      "Sculpted acoustic panels and bronze-framed partitions designed for calm strategic sessions.",
    image: "https://picsum.photos/seed/executive-suite-refined/1000/760",
    category: "commercial",
    featured: false
  }
];

const filters = [
  { label: "All", value: "all" },
  { label: "Residential", value: "residential" },
  { label: "Hospitality", value: "hospitality" },
  { label: "Commercial", value: "commercial" }
];

if (revealNodes.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const setActiveNavLink = (sectionId) => {
  navLinks.forEach((link) => {
    const isActive = sectionId && link.getAttribute("href") === `#${sectionId}`;
    link.classList.toggle("is-active", Boolean(isActive));

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const closeMobileMenu = () => {
  if (!primaryNav || !menuToggle) {
    return;
  }

  primaryNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const willOpen = !primaryNav.classList.contains("is-open");
    primaryNav.classList.toggle("is-open", willOpen);
    menuToggle.setAttribute("aria-expanded", String(willOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

const navTargets = navLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { id: target.id, element: target } : null;
  })
  .filter(Boolean);

const updateActiveNavOnScroll = () => {
  if (!navTargets.length) {
    return;
  }

  const marker = window.scrollY + (document.querySelector(".topbar")?.offsetHeight || 0) + 92;
  let activeId = "";

  navTargets.forEach((target) => {
    if (marker >= target.element.offsetTop) {
      activeId = target.id;
    }
  });

  setActiveNavLink(activeId);
};

updateActiveNavOnScroll();
window.addEventListener("scroll", updateActiveNavOnScroll, { passive: true });
window.addEventListener("resize", updateActiveNavOnScroll);

const updateExplodingStory = () => {
  if (!explodingSection || !explodingSteps.length) {
    return;
  }

  const rect = explodingSection.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  // Skip expensive scrubbing work when the section is not close to view.
  if (rect.bottom < -viewportHeight * 0.18 || rect.top > viewportHeight * 1.18) {
    return;
  }

  const scrollDistance = Math.max(explodingSection.offsetHeight - window.innerHeight, 1);
  const progress = clamp(-rect.top / scrollDistance, 0, 1);

  if (explodingProgress && Math.abs(progress - lastExplodeProgress) > 0.006) {
    explodingProgress.style.transform = `scaleX(${Math.max(progress, 0.04)})`;
    lastExplodeProgress = progress;
  }

  const stepIndex = Math.min(explodingSteps.length - 1, Math.floor(progress * explodingSteps.length));
  if (stepIndex !== activeExplodeStep) {
    if (activeExplodeStep >= 0 && explodingSteps[activeExplodeStep]) {
      explodingSteps[activeExplodeStep].classList.remove("is-active");
    }
    if (explodingSteps[stepIndex]) {
      explodingSteps[stepIndex].classList.add("is-active");
    }
    activeExplodeStep = stepIndex;
  }

  if (explodingVideo && explodingDuration > 0) {
    const targetTime = progress * explodingDuration;
    const quantizedTargetTime = Math.round(targetTime * explodeScrubFps) / explodeScrubFps;

    if (
      !explodingVideo.seeking &&
      explodingVideo.readyState >= 2 &&
      Math.abs(lastExplodeSeekTime - quantizedTargetTime) >= explodeSeekThreshold &&
      Math.abs(explodingVideo.currentTime - quantizedTargetTime) > explodeSeekThreshold
    ) {
      try {
        if (typeof explodingVideo.fastSeek === "function") {
          explodingVideo.fastSeek(quantizedTargetTime);
        } else {
          explodingVideo.currentTime = quantizedTargetTime;
        }
        lastExplodeSeekTime = quantizedTargetTime;
      } catch (_error) {
        // Some browsers can reject frequent seeks momentarily while buffering metadata.
      }
    }
  }
};

if (explodingVideo) {
  explodingVideo.pause();
  explodingVideo.muted = true;
  explodingVideo.playsInline = true;

  const bindExplodingDuration = () => {
    if (Number.isFinite(explodingVideo.duration) && explodingVideo.duration > 0) {
      explodingDuration = Math.max(explodingVideo.duration - 0.01, 0);

      // Force an initial decodable frame before scroll scrubbing begins.
      if (explodingVideo.currentTime <= 0) {
        try {
          explodingVideo.currentTime = 0.001;
        } catch (_error) {
          // Some browsers briefly reject seeks until buffered data is available.
        }
      }

      updateExplodingStory();
    }
  };

  explodingVideo.addEventListener("loadedmetadata", bindExplodingDuration);
  explodingVideo.addEventListener("canplay", bindExplodingDuration);

  // Metadata may already be available before listeners are attached.
  if (explodingVideo.readyState >= 1) {
    bindExplodingDuration();
  } else {
    explodingVideo.load();
  }
}

let explodeFrameQueued = false;
const queueExplodingStoryUpdate = () => {
  if (explodeFrameQueued) {
    return;
  }

  explodeFrameQueued = true;
  window.requestAnimationFrame((timestamp) => {
    if (timestamp - lastExplodeFrameTs >= explodeFrameIntervalMs) {
      updateExplodingStory();
      lastExplodeFrameTs = timestamp;
    }
    explodeFrameQueued = false;
  });
};

queueExplodingStoryUpdate();
window.addEventListener("scroll", queueExplodingStoryUpdate, { passive: true });
window.addEventListener("resize", queueExplodingStoryUpdate);

const buildFilterBar = (activeValue) =>
  `<div class="filter-bar" role="tablist" aria-label="Project categories">
    ${filters
      .map(
        (filter) => `
      <button
        class="filter-chip ${filter.value === activeValue ? "active" : ""}"
        type="button"
        data-filter="${filter.value}"
        role="tab"
        aria-selected="${filter.value === activeValue}"
      >
        ${filter.label}
      </button>
    `
      )
      .join("")}
  </div>`;

const buildProjectsGrid = (items) => {
  if (!items.length) {
    return `<div class="empty-state">No projects match this selection yet. Choose another category.</div>`;
  }

  const featuredItem = items.find((item) => item.featured) || items[0];
  const stackItems = items.filter((item) => item !== featuredItem).slice(0, 2);

  return `<div class="projects-grid">
      <article class="project-feature">
        <img src="${featuredItem.image}" alt="${featuredItem.title}" loading="lazy" />
        <div class="project-copy">
          <h3>${featuredItem.title}</h3>
          <p>${featuredItem.summary}</p>
        </div>
      </article>
      <div class="project-stack">
        ${stackItems
          .map(
            (item) => `
          <article>
            <img src="${item.image}" alt="${item.title}" loading="lazy" />
            <div class="project-copy">
              <h3>${item.title}</h3>
              <p>${item.summary}</p>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </div>`;
};

const renderProjects = (category = "all") => {
  if (!projectShell) {
    return;
  }

  if (!Array.isArray(projectData) || !projectData.length) {
    projectShell.innerHTML = `<div class="error-state">Unable to load project data. Refresh or try again in a minute.</div>`;
    return;
  }

  const filtered =
    category === "all" ? projectData : projectData.filter((item) => item.category === category);

  const stackFill =
    filtered.length < 3 && category === "all"
      ? projectData.filter((item) => !filtered.includes(item)).slice(0, 3 - filtered.length)
      : [];

  const displayItems = [...filtered, ...stackFill];
  projectShell.innerHTML = `${buildFilterBar(category)}${buildProjectsGrid(displayItems)}`;

  const chips = projectShell.querySelectorAll("[data-filter]");
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      renderProjects(chip.dataset.filter || "all");
    });
  });
};

setTimeout(() => renderProjects("all"), 650);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const setError = (fieldId, message) => {
  const errorElement = document.getElementById(`${fieldId}-error`);
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearErrors = () => {
  ["name", "email", "scope"].forEach((field) => setError(field, ""));
};

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();

    const status = document.getElementById("form-status");
    const submitBtn = document.getElementById("submit-btn");
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const scope = document.getElementById("scope");

    if (!status || !submitBtn || !name || !email || !scope) {
      return;
    }

    let valid = true;

    if (!name.value.trim()) {
      setError("name", "Please add your full name.");
      valid = false;
    }

    if (!email.value.trim() || !emailPattern.test(email.value.trim())) {
      setError("email", "Please provide a valid email address.");
      valid = false;
    }

    if (scope.value.trim().length < 24) {
      setError("scope", "Add at least 24 characters with project context.");
      valid = false;
    }

    if (!valid) {
      status.textContent = "Please resolve the fields marked above.";
      return;
    }

    status.textContent = "Preparing consultation brief...";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    setTimeout(() => {
      status.textContent = "Brief received. Our studio coordinator will contact you within one business day.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Send brief";
      form.reset();
    }, 1200);
  });
}
