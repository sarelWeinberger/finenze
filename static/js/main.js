/* ═══════════════════════════════════════════
   FINENZE — Main JavaScript
   ═══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

    // ── Navbar scroll effect ──
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // ── Mobile nav toggle ──
    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navLinks.classList.toggle("open");
            navToggle.classList.toggle("active");
        });

        // Close mobile nav on link click
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("open");
                navToggle.classList.remove("active");
            });
        });
    }

    // ── Animated stat counters ──
    const animateCounters = () => {
        document.querySelectorAll(".stat-value[data-target]").forEach(el => {
            const target = parseFloat(el.dataset.target);
            const duration = 2000;
            const start = performance.now();
            const isDecimal = target % 1 !== 0;

            const step = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const ease = 1 - Math.pow(1 - progress, 3);
                const current = target * ease;

                el.textContent = isDecimal
                    ? current.toFixed(1)
                    : Math.floor(current);

                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };

            requestAnimationFrame(step);
        });
    };

    // Run counters when hero is in view
    const heroObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    heroObserver.disconnect();
                }
            });
        },
        { threshold: 0.3 }
    );

    const heroStats = document.querySelector(".hero-stats");
    if (heroStats) heroObserver.observe(heroStats);

    // ── Scroll fade-in animations ──
    const fadeEls = document.querySelectorAll(
        ".service-card, .kyc-feature, .about-card, .contact-form, .contact-info"
    );

    fadeEls.forEach(el => el.classList.add("fade-in"));

    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    fadeEls.forEach(el => fadeObserver.observe(el));

    // ── Terminal animation restart on view ──
    const terminal = document.querySelector(".terminal");
    if (terminal) {
        const termObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Restart animations by re-adding elements
                        terminal.querySelectorAll(".terminal-line").forEach(line => {
                            line.style.animation = "none";
                            line.offsetHeight; // force reflow
                            line.style.animation = "";
                        });
                    }
                });
            },
            { threshold: 0.3 }
        );
        termObserver.observe(terminal);
    }

    // ── Contact form ──
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            formStatus.textContent = "";
            formStatus.className = "form-status";

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = "Please fill in all fields.";
                formStatus.classList.add("error");
                return;
            }

            try {
                const res = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, message }),
                });

                const data = await res.json();

                if (res.ok) {
                    formStatus.textContent = data.message;
                    formStatus.classList.add("success");
                    contactForm.reset();
                } else {
                    formStatus.textContent = data.message || "Something went wrong.";
                    formStatus.classList.add("error");
                }
            } catch {
                formStatus.textContent = "Network error. Please try again.";
                formStatus.classList.add("error");
            }
        });
    }

    // ── Smooth scroll for anchor links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
});
