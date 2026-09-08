document.addEventListener("DOMContentLoaded", () => {
  // --- CONTENT COPY-PASTE & RIGHT CLICK DISABLE ---
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  document.addEventListener("copy", (e) => {
    e.preventDefault();
  });

  document.addEventListener("cut", (e) => {
    e.preventDefault();
  });

  document.addEventListener("paste", (e) => {
    e.preventDefault();
  });

  document.addEventListener("selectstart", (e) => {
    e.preventDefault();
  });

  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  // Block Developer Tools and Save Shortcuts
  window.addEventListener("keydown", (e) => {
    F12
    if (e.key === "F12" || e.keyCode === 123) {
      e.preventDefault();
      return false;
    }
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
    if (
      e.ctrlKey &&
      e.shiftKey &&
      (e.key === "I" ||
        e.key === "i" ||
        e.key === "J" ||
        e.key === "j" ||
        e.key === "C" ||
        e.key === "c")
    ) {
      e.preventDefault();
      return false;
    }
    // Ctrl+U (View Source)
    if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+S (Save Page)
    if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+P (Print)
    if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
      e.preventDefault();
      return false;
    }
    // Ctrl+C, Ctrl+X, Ctrl+A
    if (
      e.ctrlKey &&
      (e.key === "c" ||
        e.key === "C" ||
        e.key === "x" ||
        e.key === "X" ||
        e.key === "a" ||
        e.key === "A")
    ) {
      e.preventDefault();
      return false;
    }
  });

  // --- STICKY NAV ACTION ---
  const header = document.querySelector("header");
  const handleScroll = () => {
    const scrollTop =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop;
    if (scrollTop > 150) {
      header.classList.add("fixed-nav");
    } else {
      header.classList.remove("fixed-nav");
    }
  };
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check on load

  // --- MOBILE MENU AUTOMATION (LEFT SLIDE DRAWER) ---
  const navbarCollapse = document.getElementById("navbarNav");
  const menuBtn = document.getElementById("custom-menu-toggle");
  const mobileCloseBtn = document.getElementById("mobileDrawerClose");
  const navBackdrop = document.getElementById("navBackdrop");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

  const openMenu = () => {
    navbarCollapse.classList.add("show-drawer");
    navBackdrop.classList.add("show");
    menuBtn.classList.remove("collapsed");
    document.body.style.overflow = "hidden"; // Lock background scroll
  };

  const closeMenu = () => {
    navbarCollapse.classList.remove("show-drawer");
    navBackdrop.classList.remove("show");
    menuBtn.classList.add("collapsed");
    document.body.style.overflow = ""; // Unlock background scroll
  };

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      const isOpen = navbarCollapse.classList.contains("show-drawer");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (mobileCloseBtn) {
    mobileCloseBtn.addEventListener("click", closeMenu);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener("click", closeMenu);
  }

  // Close mobile nav when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 992) {
        closeMenu();
      }
    });
  });

  // Handle window resize to desktop to clean up states
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 992) {
      closeMenu();
    }
  });

  // --- SMOOTH SCROLL NAV LINK ACTIVE HIGHLIGHT ---
  const sections = document.querySelectorAll("section[id]");

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120; // offset header height
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };
  window.addEventListener("scroll", highlightNav);
  highlightNav(); // Initial highlight on load

  // --- STATS COUNT UP ANIMATION ---
  const statsSection = document.querySelector(".stats-section");
  let countersAnimated = false;

  const animateCounters = () => {
    if (countersAnimated) return;

    const counters = document.querySelectorAll(".stat-num");
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      const suffix = counter.getAttribute("data-suffix") || "";
      let count = 0;
      const duration = 1800; // milliseconds
      const increment = target / (duration / 16); // 60 FPS

      const updateCount = () => {
        count += increment;
        if (count < target) {
          counter.textContent = Math.floor(count) + suffix;
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target + suffix;
        }
      };

      updateCount();
    });

    countersAnimated = true;
  };

  // Intersection Observer to fire stats animation
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target); // Run once
          }
        });
      },
      { threshold: 0.2 },
    );

    statsObserver.observe(statsSection);
  }

  // --- CATEGORY FILTER TABS FOR PROJECTS ---
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectItems = document.querySelectorAll(".project-grid-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active state on button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectItems.forEach((item) => {
        const itemCategory = item.getAttribute("data-category");
        if (filterValue === "all" || itemCategory === filterValue) {
          item.classList.remove("hide-item");
        } else {
          item.classList.add("hide-item");
        }
      });
    });
  });

  // --- YOUTUBE ID EXTRACTOR HELPER ---
  const extractYouTubeId = (url) => {
    if (!url) return "";
    url = url.trim();
    // If it's already an 11-char ID
    if (/^[A-Za-z0-9_-]{11}$/.test(url)) {
      return url;
    }
    // Matches youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID, etc.
    const regExp = /(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = url.match(regExp);
    if (match && match[1]) {
      return match[1];
    }
    // Fallback: extract any 11-character string after a slash or =
    const fallbackMatch = url.match(/[\/=]([A-Za-z0-9_-]{11})(?:[?&#]|$)/);
    return fallbackMatch && fallbackMatch[1] ? fallbackMatch[1] : url;
  };

  // --- FEATURED PROJECTS MODAL VIEWER DATABASE ---
  const projectCards = document.querySelectorAll(".project-card-custom");
  const modalElement = document.getElementById("portfolio-modal");

  // Project database with rich descriptions & customizable YouTube links
  const projectDetails = {
    VideoOne: {
      title: "Elegant Invitation Card Design",
      description:
        "A thoughtfully designed invitation card combining elegant typography, refined visuals, and a clean layout to create a premium and memorable first impression.",
      client: "Mr. Zulfeqar Khan",
      type: "Instagram Reel / Short Video",
      software: "Canva & Capcut",
      date: "Recent Work",
      youtubeUrl: "https://youtube.com/shorts/-EUUpgNxZBc",
      aspectRatio: "vertical", // "vertical" (9:16) or "horizontal" (16:9)
    },
    VideoTwo: {
      title: "Lead Generation Short Video",
      description:
        "A short-form promotional video created for Hum Sabhi, designed to capture attention, communicate the key message quickly, and encourage viewers to take action.",
      client: "Hum Sabhi Group",
      type: "Instagram Reel / Short Video",
      software: "Canva",
      date: "Recent Work",
      youtubeUrl: "https://youtube.com/shorts/vbkxjJHQpYA",
      aspectRatio: "vertical",
    },
    ThumbOne: {
      title: "Pro Sales & Marketing Upskill Program",
      description:
        "A high-impact 9:16 vertical creative and YouTube thumbnail designed for Offers Vedaa. Promotes the Pro Sales & Marketing Upskill Program focusing on practical skill acquisition, career acceleration, and job-ready industry training with bold 3D extruded typography, energized student imagery, growth graph arrows, and vibrant orange-cyan lighting.",
      client: "Offers Vedaa",
      type: "YouTube Thumbnail / 9:16 Creative",
      software: "Canva",
      date: "Recent Work",
    },
    VideoThree: {
      title: "Promotional Video",
      description:
        "A dynamic promotional video crafted for Offers Vedaa to showcase exciting deals, capture audience attention, and drive engagement through compelling visuals and fast-paced storytelling.",
      client: "Offers Vedaa",
      type: "Promo / Social Reel",
      software: "CapCut",
      date: "Recent Work",
      youtubeUrl: "https://youtube.com/shorts/aFhU6JbK2T8",
      aspectRatio: "vertical",
    },
    VideoFour: {
      title: "Introducing RaizonCare",
      description:
        "A clean and engaging intro video created for RaizonCare to introduce its brand, establish a professional identity, and build an instant connection with the audience through impactful visuals and storytelling.",
      client: "Raizoncare Pvt Ltd",
      type: "Intro Video",
      software: "Capcut",
      date: "Recent Work",
      youtubeUrl: "https://youtu.be/tvagHZV2JJA",
      aspectRatio: "horizontal",
    },
    SocialOne: {
      title: "Offers Vedaa - Multi-Service Marketplace Banner",
      description:
        "A comprehensive wide digital promotional banner for Offers Vedaa's all-in-one digital platform ('Best Offers, Trusted Services, Brighter Careers - Sab Kuch Ek Platform Par'). Designed with 3D navy shopping bags, gift boxes, discount tags, and clean service category callouts (Exclusive Offers, Professional Services, Career Growth).",
      client: "Offers Vedaa",
      type: "Social Media Banner / Ad Graphic",
      software: "Canva",
      date: "Recent Work",
    },
    SocialTwo: {
      title: "Techomind - Smart IT Solutions & Business Growth Campaign",
      description:
        "A split-concept visual storytelling promotional graphic for Techomind IT Company. Contrasts the daily stress and chaos of traditional offline business ('No Website. No Online Presence. No Customers.') against automated digital growth and delighted customers enabled through Web Development, SEO Services, and Social Media Marketing.",
      client: "Techomind - An IT Company",
      type: "Social Media Story / Ad Banner",
      software: "Canva",
      date: "Recent Work",
    },
    VideoFive: {
      title: "Cinematic Visuals & Landscape Reel",
      description:
        "An AI-powered visual video created for RaizonCare, featuring vibrant Sea Buckthorn berries to bring the brand’s natural essence to life through cinematic visuals and engaging storytelling.",
      client: "Raizoncare Pvt Ltd",
      type: "Cinematic Intro Video",
      software: "Capcut & AI",
      date: "Recent Work",
      youtubeUrl: "https://youtu.be/tvagHZV2JJA",
      aspectRatio: "horizontal",
    },
    VideoSix: {
      title: "Festive Promotional Video",
      description:
        "A festive promotional video created for Shridham Homestay, blending the vibrant spirit of Durga Puja with the warmth and comfort of a memorable stay through engaging visuals and storytelling.",
      client: "Shridham Homestay",
      type: "Instagram Reel / Short Video",
      software: "Canva",
      date: "Recent Work",
      youtubeUrl: "https://youtube.com/shorts/OD0rJ1vcFJo",
      aspectRatio: "vertical",
    },
    ThumbTwo: {
      title: "Safar Sarthi - Har Safar Yaadgaar Travel Creative",
      description:
        "An emotional and vibrant 9:16 vertical travel creative and thumbnail designed for Safar Sarthi Tour & Travels ('Aapka trusted travel partner'). Highlights a joyful Indian family selfie against the iconic Varanasi Ghats and historic temple architecture during golden hour, with bold 3D 'Har Safar Yaadgaar' typography and dynamic flight graphics.",
      client: "Safar Sarthi Tour & Travels",
      type: "YouTube Thumbnail / 9:16 Poster",
      software: "Canva",
      date: "Recent Work",
    },
    VideoSeven: {
      title: "Festive Promotional Video",
      description:
        "A festive promotional video created for Hotel RK Grand, capturing the warmth, elegance, and celebratory spirit of Diwali through vibrant visuals and engaging storytelling.",
      client: "Hotel RK Grand",
      type: "Instagram Reel / Short Video",
      software: "Canva",
      date: "Recent Work",
      youtubeUrl: "https://youtube.com/shorts/Wl02Z0wc7bU",
      aspectRatio: "vertical",
    },
    ThumbThree: {
      title: "The Awakers Society - Awake, Skill, Empower Poster",
      description:
        "An inspiring 9:16 vertical motivational poster and thumbnail created for The Awakers Society. Emphasizes youth skill empowerment with Indian tricolor brush stroke banners ('Awake, Skill, Empower'), custom badge icons (Brain, Skill, Team), and energetic youth celebrating towards a bright sunrise over the city skyline.",
      client: "The Awakers Society",
      type: "Motivational Creative / 9:16 Thumbnail",
      software: "Canva",
      date: "Recent Work",
    },
    SocialThree: {
      title: "Manan Home Stay - Poster",
      description:
        "A clean hospitality social media poster and brand creative designed for Manan Home Stay.",
      client: "Manan Home Stay",
      type: "Hospitality Social Media Poster",
      software: "Canva Pro",
      date: "Recent Work",
    },
    SocialFour: {
      title: "Shree Narayana P Guest House - Diwali Special Campaign",
      description:
        "A warm golden festive holiday promotional flyer created for Diwali bookings at Shree Narayana P Guest House. Designed with dangling circular ornament photo frames showcasing deluxe room suites, hanging snowflakes, illuminated traditional Diwali diyas, and direct contact booking details.",
      client: "Shree Narayana P Guest House (Varanasi)",
      type: "Festive Campaign Flyer / Poster",
      software: "Canva",
      date: "Recent Work",
    },
    SocialFive: {
      title: "Mughal Mahal Restaurant - Diwali Festive Food Creative",
      description:
        "A mouthwatering royal culinary festive creative designed for Mughal Mahal Restaurant at Hotel Regency. Features royal terracotta and warm tones, intricate Indian mandala patterns, golden Diwali diyas, and authentic menu highlights showcasing Chickpeas Curry and Chapati with operational details.",
      client: "Hotel Regency & Mughal Mahal Restaurant",
      type: "Restaurant Food Menu Creative",
      software: "Canva",
      date: "Recent Work",
    },
    SocialSix: {
      title: "Shree Narayana P Guest House - Luxury Stay Poster",
      description:
        "A majestic hospitality advertising creative designed for Shree Narayana P Guest House. Set against the iconic Kashi Vishwanath Ganga Dwar stone archway backdrop, it features torn-paper framed room snapshots and a clear checklist of premium guest facilities (Pets Allowed, On-site Parking, Laundry Service, CCTV Surveillance, Non-Smoking Rooms).",
      client: "Shree Narayana P Guest House (Varanasi)",
      type: "Hospitality Promotional Poster",
      software: "Canva",
      date: "Recent Work",
    },
  };

  if (modalElement && projectCards.length > 0) {
    const modalImg = document.getElementById("modal-img");
    const modalVideoBox = document.getElementById("modal-video-box");
    const modalYoutubeIframe = document.getElementById("modal-youtube-iframe");
    const modalVideo = document.getElementById("modal-video");
    const modalTag = document.getElementById("modal-tag");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalYtDirectBtn = document.getElementById("modal-yt-direct-btn");
    const metaClient = document.getElementById("meta-client");
    const metaType = document.getElementById("meta-type");
    const metaSoftware = document.getElementById("meta-software");
    const metaDate = document.getElementById("meta-date");
    const modalImgWrapper = document.querySelector(".modal-media-wrapper");

    // Dynamic thumbnail assignment for video cards from active YouTube links
    projectCards.forEach((card) => {
      const isVideoCard = card.classList.contains("project-video-card");
      if (isVideoCard) {
        const id = card.getAttribute("data-id");
        const data = id && projectDetails[id] ? projectDetails[id] : {};
        const ytUrl = card.getAttribute("data-youtube-url") || data.youtubeUrl || "";
        const ytId = extractYouTubeId(ytUrl);
        const thumb = card.querySelector(".project-thumbnail");
        if (thumb && ytId) {
          const ytThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
          thumb.style.backgroundImage = `url('${ytThumb}')`;
          thumb.style.backgroundSize = "cover";
          thumb.style.backgroundPosition = "center";
          thumb.setAttribute("data-bg", ytThumb);
        }
      }
    });

    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        const id = card.getAttribute("data-id");
        const isVideoCard = card.classList.contains("project-video-card");
        const data = id && projectDetails[id] ? projectDetails[id] : {};

        // Extract category safely
        const categoryBadge =
          card.querySelector(".media-type-badge") ||
          card.querySelector(".project-cat-badge");
        const cardTitleEl = card.querySelector(".project-title-name");

        const category = categoryBadge
          ? categoryBadge.textContent.trim()
          : data.type || "Featured Project";
        const title =
          data.title ||
          (cardTitleEl ? cardTitleEl.textContent.trim() : "Featured Project");
        const description =
          data.description ||
          "A showcase of creative design and high-quality visual content crafted with modern digital tools.";
        const client = data.client || "Creative Project";
        const type = data.type || category;
        const software = data.software || "Canva & AI Tools";
        const date = data.date || "Recent Work";

        if (isVideoCard) {
          const ytUrl = card.getAttribute("data-youtube-url") || data.youtubeUrl || "";
          const ytId = extractYouTubeId(ytUrl);
          const isVertical =
            data.aspectRatio === "vertical" ||
            card.querySelector(".vertical-ratio-video") !== null;

          if (modalImgWrapper) {
            modalImgWrapper.classList.remove("modal-ratio-vertical", "modal-ratio-horizontal");
            modalImgWrapper.classList.add(isVertical ? "modal-ratio-vertical" : "modal-ratio-horizontal");
          }

          if (modalImg) {
            modalImg.classList.add("d-none");
            modalImg.removeAttribute("src");
          }
          if (modalVideo) {
            modalVideo.pause();
            modalVideo.classList.add("d-none");
            modalVideo.removeAttribute("src");
          }

          if (modalVideoBox && modalYoutubeIframe && ytId) {
            modalVideoBox.classList.remove("d-none");
            let embedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`;
            if (window.location.origin && window.location.origin !== "null" && !window.location.origin.startsWith("file:")) {
              embedUrl += `&origin=${encodeURIComponent(window.location.origin)}`;
            }
            modalYoutubeIframe.src = embedUrl;
          }

          if (modalYtDirectBtn && ytId) {
            modalYtDirectBtn.href = ytUrl.startsWith("http") ? ytUrl : `https://youtube.com/watch?v=${ytId}`;
            modalYtDirectBtn.classList.remove("d-none");
          }
        } else {
          const thumbnailEl = card.querySelector(".project-thumbnail");
          const bgUrl = thumbnailEl ? thumbnailEl.getAttribute("data-bg") : "";

          if (modalImgWrapper) {
            modalImgWrapper.classList.remove("modal-ratio-vertical", "modal-ratio-horizontal");
          }
          if (modalVideoBox && modalYoutubeIframe) {
            modalVideoBox.classList.add("d-none");
            modalYoutubeIframe.src = "";
          }
          if (modalYtDirectBtn) {
            modalYtDirectBtn.classList.add("d-none");
            modalYtDirectBtn.href = "#";
          }
          if (modalVideo) {
            modalVideo.pause();
            modalVideo.classList.add("d-none");
            modalVideo.removeAttribute("src");
          }
          if (modalImg) {
            modalImg.classList.remove("d-none");
            modalImg.src = bgUrl;
            modalImg.alt = title;
          }
        }

        if (modalTag) modalTag.textContent = category;
        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = description;
        if (metaClient) metaClient.textContent = client;
        if (metaType) metaType.textContent = type;
        if (metaSoftware) metaSoftware.textContent = software;
        if (metaDate) metaDate.textContent = date;

        const bsModal = bootstrap.Modal.getOrCreateInstance(modalElement);
        bsModal.show();
      });
    });

    // Pause modal video & reset media when modal is closed
    modalElement.addEventListener("hidden.bs.modal", () => {
      if (modalVideoBox && modalYoutubeIframe) {
        modalYoutubeIframe.src = "";
        modalVideoBox.classList.add("d-none");
      }
      if (modalYtDirectBtn) {
        modalYtDirectBtn.classList.add("d-none");
        modalYtDirectBtn.href = "#";
      }
      if (modalVideo) {
        modalVideo.pause();
        modalVideo.removeAttribute("src");
        modalVideo.load();
        modalVideo.classList.add("d-none");
      }
      if (modalImg) {
        modalImg.removeAttribute("src");
      }
      if (modalImgWrapper) {
        modalImgWrapper.classList.remove("modal-ratio-vertical", "modal-ratio-horizontal");
      }
    });
  }

  // --- SERVICES CARD ACTION TO TRIGGER PROJECT FILTER ---
  const serviceActionLinks = document.querySelectorAll("[data-service-filter]");
  serviceActionLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const filterCategory = link.getAttribute("data-service-filter");
      if (filterCategory) {
        const targetBtn = document.querySelector(
          `.filter-btn[data-filter="${filterCategory}"]`
        );
        if (targetBtn) {
          targetBtn.click();
        }
      }
    });
  });

  // --- SERVICE CARDS 3D TILT & MOUSE-GLOW EFFECT ---
  const serviceCards = document.querySelectorAll(".service-card-premium");
  serviceCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth > 991) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        card.style.transform = `perspective(1000px) rotateX(${-deltaY * 4}deg) rotateY(${deltaX * 4}deg) translateY(-8px)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  // --- HERO DYNAMIC TYPEWRITER ANIMATION ---
  const typewriterElement = document.getElementById("heroTypewriter");
  if (typewriterElement) {
    const terms = [
      "Video Editing & Content Production",
      "Portfolio Design",
      "Social Media Design & Branding",
      "Thumbnail Design & Visual Content",
    ];
    let termIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 70;
    const deleteSpeed = 35;
    const holdDelay = 1900;

    const runTypewriter = () => {
      const currentTerm = terms[termIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentTerm.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElement.textContent = currentTerm.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === currentTerm.length) {
        setTimeout(() => {
          isDeleting = true;
          runTypewriter();
        }, holdDelay);
        return;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        termIndex = (termIndex + 1) % terms.length;
        setTimeout(runTypewriter, 350);
        return;
      }

      setTimeout(runTypewriter, isDeleting ? deleteSpeed : typeSpeed);
    };

    runTypewriter();
  }
});
