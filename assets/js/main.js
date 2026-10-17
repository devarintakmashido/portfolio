/* Arindam Rathore — portfolio interactions. Vanilla JS, no dependencies. */
(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EMAIL = 'arindam.rathore26@gmail.com';
  const GITHUB = 'https://github.com/devarintakmashido';
  const LINKEDIN = 'https://www.linkedin.com/in/arindam-rathore-a3a360240/';
  const RESUME = 'assets/Arindam_Rathore_Resume.pdf';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
  };
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const rand = (a, b) => a + Math.random() * (b - a);
  const clock = () => new Date().toTimeString().slice(0, 8);

  /* ---------------------------------------------------------------
     Content as data (drives the JSON view)
     --------------------------------------------------------------- */
  const DATA = {
    about: {
      name: 'Arindam Rathore',
      role: 'Backend Engineer',
      status: 'open_to_work',
      looking_for: ['Backend Engineer', 'Software Development Engineer (SDE)'],
      location: 'Bengaluru, India',
      timezone: 'IST (UTC+05:30)',
      summary: 'I build backend systems that stay fast and correct under load. 2+ years at Ellucian shipping Java & Groovy services for the Banner ERP suite.',
      core_stack: ['Java 21', 'Spring Boot', 'Spring Security', 'Hibernate / JPA', 'MySQL', 'PostgreSQL', 'Oracle DB', 'Redis', 'Docker'],
      links: { email: 'mailto:' + EMAIL, github: GITHUB, linkedin: LINKEDIN, resume: RESUME },
    },
    work: [
      {
        company: 'Ellucian', product: 'Banner ERP suite', location: 'Bengaluru, India',
        role: 'Software Engineer 1', from: '2023-06', to: '2025-07',
        highlights: [
          'Shipped 15+ RESTful APIs in Groovy on Grails and Spring across a Docker-based microservices setup',
          'Tuned MySQL and Oracle schemas and indexes to clear query bottlenecks',
          'Automated API regression testing with Playwright + Node.js inside Jenkins CI/CD',
          'Fixed production transaction failures caused by Oracle CLOB handling',
          'Profiled Grails and Hibernate services to remove bottlenecks in high-usage endpoints',
          'Made client onboarding configuration-driven with schema templates and extension payloads',
        ],
        stack: ['Groovy', 'Grails', 'Spring', 'Hibernate', 'Oracle DB', 'MySQL', 'Docker', 'Jenkins', 'Playwright'],
      },
      {
        company: 'Ellucian', role: 'Technical Intern', from: '2023-02', to: '2023-05',
        highlights: [
          'Built business-logic APIs that automated manual student-data workflows',
          'Designed MySQL schemas for new backend services; tested APIs with Postman',
        ],
        next: 'promoted_to_full_time',
      },
    ],
    projects: [
      {
        name: 'Prism', featured: true, category: 'api', date: '2026-10',
        summary: 'API gateway for LLM providers: one OpenAI-compatible endpoint with per-team keys, rate limits, budgets, metering and failover.',
        metrics: { overhead_p50_ms: 2, overhead_p95_ms: 12, over_admission: 0, failure_drill: '6/6', tests: 95 },
        stack: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Redis', 'Docker', 'Nginx', 'Testcontainers'],
        repo: GITHUB + '/prism-llm-gateway',
      },
      { name: 'TaskMaster', category: 'api', date: '2026-08', summary: 'Team task-management REST API with JWT auth, token revocation and team-scoped authorization.', stack: ['Spring Boot', 'Spring Security', 'JWT', 'MySQL', 'JPA'], repo: GITHUB + '/TaskMaster' },
      { name: 'URL Shortener API', category: 'api', date: '2026-08', summary: 'Redis cache-aside redirects in front of MySQL, nightly expiry job, Docker and CI.', stack: ['Spring Boot', 'Redis', 'MySQL', 'Docker', 'GitHub Actions'], repo: GITHUB + '/UrlShortnerAPI' },
      { name: 'PayFlow', category: 'api', date: '2026-05', summary: 'UPI-style payments backend with layered architecture and JPQL queries.', stack: ['Java 17', 'Spring Boot 3', 'JPA', 'H2'], repo: GITHUB + '/PayFlow-backend_project' },
      { name: 'Smart Parking Lot', category: 'lld', date: '2026-03', summary: 'Allocation by vehicle size, strategy-based fees, concurrency-safe park/unpark.', stack: ['Java', 'OOP', 'Strategy', 'Concurrency'], repo: GITHUB + '/SmartParkingLotLLD' },
      { name: 'Library Management System', category: 'lld', date: '2026-02', summary: 'SOLID + Strategy, Factory and Observer patterns with FIFO reservations.', stack: ['Java', 'SOLID', 'Design Patterns'], repo: GITHUB + '/LibraryManagementSystemLLD' },
      { name: 'MediTrack', category: 'lld', date: '2026-02', summary: 'Layered core-Java clinic and appointment system with Streams analytics.', stack: ['Core Java', 'Streams', 'File I/O'], repo: GITHUB + '/MediTrack-Clinic-Appointment-Management-System' },
      { name: 'RAG Resume Matcher', category: 'ai', date: '2026-05', summary: 'Section-aware chunking, ChromaDB, hybrid scoring, precision@K evaluation.', stack: ['Python', 'Embeddings', 'ChromaDB'], repo: GITHUB + '/RAGbasedProfileMatching' },
      { name: 'MCP Filesystem Server', category: 'ai', date: '2026-06', summary: 'JSON-RPC 2.0 MCP server with path sandboxing, driven by a LangGraph agent.', stack: ['Python', 'MCP', 'LangGraph', 'asyncio'], repo: GITHUB + '/MCPIntegration' },
      { name: 'Agentic Profile Matching', category: 'ai', date: '2026-05', summary: 'LangGraph workflow for multi-round resume screening and reports.', stack: ['Python', 'LangGraph', 'Function calling'], repo: GITHUB + '/AgenticProfileMatching' },
    ],
    playground: {
      rate_limiter: { algorithm: 'sliding_window_log', limit: 5, window_ms: 10000, store: 'redis sorted set', atomicity: 'single Lua script' },
      cache: { pattern: 'cache_aside', cache: 'redis', source_of_truth: 'mysql', ttl_s: 30 },
      failover: { timeout_ms: 300, max_attempts_per_provider: 3, backoff: 'exponential (100ms × 2^n) + jitter', providers: ['alpha', 'beta'], health_ejection: true },
      tip: 'Switch to the Human view to run these.',
    },
    skills: {
      languages: ['Java', 'Groovy', 'SQL', 'Python'],
      frameworks: ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'Grails'],
      data: ['MySQL', 'Oracle DB', 'PostgreSQL', 'Redis'],
      architecture: ['REST APIs', 'Microservices', 'JWT', 'System Design', 'Low-Level Design', 'Design Patterns', 'Concurrency', 'Caching'],
      devops_testing: ['Docker', 'Jenkins', 'GitHub Actions', 'Maven', 'JUnit 5', 'Testcontainers', 'Playwright', 'Postman'],
      education: { degree: 'B.E. Computer Science & Engineering', school: 'Oxford College of Engineering (VTU)', from: '2019-08', to: '2023-05', cgpa: 8.41 },
      achievements: ['Runner-up, Ellucian company-wide hackathon (2023)', '160+ DSA problems solved on LeetCode'],
    },
    contact: {
      email: 'mailto:' + EMAIL,
      linkedin: LINKEDIN,
      github: GITHUB,
      resume: RESUME,
      open_to: ['Backend Engineer', 'SDE'],
      location: 'Bengaluru, India',
      preferred_channel: 'email',
    },
  };

  const PROM = [
    ['experience_months', 'Professional backend experience', 'gauge', [['{company="ellucian",track="intern→sde1"}', 30]]],
    ['rest_apis_shipped_total', 'REST APIs shipped to production', 'counter', [['{stack="grails,spring"}', 15]]],
    ['gateway_overhead_ms', 'Latency Prism adds per request', 'summary', [['{project="prism",quantile="0.5"}', 2], ['{project="prism",quantile="0.95"}', 12]]],
    ['ci_tests_total', 'Automated tests on every push', 'gauge', [['{project="prism",kind="unit+testcontainers"}', 95]]],
    ['leetcode_solved_total', 'DSA problems solved', 'counter', [['', 160]]],
  ];

  /* ---------------------------------------------------------------
     Toast + clipboard
     --------------------------------------------------------------- */
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.innerHTML = '<svg><use href="#i-check"/></svg>' + esc(msg);
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
  async function copy(text, msg) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      ta.remove();
    }
    toast(msg);
  }
  $$('.copy-email').forEach((b) => b.addEventListener('click', () => copy(EMAIL, 'Email copied: ' + EMAIL)));

  /* ---------------------------------------------------------------
     Theme + view mode
     --------------------------------------------------------------- */
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : darkMQ.matches;
  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    store.set('ar-theme', next);
    toast(next === 'dark' ? 'Dark mode on' : 'Light mode on');
  }
  $('#themeBtn').addEventListener('click', toggleTheme);

  // Keep the section you're reading pinned in place when the layout swaps.
  function anchorSection() {
    const secs = $$('main > section[id]');
    const probe = 90;
    return secs.find((sec) => { const r = sec.getBoundingClientRect(); return r.top <= probe && r.bottom > probe; }) || null;
  }
  function setView(v, announce) {
    const anchor = announce ? anchorSection() : null;
    const offset = anchor ? anchor.getBoundingClientRect().top : 0;
    if (v === 'json') root.dataset.view = 'json'; else delete root.dataset.view;
    if (anchor) window.scrollTo({ top: anchor.offsetTop - offset, behavior: 'instant' });
    $$('[data-set-view]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.setView === v)));
    store.set('ar-view', v);
    if (announce) toast(v === 'json' ? 'JSON view: every section is now an API response' : 'Human view');
  }
  const toggleView = () => setView(root.dataset.view === 'json' ? 'human' : 'json', true);
  $$('[data-set-view]').forEach((b) => b.addEventListener('click', () => setView(b.dataset.setView, true)));
  setView(root.dataset.view === 'json' ? 'json' : 'human', false);

  /* ---------------------------------------------------------------
     JSON renderer
     --------------------------------------------------------------- */
  function highlight(obj) {
    const json = esc(JSON.stringify(obj, null, 2));
    return json.replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g, (m) => {
      if (m[0] === '"') {
        if (/:$/.test(m)) return '<span class="j-key">' + m.replace(/\s*:$/, '') + '</span><span class="j-punc">:</span>';
        const inner = m.slice(1, -1);
        if (/^(https?:\/\/|mailto:|assets\/)/.test(inner)) {
          const ext = /^https?:/.test(inner) ? ' target="_blank" rel="noopener"' : '';
          const dl = inner.startsWith('assets/') ? ' download' : '';
          return '<a class="j-str" href="' + inner + '"' + ext + dl + '>' + m + '</a>';
        }
        return '<span class="j-str">' + m + '</span>';
      }
      if (/^(true|false|null)$/.test(m)) return '<span class="j-bool">' + m + '</span>';
      return '<span class="j-num">' + m + '</span>';
    }).replace(/([{}\[\],])/g, '<span class="j-punc">$1</span>');
  }
  function promText() {
    return PROM.map(([name, help, type, rows]) =>
      '<span class="p-help"># HELP ' + name + ' ' + esc(help) + '</span>\n' +
      '<span class="p-help"># TYPE ' + name + ' ' + type + '</span>\n' +
      rows.map(([lbl, val]) => '<span class="p-name">' + name + '</span><span class="p-lbl">' + esc(lbl) + '</span> <span class="p-val">' + val + '</span>').join('\n')
    ).join('\n');
  }
  const ENDPOINTS = {
    about: ['GET', '/api/v1/about'],
    metrics: ['GET', '/actuator/prometheus'],
    work: ['GET', '/api/v1/work'],
    projects: ['GET', '/api/v1/projects?sort=impact'],
    playground: ['GET', '/api/v1/playground/config'],
    skills: ['GET', '/api/v1/skills'],
    contact: ['GET', '/api/v1/contact'],
  };
  $$('.view-json[data-json]').forEach((el) => {
    const key = el.dataset.json;
    const [verb, path] = ENDPOINTS[key];
    const isProm = key === 'metrics';
    const ms = Math.round(rand(2, 9));
    const raw = isProm ? null : JSON.stringify(DATA[key], null, 2);
    el.innerHTML =
      '<div class="json-panel">' +
        '<div class="json-head"><span><b>' + verb + '</b> ' + esc(path) + '</span>' +
        '<span class="ok">200 OK</span>' +
        '<span class="hdr">content-type: ' + (isProm ? 'text/plain; version=0.0.4' : 'application/json') + '</span>' +
        '<span class="hdr">x-response-time: ' + ms + 'ms</span>' +
        (raw ? '<button type="button" class="json-copy"><svg><use href="#i-copy"/></svg>copy</button>' : '') +
        '</div>' +
        '<pre class="json-body' + (isProm ? ' prom' : '') + '">' + (isProm ? promText() : highlight(DATA[key])) + '</pre>' +
      '</div>';
    const btn = $('.json-copy', el);
    if (btn) btn.addEventListener('click', () => copy(raw, 'Copied ' + path + ' response'));
  });

  /* ---------------------------------------------------------------
     Scroll: progress, top bar, active endpoint, reveals, counters
     --------------------------------------------------------------- */
  const bar = $('.progress span');
  const topbar = $('.topbar');
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
      topbar.classList.toggle('scrolled', scrollY > 8);
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const navLinks = $$('[data-nav]');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      navLinks.forEach((a) => a.classList.toggle('active', a.dataset.nav === id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[id]').forEach((s) => spy.observe(s));

  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealer.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
  $$('.reveal').forEach((el) => revealer.observe(el));

  const counters = $$('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countObs.unobserve(e.target);
      const el = e.target;
      const end = +el.dataset.count;
      if (reduceMotion) { el.textContent = end; return; }
      const t0 = performance.now(), dur = 1300;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
        if (p < 1) requestAnimationFrame(step);
      };
      el.textContent = '0';
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => countObs.observe(c));

  /* ---------------------------------------------------------------
     Hero: local time, photo fallback, tilt
     --------------------------------------------------------------- */
  const timeEl = $('#localTime');
  const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata', hour12: false });
  const tick = () => { timeEl.textContent = fmt.format(new Date()) + ' in Bengaluru (IST)'; };
  tick(); setInterval(tick, 15000);

  const photo = $('.photo');
  const img = $('.photo img');
  const noPhoto = () => photo.classList.add('no-photo');
  img.addEventListener('error', noPhoto);
  if (img.complete && img.naturalWidth === 0) noPhoto();

  const card = $('.tilt');
  if (card && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'transform .1s linear';
      card.style.transform = 'perspective(900px) rotateY(' + (x * 7).toFixed(2) + 'deg) rotateX(' + (-y * 7).toFixed(2) + 'deg)';
    });
    card.addEventListener('pointerleave', () => {
      card.style.transition = '';
      card.style.transform = '';
    });
  }

  /* ---------------------------------------------------------------
     Tabs (accessible, arrow-key navigation)
     --------------------------------------------------------------- */
  function initTabs(list, onChange) {
    const tabs = $$('[role="tab"]', list);
    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
      if (onChange) onChange(tab);
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        let j = null;
        if (e.key === 'ArrowRight') j = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft') j = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = tabs.length - 1;
        if (j !== null) { e.preventDefault(); select(tabs[j], true); }
      });
    });
    return { select: (id) => { const t = tabs.find((x) => x.id === id); if (t) select(t); } };
  }
  $$('.feature .tabs').forEach((l) => initTabs(l));
  const labTabs = initTabs($('.lab-tabs'));

  /* ---------------------------------------------------------------
     Project filters
     --------------------------------------------------------------- */
  const cards = $$('.cards .card');
  const chips = $$('.chip[data-filter]');
  chips.forEach((c) => {
    const f = c.dataset.filter;
    $('.count', c).textContent = f === 'all' ? cards.length : cards.filter((k) => k.dataset.cat === f).length;
    c.addEventListener('click', () => {
      chips.forEach((x) => x.setAttribute('aria-pressed', String(x === c)));
      cards.forEach((k, i) => {
        const show = f === 'all' || k.dataset.cat === f;
        k.classList.toggle('hide', !show);
        k.classList.remove('pop');
        if (show) {
          k.classList.add('in');
          void k.offsetWidth;
          k.style.animationDelay = (i % 3) * 40 + 'ms';
          k.classList.add('pop');
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     Console helper
     --------------------------------------------------------------- */
  function logTo(listEl, html, max = 80) {
    const first = listEl.firstElementChild;
    if (first && first.classList.contains('muted') && listEl.children.length === 1) first.remove();
    const li = document.createElement('li');
    li.innerHTML = '<span class="t">' + clock() + '</span> ' + html;
    listEl.appendChild(li);
    while (listEl.children.length > max) listEl.firstElementChild.remove();
    listEl.scrollTop = listEl.scrollHeight;
  }

  /* ---------------------------------------------------------------
     Playground 1: sliding-window rate limiter
     --------------------------------------------------------------- */
  (function rateLimiter() {
    const LIMIT = 5, WINDOW = 10000;
    const track = $('#rlTrack'), quota = $('#rlBar'), count = $('#rlCount'), log = $('#rlLog');
    const segs = $$('i', quota);
    let events = [];
    let raf = null;
    let lastCount = -1;

    const inWindow = (now) => events.filter((e) => e.ok && now - e.t < WINDOW);

    function paint() {
      const now = performance.now();
      const w = track.clientWidth;
      const usable = w - 36;
      events = events.filter((e) => {
        const age = now - e.t;
        if (age > WINDOW * 1.12) { e.el.remove(); return false; }
        e.el.style.left = (18 + usable * (1 - age / WINDOW)) + 'px';
        e.el.style.opacity = age > WINDOW ? String(Math.max(0, 1 - (age - WINDOW) / (WINDOW * 0.12))) : '';
        return true;
      });
      const n = inWindow(now).length;
      if (n !== lastCount) {
        lastCount = n;
        segs.forEach((s, i) => s.classList.toggle('on', i < n));
        quota.classList.toggle('full', n >= LIMIT);
        count.textContent = n + ' / ' + LIMIT + ' in window';
      }
      raf = events.length ? requestAnimationFrame(paint) : null;
      if (!raf) { lastCount = -1; segs.forEach((s) => s.classList.remove('on')); quota.classList.remove('full'); count.textContent = '0 / ' + LIMIT + ' in window'; }
    }

    function send() {
      const now = performance.now();
      const admitted = inWindow(now);
      const ok = admitted.length < LIMIT;
      const el = document.createElement('span');
      el.className = 'rl-dot new' + (ok ? '' : ' rej');
      track.appendChild(el);
      events.push({ t: now, ok, el });
      if (ok) {
        logTo(log, 'POST /chat → <span class="ok">200 OK</span> · ' + (LIMIT - admitted.length - 1) + ' left');
      } else {
        const retry = ((admitted[0].t + WINDOW - now) / 1000).toFixed(1);
        logTo(log, 'POST /chat → <span class="err">429</span> · retry in ' + retry + 's');
      }
      if (!raf) raf = requestAnimationFrame(paint);
    }

    $('#rlSend').addEventListener('click', send);
    $('#rlBurst').addEventListener('click', () => {
      for (let i = 0; i < 8; i++) setTimeout(send, i * 90);
    });
    $('#rlReset').addEventListener('click', () => {
      events.forEach((e) => e.el.remove());
      events = [];
      logTo(log, '<span class="info">DEL rl:demo</span> → window cleared');
    });
  })();

  /* ---------------------------------------------------------------
     Playground 2: cache-aside
     --------------------------------------------------------------- */
  (function cacheAside() {
    const TTL = 30000;
    const DEST = {
      x7Kp2a: 'github.com/devarintakmashido',
      Tm9qL1: 'linkedin.com/in/arindam-rathore',
      ab12Cd: 'github.com/…/prism-llm-gateway',
      Qz81nB: 'github.com/…/TaskMaster',
    };
    const cache = new Map();
    const hist = [];
    let hits = 0, misses = 0, total = 0;
    const log = $('#cLog'), spark = $('#cSpark');
    const node = (n) => $('.cd-node[data-node="' + n + '"]');
    const wire = (w) => $('.cd-wire[data-wire="' + w + '"]');

    function pulse(el, cls) {
      el.classList.remove('go', 'miss', 'lit', 'lit-miss');
      void el.offsetWidth;
      cls.split(' ').forEach((c) => c && el.classList.add(c));
    }
    function clearLights() { $$('.cd-node').forEach((n) => n.classList.remove('lit', 'lit-miss')); }

    function record(ms, hit) {
      total += ms;
      hit ? hits++ : misses++;
      hist.push({ ms, hit });
      if (hist.length > 18) hist.shift();
      $('#cRatio').textContent = Math.round((hits / (hits + misses)) * 100) + '%';
      $('#cAvg').textContent = (total / (hits + misses)).toFixed(1) + ' ms';
      spark.innerHTML = hist.map((h) =>
        '<i class="' + (h.hit ? '' : 'miss') + '" style="height:' + Math.max(14, Math.min(100, (h.ms / 48) * 100)).toFixed(0) + '%" title="' + h.ms.toFixed(1) + ' ms"></i>'
      ).join('');
    }

    $$('.code-btn').forEach((btn) => btn.addEventListener('click', () => {
      const code = btn.dataset.code;
      const now = Date.now();
      const hit = cache.has(code) && cache.get(code) > now;
      clearLights();
      if (hit) {
        const ms = rand(0.5, 1.4);
        pulse(wire('a'), 'go');
        setTimeout(() => node('redis').classList.add('lit'), 160);
        logTo(log, 'GET /r/' + code + ' <span class="ok">HIT</span> → 302 in ' + ms.toFixed(1) + 'ms');
        record(ms, true);
      } else {
        const ms = rand(22, 46);
        pulse(wire('a'), 'go miss');
        setTimeout(() => { node('redis').classList.add('lit-miss'); pulse(wire('b'), 'go miss'); }, 170);
        setTimeout(() => node('mysql').classList.add('lit-miss'), 360);
        logTo(log, 'GET /r/' + code + ' <span class="warn">MISS</span> → SELECT from MySQL');
        setTimeout(() => {
          logTo(log, '<span class="info">SET r:' + code + ' EX 30</span> → <span class="ok">302</span> in ' + ms.toFixed(1) + 'ms <span class="muted">→ ' + DEST[code] + '</span>');
        }, 380);
        cache.set(code, now + TTL);
        btn.classList.add('cached');
        record(ms, false);
      }
    }));

    setInterval(() => {
      const now = Date.now();
      cache.forEach((exp, code) => {
        if (exp <= now) {
          cache.delete(code);
          const b = $('.code-btn[data-code="' + code + '"]');
          if (b) b.classList.remove('cached');
          logTo(log, '<span class="muted">EXPIRED r:' + code + ' (ttl 30s)</span>');
        }
      });
    }, 1000);

    $('#cFlush').addEventListener('click', () => {
      cache.clear();
      $$('.code-btn').forEach((b) => b.classList.remove('cached'));
      clearLights();
      logTo(log, '<span class="info">FLUSHDB</span> → OK, next lookups go to MySQL');
    });
  })();

  /* ---------------------------------------------------------------
     Playground 3: retries, backoff, failover
     --------------------------------------------------------------- */
  (function failover() {
    const TIMEOUT = 300, ATTEMPTS = 3;
    const state = { alpha: 'up', beta: 'up' };
    let ejected = false;
    let busy = false;
    const log = $('#foLog'), wf = $('#foWaterfall'), sendBtn = $('#foSend'), chaosBtn = $('#foChaos');
    const provEl = (p) => $('.prov[data-prov="' + p + '"]');

    function setState(p, s, quiet) {
      state[p] = s;
      const el = provEl(p);
      el.dataset.state = s;
      $$('.seg-btn', el).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.state === s)));
      if (p === 'alpha') {
        chaosBtn.lastChild.textContent = s === 'up' ? 'Break alpha' : 'Heal alpha';
        if (s === 'up' && ejected) {
          ejected = false;
          el.classList.remove('skipped');
          if (!quiet) logTo(log, '<span class="info">probe</span> alpha <span class="ok">healthy, back in pool</span>');
        }
      }
    }
    ['alpha', 'beta'].forEach((p) => {
      $$('.seg-btn', provEl(p)).forEach((b) => b.addEventListener('click', () => setState(p, b.dataset.state)));
    });
    chaosBtn.addEventListener('click', () => setState('alpha', state.alpha === 'up' ? 'down' : 'up'));

    function plan() {
      const steps = [];
      let t = 0;
      const order = ejected ? ['beta'] : ['alpha', 'beta'];
      const notes = [];
      if (ejected) notes.push({ at: 0, html: '<span class="warn">health</span> alpha ejected → skip to beta' });
      for (const p of order) {
        for (let n = 1; n <= ATTEMPTS; n++) {
          const s = state[p];
          let dur, result;
          if (s === 'up') { dur = p === 'alpha' ? rand(85, 140) : rand(110, 175); result = 'ok'; }
          else if (s === 'slow') { dur = TIMEOUT; result = 'timeout'; }
          else { dur = rand(2, 6); result = 'refused'; }
          steps.push({ kind: 'try', prov: p, n, start: t, dur, result });
          t += dur;
          if (result === 'ok') return { steps, total: t, ok: true, via: p, notes };
          if (n < ATTEMPTS) {
            const base = 100 * Math.pow(2, n - 1);
            const wait = base + rand(0, base * 0.5);
            steps.push({ kind: 'wait', prov: p, n, start: t, dur: wait, base });
            t += wait;
          }
        }
        if (p === 'alpha') steps.push({ kind: 'failover', start: t, dur: 0 });
      }
      return { steps, total: t, ok: false, notes };
    }

    function send() {
      if (busy) return;
      busy = true;
      sendBtn.disabled = true;
      const run = plan();
      wf.innerHTML = '';
      const scale = run.total;
      run.notes.forEach((n) => logTo(log, n.html));
      logTo(log, 'POST /v1/chat/completions');

      let wall = 0;
      run.steps.forEach((s) => {
        const delay = Math.max(wall + 160, s.start * 0.9);
        wall = delay;
        setTimeout(() => {
          if (s.kind === 'failover') {
            logTo(log, '<span class="warn">failover</span> alpha → beta');
            if (!ejected) {
              ejected = true;
              provEl('alpha').classList.add('skipped');
              logTo(log, '<span class="warn">health</span> alpha ejected from pool');
            }
            return;
          }
          const row = document.createElement('div');
          row.className = 'wf-row';
          const left = (s.start / scale) * 100;
          const width = Math.max(0.8, (s.dur / scale) * 100);
          let cls = '', label = '';
          if (s.kind === 'wait') {
            cls = 'wait';
            label = 'wait ' + Math.round(s.dur) + 'ms';
            logTo(log, '  <span class="muted">backoff ' + Math.round(s.dur) + 'ms</span>');
          } else if (s.result === 'ok') {
            label = '200 · ' + Math.round(s.dur) + 'ms';
            logTo(log, '  → ' + s.prov + ' #' + s.n + ' <span class="ok">200 OK</span> ' + Math.round(s.dur) + 'ms');
          } else {
            cls = 'fail';
            label = s.result === 'timeout' ? 'timeout ' + TIMEOUT + 'ms' : 'refused';
            logTo(log, '  → ' + s.prov + ' #' + s.n + ' <span class="err">' + (s.result === 'timeout' ? 'timeout ' + TIMEOUT + 'ms' : 'refused') + '</span>');
          }
          const flip = left + width > 62;
          row.innerHTML = '<span>' + (s.kind === 'wait' ? 'backoff' : s.prov + ' #' + s.n) + '</span>' +
            '<div class="wf-track"><div class="wf-bar ' + cls + '" style="left:' + left.toFixed(2) + '%;width:' + width.toFixed(2) + '%">' +
            '<span' + (flip ? ' style="left:auto;right:calc(100% + 6px)"' : '') + '>' + label + '</span></div></div>';
          wf.appendChild(row);
        }, delay);
      });

      setTimeout(() => {
        const tot = document.createElement('div');
        tot.className = 'wf-total';
        const tries = run.steps.filter((s) => s.kind === 'try').length;
        tot.innerHTML = run.ok
          ? '→ <b class="ok">200 OK</b> via ' + run.via + ' · ' + Math.round(run.total) + ' ms · ' + tries + ' attempt' + (tries > 1 ? 's' : '')
          : '→ <b class="err">503 Service Unavailable</b> · all providers failed after ' + tries + ' attempts';
        wf.appendChild(tot);
        logTo(log, run.ok
          ? '<span class="ok">✓ 200 OK</span> via ' + run.via + ' in ' + Math.round(run.total) + 'ms'
          : '<span class="err">✗ 503</span> no healthy provider, fail fast');
        busy = false;
        sendBtn.disabled = false;
      }, wall + 260);
    }
    sendBtn.addEventListener('click', send);
  })();

  /* ---------------------------------------------------------------
     Skills + inspector
     --------------------------------------------------------------- */
  (function skills() {
    const GROUPS = {
      'languages': ['Java', 'Groovy', 'SQL', 'Python'],
      'frameworks': ['Spring Boot', 'Spring MVC', 'Spring Security', 'Spring Data JPA', 'Hibernate', 'Grails'],
      'data': ['MySQL', 'Oracle DB', 'PostgreSQL', 'Redis'],
      'architecture': ['REST APIs', 'Microservices', 'JWT', 'System Design', 'Low-Level Design', 'Design Patterns', 'Concurrency', 'Caching'],
      'devops & testing': ['Docker', 'Jenkins', 'GitHub Actions', 'Maven', 'JUnit 5', 'Testcontainers', 'Playwright', 'Postman'],
    };
    const USED = {
      'Java': ['Prism: Java 21 + virtual threads', 'TaskMaster, URL Shortener, PayFlow', 'Smart Parking, Library, MediTrack (LLD)', 'Ellucian: Spring services'],
      'Groovy': ['Ellucian: 15+ REST APIs on Grails'],
      'SQL': ['Ellucian: MySQL & Oracle tuning', 'Prism: reserve-then-settle budgets', 'PayFlow: JPQL queries'],
      'Python': ['RAG Resume Matcher', 'MCP Filesystem Server', 'Agentic Profile Matching'],
      'Spring Boot': ['Prism (multi-module)', 'TaskMaster', 'URL Shortener', 'PayFlow', 'Ellucian'],
      'Spring MVC': ['Ellucian: REST controllers', 'TaskMaster', 'PayFlow'],
      'Spring Security': ['TaskMaster: JWT filter chain, BCrypt, token revocation'],
      'Spring Data JPA': ['TaskMaster: JPA Specifications for search & paging', 'PayFlow: repositories + JPQL', 'URL Shortener'],
      'Hibernate': ['Ellucian: profiled Grails/Hibernate hot paths', 'TaskMaster'],
      'Grails': ['Ellucian: Banner ERP APIs'],
      'MySQL': ['Ellucian: schema & index tuning', 'TaskMaster', 'URL Shortener: source of truth'],
      'Oracle DB': ['Ellucian: fixed CLOB transaction failures', 'Ellucian: index tuning'],
      'PostgreSQL': ['Prism: keys, budgets, usage logs (+ pgvector)'],
      'Redis': ['Prism: atomic Lua sliding-window limiter', 'URL Shortener: cache-aside redirects'],
      'REST APIs': ['Ellucian: 15+ in production', 'Prism: OpenAI-compatible API', 'TaskMaster, URL Shortener, PayFlow'],
      'Microservices': ['Ellucian: Docker-based services', 'Prism: data / control plane split'],
      'JWT': ['TaskMaster: auth + token revocation'],
      'System Design': ['Prism: horizontally scaled gateway', 'URL Shortener: cache in front of DB'],
      'Low-Level Design': ['Smart Parking Lot', 'Library Management System', 'MediTrack'],
      'Design Patterns': ['Strategy: parking fees, book search', 'Factory: books, bills', 'Observer: reservation alerts'],
      'Concurrency': ['Prism: virtual threads, race-free limits', 'Smart Parking: safe park/unpark', 'MCP server: bounded async batches'],
      'Caching': ['URL Shortener: Redis cache-aside', 'Prism: per-team semantic cache'],
      'Docker': ['Ellucian: containerized services', 'Prism: full compose stack', 'URL Shortener'],
      'Jenkins': ['Ellucian: CI/CD with API regression suite'],
      'GitHub Actions': ['Prism: 95 tests on every push', 'URL Shortener: build on push'],
      'Maven': ['Prism (multi-module)', 'URL Shortener', 'TaskMaster', 'PayFlow'],
      'JUnit 5': ['Prism', 'TaskMaster'],
      'Testcontainers': ['Prism: tests against real Postgres & Redis'],
      'Playwright': ['Ellucian: automated API regression tests'],
      'Postman': ['Ellucian: API testing & contracts'],
    };
    const host = $('#skillGroups'), insp = $('#inspector');
    host.innerHTML = Object.entries(GROUPS).map(([g, list]) =>
      '<div class="sg"><h3>// ' + esc(g) + '</h3><ul>' +
      list.map((s) => '<li><button type="button" class="skill" aria-pressed="false" data-skill="' + esc(s) + '" data-group="' + esc(g) + '">' + esc(s) + '</button></li>').join('') +
      '</ul></div>'
    ).join('');

    function inspect(btn) {
      $$('.skill', host).forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      const s = btn.dataset.skill, g = btn.dataset.group;
      const uses = USED[s] || [];
      insp.innerHTML =
        '<span class="p">{</span><br>' +
        '&nbsp;&nbsp;<span class="k">"skill"</span><span class="p">:</span> <span class="s">"' + esc(s) + '"</span><span class="p">,</span><br>' +
        '&nbsp;&nbsp;<span class="k">"group"</span><span class="p">:</span> <span class="s">"' + esc(g) + '"</span><span class="p">,</span><br>' +
        '&nbsp;&nbsp;<span class="k">"used_in"</span><span class="p">: [</span>' +
        uses.map((u, i) => '<span class="use" style="animation-delay:' + i * 60 + 'ms">&nbsp;&nbsp;<span class="s">"' + esc(u) + '"</span>' + (i < uses.length - 1 ? '<span class="p">,</span>' : '') + '</span>').join('') +
        '&nbsp;&nbsp;<span class="p">]</span><br><span class="p">}</span>';
    }
    host.addEventListener('click', (e) => {
      const b = e.target.closest('.skill');
      if (b) inspect(b);
    });
    inspect($('.skill[data-skill="Redis"]', host));
  })();

  /* ---------------------------------------------------------------
     Contact terminal
     --------------------------------------------------------------- */
  (function terminal() {
    const out = $('#termOut'), btn = $('#termRun');
    let ran = false;
    const lines = [
      '<span class="ok">HTTP/1.1 201 Created</span>',
      '<span class="k">location</span>: mailto:' + EMAIL,
      '',
      '{',
      '  <span class="k">"candidate"</span>: <span class="s">"Arindam Rathore"</span>,',
      '  <span class="k">"status"</span>: <span class="s">"excited_to_talk"</span>,',
      '  <span class="k">"next_step"</span>: <span class="s">"email ' + EMAIL + '"</span>',
      '}',
    ];
    btn.addEventListener('click', () => {
      if (ran) { copy(EMAIL, 'Email copied: ' + EMAIL); return; }
      ran = true;
      btn.disabled = true;
      out.innerHTML = '';
      lines.forEach((l, i) => setTimeout(() => {
        out.innerHTML += l + '\n';
        if (i === lines.length - 1) {
          btn.disabled = false;
          btn.innerHTML = '<svg><use href="#i-copy"/></svg>Copy email';
        }
      }, 120 + i * (reduceMotion ? 0 : 110)));
    });
  })();

  /* ---------------------------------------------------------------
     Command palette
     --------------------------------------------------------------- */
  (function palette() {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    $$('.mod-key').forEach((k) => { k.textContent = isMac ? '⌘K' : 'Ctrl K'; });

    const pal = $('#palette'), input = $('#paletteInput'), list = $('#paletteList');
    const go = (id) => () => document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    const open = (url) => () => window.open(url, '_blank', 'noopener');
    const ICON = (id) => '<svg><use href="#' + id + '"/></svg>';
    const ITEMS = [
      { g: 'Navigate', t: 'About', k: 'home hero intro', ic: '/', run: go('about') },
      { g: 'Navigate', t: 'Work experience', k: 'ellucian job career', ic: '/', run: go('work') },
      { g: 'Navigate', t: 'Projects', k: 'prism taskmaster portfolio github', ic: '/', run: go('projects') },
      { g: 'Navigate', t: 'Playground', k: 'demo simulation interactive', ic: '/', run: go('playground') },
      { g: 'Navigate', t: 'Skills & education', k: 'stack tech degree', ic: '/', run: go('skills') },
      { g: 'Navigate', t: 'Contact', k: 'hire email reach', ic: '/', run: go('contact') },
      { g: 'Actions', t: 'Toggle JSON view', k: 'api raw developer mode', ic: '{}', hint: 'J', run: toggleView },
      { g: 'Actions', t: 'Toggle dark mode', k: 'theme light dark', ic: ICON('i-moon'), hint: 'T', run: toggleTheme },
      { g: 'Actions', t: 'Copy email address', k: 'contact mail', ic: ICON('i-mail'), run: () => copy(EMAIL, 'Email copied: ' + EMAIL) },
      { g: 'Actions', t: 'Download résumé (PDF)', k: 'cv resume pdf', ic: ICON('i-download'), run: () => { const a = document.createElement('a'); a.href = RESUME; a.download = 'Arindam_Rathore_Resume.pdf'; document.body.appendChild(a); a.click(); a.remove(); } },
      { g: 'Actions', t: 'Spam the rate limiter', k: 'redis 429 playground', ic: ICON('i-zap'), run: () => { setView('human'); labTabs.select('lt-rl'); go('playground')(); } },
      { g: 'Actions', t: 'Break the gateway', k: 'failover chaos retry', ic: ICON('i-reset'), run: () => { setView('human'); labTabs.select('lt-fo'); go('playground')(); } },
      { g: 'Links', t: 'GitHub', k: 'code repos source', ic: ICON('i-github'), hint: '↗', run: open(GITHUB) },
      { g: 'Links', t: 'LinkedIn', k: 'profile connect', ic: ICON('i-linkedin'), hint: '↗', run: open(LINKEDIN) },
      { g: 'Links', t: 'Prism source code', k: 'gateway repo', ic: ICON('i-code'), hint: '↗', run: open(GITHUB + '/prism-llm-gateway') },
    ];
    let shown = [], idx = 0, lastFocus = null;

    function render() {
      const q = input.value.trim().toLowerCase();
      shown = ITEMS.filter((it) => !q || (it.t + ' ' + it.k + ' ' + it.g).toLowerCase().includes(q));
      if (idx >= shown.length) idx = 0;
      if (!shown.length) { list.innerHTML = '<li class="palette-empty">No results for "' + esc(q) + '"</li>'; input.setAttribute('aria-activedescendant', ''); return; }
      let html = '', g = '';
      shown.forEach((it, i) => {
        if (it.g !== g) { g = it.g; html += '<li class="palette-group" role="presentation">' + g + '</li>'; }
        html += '<li class="palette-item" role="option" id="pi-' + i + '" data-i="' + i + '" aria-selected="' + (i === idx) + '">' +
          '<span class="pi-icon">' + it.ic + '</span>' + esc(it.t) + (it.hint ? '<span class="pi-hint">' + it.hint + '</span>' : '') + '</li>';
      });
      list.innerHTML = html;
      input.setAttribute('aria-activedescendant', 'pi-' + idx);
    }
    function move(d) {
      if (!shown.length) return;
      idx = (idx + d + shown.length) % shown.length;
      $$('.palette-item', list).forEach((el) => el.setAttribute('aria-selected', String(+el.dataset.i === idx)));
      const cur = $('#pi-' + idx);
      if (cur) cur.scrollIntoView({ block: 'nearest' });
      input.setAttribute('aria-activedescendant', 'pi-' + idx);
    }
    function exec(i) {
      const it = shown[i];
      if (!it) return;
      close();
      setTimeout(it.run, 10);
    }
    function openPal() {
      lastFocus = document.activeElement;
      pal.hidden = false;
      input.value = '';
      idx = 0;
      render();
      input.focus();
      document.body.style.overflow = 'hidden';
    }
    function close() {
      pal.hidden = true;
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }
    input.addEventListener('input', () => { idx = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) { e.preventDefault(); move(1); }
      else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) { e.preventDefault(); move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); exec(idx); }
      else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    list.addEventListener('mousemove', (e) => {
      const it = e.target.closest('.palette-item');
      if (it && +it.dataset.i !== idx) { idx = +it.dataset.i; move(0); }
    });
    list.addEventListener('click', (e) => {
      const it = e.target.closest('.palette-item');
      if (it) exec(+it.dataset.i);
    });
    pal.addEventListener('click', (e) => { if (e.target.hasAttribute('data-close')) close(); });
    $('#paletteBtn').addEventListener('click', openPal);

    document.addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPal() : close(); return; }
      if (!pal.hidden || typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'j') toggleView();
      else if (k === 't') toggleTheme();
      else if (k === '/') { e.preventDefault(); openPal(); }
    });
  })();

  /* ---------------------------------------------------------------
     Misc
     --------------------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear();

  console.log(
    '%c ar. %c Hey, fellow engineer! 👋',
    'background:#157A4A;color:#fff;font-weight:700;border-radius:4px;padding:2px 4px;font-family:monospace',
    'font-weight:600'
  );
  console.log('This site is hand-written HTML/CSS/JS. Press J for the JSON view.\nHiring a backend engineer? → ' + EMAIL);
})();
