/* 34 Division — single-page app (no framework, no build step) */
(() => {
  'use strict';

  // ---------------------------------------------------------------- icons
  const P = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    alert: '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    vote: '<path d="m9 12 2 2 4-4"/><path d="M5 7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v12H5z"/><path d="M22 19H2"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    loader: '<path d="M21 12a9 9 0 1 1-6.22-8.56"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    family: '<path d="M3 21v-2a4 4 0 0 1 4-4h2M17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-1a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3v1"/>',
    rupee: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3a5 5 0 0 0 0-10"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    undo: '<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>',
    box: '<rect x="3" y="3" width="18" height="18" rx="4"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 15v2M11 11v6M15 7v10M19 12v5"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    boxcheck: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="m8 12 3 3 5-6"/>',
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

  // ---------------------------------------------------------------- utils
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const initials = (n) => String(n || '?').trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const fmtNum = (n) => Number(n || 0).toLocaleString('en-IN');
  const fmtMobile = (m) => (m && m.length === 10 ? `${m.slice(0, 5)} ${m.slice(5)}` : m || '');
  const fid = (n) => (n ? `F-${String(n).padStart(4, '0')}` : '');

  const TE = () => window.I18N && window.I18N.lang === 'te';
  const LOCALE = () => (TE() ? 'te-IN' : 'en-IN');
  const fmtDateTime = (d) => new Date(d).toLocaleString(LOCALE(), { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });

  function timeAgo(iso) {
    const d = new Date(iso);
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return TE() ? 'ఇప్పుడే' : 'just now';
    if (s < 3600) return TE() ? `${Math.floor(s / 60)} ని. క్రితం` : `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return TE() ? `${Math.floor(s / 3600)} గం. క్రితం` : `${Math.floor(s / 3600)}h ago`;
    return fmtDateTime(d);
  }

  // English / తెలుగు switch (shown on login, sidebar, top bar and More page).
  const langSwitch = (extra = '') => `
    <div class="lang-switch ${extra}" data-nt role="group" aria-label="Language">
      <button type="button" data-lang="en" class="${TE() ? '' : 'on'}">EN</button>
      <button type="button" data-lang="te" class="${TE() ? 'on' : ''}" lang="te">తెలుగు</button>
    </div>`;
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang]');
    if (b && window.I18N && b.dataset.lang !== window.I18N.lang) window.I18N.setLang(b.dataset.lang);
  });

  async function api(method, url, body) {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'X-Requested-With': '34div' },
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
    let data = {};
    try { data = await res.json(); } catch { /* empty */ }
    if (res.status === 401 && url !== '/api/login') {
      state.user = null;
      renderLogin();
      throw Object.assign(new Error(data.error || 'Please sign in.'), { status: 401, data, silent: true });
    }
    if (!res.ok) throw Object.assign(new Error(data.error || 'Something went wrong.'), { status: res.status, data });
    return data;
  }

  function toast(msg, type = 'ok') {
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `${icon(type === 'ok' ? 'check' : 'alert')}<span>${esc(msg)}</span>`;
    $('#toasts').appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 250); }, 3200);
  }
  const fail = (e) => { if (!e.silent) toast(e.message, 'err'); };

  function busy(btn, on, label) {
    // After an await, event.currentTarget is null: restore whichever buttons are still busy.
    if (!btn) {
      if (!on) $$('[data-busy]').forEach((b) => busy(b, false));
      return;
    }
    if (on) {
      if (!btn.hasAttribute('data-busy')) btn.dataset.label = btn.innerHTML;
      btn.setAttribute('data-busy', '');
      btn.innerHTML = `<span class="spin"></span>${esc(label || 'Please wait…')}`;
      btn.disabled = true;
    } else {
      if (btn.hasAttribute('data-busy')) btn.innerHTML = btn.dataset.label || btn.innerHTML;
      btn.removeAttribute('data-busy');
      btn.disabled = false;
    }
  }

  // ---------------------------------------------------------------- modal
  function openModal({ title, sub = '', body = '', foot = '', wide = false }) {
    const root = $('#modal-root');
    root.innerHTML = `
      <div class="modal-backdrop" data-close>
        <div class="modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" ${wide ? 'style="max-width:720px"' : ''}>
          <div class="modal-head"><div><h2>${title}</h2>${sub ? `<p>${sub}</p>` : ''}</div>
            <button class="icon-btn" data-close aria-label="Close">${icon('x')}</button></div>
          <div class="modal-body">${body}</div>
          ${foot ? `<div class="modal-foot">${foot}</div>` : ''}
        </div>
      </div>`;
    const bd = $('.modal-backdrop', root);
    bd.addEventListener('click', (e) => { if (e.target === bd || e.target.closest('button[data-close]')) closeModal(); });
    document.addEventListener('keydown', escClose);
    return $('.modal', root);
  }
  function escClose(e) { if (e.key === 'Escape') closeModal(); }
  function closeModal() { $('#modal-root').innerHTML = ''; document.removeEventListener('keydown', escClose); }

  // ---------------------------------------------------------------- state & routing
  const state = { user: null, pending: 0, streets: [] };
  const isAdmin = () => state.user && state.user.role === 'admin';

  const routes = {
    dashboard: { title: 'Dashboard', render: viewDashboard },
    stats: { title: 'Statistics', render: viewStats },
    add: { title: 'Add voter', render: viewAdd },
    voters: { title: 'Voters', render: viewVoters },
    roll: { title: 'Voter list', render: viewRoll },
    multi: { title: 'More than one vote', render: viewMulti },
    checks: { title: 'Check names', render: viewChecks, admin: true },
    families: { title: 'Families', render: viewFamilies },
    review: { title: 'Review', render: viewReview },
    team: { title: 'Volunteers', render: viewTeam, admin: true },
    upload: { title: 'Upload list', render: viewUpload, admin: true },
    account: { title: 'Account', render: viewAccount },
  };

  function currentRoute() {
    const [path, qs] = location.hash.replace(/^#\/?/, '').split('?');
    return { name: routes[path] ? path : 'dashboard', params: new URLSearchParams(qs || '') };
  }

  async function router() {
    if (!state.user) return;
    closeModal();
    const { name, params } = currentRoute();
    const r = routes[name];
    if (r.admin && !isAdmin()) { location.hash = '#/dashboard'; return; }
    document.title = `${r.title} · 34 Division`;
    renderShell(name);
    const content = $('#content');
    try { await r.render(content, params); } catch (e) { fail(e); }
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', router);

  async function refreshPending() {
    try {
      const { total } = await api('GET', '/api/review');
      state.pending = total;
      $$('[data-pending]').forEach((b) => { b.textContent = total; b.classList.toggle('hidden', !total); });
    } catch { /* ignore */ }
  }

  // ---------------------------------------------------------------- login
  // mode: 'login' | 'signup' | 'setup' (first run, creates the admin)
  function renderLogin(mode = 'login') {
    document.title = `${mode === 'setup' ? 'Set up' : 'Sign in'} · 34 Division`;
    $('#app').innerHTML = `
      <div class="login-wrap">
        <section class="login-hero">
          <div class="brand"><div class="logo-mark">34</div><div><div class="brand-name">34 Division</div><div class="brand-sub">Voter verification portal</div></div></div>
          <div>
            <h1>Every voter. <span>Counted once.</span></h1>
            <p>Verify families street by street. Duplicates are caught automatically before they are saved.</p>
            <div class="hero-points">
              <div class="hero-point"><i>${icon('shield')}</i>Smart duplicate check on name, serial, mobile and street</div>
              <div class="hero-point"><i>${icon('family')}</i>Add a whole family in seconds</div>
              <div class="hero-point"><i>${icon('users')}</i>Every entry tracked to the volunteer who verified it</div>
            </div>
          </div>
          <div class="brand-sub">© ${new Date().getFullYear()} 34 Division</div>
        </section>
        <section class="login-panel">${langSwitch('corner')}<div id="auth-slot">${authCard(mode)}</div></section>
      </div>`;
    wireAuthCard(mode);
  }

  function authCard(mode) {
    const userFields = `
      <div class="field"><label for="fn">Full name</label>
        <input class="input" id="fn" name="full_name" autocomplete="name" autocapitalize="words" required placeholder="e.g. Ravi Kumar" /></div>
      <div class="field"><label for="mb">Mobile number <span class="muted" style="font-weight:500">(optional)</span></label>
        <div class="input-group"><span class="prefix">+91</span>
        <input class="input" id="mb" name="mobile" inputmode="numeric" maxlength="14" placeholder="98480 12345" /></div></div>
      <div class="field"><label for="u">Choose a username</label>
        <input class="input" id="u" name="username" autocomplete="username" autocapitalize="none" required placeholder="e.g. ravi" />
        <span class="help">3–30 letters or numbers, no spaces. You'll use this to sign in.</span></div>
      <div class="field"><label for="p">Choose a password</label>
        <input class="input" id="p" name="password" type="password" autocomplete="new-password" minlength="6" required />
        <span class="help">At least 6 characters.</span></div>
      <div class="field"><label for="p2">Confirm password</label>
        <input class="input" id="p2" name="password2" type="password" autocomplete="new-password" required /></div>`;

    if (mode === 'setup') {
      return `<form class="login-card" id="auth-form" autocomplete="on">
        <span class="badge badge-ink" style="margin-bottom:14px">First-time setup</span>
        <h2>Create the admin account</h2>
        <p class="muted">This is the first sign-in for 34 Division. The account you create now will be the admin. You can add volunteers after this.</p>
        ${userFields}
        <div id="auth-err" class="banner banner-red hidden"></div>
        <button class="btn btn-brand btn-block" type="submit">${icon('shield')}Create admin account</button>
      </form>`;
    }
    return `<form class="login-card" id="auth-form" autocomplete="on">
      <h2>Welcome back</h2>
      <p class="muted">Sign in to continue to 34 Division.</p>
      <div class="field"><label for="u">Username</label>
        <input class="input" id="u" name="username" autocomplete="username" autocapitalize="none" required /></div>
      <div class="field"><label for="p">Password</label>
        <input class="input" id="p" name="password" type="password" autocomplete="current-password" required /></div>
      <div id="auth-err" class="banner banner-red hidden"></div>
      <button class="btn btn-primary btn-block" type="submit">Sign in ${icon('arrow')}</button>
      <p class="muted" style="text-align:center;margin:18px 0 0;font-size:13.5px">Volunteer accounts are created by the admin.</p>
    </form>`;
  }

  function wireAuthCard(mode) {
    const form = $('#auth-form');
    const err = $('#auth-err');
    const showErr = (msg, kind = 'red') => {
      err.className = `banner banner-${kind}`;
      err.innerHTML = `${icon(kind === 'green' ? 'check' : 'alert')}<span>${esc(msg)}</span>`;
    };
    form.addEventListener('click', (e) => {
      const b = e.target.closest('[data-mode]');
      if (b) { $('#auth-slot').innerHTML = authCard(b.dataset.mode); wireAuthCard(b.dataset.mode); }
    });
    const enter = async (user) => {
      state.user = user;
      if (!location.hash || location.hash === '#/') location.hash = '#/dashboard';
      await router();
      refreshPending();
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('button[type=submit]', form);
      err.classList.add('hidden');
      const body = Object.fromEntries(new FormData(form));
      if (mode !== 'login' && body.password !== body.password2) return showErr('The two passwords do not match.');
      busy(btn, true, 'Please wait…');
      try {
        if (mode === 'login') {
          const { user } = await api('POST', '/api/login', { username: body.username, password: body.password });
          await enter(user);
        } else if (mode === 'setup') {
          const { user } = await api('POST', '/api/setup', body);
          toast('Admin account created. Welcome!');
          await enter(user);
        }
      } catch (ex) {
        if (ex.status === 409 && mode === 'setup') { $('#auth-slot').innerHTML = authCard('login'); wireAuthCard('login'); toast(ex.message, 'err'); return; }
        showErr(ex.message, ex.data && ex.data.pending ? 'amber' : 'red');
        busy(btn, false);
      }
    });
    const first = $('#fn') || $('#u');
    if (first) first.focus();
  }

  // ---------------------------------------------------------------- shell
  function renderShell(active) {
    const u = state.user;
    const navItem = (name, ic, label, extra = '') =>
      `<a href="#/${name}" class="${active === name ? 'active' : ''}">${icon(ic)}<span>${label}</span>${extra}</a>`;
    const pendingBadge = `<span class="badge badge-red ${state.pending ? '' : 'hidden'}" data-pending>${state.pending}</span>`;

    if (!$('.shell')) {
      $('#app').innerHTML = `
        <div class="shell">
          <aside class="sidebar">
            <a class="brand" href="#/dashboard"><div class="logo-mark">34</div><div><div class="brand-name">34 Division</div><div class="brand-sub">Voter verification</div></div></a>
            <nav class="nav" id="side-nav"></nav>
            <div class="sidebar-foot">
              ${langSwitch('block')}
              <a class="user-chip" href="#/account"><div class="avatar">${esc(initials(u.full_name))}</div>
                <div class="who"><b>${esc(u.full_name)}</b><span>${esc(u.role)}</span></div></a>
            </div>
          </aside>
          <div class="main">
            <header class="topbar">
              <a class="brand" href="#/dashboard"><div class="logo-mark">34</div><div class="brand-name">34 Division</div></a>
              <div style="display:flex;align-items:center;gap:10px">${langSwitch('sm')}
              <a class="avatar" href="#/account" aria-label="Account">${esc(initials(u.full_name))}</a></div>
            </header>
            <main class="content" id="content"></main>
          </div>
          <nav class="tabbar" id="tabbar"></nav>
        </div>`;
    }
    $('#side-nav').innerHTML = `
      ${navItem('dashboard', 'home', 'Dashboard')}
      ${navItem('stats', 'chart', 'Statistics')}
      ${navItem('add', 'plus', 'Add voter')}
      ${navItem('roll', 'search', 'Voter list')}
      ${navItem('multi', 'copy', 'More than one vote')}
      ${navItem('families', 'family', 'Families')}
      ${navItem('voters', 'list', 'Voters')}
      ${navItem('review', 'inbox', 'Review queue', pendingBadge)}
      ${isAdmin() ? `<div class="nav-label">Admin</div>
        ${navItem('checks', 'alert', 'Check names')}
        ${navItem('upload', 'upload', 'Upload list')}
        ${navItem('team', 'users', 'Volunteers')}
        <a href="/api/export.csv">${icon('download')}<span>Export CSV</span></a>` : ''}`;
    const tab = (name, ic, label, extra = '') =>
      `<a href="#/${name}" class="${active === name ? 'active' : ''}">${icon(ic)}<span>${label}</span>${extra}</a>`;
    $('#tabbar').innerHTML = `
      ${tab('dashboard', 'home', 'Home')}
      ${tab('families', 'family', 'Families')}
      <a href="#/add" class="fab" aria-label="Add voter"><span class="circle">${icon('plus')}</span></a>
      ${tab('voters', 'list', 'Voters')}
      ${tab('account', 'more', 'More', `<span class="dot ${state.pending ? '' : 'hidden'}" data-pending>${state.pending}</span>`)}`;
  }

  // ---------------------------------------------------------------- money (per voter, and per family)
  // Renders the box for one voter. Shows who received the money, who ticked it and when.
  function moneyControl(v) {
    const attrs = `data-money="${v.id}" data-name="${esc(v.name)}" data-mobile="${esc(v.mobile || '')}"`;
    const hist = `<button type="button" class="linkish money-hist" data-mlog="${v.id}" data-name="${esc(v.name)}" title="Money history">${icon('clock')}</button>`;
    if (v.money_given) {
      return `<div class="money-wrap" data-mwrap="${v.id}">
        <button type="button" class="money-box on" ${attrs} data-given="true" title="Tap to undo">${icon('boxcheck')}<span>Money given</span></button>
        <span class="money-by">${v.money_received_by ? `<span class="recv">${icon('user')}<span>Received by</span> <b data-nt>${esc(v.money_received_by)}</b></span>` : ''}
          <span class="tick"><span>by</span> <b>${esc(v.money_by_name || '—')}</b> · ${esc(timeAgo(v.money_at))}</span></span>
        <button type="button" class="money-undo" ${attrs} data-given="true">${icon('undo')}Undo</button>
        ${hist}
      </div>`;
    }
    return `<div class="money-wrap" data-mwrap="${v.id}">
      <button type="button" class="money-box" ${attrs} data-given="false">${icon('box')}<span>Money</span></button>
      ${v.money_logged ? hist : ''}
    </div>`;
  }

  // Re-draws every money box (and family summary) for voters that changed.
  function refreshMoney(voters) {
    voters.forEach((v) => $$(`[data-mwrap="${v.id}"]`).forEach((w) => { w.outerHTML = moneyControl({ ...v, money_logged: true }); }));
    $$('[data-family-card]').forEach(updateFamilySummary);
  }

  // The money dialog. Lists the family's members (looked up live by mobile number):
  //   - "Money for": who the money is being marked for. Opened from one voter, that
  //     voter is ticked; other members still waiting can be added. Opened from a
  //     family card, every waiting member is ticked.
  //   - "Received by": which family member (or someone else, typed in) took the money.
  async function moneyDialog({ voterId = null, name = '', mobile = '', familyId = null }) {
    let fam = null;
    try { fam = mobile ? (await api('GET', `/api/families/lookup?mobile=${encodeURIComponent(mobile)}`)).family : null; } catch (e) { fail(e); return; }
    const members = fam ? fam.members : [{ id: voterId, name, money_given: false, money_received_by: '' }];
    const pending = members.filter((x) => !x.money_given);
    if (!pending.length) { toast('Money is already marked for everyone in this family.'); return; }
    const pre = voterId ? [voterId] : pending.map((x) => x.id);
    const firstRecv = (members.find((x) => x.id === voterId) || pending[0]).id;
    const m = openModal({
      title: 'Mark money given',
      sub: fam ? `<span class="fam-chip">${icon('family')}${fid(fam.id)}</span> <span>${esc(fmtMobile(fam.mobile))}</span> · <span data-nt>${esc(fam.street || '')}</span>` : esc(name),
      wide: true,
      body: `
        <div class="md-section">
          <div class="md-cap"><span class="step">1</span>Money for <span class="muted" id="md-count"></span></div>
          <div class="pick-list">
            ${members.map((x) => `
              <label class="pick ${x.money_given ? 'done' : ''}">
                <input type="checkbox" name="for" value="${x.id}" ${x.money_given ? 'disabled checked' : pre.includes(x.id) ? 'checked' : ''} />
                <span class="pick-body"><b data-nt>${esc(x.name)}</b>${x.name_te ? `<span class="te" lang="te" data-nt>${esc(x.name_te)}</span>` : ''}
                  <small>${x.money_given ? `${icon('check')}<span>Already given</span>${x.money_received_by ? ` · <span>received by</span> <span data-nt>${esc(x.money_received_by)}</span>` : ''}` : x.serial_no ? `# <span data-nt>${esc(x.serial_no)}</span>` : ''}</small></span>
              </label>`).join('')}
          </div>
          ${pending.length > 1 ? `<button type="button" class="linkish" id="md-all" style="margin-top:8px">Select everyone still waiting</button>` : ''}
        </div>
        <div class="md-section">
          <div class="md-cap"><span class="step">2</span>Who received the money?</div>
          <div class="recv-list">
            ${members.map((x) => `
              <label class="recv-opt"><input type="radio" name="recv" value="${esc(x.name)}" ${x.id === firstRecv ? 'checked' : ''} />
                <span class="avatar">${esc(initials(x.name))}</span><span data-nt>${esc(x.name)}</span></label>`).join('')}
            <label class="recv-opt other"><input type="radio" name="recv" value="__other" /><span class="avatar">${icon('plus')}</span><span>Someone else</span></label>
          </div>
          <input class="input hidden" id="md-other" maxlength="120" placeholder="Name of the person who received it" style="margin-top:10px" />
        </div>
        <div class="md-summary" id="md-summary"></div>`,
      foot: `<button class="btn btn-ghost" data-close>Cancel</button>
             <button class="btn btn-success" id="do-money">${icon('check')}<span>Yes, money given</span></button>`,
    });
    const forBoxes = () => $$('input[name="for"]:not(:disabled)', m);
    const recvName = () => {
      const r = $('input[name="recv"]:checked', m);
      if (!r) return '';
      return r.value === '__other' ? $('#md-other', m).value.trim() : r.value;
    };
    const update = () => {
      const chosen = forBoxes().filter((b) => b.checked);
      const names = chosen.map((b) => b.closest('.pick').querySelector('b').textContent);
      const r = recvName();
      $('#md-other', m).classList.toggle('hidden', !($('input[name="recv"]:checked', m) || {}).value || $('input[name="recv"]:checked', m).value !== '__other');
      $('#md-count', m).textContent = `(${chosen.length} of ${forBoxes().length})`;
      $('#md-summary', m).innerHTML = chosen.length
        ? `${icon('rupee')}<span>Money for <b data-nt>${esc(names.join(', '))}</b>, received by <b data-nt>${esc(r || '…')}</b>.</span>`
        : `${icon('alert')}<span>Choose at least one person.</span>`;
      $('#md-summary', m).className = `md-summary ${chosen.length && r ? 'ok' : 'warn'}`;
      $('#do-money', m).disabled = !chosen.length || !r;
    };
    m.addEventListener('change', update);
    $('#md-other', m).addEventListener('input', update);
    if ($('#md-all', m)) $('#md-all', m).addEventListener('click', () => { forBoxes().forEach((b) => { b.checked = true; }); update(); });
    update();
    $('#do-money', m).addEventListener('click', async (ev) => {
      const ids = forBoxes().filter((b) => b.checked).map((b) => Number(b.value));
      busy(ev.currentTarget, true, 'Saving…');
      try {
        const r = fam && !ids.includes(voterId)
          ? await api('POST', `/api/families/${fam.id}/money`, { voter_ids: ids, received_by: recvName() })
          : await api('POST', `/api/voters/${voterId || ids[0]}/money`, {
            given: true, received_by: recvName(), also_ids: ids.filter((x) => x !== (voterId || ids[0])),
          });
        closeModal();
        toast(ids.length > 1 ? `Money marked for ${ids.length} people` : `Money marked for ${r.voters[0].name}`);
        refreshMoney(r.voters);
      } catch (er) {
        fail(er);
        busy(ev.currentTarget, false);
        if (er.status === 409) { closeModal(); router(); }
      }
    });
  }

  // One delegated handler for every money box on any page.
  document.addEventListener('click', async (e) => {
    const box = e.target.closest('[data-money]');
    const hist = e.target.closest('[data-mlog]');
    const famMoney = e.target.closest('[data-fam-money]');
    if (famMoney) { moneyDialog({ mobile: famMoney.dataset.mobile, familyId: Number(famMoney.dataset.famMoney) }); return; }
    if (hist) {
      const log = await api('GET', `/api/voters/${hist.dataset.mlog}/money-log`).catch(fail);
      if (!log) return;
      openModal({
        title: 'Money history',
        sub: esc(hist.dataset.name),
        body: log.length ? `<ul class="rank-list" style="padding:0">${log.map((l) => `
          <li style="padding:10px 0"><span class="name">${l.given ? '✅' : '↩️'} <span>${l.given ? 'Money given' : 'Undone'}</span> · <b>${esc(l.by_name || '—')}</b>
            ${l.given && l.received_by ? `<br><small class="muted"><span>Received by</span> <span data-nt>${esc(l.received_by)}</span></small>` : ''}</span>
          <span class="muted" style="font-size:13px">${esc(fmtDateTime(l.at))}</span></li>`).join('')}</ul>`
          : '<p class="muted">No changes yet.</p>',
        foot: '<button class="btn btn-primary" data-close>Close</button>',
      });
      return;
    }
    if (!box) return;
    if (box.dataset.given !== 'true') {
      moneyDialog({ voterId: Number(box.dataset.money), name: box.dataset.name, mobile: box.dataset.mobile });
      return;
    }
    const wrap = box.closest('.money-wrap');
    const recv = wrap && wrap.querySelector('.recv b') ? wrap.querySelector('.recv b').textContent : '';
    const m = openModal({
      title: 'Undo money given?',
      sub: `<b>${esc(box.dataset.name)}</b>${recv ? `<br><span>Received by</span> <b data-nt>${esc(recv)}</b>` : ''}<br>
        <span>The tick will be removed and can be given again later. Your name is recorded in the history.</span>`,
      foot: `<button class="btn btn-ghost" data-close>Cancel</button>
             <button class="btn btn-danger" id="do-money">${icon('undo')}Yes, undo</button>`,
    });
    $('#do-money', m).addEventListener('click', async (ev) => {
      busy(ev.currentTarget, true, 'Saving…');
      try {
        const { voter } = await api('POST', `/api/voters/${box.dataset.money}/money`, { given: false });
        closeModal();
        toast(`Money tick undone for ${voter.name}`);
        refreshMoney([voter]);
      } catch (er) {
        fail(er);
        busy(ev.currentTarget, false);
        if (er.status === 409) { closeModal(); router(); }
      }
    });
  });

  // Double-vote chip on voter rows: set / change / clear with a short note.
  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-dv]');
    if (!chip) return;
    const on = chip.classList.contains('on');
    const note = chip.querySelector('em') ? chip.querySelector('em').textContent : '';
    const m = openModal({
      title: 'Double vote',
      sub: 'Does this voter also have a vote somewhere else?',
      body: `<label class="check"><input type="checkbox" id="dv-on" ${on ? 'checked' : ''} />Yes, this voter has a double vote</label>
        <div class="field" style="margin:12px 0 0"><label for="dv-note">Where is the other vote? <span class="muted" style="font-weight:500">(optional)</span></label>
          <input class="input" id="dv-note" maxlength="200" value="${esc(note)}" placeholder="e.g. Ward 12, Guntur" /></div>`,
      foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="dv-save">${icon('check')}Save</button>`,
    });
    $('#dv-save', m).addEventListener('click', async (ev) => {
      busy(ev.currentTarget, true, 'Saving…');
      try {
        const { voter } = await api('POST', `/api/voters/${chip.dataset.dv}/double`, { double_vote: $('#dv-on', m).checked, note: $('#dv-note', m).value });
        closeModal();
        toast(voter.double_vote ? `${voter.name}: double vote marked` : `${voter.name}: no double vote`);
        $$(`[data-dv="${voter.id}"]`).forEach((c) => { c.outerHTML = doubleChip(voter); });
      } catch (er) { fail(er); busy(ev.currentTarget, false); }
    });
  });

  function updateFamilySummary(card) {
    const total = $$('.money-box', card).length;
    const done = $$('.money-box.on', card).length;
    const b = $('.money-sum', card);
    if (!b) return;
    b.className = `badge money-sum ${done === total ? 'badge-green' : done ? 'badge-amber' : 'badge-gray'}`;
    b.innerHTML = `${icon('rupee')}${done}/${total} money`;
    // "Give money" for the family only while someone is still waiting.
    const give = $('.fam-money-btn', card);
    if (give) give.classList.toggle('hidden', done === total);
  }

  // ---------------------------------------------------------------- shared renderers
  // Double vote: a chip anyone can tap to mark / change it.
  const doubleChip = (v) => `<button type="button" class="dv-chip ${v.double_vote ? 'on' : ''}" data-dv="${v.id}"
      title="${v.double_vote ? esc(v.double_vote_note || 'Double vote') : 'Mark as double vote'}">${icon(v.double_vote ? 'alert' : 'box')}
      <span>${v.double_vote ? 'Double vote' : 'No double vote'}</span>${v.double_vote && v.double_vote_note ? `<em data-nt>${esc(v.double_vote_note)}</em>` : ''}</button>`;

  function voterRow(v, { matched = [], level = '', actions = '', money = false, dv = false } = {}) {
    const hl = (field, html) => (matched.includes(field) ? `<span class="hl">${html}</span>` : html);
    const nameHl = matched.includes('name') || matched.includes('similar name');
    const levelBadge = level === 'exact' ? '<span class="badge badge-red">Already verified</span>'
      : level === 'likely' ? '<span class="badge badge-amber">Likely same</span>'
      : level === 'possible' ? '<span class="badge badge-gray">Possible match</span>'
      : level === 'family' ? `<span class="badge badge-green">${icon('family')}Same family</span>`
      : `<span class="badge badge-green">${icon('check')}Verified</span>`;
    return `
      <div class="voter-row ${level}">
        <div class="avatar">${esc(initials(v.name))}</div>
        <div class="body">
          <div class="top"><span class="vname">${nameHl ? `<span class="hl">${esc(v.name)}</span>` : esc(v.name)}</span>${levelBadge}
            ${v.family_id ? `<a class="fam-chip" href="#/families?q=${fid(v.family_id)}" title="Open family">${icon('family')}${fid(v.family_id)}</a>` : ''}
            ${dupBadge(v.roll_dups, `#/multi?q=${encodeURIComponent(v.serial_no)}`)}
            ${v.double_vote && !dv ? `<span class="badge badge-amber" title="${esc(v.double_vote_note)}">${icon('alert')}Double vote</span>` : ''}
            ${v.roll_check === 'mismatch' && isAdmin() ? `<a class="badge badge-red" href="#/checks">${icon('alert')}Check name</a>` : ''}</div>
          ${v.name_te ? `<div class="te-name" lang="te" data-nt>${esc(v.name_te)}</div>` : ''}
          <div class="meta">
            <span>${icon('hash')}${hl('serial no', esc(v.serial_no))}</span>
            ${v.door_no ? `<span>${icon('home')}Door ${esc(v.door_no)}</span>` : ''}
            <span>${icon('phone')}${hl('mobile', esc(fmtMobile(v.mobile)))}</span>
            <span>${icon('pin')}${hl('street', esc(v.street))}</span>
            <span>${icon('vote')}${esc(v.family_votes)} family vote${v.family_votes == 1 ? '' : 's'}</span>
          </div>
          <div class="by">Verified by ${esc(v.verified_by_name || '—')} · ${esc(timeAgo(v.verified_at))}${v.notes ? ` · ${esc(v.notes)}` : ''}</div>
          ${matched.length ? `<div class="chips" style="margin-top:6px">${matched.map((m) => `<span class="badge badge-gray">same ${esc(m)}</span>`).join('')}</div>` : ''}
          ${money || dv ? `<div class="row-controls">${money ? moneyControl(v) : ''}${dv ? doubleChip(v) : ''}</div>` : ''}
        </div>
        ${actions ? `<div class="actions">${actions}</div>` : ''}
      </div>`;
  }

  const emptyState = (ic, title, text, cta = '') =>
    `<div class="empty"><div class="ico">${icon(ic)}</div><h3>${title}</h3><p>${text}</p>${cta}</div>`;

  function compareCards(newV, matches) {
    const kv = (v, ref) => {
      const same = (k) => (ref && ref[k] === v[k] ? ' class="same"' : '');
      return `<dl class="kv">
        <div><dt>Serial no</dt><dd${same('serial_no')}>${esc(v.serial_no)}</dd></div>
        <div><dt>Door no</dt><dd>${esc(v.door_no || '—')}</dd></div>
        <div><dt>Mobile</dt><dd${same('mobile')}>${esc(fmtMobile(v.mobile))}</dd></div>
        <div><dt>Street</dt><dd>${esc(v.street)}</dd></div>
        <div><dt>Family votes</dt><dd>${esc(v.family_votes)}</dd></div>
      </dl>`;
    };
    return `<div class="compare">
      <div class="compare-card new"><div class="cap"><span>New entry</span></div>
        <div style="font-weight:800;font-size:16px;margin-bottom:6px">${esc(newV.name)}</div>${kv(newV)}</div>
      ${matches.map((m) => `
        <div class="compare-card"><div class="cap"><span>Already verified · ${esc(m.verified_by_name || '—')} · ${esc(timeAgo(m.verified_at))}</span>
          <span class="badge ${m.level === 'exact' ? 'badge-red' : m.level === 'likely' ? 'badge-amber' : 'badge-gray'}">${m.level === 'exact' ? 'Same voter' : m.level === 'likely' ? 'Likely same' : 'Possible'}</span></div>
          <div style="font-weight:800;font-size:16px;margin-bottom:6px">${esc(m.name)}</div>${kv(m, newV)}
          <div class="chips" style="margin-top:8px">${m.matched_on.map((f) => `<span class="badge badge-gray">same ${esc(f)}</span>`).join('')}</div>
        </div>`).join('')}
    </div>`;
  }

  // ---------------------------------------------------------------- voter list (official roll) rows
  const REL = { Father: 'Father', Husband: 'Husband', Mother: 'Mother', Other: 'Relative' };
  const relText = (r) => (r.relation_en || r.relation_te
    ? `${REL[r.relation_type] || 'Relative'}: <span data-nt>${esc(r.relation_en || r.relation_te)}</span>` : '');
  const ageText = (r) => [r.age ? `${r.age} yrs` : '', r.gender === 'F' ? 'Female' : r.gender === 'M' ? 'Male' : r.gender === 'O' ? 'Other' : '']
    .filter(Boolean).join(' · ');

  // Duplicate votes: the same person's other entries in the voter list.
  const dupSerials = (list) => list.map((o) => o.serial_no).join(', ');
  const dupBadge = (dups, href) => (dups && dups.length
    ? `<${href ? `a href="${href}"` : 'span'} class="badge ${dups.some((o) => o.verified) ? 'badge-red' : 'badge-amber'}" title="Duplicate in the voter list">${icon('copy')}<span>Also serial ${esc(dupSerials(dups))}</span></${href ? 'a' : 'span'}>`
    : '');
  function dupNote(r) {
    const dups = r.dups || [];
    if (!dups.length && !(r.dup_reasons || []).length) return '';
    const added = dups.filter((o) => o.verified);
    return `<div class="dup-note ${added.length ? 'red' : 'amber'}">${icon('copy')}<div class="dup-body">
      <b>${added.length ? 'Duplicate vote: this person is already added at another serial' : 'Duplicate in the voter list: same person at another serial'}</b>
      ${dups.length ? `<div class="dup-others">${dups.map((o) => `
        <a class="dup-serial" href="#/multi?q=${encodeURIComponent(o.serial_no)}"><span class="ds-no">Serial <b class="mono" data-nt>${esc(o.serial_no)}</b></span>
          ${o.epic ? `<span class="mono" data-nt>${esc(o.epic)}</span>` : ''}${o.age ? `<span>${o.age} yrs</span>` : ''}${o.door_no ? `<span>Door <span data-nt>${esc(o.door_no)}</span></span>` : ''}
          ${o.verified ? `<span class="badge badge-red">Added</span>${o.verified_by_name ? `<span class="muted" data-nt>${esc(o.verified_by_name)}</span>` : ''}` : '<span class="badge badge-gray">Not added</span>'}</a>`).join('')}</div>`
        : '<div class="muted">The voter list marks this entry as listed twice.</div>'}
    </div></div>`;
  }

  // Full details of one voter-list entry (used under the form and on Check names).
  const refSummary = (r) => `
    <div class="ref-sum">
      <div class="ref-name"><b data-nt>${esc(r.name)}</b>${r.name_te ? ` <span class="te" lang="te" data-nt>${esc(r.name_te)}</span>` : ''}</div>
      <div class="ref-meta">
        ${relText(r) ? `<span>${icon('user')}${relText(r)}</span>` : ''}
        ${ageText(r) ? `<span>${ageText(r)}</span>` : ''}
        <span>${icon('hash')}Serial <span data-nt>${esc(r.serial_no)}</span></span>
        ${r.door_no ? `<span>${icon('home')}Door <span data-nt>${esc(r.door_no)}</span></span>` : ''}
        ${r.epic ? `<span>${icon('file')}<span data-nt>${esc(r.epic)}</span></span>` : ''}
        ${r.listed_twice ? '<span class="badge badge-amber">Listed twice in the voter list</span>' : ''}
      </div>
      ${dupNote(r)}
    </div>`;

  // Keeps everyone with the same name together, in order of first appearance.
  function groupSameNames(items) {
    const order = [];
    const by = new Map();
    items.forEach((r) => {
      const g = r.group || r.name;
      if (!by.has(g)) { by.set(g, []); order.push(g); }
      by.get(g).push(r);
    });
    return order.flatMap((g) => by.get(g));
  }

  // Drop-down / list rows. People sharing a name get a header so volunteers
  // compare father's name, age and door number before choosing.
  function rollItems(items, idPrefix, { button = '' } = {}) {
    let prev = null;
    // A group whose entries are all the same person (duplicates in the voter list).
    const onePerson = (group) => {
      const g = items.filter((x) => x.group === group);
      return g.length > 1 && g.every((x) => g.every((y) => y === x || (x.dups || []).some((d) => d.id === y.id)));
    };
    return items.map((r, i) => {
      const same = r.same_name > 1 && r.group !== prev && onePerson(r.group);
      const head = r.same_name > 1 && r.group !== prev
        ? (same
          ? `<div class="ac-group dup" aria-hidden="true">${icon('copy')}<span>Same person listed ${r.same_name} times: serial <b data-nt>${esc(items.filter((x) => x.group === r.group).map((x) => x.serial_no).join(', '))}</b>. Only one of these is a real vote.</span></div>`
          : `<div class="ac-group" aria-hidden="true">${icon('users')}<span>${r.same_name} people named <b data-nt>${esc(r.name)}</b>. Check father’s name, age and door number.</span></div>`) : '';
      prev = r.group;
      return `${head}
        <div class="ac-item${r.verified ? ' done' : ''}${r.same_name > 1 ? ' grouped' : ''}" role="option" id="${idPrefix}-${i}" data-i="${i}" data-group="${esc(r.group || '')}">
          <div class="ac-main">
            <div class="ac-name"><span data-nt>${esc(r.name)}</span>
              ${r.listed_twice ? '<span class="badge badge-amber">Listed twice</span>' : ''}
              ${dupBadge(r.dups)}
              ${r.verified ? `<span class="badge badge-red">${icon('check')}Already verified</span>` : ''}</div>
            ${r.name_te ? `<div class="ac-te" lang="te" data-nt>${esc(r.name_te)}</div>` : ''}
            <div class="ac-rel">${[relText(r), ageText(r) ? `<span>${ageText(r)}</span>` : ''].filter(Boolean).join(' · ')}</div>
          </div>
          <div class="ac-cell"><small>Serial</small><b class="mono" data-nt>${esc(r.serial_no)}</b></div>
          <div class="ac-cell ac-door"><small>Door</small><b class="mono" data-nt>${esc(r.door_no || '—')}</b></div>
          ${button ? `<div class="ac-btn">${r.verified ? '' : button.replace(/__SERIAL__/g, encodeURIComponent(r.serial_no))}</div>` : ''}
        </div>`;
    }).join('');
  }

  // Hovering one person highlights everyone else with the same name.
  function hoverSameNames(container) {
    container.addEventListener('mouseover', (e) => {
      const it = e.target.closest('.ac-item.grouped');
      $$('.ac-item.same-hl', container).forEach((x) => x.classList.remove('same-hl'));
      if (it) $$('.ac-item.grouped', container).filter((x) => x.dataset.group === it.dataset.group).forEach((x) => x.classList.add('same-hl'));
    });
    container.addEventListener('mouseleave', () => $$('.ac-item.same-hl', container).forEach((x) => x.classList.remove('same-hl')));
  }

  async function loadStreets() {
    try { state.streets = await api('GET', '/api/streets'); } catch { /* ignore */ }
    return state.streets;
  }

  // ---------------------------------------------------------------- dashboard
  async function viewDashboard(el) {
    const hour = new Date().getHours();
    const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    el.innerHTML = `
      <div class="page-head"><div><h1>${greet}, ${esc(state.user.full_name.split(' ')[0])}</h1><p>Here's how 34 Division is doing.</p></div>
        <a class="btn btn-brand" href="#/add">${icon('plus')}Add voter</a></div>
      <div class="grid grid-4">${'<div class="card stat"><div class="skeleton" style="height:70px"></div></div>'.repeat(4)}</div>`;
    const s = await api('GET', '/api/stats');
    state.pending = s.pending_review;
    $$('[data-pending]').forEach((b) => { b.textContent = s.pending_review; b.classList.toggle('hidden', !s.pending_review); });

    const maxDay = Math.max(1, ...s.daily.map((d) => d.n));
    const maxVol = Math.max(1, ...s.volunteers.map((v) => v.n));
    const maxSt = Math.max(1, ...s.top_streets.map((v) => v.voters));
    const dayLabel = (d) => new Date(d + 'T00:00:00').toLocaleDateString(LOCALE(), { weekday: 'short' });

    el.innerHTML = `
      <div class="page-head"><div><h1>${greet}, ${esc(state.user.full_name.split(' ')[0])}</h1><p>Here's how 34 Division is doing.</p></div>
        <a class="btn btn-brand" href="#/add">${icon('plus')}Add voter</a></div>
      ${s.pending_users ? `<div class="banner banner-green">${icon('users')}<span>${fmtNum(s.pending_users)} new volunteer${s.pending_users === 1 ? ' is' : 's are'} waiting for your approval.</span><a class="btn btn-sm btn-primary" href="#/team">Review sign-ups</a></div>` : ''}
      ${s.pending_review ? `<div class="banner banner-amber">${icon('inbox')}<span>${fmtNum(s.pending_review)} uploaded ${s.pending_review === 1 ? 'entry needs' : 'entries need'} a duplicate review.</span><a class="btn btn-sm btn-primary" href="#/review">Review now</a></div>` : ''}
      ${isAdmin() && !s.roll_total ? `<div class="banner banner-amber">${icon('list')}<span>The voter list isn’t uploaded yet, so volunteers get no name suggestions.</span><a class="btn btn-sm btn-primary" href="#/upload?type=reference">Upload it</a></div>` : ''}
      ${s.name_checks ? `<div class="banner banner-red">${icon('alert')}<span>${fmtNum(s.name_checks)} saved ${s.name_checks === 1 ? 'voter’s name doesn’t' : 'voters’ names don’t'} match the voter list at their serial number.</span><a class="btn btn-sm btn-primary" href="#/checks">Check names</a></div>` : ''}
      ${s.double_votes ? `<div class="banner banner-amber">${icon('alert')}<span>${fmtNum(s.double_votes)} ${s.double_votes === 1 ? 'voter has' : 'voters have'} a double vote.</span><a class="btn btn-sm btn-ghost" href="#/voters?double=1">Show</a></div>` : ''}
      <div class="grid grid-4">
        <div class="card stat feature"><div class="label"><span class="ico">${icon('shield')}</span>Verified voters</div>
          <div class="value mono">${fmtNum(s.voters)}</div><div class="hint">+${fmtNum(s.today)} today</div></div>
        <div class="card stat"><div class="label"><span class="ico y">${icon('family')}</span>Families</div>
          <div class="value mono">${fmtNum(s.families)}</div><div class="hint">unique mobile numbers</div></div>
        <div class="card stat"><div class="label"><span class="ico g">${icon('vote')}</span>Family votes</div>
          <div class="value mono">${fmtNum(s.family_votes)}</div><div class="hint">total votes across families</div></div>
        <a class="card stat" href="#/families" style="text-decoration:none"><div class="label"><span class="ico b">${icon('rupee')}</span>Money given</div>
          <div class="value mono">${fmtNum(s.money_given)}<span class="muted" style="font-size:18px;font-weight:600"> / ${fmtNum(s.money_total)}</span></div>
          <div class="hint">voters ticked · ${fmtNum(s.streets)} streets</div></a>
      </div>
      <div class="grid grid-2" style="margin-top:20px">
        <div class="card"><div class="card-head"><h3>Verifications · last 7 days</h3><a class="btn btn-sm btn-ghost" href="#/stats">${icon('chart')}All statistics</a></div>
          <div class="card-pad"><div class="chart">${s.daily.map((d) => `
            <div class="col"><div class="bar ${d.n ? '' : 'zero'}" style="height:${Math.max(3, (d.n / maxDay) * 100)}%">${d.n ? `<span>${d.n}</span>` : ''}</div><div class="day">${dayLabel(d.day)}</div></div>`).join('')}
          </div></div></div>
        <div class="card"><div class="card-head"><h3>Top volunteers</h3></div>
          ${s.volunteers.length ? `<ul class="rank-list">${s.volunteers.map((v) => `
            <li><span class="name">${esc(v.full_name)}</span><span class="n mono">${fmtNum(v.n)}</span><span class="track"><i style="width:${(v.n / maxVol) * 100}%"></i></span></li>`).join('')}</ul>`
            : emptyState('users', 'No entries yet', 'Volunteer activity will show up here.')}
        </div>
      </div>
      <div class="grid grid-2" style="margin-top:20px">
        <div class="card"><div class="card-head"><h3>Recently verified</h3><a class="btn btn-sm btn-ghost" href="#/voters">View all</a></div>
          ${s.recent.length ? s.recent.map((v) => voterRow(v)).join('') : emptyState('shield', 'No voters yet', 'Start by adding the first voter.', `<a class="btn btn-brand" href="#/add" style="margin-top:12px">${icon('plus')}Add voter</a>`)}
        </div>
        <div class="card"><div class="card-head"><h3>Streets</h3></div>
          ${s.top_streets.length ? `<ul class="rank-list y">${s.top_streets.map((t) => `
            <li><span class="name">${esc(t.street)}</span><span class="n mono">${fmtNum(t.voters)} <span class="muted" style="font-weight:500">· ${fmtNum(t.families)} fam</span></span><span class="track"><i style="width:${(t.voters / maxSt) * 100}%"></i></span></li>`).join('')}</ul>`
            : emptyState('pin', 'No streets yet', 'Streets appear as voters are added.')}
        </div>
      </div>`;
  }

  // ---------------------------------------------------------------- statistics
  // Filters live in the address (#/stats?street=..&volunteer=..&from=..&to=..),
  // so a filtered view can be bookmarked or shared. Changing a filter reloads
  // the numbers in place.
  async function viewStats(el, params) {
    const f = { street: params.get('street') || '', volunteer: params.get('volunteer') || '', from: params.get('from') || '', to: params.get('to') || '' };
    const sort = { streets: { key: 'voters', dir: -1 }, volunteers: { key: 'voters', dir: -1 } };
    let data = null;

    const isoDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return isoDay(d); };
    const RANGES = [['today', 'Today', 0], ['7', 'Last 7 days', 6], ['30', 'Last 30 days', 29], ['all', 'All time', null]];
    const rangeOn = (r) => (r[2] === null ? !f.from && !f.to : f.from === daysAgo(r[2]) && (!f.to || f.to === daysAgo(0)));
    const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
    const shortDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString(LOCALE(), { day: 'numeric', month: 'short' });

    el.innerHTML = `
      <div class="page-head"><div><h1>Statistics</h1><p>Progress of the verification, with filters.</p></div>
        <button class="btn btn-ghost" id="st-csv" disabled>${icon('download')}Download CSV</button></div>
      <div class="card st-filters">
        <div class="toolbar">
          <select class="select" id="st-street" aria-label="Street"><option value="">All streets</option></select>
          <select class="select" id="st-vol" aria-label="Volunteer"><option value="">All volunteers</option></select>
          <label class="st-date"><span>From</span><input class="input" type="date" id="st-from" value="${esc(f.from)}" /></label>
          <label class="st-date"><span>To</span><input class="input" type="date" id="st-to" value="${esc(f.to)}" /></label>
        </div>
        <div class="st-ranges" id="st-ranges"></div>
      </div>
      <div id="st-body"><div class="grid grid-4" style="margin-top:20px">${'<div class="card stat"><div class="skeleton" style="height:70px"></div></div>'.repeat(4)}</div></div>`;

    const body = $('#st-body');

    function drawRanges() {
      const active = [f.street && data && (data.options.streets.find((s) => s.key === f.street) || {}).street,
        f.volunteer && data && (data.options.volunteers.find((v) => String(v.id) === f.volunteer) || {}).full_name].filter(Boolean);
      $('#st-ranges').innerHTML = `
        ${RANGES.map((r) => `<button type="button" class="chip-btn ${rangeOn(r) ? 'on' : ''}" data-range="${r[0]}">${r[1]}</button>`).join('')}
        ${active.length || f.from || f.to ? `<span class="st-active">${active.map((a) => `<span class="badge badge-ink" data-nt>${esc(a)}</span>`).join('')}</span>
          <button type="button" class="btn btn-sm btn-ghost" id="st-clear">${icon('x')}Clear filters</button>` : ''}`;
    }

    async function load() {
      const qs = new URLSearchParams(Object.entries(f).filter(([, v]) => v)).toString();
      history.replaceState(null, '', `#/stats${qs ? '?' + qs : ''}`);
      drawRanges();
      body.classList.add('st-loading');
      try { data = await api('GET', `/api/statistics${qs ? '?' + qs : ''}`); }
      catch (e) { body.classList.remove('st-loading'); fail(e); return; }
      if (!el.isConnected) return;
      body.classList.remove('st-loading');
      fillOptions();
      drawRanges();
      draw();
      $('#st-csv').disabled = false;
    }

    function fillOptions() {
      const sSel = $('#st-street'), vSel = $('#st-vol');
      sSel.innerHTML = `<option value="">All streets</option>${data.options.streets.map((s) => `<option value="${esc(s.key)}" ${s.key === f.street ? 'selected' : ''}>${esc(s.street)}</option>`).join('')}`;
      vSel.innerHTML = `<option value="">All volunteers</option>${data.options.volunteers.map((v) => `<option value="${v.id}" ${String(v.id) === f.volunteer ? 'selected' : ''}>${esc(v.full_name)}</option>`).join('')}`;
      // Names and streets are data: never translate them.
      [...sSel.options, ...vSel.options].forEach((o) => { if (o.value) o.setAttribute('data-nt', ''); });
    }

    const hbars = (rows, cls = '') => {
      const max = Math.max(1, ...rows.map((r) => r.n));
      return `<ul class="rank-list ${cls}">${rows.map((r) => `
        <li><span class="name">${r.label}</span><span class="n mono">${fmtNum(r.n)}${r.sub ? ` <span class="muted" style="font-weight:500">${r.sub}</span>` : ''}</span>
          <span class="track"><i style="width:${(r.n / max) * 100}%"></i></span></li>`).join('')}</ul>`;
    };

    function sortRows(rows, s) {
      return [...rows].sort((a, b) => {
        const x = a[s.key], y = b[s.key];
        if (typeof x === 'string' || typeof y === 'string') return String(x || '').localeCompare(String(y || '')) * s.dir;
        return ((x || 0) - (y || 0)) * s.dir;
      });
    }
    const th = (table, key, label, num = true) => {
      const s = sort[table];
      return `<th class="sortable ${num ? 'num' : ''}" data-sort="${table}:${key}" aria-sort="${s.key === key ? (s.dir > 0 ? 'ascending' : 'descending') : 'none'}">${label}${s.key === key ? `<span class="sort-ar">${s.dir > 0 ? '▲' : '▼'}</span>` : ''}</th>`;
    };
    const when = (iso) => (iso ? `<span title="${esc(fmtDateTime(iso))}">${timeAgo(iso)}</span>` : '—');

    function streetTable() {
      const rows = sortRows(data.streets, sort.streets);
      if (!rows.length) return emptyState('pin', 'No streets', 'Nothing matches these filters.');
      return `<div class="table-wrap"><table class="table st-table"><thead><tr>
          ${th('streets', 'street', 'Street', false)}${th('streets', 'voters', 'Voters')}${th('streets', 'families', 'Families')}
          ${th('streets', 'double_votes', 'Double votes')}${th('streets', 'volunteers', 'Volunteers')}${th('streets', 'last_at', 'Last added', false)}</tr></thead>
        <tbody>${rows.map((r) => `<tr data-street="${esc(r.key)}" class="clickable" title="Show only this street">
          <td><b data-nt>${esc(r.street)}</b></td><td class="num mono">${fmtNum(r.voters)}</td><td class="num mono">${fmtNum(r.families)}</td>
          <td class="num mono">${r.double_votes ? `<span class="badge badge-amber">${fmtNum(r.double_votes)}</span>` : '0'}</td>
          <td class="num mono">${fmtNum(r.volunteers)}</td><td>${when(r.last_at)}</td></tr>`).join('')}</tbody></table></div>`;
    }

    function volunteerTable() {
      const rows = sortRows(data.volunteers, sort.volunteers);
      if (!rows.length) return emptyState('users', 'No volunteers', 'Nothing matches these filters.');
      return `<div class="table-wrap"><table class="table st-table"><thead><tr>
          ${th('volunteers', 'full_name', 'Volunteer', false)}${th('volunteers', 'voters', 'Voters')}${th('volunteers', 'families', 'Families')}
          ${th('volunteers', 'streets', 'Streets')}${th('volunteers', 'today', 'Today')}${th('volunteers', 'days', 'Active days')}${th('volunteers', 'last_at', 'Last active', false)}</tr></thead>
        <tbody>${rows.map((r) => `<tr data-vol="${r.id}" class="clickable" title="Show only this volunteer">
          <td><div class="st-person"><span class="avatar sm">${esc(initials(r.full_name))}</span><b data-nt>${esc(r.full_name)}</b>${r.active ? '' : '<span class="badge badge-gray">Inactive</span>'}</div></td>
          <td class="num mono">${fmtNum(r.voters)}</td><td class="num mono">${fmtNum(r.families)}</td><td class="num mono">${fmtNum(r.streets)}</td>
          <td class="num mono">${r.today ? `<span class="badge badge-green">+${fmtNum(r.today)}</span>` : '0'}</td>
          <td class="num mono">${fmtNum(r.days)}</td><td>${when(r.last_at)}</td></tr>`).join('')}</tbody></table></div>`;
    }

    function draw() {
      const s = data.summary;
      const q = data.quality;
      const dense = data.daily.length > 14;
      const maxDay = Math.max(1, ...data.daily.map((d) => d.n));
      const rangeTotal = data.daily.reduce((a, d) => a + d.n, 0);
      const best = data.daily.reduce((b, d) => (d.n > b.n ? d : b), { n: 0 });
      const labelEvery = Math.ceil(data.daily.length / 8);
      const hourMap = Object.fromEntries(data.hours.map((h) => [h.hour, h.n]));
      const hourRows = Array.from({ length: 24 }, (_, h) => ({ h, n: hourMap[h] || 0 }));
      const firstH = Math.min(7, ...data.hours.map((h) => h.hour)), lastH = Math.max(21, ...data.hours.map((h) => h.hour));
      const hours = hourRows.slice(firstH, lastH + 1);
      const maxHour = Math.max(1, ...hours.map((h) => h.n));
      const hourLabel = (h) => `${((h + 11) % 12) + 1}${h < 12 ? 'am' : 'pm'}`;
      const peak = data.hours.reduce((b, h) => (h.n > b.n ? h : b), { n: 0 });
      const avgFam = s.families ? (s.voters / s.families).toFixed(1) : '0';
      const coverage = pct(s.in_roll, s.roll_total);

      const AGE_ORDER = ['18-25', '26-35', '36-45', '46-60', '60+', 'unknown'];
      const ageRows = AGE_ORDER.map((b) => ({ label: b === 'unknown' ? 'Not in voter list' : `${b} years`, n: (data.ages.find((a) => a.band === b) || {}).n || 0 }))
        .filter((r) => r.n || r.label !== 'Not in voter list');
      const G = { M: 'Men', F: 'Women', other: 'Other', unknown: 'Not in voter list' };
      const gOf = (list, g) => (list.find((x) => x.g === g) || {}).n || 0;
      const genderRows = ['M', 'F', 'other', 'unknown'].map((g) => ({
        label: G[g], n: gOf(data.genders, g),
        sub: s.roll_total && g !== 'unknown' && gOf(data.roll_genders, g) ? `/ ${fmtNum(gOf(data.roll_genders, g))} · ${pct(gOf(data.genders, g), gOf(data.roll_genders, g))}%` : '',
      })).filter((r) => r.n || r.label === 'Men' || r.label === 'Women');
      const sizeRows = [1, 2, 3, 4, 5, 6].map((n) => ({ label: n === 6 ? '6 or more voters' : n === 1 ? '1 voter' : `${n} voters`, n: (data.family_sizes.find((x) => x.size === n) || {}).families || 0 }));

      const qItem = (ic, cls, label, n, href, hint) => `
        <${href && n ? `a href="${href}"` : 'div'} class="q-item ${n ? cls : 'ok'}">
          <span class="ico">${icon(n ? ic : 'check')}</span><span class="q-text"><b>${label}</b><span>${hint}</span></span>
          <span class="q-n mono">${fmtNum(n)}</span>${href && n ? icon('arrow') : ''}</${href && n ? 'a' : 'div'}>`;

      body.innerHTML = `
        <div class="grid grid-4" style="margin-top:20px">
          <div class="card stat feature"><div class="label"><span class="ico">${icon('shield')}</span>Verified voters</div>
            <div class="value mono">${fmtNum(s.voters)}</div>
            <div class="hint">${s.roll_total ? `${coverage}% of ${fmtNum(s.roll_total)} in the voter list` : `${fmtNum(s.active_days)} active days`}</div>
            ${s.roll_total ? `<div class="st-progress"><i style="width:${Math.min(100, coverage)}%"></i></div>` : ''}</div>
          <div class="card stat"><div class="label"><span class="ico y">${icon('family')}</span>Families</div>
            <div class="value mono">${fmtNum(s.families)}</div><div class="hint">${avgFam} voters per family</div></div>
          <div class="card stat"><div class="label"><span class="ico g">${icon('vote')}</span>Family votes</div>
            <div class="value mono">${fmtNum(s.family_votes)}</div><div class="hint">${fmtNum(s.family_remaining)} not verified yet</div></div>
          <div class="card stat"><div class="label"><span class="ico b">${icon('pin')}</span>Streets</div>
            <div class="value mono">${fmtNum(s.streets)}</div><div class="hint">${fmtNum(s.volunteers)} volunteers · ${fmtNum(s.active_days)} days</div></div>
        </div>

        <div class="grid grid-2" style="margin-top:20px">
          <div class="card"><div class="card-head"><h3>Verified per day</h3><span class="badge badge-gray">${shortDate(data.range.from)} – ${shortDate(data.range.to)}</span></div>
            <div class="card-pad">
              <div class="st-mini"><span><b class="mono">${fmtNum(rangeTotal)}</b> in this period</span><span><b class="mono">${(rangeTotal / data.daily.length).toFixed(1)}</b> per day</span>
                ${best.n ? `<span>Best day <b>${shortDate(best.day)}</b> · <b class="mono">${fmtNum(best.n)}</b></span>` : ''}</div>
              <div class="chart ${dense ? 'dense' : ''}">${data.daily.map((d, i) => `
                <div class="col" title="${esc(shortDate(d.day))}: ${d.n}"><div class="bar ${d.n ? '' : 'zero'}" style="height:${Math.max(3, (d.n / maxDay) * 100)}%">${d.n && !dense ? `<span>${d.n}</span>` : ''}</div>
                  <div class="day">${!dense || i % labelEvery === 0 || (i === data.daily.length - 1 && i % labelEvery >= labelEvery / 2) ? shortDate(d.day) : '&nbsp;'}</div></div>`).join('')}
              </div></div></div>
          <div class="card"><div class="card-head"><h3>Data quality</h3></div>
            <div class="q-list">
              ${qItem('alert', 'amber', 'Double votes', q.double_votes, '#/voters?double=1', 'Voters with a second vote elsewhere')}
              ${q.name_checks !== null ? qItem('alert', 'red', 'Names to check', q.name_checks, '#/checks', 'Name differs from the voter list') : ''}
              ${qItem('inbox', 'amber', 'Waiting in review', q.review_pending, '#/review', 'Uploaded rows to accept or discard')}
              ${s.roll_total ? qItem('search', 'amber', 'Serial not in voter list', q.not_in_roll, '', 'Check the serial number') : ''}
              ${qItem('hash', 'gray', 'No door number', q.no_door, '', 'Door number is empty')}
            </div></div>
        </div>

        <div class="card" style="margin-top:20px"><div class="card-head"><h3>Streets</h3><span class="badge badge-gray">${fmtNum(data.streets.length)}</span></div>
          <div id="st-streets">${streetTable()}</div></div>

        <div class="card" style="margin-top:20px"><div class="card-head"><h3>Volunteers</h3><span class="badge badge-gray">${fmtNum(data.volunteers.length)}</span></div>
          <div id="st-vols">${volunteerTable()}</div></div>

        <div class="grid grid-3" style="margin-top:20px">
          <div class="card"><div class="card-head"><h3>Family size</h3></div>
            ${s.families ? hbars(sizeRows, 'y') : emptyState('family', 'No families', 'Nothing matches these filters.')}
            <p class="muted st-foot">Voters verified per family (one mobile number).</p></div>
          <div class="card"><div class="card-head"><h3>Age</h3></div>
            ${s.voters ? hbars(ageRows) : emptyState('user', 'No voters', 'Nothing matches these filters.')}
            <p class="muted st-foot">From the voter list.</p></div>
          <div class="card"><div class="card-head"><h3>Men and women</h3></div>
            ${s.voters ? hbars(genderRows, 'y') : emptyState('users', 'No voters', 'Nothing matches these filters.')}
            ${s.roll_total ? '<p class="muted st-foot">Verified / in the voter list.</p>' : ''}</div>
        </div>

        <div class="card" style="margin-top:20px"><div class="card-head"><h3>Time of day</h3>${peak.n ? `<span class="badge badge-gray">Busiest ${hourLabel(peak.hour)}</span>` : ''}</div>
          <div class="card-pad"><div class="chart dense hours">${hours.map((h) => `
            <div class="col" title="${hourLabel(h.h)}: ${h.n}"><div class="bar ${h.n ? '' : 'zero'}" style="height:${Math.max(3, (h.n / maxHour) * 100)}%"></div>
              <div class="day">${h.h % 3 === 0 ? hourLabel(h.h) : '&nbsp;'}</div></div>`).join('')}</div></div></div>`;
    }

    function toCsv() {
      const cell = (v) => { const t = String(v ?? ''); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
      const line = (a) => a.map(cell).join(',');
      const s = data.summary, q = data.quality;
      const out = [
        line(['34 Division statistics']),
        line(['Street', f.street ? (data.options.streets.find((x) => x.key === f.street) || {}).street : 'All']),
        line(['Volunteer', f.volunteer ? (data.options.volunteers.find((x) => String(x.id) === f.volunteer) || {}).full_name : 'All']),
        line(['From', f.from || 'start']), line(['To', f.to || 'today']), '',
        line(['Verified voters', s.voters]), line(['Families', s.families]), line(['Family votes', s.family_votes]),
        line(['Family votes not verified yet', s.family_remaining]), line(['Streets', s.streets]), line(['Volunteers', s.volunteers]),
        line(['In voter list', s.in_roll]), line(['Voter list total', s.roll_total]), line(['Double votes', q.double_votes]),
        ...(q.name_checks !== null ? [line(['Names to check', q.name_checks])] : []), line(['No door number', q.no_door]), '',
        line(['Street', 'Voters', 'Families', 'Double votes', 'Volunteers', 'Last added']),
        ...data.streets.map((r) => line([r.street, r.voters, r.families, r.double_votes, r.volunteers, r.last_at ? new Date(r.last_at).toLocaleString('en-IN') : ''])), '',
        line(['Volunteer', 'Voters', 'Families', 'Streets', 'Today', 'Active days', 'Last active']),
        ...data.volunteers.map((r) => line([r.full_name, r.voters, r.families, r.streets, r.today, r.days, r.last_at ? new Date(r.last_at).toLocaleString('en-IN') : ''])), '',
        line(['Day', 'Verified']), ...data.daily.map((d) => line([d.day, d.n])),
      ];
      const blob = new Blob(['﻿' + out.join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `34-division-statistics-${isoDay(new Date())}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    // ----- events
    $('#st-street').addEventListener('change', (e) => { f.street = e.target.value; load(); });
    $('#st-vol').addEventListener('change', (e) => { f.volunteer = e.target.value; load(); });
    $('#st-from').addEventListener('change', (e) => { f.from = e.target.value; load(); });
    $('#st-to').addEventListener('change', (e) => { f.to = e.target.value; load(); });
    $('#st-csv').addEventListener('click', () => data && toCsv());
    el.addEventListener('click', (e) => {
      const r = e.target.closest('[data-range]');
      if (r) {
        const def = RANGES.find((x) => x[0] === r.dataset.range);
        f.from = def[2] === null ? '' : daysAgo(def[2]);
        f.to = '';
        $('#st-from').value = f.from; $('#st-to').value = '';
        return load();
      }
      if (e.target.closest('#st-clear')) {
        Object.assign(f, { street: '', volunteer: '', from: '', to: '' });
        $('#st-from').value = ''; $('#st-to').value = '';
        return load();
      }
      const h = e.target.closest('[data-sort]');
      if (h) {
        const [table, key] = h.dataset.sort.split(':');
        const s = sort[table];
        if (s.key === key) s.dir = -s.dir; else { s.key = key; s.dir = ['street', 'full_name'].includes(key) ? 1 : -1; }
        if (table === 'streets') $('#st-streets').innerHTML = streetTable(); else $('#st-vols').innerHTML = volunteerTable();
        return;
      }
      const st = e.target.closest('tr[data-street]');
      if (st) { f.street = st.dataset.street; window.scrollTo({ top: 0, behavior: 'smooth' }); return load(); }
      const vo = e.target.closest('tr[data-vol]');
      if (vo) { f.volunteer = vo.dataset.vol; window.scrollTo({ top: 0, behavior: 'smooth' }); return load(); }
    });
    await load();
  }

  // ---------------------------------------------------------------- more than one vote
  // People who appear more than once in the uploaded voter list (same voter ID,
  // or same name + father/husband + age), and entries the list marks "listed
  // twice". Worked out from the voter list only, not from the added voters.
  const MV_REASONS = {
    same_id: ['Same voter ID', 'badge-red'],
    same_house: ['Same name and house number', 'badge-amber'],
    listed_twice: ['Listed twice in the voter list', 'badge-amber'],
  };
  const mvTabs = (active) => `
    <div class="seg-tabs" role="tablist">
      <a role="tab" href="#/multi" class="${active === 'dup' ? 'on' : ''}" aria-selected="${active === 'dup'}">${icon('copy')}Duplicates</a>
      <a role="tab" href="#/multi?tab=names" class="${active === 'names' ? 'on' : ''}" aria-selected="${active === 'names'}">${icon('users')}Check by hand</a>
    </div>`;

  // Possible duplicates for checking by hand: same name + same father/husband +
  // about the same age, with their serial numbers side by side.
  const SN_HINTS = {
    same_id: ['Same voter ID', 'badge-red'],
    same_house: ['Same house', 'badge-red'],
    added_twice: ['Added more than once', 'badge-ink'],
    same_father: ['Same father/husband', 'badge-amber'],
    listed_twice: ['Listed twice', 'badge-amber'],
    close_age: ['Similar age', 'badge-gray'],
  };
  async function viewSameNames(el, params) {
    const f = { q: params.get('q') || '', hint: params.get('hint') || '' };
    let data = null;
    let shown = 60;
    const open = new Set();
    el.innerHTML = `
      <div class="page-head"><div><h1>More than one vote</h1><p>Same name, same father/husband and about the same age (within 2 years), with their serial numbers. Check them by hand so nobody is missed.</p></div>
        <button class="btn btn-ghost" id="sn-csv" disabled>${icon('download')}Download CSV</button></div>
      ${mvTabs('names')}
      <div class="card">
        <div class="toolbar">
          <label class="search">${icon('search')}<input class="input" id="sn-q" type="search" value="${esc(f.q)}" placeholder="Search name, Telugu name, voter ID or serial" /></label>
        </div>
        <div class="st-ranges" id="sn-hints"></div>
      </div>
      <div id="sn-sum" class="mv-sum"></div>
      <div id="sn-list"><div class="card card-pad" style="margin-top:16px"><div class="skeleton" style="height:220px"></div></div></div>`;

    const keep = () => {
      const qs = new URLSearchParams(Object.entries({ tab: 'names', ...f }).filter(([, v]) => v)).toString();
      history.replaceState(null, '', `#/multi?${qs}`);
    };
    const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
    function filtered() {
      const q = norm(f.q), qId = q.replace(/\s+/g, ''), raw = f.q.trim();
      return data.groups.filter((g) => {
        if (f.hint === 'none' ? g.hints.length : f.hint && !g.hints.includes(f.hint)) return false;
        if (!q) return true;
        if (/^\d+$/.test(raw)) return g.entries.some((e) => e.serial_no === raw); // a number = a serial number
        return g.entries.some((e) => norm(e.name).includes(q) || (e.name_te || '').includes(raw)
          || (e.epic || '').toLowerCase().includes(qId));
      });
    }
    function drawHints() {
      const n = (h) => data.groups.filter((g) => (h === 'none' ? !g.hints.length : g.hints.includes(h))).length;
      $('#sn-hints').innerHTML = [['', 'All', data.groups.length], ...Object.entries(SN_HINTS).map(([k, [l]]) => [k, l, n(k)])]
        .map(([k, l, c]) => `<button type="button" class="chip-btn ${f.hint === k ? 'on' : ''}" data-hint="${k}">${l} <span class="mono">${fmtNum(c)}</span></button>`).join('');
    }
    const row = (g, i) => {
      const isOpen = open.has(i);
      return `
      <div class="sn-row ${isOpen ? 'open' : ''}" data-i="${i}">
        <button type="button" class="sn-main" data-toggle="${i}" aria-expanded="${isOpen}">
          <span class="sn-name"><b data-nt>${esc(g.name)}</b>${g.name_te ? ` <span class="te" lang="te" data-nt>${esc(g.name_te)}</span>` : ''}</span>
          <span class="sn-serials">${g.entries.map((e) => `<span class="sn-serial ${e.voter_id ? 'added' : ''}" title="${e.voter_id ? 'Added' : 'Not added'}"><span class="mono" data-nt>${esc(e.serial_no)}</span>${e.voter_id ? icon('check') : ''}</span>`).join('')}</span>
          <span class="sn-hints">${g.duplicate ? `<span class="badge badge-red">${icon('copy')}Duplicate</span>` : ''}${g.hints.map((h) => `<span class="badge ${SN_HINTS[h][1]}">${SN_HINTS[h][0]}</span>`).join('')}</span>
          <span class="sn-chev">${icon('arrow')}</span>
        </button>
        ${isOpen ? `<div class="table-wrap"><table class="table sn-table"><thead><tr><th>Serial</th><th>Voter ID</th><th>Name</th><th>Father/Husband</th><th>Age</th><th>Door</th><th>Part</th><th>Added</th></tr></thead><tbody>
          ${g.entries.map((e) => `<tr>
            <td class="mono"><b data-nt>${esc(e.serial_no)}</b></td><td class="mono" data-nt>${esc(e.epic || '—')}</td>
            <td><span data-nt>${esc(e.name)}</span>${e.listed_twice ? ' <span class="badge badge-amber">Listed twice</span>' : ''}</td>
            <td data-nt>${esc(e.relation_en || e.relation_te || '—')}</td><td class="mono">${e.age ?? '—'}</td>
            <td data-nt>${esc(e.door_no || '—')}</td><td class="mono" data-nt>${esc(e.part_no || '—')}</td>
            <td>${e.voter_id ? `<span class="badge badge-green">${icon('check')}Added</span> <span class="muted" data-nt>${esc(e.verified_by_name || '')}</span>`
              : `<a class="btn btn-sm btn-brand" href="#/add?serial=${encodeURIComponent(e.serial_no)}">${icon('plus')}Add</a>`}</td></tr>`).join('')}
          </tbody></table></div>` : ''}
      </div>`;
    };
    function draw() {
      const list = filtered();
      $('#sn-sum').innerHTML = `<b class="mono">${fmtNum(list.length)}</b> <span>names</span> · <b class="mono">${fmtNum(list.reduce((a, g) => a + g.count, 0))}</b> <span>entries</span> · <span class="muted">tap a name to compare</span>`;
      if (!data.roll_total) {
        $('#sn-list').innerHTML = `<div class="card" style="margin-top:16px">${emptyState('list', 'The voter list isn’t uploaded yet', 'Duplicates are found in the voter list.')}</div>`;
        return;
      }
      $('#sn-list').innerHTML = list.length
        ? `<div class="card sn-card">${list.slice(0, shown).map((g) => row(g, data.groups.indexOf(g))).join('')}</div>`
          + (list.length > shown ? `<button class="btn btn-ghost btn-block" id="sn-more" style="margin-top:16px">Show more (${fmtNum(list.length - shown)} left)</button>` : '')
        : `<div class="card" style="margin-top:16px">${emptyState('check', 'Nobody found', 'No one with more than one vote matches this search.')}</div>`;
    }
    function toCsv() {
      const cell = (v) => { const t = String(v ?? ''); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
      const rows = [['Group', 'Name', 'Serial numbers', 'Duplicate', 'Hints', 'Serial', 'Voter ID', 'Name (entry)', 'Name (Telugu)', 'Father/Husband', 'Age', 'Gender', 'Door No', 'Part', 'Listed twice', 'Added', 'Added by']];
      filtered().forEach((g, n) => g.entries.forEach((e) => rows.push([n + 1, g.name, g.entries.map((x) => x.serial_no).join(' / '), g.duplicate ? 'Yes' : '',
        g.hints.map((h) => SN_HINTS[h][0]).join('; '), e.serial_no, e.epic, e.name, e.name_te, e.relation_en || e.relation_te, e.age ?? '', e.gender,
        e.door_no, e.part_no, e.listed_twice ? 'Yes' : '', e.voter_id ? 'Yes' : 'No', e.verified_by_name || ''])));
      const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `34-division-same-names-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    $('#sn-q').addEventListener('input', debounce((e) => {
      f.q = e.target.value; shown = 60; keep();
      if (data && /^\d+$/.test(f.q.trim())) filtered().forEach((g) => open.add(data.groups.indexOf(g)));
      if (data) draw();
    }, 200));
    $('#sn-csv').addEventListener('click', () => data && toCsv());
    el.addEventListener('click', (e) => {
      const h = e.target.closest('[data-hint]');
      if (h) { f.hint = h.dataset.hint; shown = 60; keep(); drawHints(); return draw(); }
      if (e.target.closest('#sn-more')) { shown += 60; return draw(); }
      const t = e.target.closest('[data-toggle]');
      if (t) { const i = Number(t.dataset.toggle); if (open.has(i)) open.delete(i); else open.add(i); draw(); }
    });
    data = await api('GET', '/api/same-names');
    if (!el.isConnected) return;
    if (f.hint && f.hint !== 'none' && !SN_HINTS[f.hint]) f.hint = '';
    // A search for one serial opens that name straight away.
    if (/^\d+$/.test(f.q.trim())) filtered().forEach((g) => open.add(data.groups.indexOf(g)));
    drawHints();
    draw();
    $('#sn-csv').disabled = !data.groups.length;
  }

  async function viewMulti(el, params) {
    if (params.get('tab') === 'names') return viewSameNames(el, params);
    const f = { reason: params.get('reason') || 'all', status: params.get('status') || '', q: params.get('q') || '' };
    let data = null;
    let shown = 30;

    el.innerHTML = `
      <div class="page-head"><div><h1>More than one vote</h1><p>People listed more than once in the voter list. Search any serial number to see all of that person’s serials.</p></div>
        <button class="btn btn-ghost" id="mv-csv" disabled>${icon('download')}Download CSV</button></div>
      ${mvTabs('dup')}
      <div class="card">
        <div class="toolbar">
          <label class="search">${icon('search')}<input class="input" id="mv-q" type="search" value="${esc(f.q)}" placeholder="Search name, Telugu name, voter ID or serial" /></label>
          <select class="select" id="mv-status" aria-label="Verified">
            <option value="">Verified or not</option><option value="verified" ${f.status === 'verified' ? 'selected' : ''}>Verified</option>
            <option value="not" ${f.status === 'not' ? 'selected' : ''}>Not verified yet</option>
            <option value="twice" ${f.status === 'twice' ? 'selected' : ''}>Added more than once</option></select>
        </div>
        <div class="st-ranges" id="mv-reasons"></div>
      </div>
      <div id="mv-sum" class="mv-sum"></div>
      <div id="mv-list"><div class="card card-pad" style="margin-top:16px"><div class="skeleton" style="height:220px"></div></div></div>`;

    const keep = () => {
      const qs = new URLSearchParams(Object.entries(f).filter(([k, v]) => v && !(k === 'reason' && v === 'all'))).toString();
      history.replaceState(null, '', `#/multi${qs ? '?' + qs : ''}`);
    };
    const norm = (s) => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

    function filtered() {
      const q = norm(f.q);
      const qId = q.replace(/\s+/g, '');
      return data.people.filter((p) => {
        if (f.reason !== 'all' && !p.reasons.includes(f.reason)) return false;
        if (f.status === 'verified' && !p.entries.some((e) => e.voter_id)) return false;
        if (f.status === 'not' && p.entries.some((e) => e.voter_id)) return false;
        if (f.status === 'twice' && p.added < 2) return false;
        if (!q) return true;
        return p.entries.some((e) => norm(e.name).includes(q) || (e.name_te || '').includes(f.q.trim())
          || norm(e.relation_en).includes(q) || (e.epic || '').toLowerCase().replace(/\s+/g, '').includes(qId) || e.serial_no === f.q.trim());
      });
    }

    function drawReasons() {
      const c = data.counts;
      $('#mv-reasons').innerHTML = [['all', 'All', c.all], ...Object.entries(MV_REASONS).map(([k, [label]]) => [k, label, c[k]])]
        .map(([k, label, n]) => `<button type="button" class="chip-btn ${f.reason === k ? 'on' : ''}" data-reason="${k}">${label} <span class="mono">${fmtNum(n)}</span></button>`).join('');
    }

    const entryRow = (e, p) => {
      const others = p.entries.filter((x) => x !== e).map((x) => x.serial_no);
      return `
      <div class="mv-entry">
        <div class="mv-cells">
          <div class="ac-cell"><small>Serial</small><b class="mono" data-nt>${esc(e.serial_no)}</b></div>
          <div class="ac-cell"><small>Voter ID</small><b class="mono" data-nt>${esc(e.epic || '—')}</b></div>
          <div class="ac-cell"><small>Door</small><b class="mono" data-nt>${esc(e.door_no || '—')}</b></div>
        </div>
        <div class="mv-who">
          <div><b data-nt>${esc(e.name)}</b>${e.name_te ? ` <span class="te" lang="te" data-nt>${esc(e.name_te)}</span>` : ''}</div>
          <div class="ac-rel">${[relText(e), ageText(e) ? `<span>${ageText(e)}</span>` : '', e.part_no ? `<span>Part <span data-nt>${esc(e.part_no)}</span></span>` : ''].filter(Boolean).join(' · ')}</div>
        </div>
        <div class="mv-status">
          ${e.voter_id ? `
            <span class="badge badge-green">${icon('check')}Verified</span>
            <span class="muted mv-by"><span data-nt>${esc(e.verified_by_name || '')}</span>${e.street ? ` · <span data-nt>${esc(e.street)}</span>` : ''}</span>
            ${e.family_id ? `<a class="btn btn-sm btn-ghost" href="#/families?q=${encodeURIComponent(fid(e.family_id))}">${icon('family')}<span data-nt>${fid(e.family_id)}</span></a>` : ''}
            ${e.double_vote
              ? `<span class="dv-chip on">${icon('alert')}Double vote${e.double_vote_note ? ` <em data-nt>${esc(e.double_vote_note)}</em>` : ''}</span>`
              : `<button class="btn btn-sm btn-ghost" data-mark="${e.voter_id}" data-note="${esc(others.length ? `Also serial ${others.join(', ')}` : '')}">${icon('alert')}Mark double vote</button>`}`
            : `<span class="badge badge-gray">Not verified yet</span>
               <a class="btn btn-sm btn-brand" href="#/add?serial=${encodeURIComponent(e.serial_no)}">${icon('plus')}Add</a>`}
        </div>
      </div>`;
    };

    function draw() {
      const list = filtered();
      const votes = list.reduce((a, p) => a + p.votes, 0);
      $('#mv-sum').innerHTML = data.roll_total || data.people.length
        ? `<b class="mono">${fmtNum(list.length)}</b> <span>people</span> · <b class="mono">${fmtNum(votes)}</b> <span>votes</span>${data.roll_total ? ` · <span class="muted">voter list:</span> <b class="mono">${fmtNum(data.roll_total)}</b>` : ''}` : '';
      if (!data.roll_total && !data.people.length) {
        $('#mv-list').innerHTML = `<div class="card" style="margin-top:16px">${emptyState('list', 'The voter list isn’t uploaded yet', 'Duplicates are found in the voter list.',
          isAdmin() ? `<a class="btn btn-brand" href="#/upload?type=reference" style="margin-top:12px">${icon('upload')}Upload voter list</a>` : '')}</div>`;
        return;
      }
      if (!list.length) { $('#mv-list').innerHTML = `<div class="card" style="margin-top:16px">${emptyState('check', 'Nobody found', f.q ? 'No one with more than one vote matches this search.' : 'No one has more than one vote here.')}</div>`; return; }
      $('#mv-list').innerHTML = list.slice(0, shown).map((p) => `
        <div class="card mv-card">
          <div class="mv-head">
            <div class="mv-title"><b data-nt>${esc(p.entries[0].name)}</b>${p.entries[0].name_te ? ` <span class="te" lang="te" data-nt>${esc(p.entries[0].name_te)}</span>` : ''}</div>
            <span class="badge badge-red mv-votes">${p.votes} votes</span>
            ${p.added > 1 ? `<span class="badge badge-ink">${icon('alert')}Added ${p.added} times</span>` : ''}
            <div class="chips mv-why">${p.reasons.map((r) => `<span class="badge ${MV_REASONS[r][1]}">${MV_REASONS[r][0]}</span>`).join('')}</div>
          </div>
          ${p.entries.map((e) => entryRow(e, p)).join('')}
        </div>`).join('')
        + (list.length > shown ? `<button class="btn btn-ghost btn-block" id="mv-more" style="margin-top:16px">Show more (${fmtNum(list.length - shown)} left)</button>` : '');
    }

    function toCsv() {
      const cell = (v) => { const t = String(v ?? ''); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
      const rows = [['Person', 'Votes', 'Why', 'Serial', 'Voter ID', 'Name', 'Name (Telugu)', 'Father/Husband', 'Age', 'Gender', 'Door No', 'Part', 'Verified', 'Verified by', 'Street', 'Family', 'Double vote', 'Note']];
      filtered().forEach((p, n) => p.entries.forEach((e) => rows.push([n + 1, p.votes, p.reasons.map((r) => MV_REASONS[r][0]).join('; '),
        e.serial_no, e.epic, e.name, e.name_te, e.relation_en || e.relation_te, e.age ?? '', e.gender, e.door_no, e.part_no,
        e.voter_id ? 'Yes' : 'No', e.verified_by_name || '', e.street || '', e.family_id ? fid(e.family_id) : '', e.double_vote ? 'Yes' : '', e.double_vote_note || ''])));
      const blob = new Blob(['﻿' + rows.map((r) => r.map(cell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `34-division-more-than-one-vote-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    const redraw = () => { shown = 30; keep(); draw(); };
    $('#mv-q').addEventListener('input', debounce((e) => { f.q = e.target.value; redraw(); }, 200));
    $('#mv-status').addEventListener('change', (e) => { f.status = e.target.value; redraw(); });
    $('#mv-csv').addEventListener('click', () => data && toCsv());
    el.addEventListener('click', async (e) => {
      const r = e.target.closest('[data-reason]');
      if (r) { f.reason = r.dataset.reason; drawReasons(); return redraw(); }
      if (e.target.closest('#mv-more')) { shown += 30; return draw(); }
      const m = e.target.closest('[data-mark]');
      if (m) {
        busy(m, true, 'Saving…');
        try {
          await api('POST', `/api/voters/${m.dataset.mark}/double`, { double_vote: true, note: m.dataset.note });
          data.people.forEach((p) => p.entries.forEach((x) => {
            if (String(x.voter_id) === m.dataset.mark) { x.double_vote = true; x.double_vote_note = m.dataset.note; }
          }));
          toast('Marked as double vote');
          draw();
        } catch (er) { busy(m, false); fail(er); }
      }
    });

    data = await api('GET', '/api/multi-votes');
    if (!el.isConnected) return;
    if (f.reason !== 'all' && !MV_REASONS[f.reason]) f.reason = 'all';
    drawReasons();
    draw();
    $('#mv-csv').disabled = !data.people.length;
  }

  // ---------------------------------------------------------------- add voter
  async function viewAdd(el, params) {
    const pre = {
      mobile: params.get('mobile') || '',
      street: params.get('street') || '',
      family_votes: params.get('fv') || '1',
      serial: params.get('serial') || '',
    };
    el.innerHTML = `
      <div class="page-head"><div><h1>Add voter</h1><p>We check for duplicates while you type. Nothing is saved until you confirm.</p></div></div>
      ${pre.mobile ? `<div class="banner banner-green">${icon('family')}<span>Adding another member of the same family. Mobile, street and family votes are already filled in.</span></div>` : ''}
      <div class="grid grid-form">
        <form class="card card-pad" id="voter-form" novalidate autocomplete="off">
          <div class="field ac-wrap"><label for="f-name">Voter name</label>
            <span class="help hidden" id="ref-help" style="margin-top:-2px"></span>
            <input class="input" id="f-name" name="name" placeholder="e.g. Kandula Venkata Rao" required maxlength="120" autocapitalize="words"
              role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="ac-name" />
            <div class="ac-list hidden" id="ac-name" role="listbox"></div></div>
          <div class="row-2 ac-row">
            <div class="field ac-wrap"><label for="f-serial">Serial number</label>
              <input class="input" id="f-serial" name="serial_no" placeholder="e.g. 245" required maxlength="30" inputmode="numeric"
                role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="ac-serial" />
              <div class="ac-list hidden" id="ac-serial" role="listbox"></div></div>
            <div class="field ac-wrap"><label for="f-door">Door number</label>
              <input class="input" id="f-door" name="door_no" placeholder="e.g. 11-250" maxlength="60"
                role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="ac-door" />
              <div class="ac-list hidden" id="ac-door" role="listbox"></div></div>
          </div>
          <div id="picked" class="picked hidden"></div>
          <div class="field"><label for="f-fv">Family votes</label>
            <div class="stepper"><button type="button" data-step="-1" aria-label="Decrease">−</button>
              <input id="f-fv" name="family_votes" type="number" min="1" max="99" value="${esc(pre.family_votes)}" inputmode="numeric" />
              <button type="button" data-step="1" aria-label="Increase">+</button></div></div>
          <div class="field dv-field">
            <label class="check"><input type="checkbox" id="f-dv" name="double_vote" />This voter has a double vote (also listed somewhere else)</label>
            <input class="input hidden" id="f-dv-note" name="double_vote_note" maxlength="200" placeholder="Where is the other vote? e.g. Ward 12, Guntur" /></div>
          <div class="field"><label for="f-mobile">Family mobile number</label>
            <div class="input-group"><span class="prefix">+91</span>
              <input class="input" id="f-mobile" name="mobile" placeholder="98480 12345" required inputmode="numeric" maxlength="14" value="${esc(pre.mobile)}" /></div>
            <span class="help">One number for the whole family. A number already used by a family can only be used to add members to that family.</span></div>
          <div id="fam-box" class="hidden" aria-live="polite"></div>
          <div class="field"><label for="f-street">Street name</label>
            <input class="input" id="f-street" name="street" list="street-list" placeholder="Start typing to pick a street" required maxlength="120" value="${esc(pre.street)}" />
            <datalist id="street-list"></datalist></div>
          <div class="field"><label for="f-notes">Notes <span class="muted" style="font-weight:500">(optional)</span></label>
            <input class="input" id="f-notes" name="notes" maxlength="500" placeholder="Anything the team should know" /></div>
          <div id="form-err" class="banner banner-red hidden"></div>
          <button type="button" id="dup-inline" class="dup-inline hidden"></button>
          <button class="btn btn-brand btn-block" type="submit" style="height:52px;font-size:16px">${icon('shield')}Verify & save</button>
          <button class="btn btn-ghost btn-block" type="button" id="clear-btn" style="margin-top:10px">Clear form</button>
        </form>
        <aside class="card dup-panel" id="dup-panel"></aside>
      </div>`;

    const form = $('#voter-form');
    const panel = $('#dup-panel');
    loadStreets().then((list) => { if ($('#street-list')) $('#street-list').innerHTML = list.map((s) => `<option value="${esc(s.street)}">`).join(''); });

    const values = () => ({
      name: form.name.value.trim(),
      serial_no: form.serial_no.value.trim(),
      mobile: form.mobile.value.replace(/\D/g, '').slice(-10),
      street: form.street.value.trim(),
      family_votes: Number(form.family_votes.value),
      notes: form.notes.value.trim(),
      door_no: form.door_no.value.trim(),
      double_vote: form.double_vote.checked,
      double_vote_note: form.double_vote.checked ? form.double_vote_note.value.trim() : '',
      join_family: !!joined && joined === form.mobile.value.replace(/\D/g, '').slice(-10),
    });

    // ---- one mobile number = one family
    let mobileFamily = null; // family that already owns the typed mobile number
    let joined = pre.mobile ? pre.mobile.replace(/\D/g, '').slice(-10) : ''; // mobile of the family the volunteer chose to join
    const famBox = $('#fam-box');
    function renderFamBox() {
      const mob = form.mobile.value.replace(/\D/g, '').slice(-10);
      if (!mobileFamily || mobileFamily.mobile !== mob) { famBox.className = 'hidden'; famBox.innerHTML = ''; return; }
      const f = mobileFamily;
      if (joined === mob) {
        famBox.className = 'fam-box joined';
        famBox.innerHTML = familyBox(f, `Adding to family ${fid(f.id)}`,
          `This voter will join the ${f.member_count} member${f.member_count === 1 ? '' : 's'} already in this family.`,
          '<button type="button" class="btn btn-sm btn-ghost" data-fam-act="other">Use a different number</button>');
      } else {
        famBox.className = 'fam-box taken';
        famBox.innerHTML = familyBox(f, 'This mobile number already belongs to a family',
          'One mobile number = one family. Add this voter to that family, or enter a different number for a new family.',
          `<button type="button" class="btn btn-sm btn-success" data-fam-act="join">${icon('family')}Add to family ${fid(f.id)}</button>
           <button type="button" class="btn btn-sm btn-ghost" data-fam-act="other">Use a different number</button>`);
      }
    }
    famBox.addEventListener('click', (e) => {
      const b = e.target.closest('[data-fam-act]');
      if (!b) return;
      if (b.dataset.famAct === 'join') {
        joined = mobileFamily.mobile;
        if (!form.street.value.trim() && mobileFamily.street) form.street.value = mobileFamily.street;
        if (mobileFamily.family_votes) form.family_votes.value = mobileFamily.family_votes;
        form.mobile.classList.remove('invalid');
        $('#form-err').classList.add('hidden');
      } else {
        joined = '';
        form.mobile.value = '';
        mobileFamily = null;
        form.mobile.focus();
      }
      renderFamBox();
    });

    function setPanel(kind, title, text, matches = [], family = [], roll = null) {
      const ic = { idle: 'search', checking: 'loader', ok: 'check', warn: 'alert', block: 'ban' }[kind];
      const row = (m) => voterRow(m, { matched: m.matched_on, level: m.level,
        actions: `<button type="button" class="icon-btn" data-family="${esc(m.mobile)}" title="See this family">${icon('family')}</button>` });
      // Compact copy of the status above the save button (visible on phones,
      // where the full panel sits below the form).
      const inline = $('#dup-inline');
      const rollWarn = roll && roll.name_matches === false;
      inline.className = `dup-inline ${rollWarn && kind === 'ok' ? 'warn' : kind}${kind === 'idle' ? ' hidden' : ''}`;
      inline.innerHTML = `${icon(rollWarn ? 'alert' : ic)}<span>${rollWarn && kind === 'ok' ? 'Name differs from the voter list' : title}</span>${matches.length || family.length || rollWarn ? '<em>See below ↓</em>' : ''}`;
      panel.innerHTML = `
        ${roll ? rollNote(roll) : ''}
        <div class="dup-state ${kind}"><div class="ico">${icon(ic)}</div><div><h3>${title}</h3><p>${text}</p></div></div>
        ${matches.length ? `<div class="match-list">${matches.map(row).join('')}</div>` : ''}
        ${family.length ? `<div class="section-cap">${icon('family')}Family already verified on this mobile (${family.length})</div>
          <div class="match-list">${family.map(row).join('')}</div>` : ''}`;
    }
    // What the voter list says at the typed serial number.
    const rollNote = (roll) => `
      <div class="roll-note ${roll.name_matches === false ? 'warn' : ''}">
        <div class="section-cap" style="margin:0 0 8px">${icon('list')}Voter list · serial <span data-nt>${esc(roll.entry.serial_no)}</span></div>
        ${refSummary(roll.entry)}
        ${roll.name_matches === false ? `<p class="roll-warn">${icon('alert')}<span>The name you typed is different from the voter list at this serial number. Check the serial number. If you save anyway, the admin will be asked to check it.</span></p>` : ''}
      </div>`;
    setPanel('idle', 'Duplicate check', 'Start typing the name, serial number or mobile. Matching voters will appear here.');

    let seq = 0;
    const check = debounce(async () => {
      const v = values();
      if (v.name.length < 3 && !v.serial_no && v.mobile.length < 10) {
        setPanel('idle', 'Duplicate check', 'Start typing the name, serial number or mobile. Matching voters will appear here.');
        mobileFamily = null; renderFamBox();
        return;
      }
      const my = ++seq;
      setPanel('checking', 'Checking…', 'Looking through verified voters.');
      try {
        const r = await api('POST', '/api/voters/check', v);
        if (my !== seq) return;
        mobileFamily = r.mobile_family || null;
        renderFamBox();
        const fam = r.family || [];
        if (r.level === 'exact') setPanel('block', 'Already verified', 'This voter is already in the list and can’t be entered again.', r.matches, fam, r.roll);
        else if (r.matches.length) setPanel('warn', `${r.matches.length} possible match${r.matches.length > 1 ? 'es' : ''}`, 'Check that this is a different person before saving. Highlighted fields match.', r.matches, fam, r.roll);
        else setPanel('ok', 'No duplicates found', fam.length ? 'This is a new member of a family that’s already in the list. You can save.' : 'This looks like a new voter. You can save.', [], fam, r.roll);
      } catch (e) { if (my === seq) fail(e); }
    }, 350);

    form.addEventListener('input', (e) => {
      if (e.target.name === 'mobile') e.target.value = e.target.value.replace(/[^\d+ ]/g, '');
      e.target.classList.remove('invalid');
      $('#form-err').classList.add('hidden');
      if (e.target.name === 'name') suggest('name');
      if (e.target.name === 'serial_no') suggest('serial');
      if (e.target.name === 'door_no') suggest('door');
      if (!['notes', 'family_votes', 'door_no', 'double_vote', 'double_vote_note'].includes(e.target.name)) check();
    });
    form.double_vote.addEventListener('change', (e) => {
      form.double_vote_note.classList.toggle('hidden', !e.target.checked);
      if (e.target.checked) form.double_vote_note.focus();
    });

    // ---- suggestions & auto-fill from the voter list
    const LISTS = { name: $('#ac-name'), serial: $('#ac-serial'), door: $('#ac-door') };
    const INPUTS = { name: form.name, serial: form.serial_no, door: form.door_no };
    const fieldOf = (list) => Object.keys(LISTS).find((k) => LISTS[k] === list);
    const inputOf = (list) => INPUTS[fieldOf(list)];
    const lists = new Map(); // list element -> { items, idx }
    let fromRef = null; // voter-list entry the form was last filled from
    let acSeq = 0;
    const serialKey = (s) => String(s || '').toUpperCase().replace(/\s+/g, '');
    const picked = $('#picked');

    function acClose(list) {
      list.classList.add('hidden');
      list.innerHTML = '';
      lists.delete(list);
      inputOf(list).setAttribute('aria-expanded', 'false');
      inputOf(list).removeAttribute('aria-activedescendant');
    }
    function acOpen(list, items) {
      if (!items.length) return acClose(list);
      items = groupSameNames(items);
      lists.set(list, { items, idx: -1 });
      list.innerHTML = rollItems(items, list.id);
      list.classList.remove('hidden');
      inputOf(list).setAttribute('aria-expanded', 'true');
    }
    function acMove(list, step) {
      const s = lists.get(list);
      if (!s) return;
      s.idx = (s.idx + step + s.items.length) % s.items.length;
      $$('.ac-item', list).forEach((el) => el.classList.toggle('active', Number(el.dataset.i) === s.idx));
      const act = $(`#${list.id}-${s.idx}`);
      inputOf(list).setAttribute('aria-activedescendant', act.id);
      act.scrollIntoView({ block: 'nearest' });
    }
    function showPicked(r) {
      if (!r) { picked.classList.add('hidden'); picked.innerHTML = ''; return; }
      picked.innerHTML = `<div class="picked-head">${icon('check')}<span>From the voter list</span>
        <button type="button" class="btn btn-sm btn-ghost" id="unpick">${icon('x')}Change</button></div>${refSummary(r)}`;
      picked.classList.remove('hidden');
      $('#unpick', picked).addEventListener('click', () => {
        form.name.value = ''; form.serial_no.value = ''; form.door_no.value = '';
        fromRef = null; showPicked(null); check(); form.name.focus();
      });
    }
    function choose(r) {
      if (r.verified) {
        toast(`${r.name} is already verified${r.verified_by_name ? ` by ${r.verified_by_name}` : ''}.`, 'err');
        return false;
      }
      form.name.value = r.name;
      form.serial_no.value = r.serial_no;
      form.door_no.value = r.door_no || '';
      fromRef = r;
      showPicked(r);
      [form.name, form.serial_no, form.door_no].forEach((i) => i.classList.remove('invalid'));
      Object.values(LISTS).forEach(acClose);
      check();
      return true;
    }

    const suggest = debounce(async (field) => {
      const list = LISTS[field];
      const q = INPUTS[field].value.trim();
      const my = ++acSeq;
      if (field === 'serial' && fromRef && form.name.value === fromRef.name && serialKey(q) !== fromRef.serial_no) {
        // Serial changed after an auto-fill: the filled name no longer belongs to it.
        form.name.value = '';
        form.door_no.value = '';
        fromRef = null;
        showPicked(null);
      }
      if (field === 'name' && fromRef && form.name.value !== fromRef.name) { fromRef = null; showPicked(null); }
      if (!q || (field === 'name' && q.length < 2)) return acClose(list);
      let items;
      try { items = await api('GET', `/api/reference/search?field=${field}&q=${encodeURIComponent(q)}`); } catch { return; }
      if (my !== acSeq || document.activeElement !== INPUTS[field]) return;
      if (field === 'serial') {
        const exact = items.filter((r) => r.serial_no === serialKey(q));
        const nameFree = !form.name.value.trim() || (fromRef && form.name.value === fromRef.name);
        if (exact.length === 1 && nameFree && !exact[0].verified) {
          // One voter has this serial number: fill name and door number straight away.
          form.name.value = exact[0].name;
          form.door_no.value = exact[0].door_no || '';
          form.name.classList.remove('invalid');
          fromRef = exact[0];
          showPicked(exact[0]);
          acClose(list);
          check();
          return;
        }
      }
      acOpen(list, items);
    }, 200);

    Object.values(LISTS).forEach((list) => {
      list.addEventListener('mousedown', (e) => e.preventDefault()); // keep focus in the input
      list.addEventListener('click', (e) => {
        const it = e.target.closest('.ac-item');
        const s = lists.get(list);
        if (it && s && choose(s.items[Number(it.dataset.i)])) (form.mobile.value ? form.street : form.mobile).focus();
      });
      hoverSameNames(list);
      const inp = inputOf(list);
      inp.addEventListener('keydown', (e) => {
        if (!lists.has(list)) return;
        if (e.key === 'ArrowDown') { e.preventDefault(); acMove(list, 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); acMove(list, -1); }
        else if (e.key === 'Escape') { e.stopPropagation(); acClose(list); }
        else if (e.key === 'Enter') {
          const s = lists.get(list);
          if (s.idx >= 0) { e.preventDefault(); if (choose(s.items[s.idx])) form.mobile.focus(); }
        }
      });
      inp.addEventListener('blur', () => acClose(list));
    });

    // Opened from the Voter list page with a serial number: fill it in.
    if (pre.serial) {
      api('GET', `/api/reference/search?field=serial&q=${encodeURIComponent(pre.serial)}`).then((items) => {
        const hit = items.find((r) => r.serial_no === serialKey(pre.serial));
        if (hit) choose(hit);
      }).catch(() => {});
    }

    api('GET', '/api/reference/stats').then(({ total }) => {
      const h = $('#ref-help');
      if (!h) return;
      h.innerHTML = total
        ? `Type a name (English or Telugu), serial number or door number to pick from the voter list (${fmtNum(total)} voters).`
        : `No reference voter list uploaded yet, so there are no suggestions.${isAdmin() ? ' <a href="#/upload?type=reference">Upload it</a>' : ''}`;
      h.classList.remove('hidden');
    }).catch(() => {});
    form.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (b) {
        const i = form.family_votes;
        i.value = Math.min(99, Math.max(1, (Number(i.value) || 1) + Number(b.dataset.step)));
      }
    });
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-family]');
      if (b) location.hash = `#/families?q=${encodeURIComponent(b.dataset.family)}`;
    });
    $('#dup-inline').addEventListener('click', () => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $('#clear-btn').addEventListener('click', () => { if (location.hash === '#/add') router(); else location.hash = '#/add'; });
    if (pre.mobile) { form.name.focus(); check(); } else form.name.focus();

    function clientValidate(v) {
      const errs = [];
      if (v.name.length < 2) errs.push(['name', 'Enter the voter name.']);
      if (!v.serial_no) errs.push(['serial_no', 'Enter the serial number.']);
      if (!/^[6-9]\d{9}$/.test(v.mobile)) errs.push(['mobile', 'Enter a valid 10-digit mobile number.']);
      else if (mobileFamily && mobileFamily.mobile === v.mobile && !v.join_family) {
        errs.push(['mobile', `This mobile number already belongs to family ${fid(mobileFamily.id)}. Tap “Add to family” or use a different number.`]);
      }
      if (!v.street) errs.push(['street', 'Enter the street name.']);
      if (!(v.family_votes >= 1 && v.family_votes <= 99)) errs.push(['family_votes', 'Family votes must be 1–99.']);
      errs.forEach(([n]) => form[n].classList.add('invalid'));
      return errs[0] && errs[0][1];
    }

    async function save(confirmDifferent) {
      const v = values();
      const msg = clientValidate(v);
      if (msg) { const fe = $('#form-err'); fe.innerHTML = `${icon('alert')}${esc(msg)}`; fe.classList.remove('hidden'); return; }
      const btn = $('button[type=submit]', form);
      busy(btn, true, 'Saving…');
      try {
        const saved = await api('POST', '/api/voters', { ...v, confirm_different: confirmDifferent });
        closeModal();
        showSaved(v, saved);
      } catch (e) {
        if (e.status === 409 && e.data.family_taken) {
          closeModal();
          mobileFamily = e.data.family;
          joined = '';
          renderFamBox();
          form.mobile.classList.add('invalid');
          const fe = $('#form-err'); fe.innerHTML = `${icon('alert')}${esc(e.message)}`; fe.classList.remove('hidden');
          famBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (e.status === 409 && e.data.level === 'exact') {
          closeModal();
          setPanel('block', 'Already verified', 'This voter is already in the list and can’t be entered again.', e.data.matches || []);
          openModal({
            title: 'Already verified',
            sub: 'This voter was verified earlier, so it can’t be entered again.',
            body: compareCards(v, (e.data.matches || []).filter((m) => m.level === 'exact')),
            foot: '<button class="btn btn-primary" data-close>OK, got it</button>',
          });
        } else if (e.status === 409 && e.data.needs_confirmation) {
          confirmModal(v, e.data.matches);
        } else fail(e);
      } finally { busy(btn, false); }
    }

    function confirmModal(v, matches) {
      const m = openModal({
        title: 'Is this a different person?',
        sub: 'We found verified voters that look similar. Compare them carefully.',
        wide: true,
        body: `${compareCards(v, matches)}
          <label class="check" style="margin-top:14px"><input type="checkbox" id="confirm-diff" />I have checked these entries. This is a different person and should be added.</label>`,
        foot: `<button class="btn btn-ghost" data-close>Same person, don’t add</button>
               <button class="btn btn-primary" id="confirm-save" disabled>${icon('check')}Add as new voter</button>`,
      });
      $('#confirm-diff', m).addEventListener('change', (e) => { $('#confirm-save', m).disabled = !e.target.checked; });
      $('#confirm-save', m).addEventListener('click', (e) => { busy(e.currentTarget, true, 'Saving…'); save(true); });
    }

    function showSaved(v, saved) {
      toast(`${v.name} verified`);
      const m = openModal({
        title: '',
        body: `<div class="success-card"><div class="ico">${icon('check')}</div>
          <h2 style="font-size:22px">${esc(v.name)} is verified</h2>
          <p class="muted" style="margin:6px 0 12px">Serial ${esc(v.serial_no)}${v.door_no ? ` · Door ${esc(v.door_no)}` : ''} · ${esc(v.street)}</p>
          <a class="fam-chip lg" href="#/families?q=${fid(saved.family_id)}">${icon('family')}Family ${fid(saved.family_id)}</a>
          <p class="muted" style="margin:10px 0 0;font-size:13.5px">${saved.family_created
            ? `<span>New family created by</span> <b>${esc(state.user.full_name)}</b>`
            : 'Added to an existing family'}</p></div>`,
        foot: `<button class="btn btn-ghost" id="s-new">${icon('plus')}New family</button>
               <button class="btn btn-brand" id="s-family">${icon('family')}Add family member</button>`,
      });
      $('#s-family', m).addEventListener('click', () => {
        const target = `#/add?mobile=${encodeURIComponent(v.mobile)}&street=${encodeURIComponent(v.street)}&fv=${v.family_votes}`;
        if (location.hash === target) router(); else location.hash = target;
      });
      $('#s-new', m).addEventListener('click', () => { if (location.hash === '#/add') router(); else location.hash = '#/add'; });
    }

    form.addEventListener('submit', (e) => { e.preventDefault(); save(false); });
  }

  // ---------------------------------------------------------------- voters list
  async function viewVoters(el, params) {
    const q = { q: params.get('q') || '', street: params.get('street') || '', mobile: params.get('mobile') || '', page: 1,
      double: params.get('double') === '1' ? '1' : '', dup: params.get('dup') === '1' ? '1' : '' };
    el.innerHTML = `
      <div class="page-head"><div><h1>Voters</h1><p id="count-line">Loading…</p></div>
        <div style="display:flex;gap:10px">${isAdmin() ? `<a class="btn btn-ghost" href="/api/export.csv">${icon('download')}Export</a>` : ''}
        <a class="btn btn-brand" href="#/add">${icon('plus')}Add voter</a></div></div>
      ${q.mobile ? `<div class="banner banner-green">${icon('family')}<span>Showing the family with mobile ${esc(fmtMobile(q.mobile))}</span>
        <a class="btn btn-sm btn-ghost" href="#/add?mobile=${encodeURIComponent(q.mobile)}">${icon('plus')}Add member</a>
        <a class="btn btn-sm btn-primary" href="#/voters" style="margin-left:0">Show all</a></div>` : ''}
      <div class="card">
        <div class="toolbar">
          <label class="search">${icon('search')}<input class="input" id="v-q" placeholder="Search name, serial, family ID, mobile or street" value="${esc(q.q)}" type="search" /></label>
          <select class="select" id="v-street"><option value="">All streets</option></select>
          <label class="check filter-check"><input type="checkbox" id="v-double" ${q.double ? 'checked' : ''} />Double votes only</label>
          <label class="check filter-check"><input type="checkbox" id="v-dup" ${q.dup ? 'checked' : ''} />Duplicate in voter list</label>
        </div>
        <div id="v-list"><div class="card-pad"><div class="skeleton" style="height:200px"></div></div></div>
        <div class="list-foot" id="v-foot"></div>
      </div>`;

    loadStreets().then((list) => {
      if (!$('#v-street')) return; // page already left
      $('#v-street').innerHTML = '<option value="">All streets</option>' +
        list.map((s) => `<option ${s.street === q.street ? 'selected' : ''} value="${esc(s.street)}">${esc(s.street)} (${s.voters})</option>`).join('');
    });

    async function load() {
      const usp = new URLSearchParams({ q: q.q, street: q.street, mobile: q.mobile, page: q.page, double: q.double, dup: q.dup });
      const r = await api('GET', `/api/voters?${usp}`);
      $('#count-line').textContent = `${fmtNum(r.total)} verified voter${r.total === 1 ? '' : 's'}${q.q || q.street || q.mobile || q.double || q.dup ? ' match your filters' : ''}`;
      const acts = (v) => `
        <button class="icon-btn" data-family="${esc(v.mobile)}" title="Show family">${icon('family')}</button>
        ${isAdmin() ? `<button class="icon-btn" data-edit="${v.id}" title="Edit">${icon('edit')}</button>
        <button class="icon-btn" data-del="${v.id}" title="Delete">${icon('trash')}</button>` : ''}`;
      $('#v-list').innerHTML = r.voters.length
        ? r.voters.map((v) => voterRow(v, { actions: acts(v), money: true, dv: true })).join('')
        : emptyState('search', 'No voters found', q.q || q.street ? 'Try a different search or street.' : 'Verified voters will appear here.');
      $('#v-list').__data = r.voters;
      $('#v-foot').innerHTML = r.pages > 1 ? `
        <span>Page ${r.page} of ${r.pages}</span>
        <span style="display:flex;gap:8px"><button class="btn btn-sm btn-ghost" data-page="${r.page - 1}" ${r.page <= 1 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn-sm btn-ghost" data-page="${r.page + 1}" ${r.page >= r.pages ? 'disabled' : ''}>Next</button></span>` : `<span>${fmtNum(r.total)} shown</span><span></span>`;
    }

    $('#v-q').addEventListener('input', debounce((e) => { q.q = e.target.value.trim(); q.page = 1; load().catch(fail); }, 300));
    $('#v-street').addEventListener('change', (e) => { q.street = e.target.value; q.page = 1; load().catch(fail); });
    $('#v-double').addEventListener('change', (e) => { q.double = e.target.checked ? '1' : ''; q.page = 1; load().catch(fail); });
    $('#v-dup').addEventListener('change', (e) => { q.dup = e.target.checked ? '1' : ''; q.page = 1; load().catch(fail); });
    $('#v-foot').addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (b) { q.page = Number(b.dataset.page); load().catch(fail); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
    $('#v-list').addEventListener('click', async (e) => {
      const fam = e.target.closest('[data-family]');
      const ed = e.target.closest('[data-edit]');
      const del = e.target.closest('[data-del]');
      const data = $('#v-list').__data || [];
      if (fam) location.hash = `#/families?q=${encodeURIComponent(fam.dataset.family)}`;
      if (ed) editModal(data.find((v) => v.id === Number(ed.dataset.edit)), () => load().catch(fail));
      if (del) {
        const v = data.find((x) => x.id === Number(del.dataset.del));
        const m = openModal({
          title: 'Delete this voter?',
          sub: `${esc(v.name)} · Serial ${esc(v.serial_no)}. This can’t be undone.`,
          foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="do-del">${icon('trash')}Delete</button>`,
        });
        $('#do-del', m).addEventListener('click', async (ev) => {
          busy(ev.currentTarget, true, 'Deleting…');
          try { await api('DELETE', `/api/voters/${v.id}`); closeModal(); toast('Voter deleted'); load().catch(fail); } catch (er) { fail(er); busy(ev.currentTarget, false); }
        });
      }
    });
    await load();
  }

  function editModal(v, onDone) {
    const m = openModal({
      title: 'Edit voter',
      sub: 'Only the admin can edit verified voters.',
      body: `<form id="edit-form">
        <div class="field"><label>Voter name</label><input class="input" name="name" value="${esc(v.name)}" required /></div>
        <div class="row-2">
          <div class="field"><label>Serial number</label><input class="input" name="serial_no" value="${esc(v.serial_no)}" required /></div>
          <div class="field"><label>Family votes</label><input class="input" name="family_votes" type="number" min="1" max="99" value="${esc(v.family_votes)}" /></div>
        </div>
        <div class="field"><label>Door number</label><input class="input" name="door_no" value="${esc(v.door_no)}" maxlength="60" /></div>
        <div class="field"><label>Mobile</label><input class="input" name="mobile" value="${esc(v.mobile)}" inputmode="numeric" /></div>
        <div class="field"><label>Street</label><input class="input" name="street" value="${esc(v.street)}" /></div>
        <div class="field"><label class="check"><input type="checkbox" name="double_vote" value="1" ${v.double_vote ? 'checked' : ''} />Double vote</label>
          <input class="input" name="double_vote_note" value="${esc(v.double_vote_note)}" maxlength="200" placeholder="Where is the other vote?" /></div>
        <div class="field"><label>Notes</label><input class="input" name="notes" value="${esc(v.notes)}" /></div>
        <p class="help muted" style="font-size:12.5px;margin:0">If the serial number is in the voter list and the name is the same person, the official name is used.</p>
        <div id="edit-fam" class="hidden" style="margin-top:14px"></div>
      </form>`,
      foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="do-edit">Save changes</button>`,
    });
    let moveTo = ''; // mobile of another family the admin agreed to move this voter into
    $('#do-edit', m).addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const f = $('#edit-form', m);
      const body = Object.fromEntries(new FormData(f));
      body.join_family = !!moveTo && moveTo === String(body.mobile || '').replace(/\D/g, '').slice(-10);
      busy(btn, true, 'Saving…');
      try { await api('PUT', `/api/voters/${v.id}`, body); closeModal(); toast('Voter updated'); onDone(); }
      catch (er) {
        busy(btn, false);
        if (er.status === 409 && er.data.family_taken && er.data.family) {
          // The new mobile belongs to another family: ask before moving the voter there.
          const box = $('#edit-fam', m);
          box.className = 'fam-box taken';
          box.innerHTML = familyBox(er.data.family, 'This mobile number belongs to another family',
            `Saving will move <b>${esc(v.name)}</b> into family ${fid(er.data.family.id)}. To keep them in their own family, change the number back.`);
          moveTo = er.data.family.mobile;
          btn.innerHTML = `${icon('family')}Move to family ${fid(er.data.family.id)} & save`;
          box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else fail(er);
      }
    });
  }

  // ---------------------------------------------------------------- families
  function familyCard(f) {
    const addMember = `#/add?mobile=${encodeURIComponent(f.mobile)}&street=${encodeURIComponent(f.street)}&fv=${f.family_votes}`;
    const pending = f.members.filter((m) => !m.money_given).length;
    return `
      <div class="card fam-card" data-family-card data-fam-id="${f.id}">
        <div class="fam-head">
          <span class="fam-id">${fid(f.id)}</span>
          <div class="fam-title">
            <b data-nt>${esc(f.street)}</b>
            <div class="meta"><span>${icon('phone')}${esc(fmtMobile(f.mobile))}</span><span>${icon('vote')}${esc(f.family_votes)} family votes</span><span>${icon('users')}${f.member_count} verified</span></div>
          </div>
          <span class="badge money-sum"></span>
        </div>
        <div class="fam-created">${icon('user')}<span>Family created by <b>${esc(f.created_by_name || '—')}</b> · ${esc(timeAgo(f.created_at))}</span>
          ${f.updated_at ? `<span class="fam-edited">${icon('edit')}<span>Edited by</span> <b>${esc(f.updated_by_name || '—')}</b> · ${esc(timeAgo(f.updated_at))}</span>` : ''}</div>
        <div class="fam-members">
          ${f.members.map((m) => `
            <div class="fam-member">
              <div class="avatar">${esc(initials(m.name))}</div>
              <div class="body"><b data-nt>${esc(m.name)}</b>${m.double_vote ? ` <span class="badge badge-amber">${icon('alert')}Double vote</span>` : ''}
                ${m.name_te ? `<div class="te-name" lang="te" data-nt>${esc(m.name_te)}</div>` : ''}
                <div class="muted" style="font-size:12.5px"># <span data-nt>${esc(m.serial_no)}</span>${m.door_no ? ` · <span>Door</span> <span data-nt>${esc(m.door_no)}</span>` : ''} · <span>added by</span> ${esc(m.verified_by_name || '—')}</div></div>
              ${moneyControl({ ...m, mobile: f.mobile })}
            </div>`).join('')}
        </div>
        <div class="fam-foot">
          <button type="button" class="btn btn-sm btn-ghost" data-fam-edit="${f.id}">${icon('edit')}Edit family</button>
          <button type="button" class="btn btn-sm btn-ghost" data-fam-hist="${f.id}">${icon('clock')}History</button>
          <a class="btn btn-sm btn-ghost" href="${addMember}">${icon('plus')}Add member</a>
          <button type="button" class="btn btn-sm btn-success fam-money-btn ${pending ? '' : 'hidden'}" data-fam-money="${f.id}" data-mobile="${esc(f.mobile)}">${icon('rupee')}Give money</button>
        </div>
      </div>`;
  }

  // Edit a family's shared details. Mobile, street and family votes change for every member.
  function editFamilyModal(f, onDone) {
    const m = openModal({
      title: `Edit family ${fid(f.id)}`,
      sub: 'These details are shared by everyone in the family. Changes apply to all members.',
      wide: true,
      body: `<form id="fam-form" novalidate autocomplete="off">
        <div class="field"><label for="ff-mobile">Family mobile number</label>
          <div class="input-group"><span class="prefix">+91</span>
            <input class="input" id="ff-mobile" name="mobile" value="${esc(f.mobile)}" inputmode="numeric" maxlength="14" required /></div>
          <span class="help">One mobile number belongs to one family only. A number already used by another family can’t be chosen.</span></div>
        <div id="ff-taken" class="hidden"></div>
        <div class="row-2">
          <div class="field"><label for="ff-street">Street name</label>
            <input class="input" id="ff-street" name="street" list="ff-streets" value="${esc(f.street)}" maxlength="120" required />
            <datalist id="ff-streets"></datalist></div>
          <div class="field"><label for="ff-fv">Family votes</label>
            <div class="stepper"><button type="button" data-fstep="-1" aria-label="Decrease">−</button>
              <input id="ff-fv" name="family_votes" type="number" min="1" max="99" value="${esc(f.family_votes)}" inputmode="numeric" />
              <button type="button" data-fstep="1" aria-label="Increase">+</button></div></div>
        </div>
        <div class="section-cap" style="margin:6px 0 8px">${icon('users')}Members (${f.members.length})</div>
        <div class="fam-edit-members">
          ${f.members.map((x) => `<div class="fem"><span class="avatar">${esc(initials(x.name))}</span>
            <div class="body"><b data-nt>${esc(x.name)}</b><small># <span data-nt>${esc(x.serial_no)}</span>${x.money_given ? ` · <span>money given</span>` : ''}</small></div>
            ${isAdmin() ? `<button type="button" class="btn btn-sm btn-ghost" data-fem-edit="${x.id}">${icon('edit')}Edit voter</button>` : ''}</div>`).join('')}
        </div>
        <div id="ff-err" class="banner banner-red hidden" style="margin:14px 0 0"></div>
      </form>`,
      foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="ff-save">${icon('check')}Save family</button>`,
    });
    loadStreets().then((list) => { if ($('#ff-streets', m)) $('#ff-streets', m).innerHTML = list.map((s) => `<option value="${esc(s.street)}">`).join(''); });
    const form = $('#fam-form', m);
    const err = (msg) => { const e = $('#ff-err', m); e.innerHTML = msg ? `${icon('alert')}<span>${esc(msg)}</span>` : ''; e.classList.toggle('hidden', !msg); };
    const taken = $('#ff-taken', m);
    // Warn while typing if the new number already belongs to another family.
    const checkMobile = debounce(async () => {
      const mob = form.mobile.value.replace(/\D/g, '').slice(-10);
      if (mob.length !== 10 || mob === f.mobile) { taken.className = 'hidden'; return; }
      const { family } = await api('GET', `/api/families/lookup?mobile=${mob}`).catch(() => ({}));
      if (family && family.id !== f.id) {
        taken.className = 'fam-box taken';
        taken.innerHTML = familyBox(family, 'This number already belongs to another family', 'Choose a different number. One mobile number can only be used by one family.');
      } else taken.className = 'hidden';
    }, 300);
    form.mobile.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^\d+ ]/g, ''); err(''); checkMobile(); });
    form.addEventListener('click', (e) => {
      const st = e.target.closest('[data-fstep]');
      if (st) form.family_votes.value = Math.min(99, Math.max(1, (Number(form.family_votes.value) || 1) + Number(st.dataset.fstep)));
      const ed = e.target.closest('[data-fem-edit]');
      if (ed) {
        api('GET', `/api/voters?q=${encodeURIComponent(f.members.find((x) => x.id === Number(ed.dataset.femEdit)).serial_no)}&mobile=${f.mobile}`)
          .then((r) => { const v = r.voters.find((x) => x.id === Number(ed.dataset.femEdit)); if (v) editModal(v, onDone); })
          .catch(fail);
      }
    });
    $('#ff-save', m).addEventListener('click', async (e) => {
      const mobile = form.mobile.value.replace(/\D/g, '').slice(-10);
      if (!/^[6-9]\d{9}$/.test(mobile)) return err('Enter a valid 10-digit mobile number.');
      if (!form.street.value.trim()) return err('Please enter the street name.');
      busy(e.currentTarget, true, 'Saving…');
      try {
        await api('PATCH', `/api/families/${f.id}`, { mobile, street: form.street.value.trim(), family_votes: Number(form.family_votes.value) });
        closeModal();
        toast(`Family ${fid(f.id)} updated`);
        onDone();
      } catch (er) {
        busy(e.currentTarget, false);
        if (er.data && er.data.family_taken && er.data.family) {
          taken.className = 'fam-box taken';
          taken.innerHTML = familyBox(er.data.family, 'This number already belongs to another family', 'Choose a different number. One mobile number can only be used by one family.');
        }
        err(er.message);
      }
    });
  }

  // Family history: everything that happened to the family, newest first, with who did it.
  async function familyHistory(id) {
    const log = await api('GET', `/api/families/${id}/history`).catch(fail);
    if (!log) return;
    const who = (d) => `<b data-nt>${esc(d.name || '')}</b>${d.serial_no ? ` <span class="muted">#<span data-nt>${esc(d.serial_no)}</span></span>` : ''}`;
    const FIELD = { mobile: 'Mobile', street: 'Street', family_votes: 'Family votes' };
    const val = (k, x) => esc(k === 'mobile' ? fmtMobile(String(x)) : String(x ?? '—'));
    const ROW = {
      created: (d) => ({ ic: 'plus', cls: 'g', text: `<span>Family created</span>${d.name ? ` <span>with</span> ${who(d)}` : ''}` }),
      member_added: (d) => ({ ic: 'user', cls: 'g', text: `<span>Added</span> ${who(d)}${d.via === 'upload' ? ' <span class="muted">(<span>from an upload</span>)</span>' : d.via === 'review' ? ' <span class="muted">(<span>from the review queue</span>)</span>' : ''}` }),
      member_moved_in: (d) => ({ ic: 'arrow', cls: 'b', text: `${who(d)} <span>moved in</span>${d.from ? ` <span>from</span> ${esc(d.from)}` : ''}` }),
      member_moved_out: (d) => ({ ic: 'arrow', cls: 'y', text: `${who(d)} <span>moved out</span>${d.to ? ` <span>to</span> ${esc(d.to)}` : ''}` }),
      member_removed: (d) => ({ ic: 'trash', cls: 'r', text: `<span>Removed</span> ${who(d)}` }),
      edited: (d) => ({ ic: 'edit', cls: 'b', text: `<span>Family details edited</span><ul class="hist-changes">${Object.keys(d).map((k) => `
        <li><span>${FIELD[k] || esc(k)}</span>: <s data-nt>${val(k, d[k].from)}</s> → <b data-nt>${val(k, d[k].to)}</b></li>`).join('')}</ul>` }),
    };
    openModal({
      title: `Family ${fid(id)} history`,
      sub: 'Everything that changed in this family, and who did it.',
      body: log.length ? `<ol class="hist">${log.map((l) => {
        const r = (ROW[l.action] || ((d) => ({ ic: 'clock', cls: '', text: esc(l.action) })))(l.detail || {});
        return `<li><span class="hist-ico ${r.cls}">${icon(r.ic)}</span>
          <div class="hist-body"><div>${r.text}</div>
            <div class="hist-by"><span>by</span> <b>${esc(l.by_name || '—')}</b> · ${esc(fmtDateTime(l.at))}</div></div></li>`;
      }).join('')}</ol>` : '<p class="muted">No changes recorded yet.</p>',
      foot: '<button class="btn btn-primary" data-close>Close</button>',
    });
  }
  document.addEventListener('click', (e) => {
    const h = e.target.closest('[data-fam-hist]');
    if (h) familyHistory(Number(h.dataset.famHist));
  });

  // Compact description of a family (used for "this mobile already belongs to…").
  function familyBox(fam, title, text, actions = '') {
    return `<div class="fam-box-head">${icon('family')}<div><b>${title}</b>
        <div class="fam-box-id"><span class="fam-chip">${icon('family')}${fid(fam.id)}</span>
          <span>${icon('phone')}${esc(fmtMobile(fam.mobile))}</span>${fam.street ? `<span>${icon('pin')}<span data-nt>${esc(fam.street)}</span></span>` : ''}</div></div></div>
      <div class="fam-box-members">${fam.members.map((x) => `<span class="mchip"><span class="avatar">${esc(initials(x.name))}</span><span data-nt>${esc(x.name)}</span></span>`).join('')}</div>
      ${text ? `<p class="fam-box-text">${text}</p>` : ''}
      ${actions ? `<div class="fam-box-actions">${actions}</div>` : ''}`;
  }

  async function viewFamilies(el, params) {
    const q = { q: params.get('q') || '', money: '', street: '', mine: '', page: 1 };
    el.innerHTML = `
      <div class="page-head"><div><h1>Families</h1><p id="f-count">Loading…</p></div>
        <a class="btn btn-brand" href="#/add">${icon('plus')}Add voter</a></div>
      <div class="card" style="margin-bottom:20px">
        <div class="toolbar" style="border-bottom:0">
          <label class="search">${icon('search')}<input class="input" id="f-q" type="search" value="${esc(q.q)}"
            placeholder="Search family ID (F-0012), name, serial or mobile" /></label>
          <select class="select" id="f-money"><option value="">All families</option><option value="pending">Money pending</option><option value="done">Money done for all</option></select>
          <select class="select" id="f-street"><option value="">All streets</option></select>
          <select class="select" id="f-mine"><option value="">Created by anyone</option><option value="1">Created by me</option></select>
        </div>
      </div>
      <div id="f-list" class="fam-grid"><div class="card card-pad"><div class="skeleton" style="height:200px"></div></div></div>
      <div class="list-foot" id="f-foot" style="border:0;padding:16px 0"></div>`;

    loadStreets().then((list) => {
      if (!$('#f-street')) return; // page already left
      $('#f-street').innerHTML = '<option value="">All streets</option>' + list.map((s) => `<option value="${esc(s.street)}">${esc(s.street)}</option>`).join('');
    });

    async function load() {
      const usp = new URLSearchParams({ q: q.q, money: q.money, street: q.street, mine: q.mine, page: q.page });
      const r = await api('GET', `/api/families?${usp}`);
      $('#f-count').textContent = `${fmtNum(r.total)} famil${r.total === 1 ? 'y' : 'ies'}${q.q || q.money || q.street || q.mine ? ' match your search' : ''}`;
      $('#f-list').__data = r.families;
      $('#f-list').innerHTML = r.families.length ? r.families.map(familyCard).join('')
        : `<div class="card">${emptyState('family', 'No families found', q.q ? 'Try a family ID like F-0012, a name or a mobile number.' : 'Families appear when voters are added.')}</div>`;
      $$('[data-family-card]').forEach(updateFamilySummary);
      $('#f-foot').innerHTML = r.pages > 1 ? `<span>Page ${r.page} of ${r.pages}</span>
        <span style="display:flex;gap:8px"><button class="btn btn-sm btn-ghost" data-page="${r.page - 1}" ${r.page <= 1 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn-sm btn-ghost" data-page="${r.page + 1}" ${r.page >= r.pages ? 'disabled' : ''}>Next</button></span>` : '';
    }
    const reload = () => { q.page = 1; load().catch(fail); };
    $('#f-q').addEventListener('input', debounce((e) => { q.q = e.target.value.trim(); reload(); }, 300));
    $('#f-money').addEventListener('change', (e) => { q.money = e.target.value; reload(); });
    $('#f-street').addEventListener('change', (e) => { q.street = e.target.value; reload(); });
    $('#f-mine').addEventListener('change', (e) => { q.mine = e.target.value; reload(); });
    $('#f-list').addEventListener('click', (e) => {
      const ed = e.target.closest('[data-fam-edit]');
      if (!ed) return;
      const f = ($('#f-list').__data || []).find((x) => x.id === Number(ed.dataset.famEdit));
      if (f) editFamilyModal(f, () => load().catch(fail));
    });
    $('#f-foot').addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (b) { q.page = Number(b.dataset.page); load().catch(fail); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
    await load();
  }

  // ---------------------------------------------------------------- review queue
  async function viewReview(el) {
    el.innerHTML = `<div class="page-head"><div><h1>Review queue</h1><p>Uploaded entries that need a decision: they look like a saved voter, or their mobile number already belongs to a family.</p></div></div>
      <div id="r-list"><div class="card card-pad"><div class="skeleton" style="height:180px"></div></div></div>`;
    let items = [];
    async function load() {
      const r = await api('GET', '/api/review');
      items = r.items;
      state.pending = r.total;
      $$('[data-pending]').forEach((b) => { b.textContent = r.total; b.classList.toggle('hidden', !r.total); });
      $('#r-list').innerHTML = r.items.length
        ? `<p class="muted" style="margin:0 0 14px">${fmtNum(r.total)} waiting${r.total > r.items.length ? ` · showing the first ${r.items.length}` : ''}</p>` +
          r.items.map((it) => {
            const f = it.mobile_family;
            const tag = it.matches.length
              ? `<span class="badge badge-amber">${icon('users')}Looks like a saved voter</span>` : '';
            const famTag = f ? `<span class="badge badge-red">${icon('family')}Mobile belongs to ${fid(f.id)}</span>` : '';
            return `
            <div class="card review-card" style="margin-bottom:16px">
              <div class="card-head"><div><h3 data-nt>${esc(it.data.name)}</h3>
                <div class="review-tags">${tag}${famTag}</div></div>
                <span class="muted" style="font-size:13px">Uploaded by ${esc(it.uploaded_by_name || '—')} · ${esc(timeAgo(it.created_at))}</span></div>
              <div class="card-pad">
                <div class="review-meta"><span>${icon('hash')}<span data-nt>${esc(it.data.serial_no)}</span></span>
                  <span>${icon('phone')}${esc(fmtMobile(it.data.mobile))}</span><span>${icon('pin')}<span data-nt>${esc(it.data.street)}</span></span>
                  <span>${icon('vote')}${esc(it.data.family_votes)} family votes</span></div>
                ${f ? `<div class="fam-box taken" style="margin:14px 0 0">${familyBox(f, 'This mobile number already belongs to a family',
                  'Decide whether this voter belongs to that family. If not, give them a different number.')}</div>` : ''}
                ${it.matches.length ? `<div style="margin-top:14px">${compareCards(it.data, it.matches)}</div>`
                  : !f ? `<div class="banner banner-green" style="margin:14px 0 0">${icon('check')}No matches any more. Safe to add.</div>` : ''}
              </div>
              <div class="modal-foot">
                <button class="btn btn-ghost" data-act="discard" data-id="${it.id}">${icon('x')}${it.matches.length ? 'Duplicate, discard' : 'Discard'}</button>
                ${f ? `<button class="btn btn-ghost" data-act="newmobile" data-id="${it.id}">${icon('phone')}Use a different number</button>
                  <button class="btn btn-success" data-act="join" data-id="${it.id}">${icon('family')}${it.matches.length ? 'Different person, add to' : 'Add to'} family ${fid(f.id)}</button>`
                  : `<button class="btn btn-primary" data-act="accept" data-id="${it.id}">${icon('check')}Different person, add</button>`}
              </div>
            </div>`;
          }).join('')
        : `<div class="card">${emptyState('inbox', 'All clear', 'There are no entries waiting for review.')}</div>`;
    }

    async function decide(b, body, label, doneMsg) {
      busy(b, true, label);
      try {
        await api('POST', `/api/review/${b.dataset.id}/${b.dataset.act === 'discard' ? 'discard' : 'accept'}`, body);
        toast(doneMsg);
      } catch (er) { fail(er); }
      closeModal();
      load().catch(fail);
    }

    // A new mobile number for a voter who is NOT part of the family that owns the uploaded number.
    function askNewMobile(b) {
      const it = items.find((x) => String(x.id) === b.dataset.id);
      const m = openModal({
        title: 'Use a different number',
        sub: `<b data-nt>${esc(it.data.name)}</b> <span>will be added with this number instead of</span> ${esc(fmtMobile(it.data.mobile))}.`,
        body: `<div class="field" style="margin:0"><label for="rv-mobile">New family mobile number</label>
            <div class="input-group"><span class="prefix">+91</span><input class="input" id="rv-mobile" inputmode="numeric" maxlength="14" placeholder="98480 12345" /></div></div>
          <div id="rv-fam" class="hidden" style="margin-top:12px"></div>`,
        foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="rv-save" disabled>${icon('check')}Add with this number</button>`,
      });
      const inp = $('#rv-mobile', m);
      const box = $('#rv-fam', m);
      let famHere = null;
      const look = debounce(async () => {
        const mob = inp.value.replace(/\D/g, '').slice(-10);
        famHere = null;
        box.className = 'hidden';
        $('#rv-save', m).disabled = !/^[6-9]\d{9}$/.test(mob);
        if (mob.length !== 10) return;
        const { family } = await api('GET', `/api/families/lookup?mobile=${mob}`).catch(() => ({}));
        if (family) {
          famHere = family;
          box.className = 'fam-box taken';
          box.innerHTML = familyBox(family, 'This number also belongs to a family', `Saving will add the voter to family ${fid(family.id)}.`);
          $('#rv-save', m).innerHTML = `${icon('family')}Add to family ${fid(family.id)}`;
        } else $('#rv-save', m).innerHTML = `${icon('check')}Add with this number`;
      }, 300);
      inp.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/[^\d+ ]/g, ''); look(); });
      inp.focus();
      $('#rv-save', m).addEventListener('click', (ev) => {
        const btn = ev.currentTarget;
        btn.dataset.id = b.dataset.id; btn.dataset.act = 'accept';
        decide(btn, { mobile: inp.value, join_family: !!famHere }, 'Adding…', 'Added with the new number');
      });
    }

    $('#r-list').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      if (b.dataset.act === 'discard') return decide(b, null, 'Discarding…', 'Discarded');
      if (b.dataset.act === 'accept') return decide(b, null, 'Adding…', 'Added as a new voter');
      if (b.dataset.act === 'join') return decide(b, { join_family: true }, 'Adding…', 'Added to the family');
      if (b.dataset.act === 'newmobile') return askNewMobile(b);
    });
    await load();
  }

  // ---------------------------------------------------------------- team (admin)
  async function viewTeam(el) {
    const genPw = () => Array.from(crypto.getRandomValues(new Uint8Array(8)), (b) => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
    el.innerHTML = `
      <div class="page-head"><div><h1>Volunteers</h1><p>Approve sign-ups or create logins for your team. Every verification is recorded under the volunteer's name.</p></div></div>
      <div id="t-pending"></div>
      <div class="grid grid-form">
        <div class="card"><div class="card-head"><h3>Team</h3></div><div class="table-wrap" id="t-list"><div class="card-pad"><div class="skeleton" style="height:160px"></div></div></div></div>
        <form class="card card-pad" id="t-form" autocomplete="off">
          <h3 style="font-size:16px;margin-bottom:16px">Add volunteer</h3>
          <div class="field"><label>Full name</label><input class="input" name="full_name" required placeholder="e.g. Ravi Kumar" /></div>
          <div class="field"><label>Username</label><input class="input" name="username" required placeholder="e.g. ravi" autocapitalize="none" /></div>
          <div class="field"><label>Password</label><input class="input" name="password" required value="${genPw()}" />
            <span class="help">Share this with the volunteer. They can change it later.</span></div>
          <div class="field"><label>Role</label><select class="select input" name="role"><option value="volunteer">Volunteer</option><option value="admin">Admin</option></select></div>
          <button class="btn btn-primary btn-block" type="submit">${icon('plus')}Create login</button>
        </form>
      </div>`;
    async function load() {
      const all = await api('GET', '/api/users');
      const pending = all.filter((u) => !u.approved);
      const users = all.filter((u) => u.approved);
      $('#t-pending').innerHTML = pending.length ? `
        <div class="card" style="margin-bottom:20px">
          <div class="card-head"><h3>Waiting for approval</h3><span class="badge badge-amber">${pending.length}</span></div>
          ${pending.map((u) => `
            <div class="voter-row">
              <div class="avatar">${esc(initials(u.full_name))}</div>
              <div class="body"><div class="top"><span class="vname">${esc(u.full_name)}</span><span class="badge badge-amber">Pending</span></div>
                <div class="meta"><span>${icon('user')}@${esc(u.username)}</span>${u.mobile ? `<span>${icon('phone')}${esc(fmtMobile(u.mobile))}</span>` : ''}</div>
                <div class="by">Signed up ${esc(timeAgo(u.created_at))}</div></div>
              <div class="actions">
                <button class="btn btn-sm btn-ghost" data-reject="${u.id}" data-name="${esc(u.full_name)}">${icon('x')}Reject</button>
                <button class="btn btn-sm btn-success" data-approve="${u.id}">${icon('check')}Approve</button>
              </div>
            </div>`).join('')}
        </div>` : '';
      $('#t-list').innerHTML = `<table class="table"><thead><tr><th>Name</th><th>Verified</th><th>Status</th><th></th></tr></thead><tbody>
        ${users.map((u) => `<tr>
          <td><div style="display:flex;gap:10px;align-items:center"><div class="avatar">${esc(initials(u.full_name))}</div>
            <div><b>${esc(u.full_name)}</b><div class="muted" style="font-size:12.5px">@${esc(u.username)} · ${esc(u.role)}</div></div></div></td>
          <td class="mono"><b>${fmtNum(u.verified)}</b></td>
          <td>${u.active ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-gray">Disabled</span>'}</td>
          <td style="text-align:right;white-space:nowrap">
            <button class="btn btn-sm btn-ghost" data-pw="${u.id}" data-name="${esc(u.full_name)}">${icon('lock')}Reset</button>
            ${u.id !== state.user.id ? `<button class="btn btn-sm ${u.active ? 'btn-danger' : 'btn-ghost'}" data-toggle="${u.id}" data-active="${u.active}">${u.active ? 'Disable' : 'Enable'}</button>` : ''}
          </td></tr>`).join('')}</tbody></table>`;
    }
    $('#t-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target;
      const body = Object.fromEntries(new FormData(f));
      const btn = $('button[type=submit]', f);
      busy(btn, true, 'Creating…');
      try {
        await api('POST', '/api/users', body);
        openModal({
          title: 'Login created',
          sub: 'Send these details to the volunteer.',
          body: `<div class="compare-card new"><dl class="kv" style="grid-template-columns:auto auto">
            <div><dt>Website</dt><dd>${esc(location.origin)}</dd></div><div><dt>Name</dt><dd>${esc(body.full_name)}</dd></div>
            <div><dt>Username</dt><dd>${esc(body.username.toLowerCase())}</dd></div><div><dt>Password</dt><dd class="mono">${esc(body.password)}</dd></div></dl></div>`,
          foot: '<button class="btn btn-primary" data-close>Done</button>',
        });
        f.reset();
        f.password.value = genPw();
        load().catch(fail);
      } catch (er) { fail(er); }
      busy(btn, false);
    });
    $('#t-pending').addEventListener('click', async (e) => {
      const ap = e.target.closest('[data-approve]');
      const rj = e.target.closest('[data-reject]');
      if (ap) {
        busy(ap, true, 'Approving…');
        try { await api('PATCH', `/api/users/${ap.dataset.approve}`, { approved: true }); toast('Volunteer approved. They can sign in now.'); }
        catch (er) { fail(er); }
        load().catch(fail);
      }
      if (rj) {
        const m = openModal({
          title: 'Reject this sign-up?',
          sub: `<b>${esc(rj.dataset.name)}</b><br><span>They will not be able to sign in.</span>`,
          foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="do-rej">${icon('x')}Reject</button>`,
        });
        $('#do-rej', m).addEventListener('click', async (ev) => {
          busy(ev.currentTarget, true, 'Rejecting…');
          try { await api('DELETE', `/api/users/${rj.dataset.reject}`); closeModal(); toast('Sign-up rejected'); load().catch(fail); }
          catch (er) { fail(er); busy(ev.currentTarget, false); }
        });
      }
    });
    $('#t-list').addEventListener('click', async (e) => {
      const tg = e.target.closest('[data-toggle]');
      const pw = e.target.closest('[data-pw]');
      if (tg) {
        try { await api('PATCH', `/api/users/${tg.dataset.toggle}`, { active: tg.dataset.active !== 'true' }); load().catch(fail); } catch (er) { fail(er); }
      }
      if (pw) {
        const np = genPw();
        const m = openModal({
          title: `Reset password`,
          sub: `New password for ${esc(pw.dataset.name)}. They will be signed out everywhere.`,
          body: `<div class="field"><label>New password</label><input class="input mono" id="np" value="${np}" /></div>`,
          foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="do-pw">Set password</button>`,
        });
        $('#do-pw', m).addEventListener('click', async (ev) => {
          busy(ev.currentTarget, true);
          try { await api('PATCH', `/api/users/${pw.dataset.pw}`, { password: $('#np', m).value }); closeModal(); toast('Password updated'); }
          catch (er) { fail(er); busy(ev.currentTarget, false); }
        });
      }
    });
    await load();
  }

  // ---------------------------------------------------------------- voter list (search the official roll)
  async function viewRoll(el, params) {
    el.innerHTML = `
      <div class="page-head"><div><h1>Voter list</h1><p>Search everyone in the ward’s voter list by name (English or Telugu), serial number, door number or voter ID.</p></div></div>
      <div class="card">
        <div class="toolbar">
          <label class="search">${icon('search')}<input class="input" id="r-q" type="search" placeholder="Name, serial no, door no or voter ID" value="${esc(params.get('q') || '')}" /></label>
          <select class="select" id="r-field" aria-label="Search in">
            <option value="auto">Search in: everything</option><option value="name">Name or voter ID</option>
            <option value="serial">Serial number</option><option value="door">Door number</option></select>
        </div>
        <div id="r-list" class="roll-list"></div>
      </div>`;
    const list = $('#r-list');
    hoverSameNames(list);
    const { total } = await api('GET', '/api/reference/stats');
    // Digits only = serial number; digits with "-" or "/" = door number; anything else = name.
    const guess = (q) => (/^\d+$/.test(q) ? 'serial' : /\d/.test(q) && /[-/]/.test(q) ? 'door' : 'name');
    let seq = 0;
    async function load() {
      const q = $('#r-q').value.trim();
      const field = $('#r-field').value === 'auto' ? guess(q) : $('#r-field').value;
      if (!total) {
        list.innerHTML = emptyState('list', 'The voter list isn’t uploaded yet', isAdmin() ? 'Upload it from Upload list → Reference list.' : 'Ask your admin to upload it.',
          isAdmin() ? `<a class="btn btn-brand" href="#/upload?type=reference" style="margin-top:12px">${icon('upload')}Upload voter list</a>` : '');
        return;
      }
      if (!q) {
        list.innerHTML = emptyState('search', 'Search the voter list', `${fmtNum(total)} voters. Type a name, serial number, door number (e.g. 11-250) or voter ID.`);
        return;
      }
      const my = ++seq;
      const items = groupSameNames(await api('GET', `/api/reference/search?field=${field}&q=${encodeURIComponent(q)}&limit=50`));
      if (my !== seq) return;
      list.innerHTML = items.length
        ? rollItems(items, 'r', { button: `<a class="btn btn-sm btn-brand" href="#/add?serial=__SERIAL__">${icon('plus')}Add</a>` })
        : emptyState('search', 'No one found', 'Try another spelling, or search by serial or door number.');
    }
    $('#r-q').addEventListener('input', debounce(() => load().catch(fail), 250));
    $('#r-field').addEventListener('change', () => load().catch(fail));
    await load();
    $('#r-q').focus();
  }

  // ---------------------------------------------------------------- check names (admin)
  async function viewChecks(el) {
    el.innerHTML = `
      <div class="page-head"><div><h1>Check names</h1><p>Saved voters whose name doesn’t match the voter list at their serial number. Pick the right person, or keep the name as typed.</p></div>
        <button class="btn btn-ghost" id="resync">${icon('undo')}Re-check all names</button></div>
      <div id="c-list"><div class="card card-pad"><div class="skeleton" style="height:160px"></div></div></div>`;
    async function load() {
      const items = await api('GET', '/api/reference/checks');
      $('#c-list').innerHTML = items.length ? items.map((v) => `
        <div class="card check-card">
          <div class="card-head"><h3><span class="muted" style="font-weight:600">Saved as</span> <span data-nt>${esc(v.name)}</span></h3>
            <span class="badge badge-gray">${icon('hash')}Serial <span data-nt>${esc(v.serial_no)}</span></span></div>
          <div class="card-pad">
            <p class="muted" style="margin:0 0 14px;font-size:13.5px">Verified by ${esc(v.verified_by_name || '—')} · ${esc(fmtMobile(v.mobile))} · ${esc(v.street)}</p>
            <div class="section-cap">${icon('list')}Voter list at serial <span data-nt>${esc(v.serial_no)}</span></div>
            ${v.at_serial.length ? v.at_serial.map((r) => `<div class="check-opt">${refSummary(r)}
                <button class="btn btn-sm btn-primary" data-use="${r.id}" data-v="${v.id}">${icon('check')}Use this name</button></div>`).join('')
              : '<p class="muted">Nobody is listed at this serial number.</p>'}
            ${v.suggestions.length ? `<div class="section-cap" style="margin-top:16px">${icon('search')}Closest names elsewhere in the list</div>
              ${v.suggestions.map((r) => `<div class="check-opt">${refSummary(r)}
                ${r.verified ? `<span class="badge badge-red">Already verified</span>`
                  : `<button class="btn btn-sm btn-ghost" data-use="${r.id}" data-v="${v.id}">${icon('arrow')}Move to serial <span data-nt>${esc(r.serial_no)}</span></button>`}</div>`).join('')}` : ''}
            <button class="btn btn-ghost btn-block" data-keep="${v.id}" style="margin-top:14px">Keep “<span data-nt>${esc(v.name)}</span>” as typed</button>
          </div>
        </div>`).join('')
        : `<div class="card">${emptyState('check', 'All names match', 'Every saved voter matches the voter list at their serial number.')}</div>`;
    }
    $('#c-list').addEventListener('click', async (e) => {
      const use = e.target.closest('[data-use]');
      const keep = e.target.closest('[data-keep]');
      const btn = use || keep;
      if (!btn) return;
      busy(btn, true, 'Saving…');
      try {
        await api('POST', `/api/voters/${use ? use.dataset.v : keep.dataset.keep}/roll-fix`, use ? { ref_id: Number(use.dataset.use) } : { action: 'keep' });
        toast(use ? 'Name updated from the voter list' : 'Name kept as typed');
        await load();
      } catch (er) { fail(er); busy(btn, false); }
    });
    $('#resync').addEventListener('click', async (e) => {
      busy(e.currentTarget, true, 'Checking…');
      try {
        const r = await api('POST', '/api/reference/sync-names');
        toast(`${r.updated.length} name${r.updated.length === 1 ? '' : 's'} updated from the voter list`);
        await load();
      } catch (er) { fail(er); }
      busy(e.currentTarget, false);
    });
    await load();
  }

  // ---------------------------------------------------------------- upload (admin)
  function loadSheetJS() {
    if (window.XLSX) return Promise.resolve();
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
      s.onload = res;
      s.onerror = () => rej(new Error('Could not load the Excel reader. Check your internet connection.'));
      document.head.appendChild(s);
    });
  }

  async function viewUpload(el, params) {
    const isRef = params.get('type') === 'reference';
    const F_NAME = ['name', 'Voter name', /name|పేరు/i];
    const F_SERIAL = ['serial_no', 'Serial number', /serial|sl\.?\s*no|s\.?\s*no|sno|క్రమ/i];
    const F_DOOR = ['door_no', 'Door number', /door|house|h\.?\s*no|d\.?\s*no|ఇంటి/i];
    const REF_EXTRA = [
      ['name_te', 'Name in Telugu', /telugu|తెలుగు/i],
      ['relation_type', 'Relation (father / husband / mother)', /^relation( type)?$|relation ?type|సంబంధ/i],
      ['relation_en', 'Father / husband name', /relative|relation name|father|husband|guardian|తండ్రి|భర్త/i],
      ['relation_te', 'Father / husband name in Telugu', /(relative|relation|father|husband).*(telugu|తెలుగు)/i],
      ['age', 'Age', /^age\b|వయస్సు/i],
      ['gender', 'Gender', /gender|sex|లింగ/i],
      ['epic', 'Voter ID', /voter ?id|epic|card/i],
      ['part_no', 'Part number', /part|విభాగ/i],
      ['listed_twice', 'Listed twice', /twice|duplicate/i],
    ];
    const FIELDS = isRef ? [F_NAME, REF_EXTRA[0], F_SERIAL, F_DOOR, ...REF_EXTRA.slice(1)] : [
      F_NAME, F_SERIAL, F_DOOR,
      ['mobile', 'Mobile', /mobile|phone|cell|contact|ఫోన్|మొబైల్/i],
      ['street', 'Street', /street|road|colony|area|address|వీధి/i],
      ['family_votes', 'Family votes', /family|votes|members|count|ఓట్లు/i],
    ];
    const OPTIONAL = { family_votes: 'Not in file (use 1)', door_no: 'Not in file' };
    REF_EXTRA.forEach(([k]) => { OPTIONAL[k] = 'Not in file'; });
    // Most specific headings are matched first, so "Relative Name (Telugu)" isn't taken as the voter's name.
    const GUESS_ORDER = ['relation_te', 'relation_type', 'relation_en', 'name_te', 'name', 'serial_no', 'door_no', 'epic', 'part_no',
      'age', 'gender', 'listed_twice', 'mobile', 'street', 'family_votes'];
    const refCount = isRef ? await api('GET', '/api/reference/stats').then((r) => r.total).catch(() => 0) : 0;
    el.innerHTML = `
      <div class="page-head"><div>
        <h1>${isRef ? 'Upload reference voter list' : 'Upload voter list'}</h1>
        <p>${isRef
          ? 'The ward’s full voter list (Excel or CSV). It powers the name suggestions on Add voter, the Voter list page and the name checks. Nobody is marked verified by uploading it.'
          : 'Upload an Excel or CSV file. Exact duplicates are skipped. Look-alikes go to the review queue.'}</p></div></div>
      <div class="seg-tabs" role="tablist">
        <a role="tab" href="#/upload?type=reference" class="${isRef ? 'on' : ''}" aria-selected="${isRef}">${icon('list')}Reference list</a>
        <a role="tab" href="#/upload" class="${isRef ? '' : 'on'}" aria-selected="${!isRef}">${icon('shield')}Verified voters</a>
      </div>
      ${isRef ? `<div class="banner banner-green" id="ref-count">${icon('list')}<span>${refCount
        ? `${fmtNum(refCount)} voters are in the reference list now.`
        : 'No reference list uploaded yet.'}</span>${refCount ? `<button class="btn btn-sm btn-ghost" id="ref-clear">${icon('trash')}Clear list</button>` : ''}</div>` : ''}
      <label class="drop" id="drop"><input type="file" id="file" accept=".xlsx,.xls,.csv" hidden />
        <div class="ico">${icon('upload')}</div><h3 style="font-size:17px">Drop your file here or tap to choose</h3>
        <p class="muted" style="margin:4px 0 0">Excel (.xlsx, .xls) or CSV · first row must be column headings</p></label>
      <div id="u-step"></div>`;

    const clearBtn = $('#ref-clear');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      const m = openModal({
        title: 'Clear the reference list?',
        sub: `All ${fmtNum(refCount)} reference voters will be removed. Verified voters are not affected.`,
        foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="do-clear">${icon('trash')}Clear list</button>`,
      });
      $('#do-clear', m).addEventListener('click', async (ev) => {
        busy(ev.currentTarget, true);
        try { await api('DELETE', '/api/reference'); closeModal(); toast('Reference list cleared'); router(); }
        catch (er) { fail(er); busy(ev.currentTarget, false); }
      });
    });

    async function uploadReference(btn, all) {
      const total = { added: 0, updated: 0, invalid: [] };
      const BATCH = 1000;
      let ok = true;
      try {
        if ($('#u-replace') && $('#u-replace').checked) {
          busy(btn, true, 'Clearing the old list…');
          await api('DELETE', '/api/reference');
        }
        for (let i = 0; i < all.length; i += BATCH) {
          busy(btn, true, `Uploading… ${Math.min(i + BATCH, all.length)} / ${all.length}`);
          const r = await api('POST', '/api/reference/import', { rows: all.slice(i, i + BATCH) });
          total.added += r.added; total.updated += r.updated; total.invalid.push(...r.invalid);
        }
      } catch (er) { ok = false; fail(er); }
      // Line up the voters already saved with the (new) list.
      let sync = null;
      if (ok) {
        busy(btn, true, 'Matching saved voters to the list…');
        sync = await api('POST', '/api/reference/sync-names').catch((er) => { fail(er); return null; });
      }
      busy(btn, false);
      btn.disabled = true;
      const { total: now } = await api('GET', '/api/reference/stats').catch(() => ({ total: 0 }));
      const syncHtml = sync ? `
          <h3 style="font-size:14px;margin:20px 0 8px">Saved voters matched to the list</h3>
          <p class="muted" style="margin:0 0 10px">${fmtNum(sync.updated.length)} name${sync.updated.length === 1 ? '' : 's'} changed to the official spelling.
            ${sync.mismatched ? `${fmtNum(sync.mismatched)} need${sync.mismatched === 1 ? 's' : ''} a check.` : ''}</p>
          ${sync.updated.length ? `<div class="table-wrap card"><table class="table"><thead><tr><th>Serial</th><th>Was</th><th>Now</th></tr></thead><tbody>
            ${sync.updated.map((u) => `<tr><td class="mono" data-nt>${esc(u.serial_no)}</td><td data-nt>${esc(u.from)}</td>
              <td data-nt><b>${esc(u.to)}</b><div class="te" lang="te">${esc(u.name_te)}</div></td></tr>`).join('')}</tbody></table></div>` : ''}
          ${sync.mismatched ? `<a class="btn btn-primary" href="#/checks" style="margin-top:12px">${icon('alert')}Check ${fmtNum(sync.mismatched)} name${sync.mismatched === 1 ? '' : 's'}</a>` : ''}` : '';
      $('#u-result').innerHTML = `
        <div class="card card-pad" style="margin-top:20px">
          <h3 style="font-size:16px;margin-bottom:14px">${ok ? 'Upload complete' : 'Upload stopped part-way'}</h3>
          <div class="result-grid">
            <div class="stat"><div class="label"><span class="ico g">${icon('check')}</span>Added</div><div class="value mono">${fmtNum(total.added)}</div></div>
            <div class="stat"><div class="label"><span class="ico b">${icon('edit')}</span>Updated</div><div class="value mono">${fmtNum(total.updated)}</div><div class="hint">already in the list</div></div>
            <div class="stat"><div class="label"><span class="ico y">${icon('list')}</span>In the list now</div><div class="value mono">${fmtNum(now)}</div></div>
            <div class="stat"><div class="label"><span class="ico" style="background:var(--red-soft);color:var(--red)">${icon('alert')}</span>Invalid rows</div><div class="value mono">${fmtNum(total.invalid.length)}</div></div>
          </div>
          <a class="btn btn-brand" href="#/add" style="margin-top:16px">${icon('plus')}Go to Add voter</a>
          ${syncHtml}
          ${total.invalid.length ? `<h3 style="font-size:14px;margin:20px 0 8px">Rows that need fixing in your file</h3>
            <div class="table-wrap card"><table class="table"><thead><tr><th>Row</th><th>Problem</th></tr></thead><tbody>
            ${total.invalid.slice(0, 100).map((x) => `<tr><td class="mono">${esc(x.row)}</td><td>${esc(x.error)}</td></tr>`).join('')}</tbody></table></div>` : ''}
        </div>`;
    }

    let rows = [];
    let headers = [];
    const drop = $('#drop');
    ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('over')));
    drop.addEventListener('drop', (e) => { e.preventDefault(); if (e.dataTransfer.files[0]) handle(e.dataTransfer.files[0]); });
    $('#file').addEventListener('change', (e) => { if (e.target.files[0]) handle(e.target.files[0]); });

    async function handle(file) {
      const step = $('#u-step');
      step.innerHTML = `<div class="card card-pad" style="margin-top:20px"><div class="skeleton" style="height:120px"></div></div>`;
      try {
        await loadSheetJS();
        const wb = window.XLSX.read(await file.arrayBuffer(), { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const aoa = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
        const nonEmpty = aoa.filter((r) => r.some((c) => String(c).trim()));
        if (nonEmpty.length < 2) throw new Error('The file has no data rows.');
        headers = nonEmpty[0].map((h) => String(h).trim());
        rows = nonEmpty.slice(1);
      } catch (e) { step.innerHTML = ''; return fail(e); }

      const guess = {};
      GUESS_ORDER.map((k) => FIELDS.find((f) => f[0] === k)).filter(Boolean).forEach(([k, , re]) => {
        guess[k] = headers.findIndex((h, idx) => re.test(h) && !Object.values(guess).includes(idx));
      });

      step.innerHTML = `
        <div class="card" style="margin-top:20px">
          <div class="card-head"><h3>${icon('file')} ${esc(file.name)}</h3><span class="badge badge-gray">${fmtNum(rows.length)} rows</span></div>
          <div class="card-pad">
            <p class="muted" style="margin:0 0 14px">Match each field to a column in your file.</p>
            <div class="map-grid">${FIELDS.map(([k, label]) => `
              <div class="field"><label>${label}</label><select class="select input" data-map="${k}">
                <option value="-1">${OPTIONAL[k] || '— choose column —'}</option>
                ${headers.map((h, i) => `<option value="${i}" ${guess[k] === i ? 'selected' : ''}>${esc(h || `Column ${i + 1}`)}</option>`).join('')}
              </select></div>`).join('')}</div>
            <h3 style="font-size:14px;margin:6px 0 10px">Preview</h3>
            <div class="table-wrap card" id="u-preview"></div>
            <div id="u-err" class="banner banner-red hidden" style="margin-top:16px"></div>
            ${isRef && refCount ? `<label class="check" style="margin-top:16px"><input type="checkbox" id="u-replace" />Replace the current reference list (delete the ${fmtNum(refCount)} voters already in it first)</label>` : ''}
            <button class="btn btn-brand" id="u-go" style="margin-top:18px">${icon('upload')}Upload ${fmtNum(rows.length)} voters</button>
          </div>
        </div>
        <div id="u-result"></div>`;

      const mapping = () => Object.fromEntries($$('[data-map]').map((s) => [s.dataset.map, Number(s.value)]));
      const mapRow = (r, mp, idx) => {
        const out = { __row: idx + 2 };
        FIELDS.forEach(([k]) => { out[k] = mp[k] >= 0 ? r[mp[k]] : k === 'family_votes' ? 1 : ''; });
        return out;
      };
      const preview = () => {
        const mp = mapping();
        $('#u-preview').innerHTML = `<table class="table"><thead><tr>${FIELDS.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead><tbody>
          ${rows.slice(0, 5).map((r, i) => { const m = mapRow(r, mp, i); return `<tr>${FIELDS.map(([k]) => `<td>${esc(m[k])}</td>`).join('')}</tr>`; }).join('')}</tbody></table>`;
      };
      preview();
      $$('[data-map]').forEach((s) => s.addEventListener('change', preview));

      $('#u-go').addEventListener('click', async (e) => {
        const mp = mapping();
        const missing = FIELDS.filter(([k]) => !OPTIONAL[k] && mp[k] < 0).map(([, l]) => l);
        const err = $('#u-err');
        if (missing.length) { err.innerHTML = `${icon('alert')}Choose a column for: ${esc(missing.join(', '))}`; err.classList.remove('hidden'); return; }
        err.classList.add('hidden');
        const btn = e.currentTarget;
        const all = rows.map((r, i) => mapRow(r, mp, i));
        if (isRef) return uploadReference(btn, all);
        const total = { added: 0, already_verified: 0, queued: 0, family_queued: 0, invalid: [] };
        const BATCH = 250;
        // Same id for every batch of this file: its rows may form new families together.
        const uploadId = `up-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
        try {
          for (let i = 0; i < all.length; i += BATCH) {
            busy(btn, true, `Uploading… ${Math.min(i + BATCH, all.length)} / ${all.length}`);
            const r = await api('POST', '/api/import', { rows: all.slice(i, i + BATCH), upload_id: uploadId });
            total.added += r.added; total.already_verified += r.already_verified; total.queued += r.queued;
            total.family_queued += r.family_queued || 0; total.invalid.push(...r.invalid);
          }
        } catch (er) { fail(er); }
        busy(btn, false);
        btn.disabled = true;
        $('#u-result').innerHTML = `
          <div class="card card-pad" style="margin-top:20px">
            <h3 style="font-size:16px;margin-bottom:14px">Upload complete</h3>
            <div class="result-grid">
              <div class="stat"><div class="label"><span class="ico g">${icon('check')}</span>Added</div><div class="value mono">${fmtNum(total.added)}</div></div>
              <div class="stat"><div class="label"><span class="ico b">${icon('shield')}</span>Already verified</div><div class="value mono">${fmtNum(total.already_verified)}</div><div class="hint">skipped</div></div>
              <div class="stat"><div class="label"><span class="ico y">${icon('inbox')}</span>Needs review</div><div class="value mono">${fmtNum(total.queued)}</div>
                ${total.family_queued ? `<div class="hint">${fmtNum(total.family_queued)} with a mobile number that already belongs to a family</div>` : ''}</div>
              <div class="stat"><div class="label"><span class="ico" style="background:var(--red-soft);color:var(--red)">${icon('alert')}</span>Invalid rows</div><div class="value mono">${fmtNum(total.invalid.length)}</div></div>
            </div>
            ${total.queued ? `<a class="btn btn-primary" href="#/review" style="margin-top:16px">${icon('inbox')}Open review queue</a>` : ''}
            ${total.invalid.length ? `<h3 style="font-size:14px;margin:20px 0 8px">Rows that need fixing in your file</h3>
              <div class="table-wrap card"><table class="table"><thead><tr><th>Row</th><th>Problem</th></tr></thead><tbody>
              ${total.invalid.slice(0, 100).map((x) => `<tr><td class="mono">${esc(x.row)}</td><td>${esc(x.error)}</td></tr>`).join('')}</tbody></table></div>` : ''}
          </div>`;
        refreshPending();
      });
    }
  }

  // ---------------------------------------------------------------- account
  async function viewAccount(el) {
    const u = state.user;
    el.innerHTML = `
      <div class="page-head"><div><h1>Account</h1><p>Manage your login.</p></div></div>
      <div class="grid grid-form">
        <div class="grid" style="gap:20px">
          <div class="card card-pad" style="display:flex;gap:16px;align-items:center">
            <div class="avatar" style="width:56px;height:56px;font-size:20px">${esc(initials(u.full_name))}</div>
            <div><h2 style="font-size:20px">${esc(u.full_name)}</h2><div class="muted">@${esc(u.username)} · <span style="text-transform:capitalize">${esc(u.role)}</span></div></div>
          </div>
          ${isStandalone() ? '' : `<div class="card card-pad install-card">
            <div style="display:flex;gap:14px;align-items:center">
              <div class="logo-mark">34</div>
              <div style="flex:1"><b>Install the 34 Division app</b>
                <div class="muted" style="font-size:13px">Opens full-screen from your home screen, like a normal app.</div></div>
            </div>
            <button class="btn btn-brand btn-block hidden" data-install style="margin-top:14px">${icon('download')}Install app</button>
            <p class="muted" style="font-size:12.5px;margin:12px 0 0"><b>Android (Chrome):</b> <span>Tap the ⋮ menu, then “Add to Home screen” or “Install app”.</span><br/>
              <b>iPhone (Safari):</b> <span>Tap the Share button, then “Add to Home Screen”.</span></p>
          </div>`}
          <div class="card card-pad" style="display:flex;align-items:center;gap:14px;justify-content:space-between;flex-wrap:wrap">
            <div><b>Language</b> <span class="muted" data-nt>· భాష</span><div class="muted" style="font-size:13px">Choose the language for this phone.</div></div>
            ${langSwitch()}
          </div>
          <div class="card"><div class="card-head"><h3>Menu</h3></div>
            <div class="nav" style="padding:8px">
              <a href="#/stats">${icon('chart')}<span>Statistics</span></a>
              <a href="#/roll">${icon('search')}<span>Voter list (search by name, serial, door)</span></a>
              <a href="#/families">${icon('family')}<span>Families &amp; money</span></a>
              <a href="#/voters">${icon('list')}<span>All voters</span></a>
              <a href="#/multi">${icon('copy')}<span>More than one vote</span></a>
              <a href="#/voters?double=1">${icon('alert')}<span>Double votes</span></a>
              <a href="#/review">${icon('inbox')}<span>Review queue</span><span class="badge badge-red ${state.pending ? '' : 'hidden'}" data-pending>${state.pending}</span></a>
            </div></div>
          ${isAdmin() ? `<div class="card"><div class="card-head"><h3>Admin tools</h3></div>
            <div class="nav" style="padding:8px">
              <a href="#/checks">${icon('alert')}<span>Check names</span></a>
              <a href="#/upload">${icon('upload')}<span>Upload voter list</span></a>
              <a href="#/team">${icon('users')}<span>Volunteers</span></a>
              <a href="/api/export.csv">${icon('download')}<span>Export all voters (CSV)</span></a>
            </div></div>` : ''}
          <button class="btn btn-ghost btn-block" id="logout">${icon('logout')}Sign out</button>
        </div>
        <form class="card card-pad" id="pw-form">
          <h3 style="font-size:16px;margin-bottom:16px">Change password</h3>
          <div class="field"><label>Current password</label><input class="input" type="password" name="current" autocomplete="current-password" required /></div>
          <div class="field"><label>New password</label><input class="input" type="password" name="next" autocomplete="new-password" minlength="6" required /></div>
          <button class="btn btn-primary btn-block" type="submit">Update password</button>
        </form>
      </div>`;
    $('#logout').addEventListener('click', async () => {
      try { await api('POST', '/api/logout'); } catch { /* ignore */ }
      state.user = null;
      location.hash = '';
      renderLogin();
    });
    $('#pw-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('button[type=submit]', e.target);
      busy(btn, true, 'Updating…');
      try { await api('POST', '/api/me/password', Object.fromEntries(new FormData(e.target))); toast('Password updated'); e.target.reset(); }
      catch (er) { fail(er); }
      busy(btn, false);
    });
  }

  // ---------------------------------------------------------------- install as app (PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
  }
  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    installPrompt = e;
    $$('[data-install]').forEach((b) => b.classList.remove('hidden'));
  });
  document.addEventListener('click', async (e) => {
    if (!e.target.closest('[data-install]')) return;
    if (installPrompt) { installPrompt.prompt(); installPrompt = null; $$('[data-install]').forEach((b) => b.classList.add('hidden')); }
  });
  const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;

  // ---------------------------------------------------------------- boot
  (async () => {
    try {
      const { user } = await api('GET', '/api/me');
      state.user = user;
      await router();
      refreshPending();
    } catch (e) {
      // Not signed in: first run shows the admin setup screen, otherwise sign-in.
      let mode = 'login';
      try { if ((await api('GET', '/api/setup-status')).needs_setup) mode = 'setup'; } catch { /* fall back to login */ }
      renderLogin(mode);
    }
  })();
})();
