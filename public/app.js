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

  function timeAgo(iso) {
    const d = new Date(iso);
    const s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  }

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
    if (!btn) return;
    if (on) { btn.dataset.label = btn.innerHTML; btn.innerHTML = `<span class="spin"></span>${esc(label || 'Please wait…')}`; btn.disabled = true; }
    else { btn.innerHTML = btn.dataset.label || btn.innerHTML; btn.disabled = false; }
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
    add: { title: 'Add voter', render: viewAdd },
    voters: { title: 'Voters', render: viewVoters },
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
    document.title = `${mode === 'login' ? 'Sign in' : mode === 'setup' ? 'Set up' : 'Create account'} · 34 Division`;
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
        <section class="login-panel">${authCard(mode)}</section>
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
        <p class="muted">This is the first sign-in for 34 Division. The account you create now will be the <b>admin</b>. You can add volunteers after this.</p>
        ${userFields}
        <div id="auth-err" class="banner banner-red hidden"></div>
        <button class="btn btn-brand btn-block" type="submit">${icon('shield')}Create admin account</button>
      </form>`;
    }
    if (mode === 'signup') {
      return `<form class="login-card" id="auth-form" autocomplete="on">
        <h2>Create your account</h2>
        <p class="muted">Volunteers can sign up here. Your admin must approve your account before you can sign in.</p>
        ${userFields}
        <div id="auth-err" class="banner banner-red hidden"></div>
        <button class="btn btn-primary btn-block" type="submit">Create account ${icon('arrow')}</button>
        <p class="muted" style="text-align:center;margin:18px 0 0">Already have an account? <button type="button" class="linkish" data-mode="login" style="font-weight:700;color:var(--ink)">Sign in</button></p>
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
      <p class="muted" style="text-align:center;margin:18px 0 0">New volunteer? <button type="button" class="linkish" data-mode="signup" style="font-weight:700;color:var(--ink)">Create an account</button></p>
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
      if (b) { $('.login-panel').innerHTML = authCard(b.dataset.mode); wireAuthCard(b.dataset.mode); }
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
        } else {
          await api('POST', '/api/signup', body);
          $('.login-panel').innerHTML = `
            <div class="login-card"><div class="success-card" style="padding:0">
              <div class="ico">${icon('check')}</div>
              <h2 style="font-size:22px">Account created</h2>
              <p class="muted" style="margin:8px 0 22px">Your username is <b>${esc(body.username.toLowerCase())}</b>. Ask your admin to approve your account. Then you can sign in.</p>
              <button class="btn btn-primary btn-block" data-mode="login">Go to sign in</button></div></div>`;
          $('.login-panel [data-mode]').addEventListener('click', () => { $('.login-panel').innerHTML = authCard('login'); wireAuthCard('login'); });
        }
      } catch (ex) {
        if (ex.status === 409 && mode === 'setup') { $('.login-panel').innerHTML = authCard('login'); wireAuthCard('login'); toast(ex.message, 'err'); return; }
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
              <a class="user-chip" href="#/account"><div class="avatar">${esc(initials(u.full_name))}</div>
                <div class="who"><b>${esc(u.full_name)}</b><span>${esc(u.role)}</span></div></a>
            </div>
          </aside>
          <div class="main">
            <header class="topbar">
              <a class="brand" href="#/dashboard"><div class="logo-mark">34</div><div class="brand-name">34 Division</div></a>
              <a class="avatar" href="#/account" aria-label="Account">${esc(initials(u.full_name))}</a>
            </header>
            <main class="content" id="content"></main>
          </div>
          <nav class="tabbar" id="tabbar"></nav>
        </div>`;
    }
    $('#side-nav').innerHTML = `
      ${navItem('dashboard', 'home', 'Dashboard')}
      ${navItem('add', 'plus', 'Add voter')}
      ${navItem('voters', 'list', 'Voters')}
      ${navItem('review', 'inbox', 'Review queue', pendingBadge)}
      ${isAdmin() ? `<div class="nav-label">Admin</div>
        ${navItem('upload', 'upload', 'Upload list')}
        ${navItem('team', 'users', 'Volunteers')}
        <a href="/api/export.csv">${icon('download')}<span>Export CSV</span></a>` : ''}`;
    const tab = (name, ic, label, extra = '') =>
      `<a href="#/${name}" class="${active === name ? 'active' : ''}">${icon(ic)}<span>${label}</span>${extra}</a>`;
    $('#tabbar').innerHTML = `
      ${tab('dashboard', 'home', 'Home')}
      ${tab('voters', 'list', 'Voters')}
      <a href="#/add" class="fab" aria-label="Add voter"><span class="circle">${icon('plus')}</span></a>
      ${tab('review', 'inbox', 'Review', `<span class="dot ${state.pending ? '' : 'hidden'}" data-pending>${state.pending}</span>`)}
      ${tab('account', 'more', 'More')}`;
  }

  // ---------------------------------------------------------------- shared renderers
  function voterRow(v, { matched = [], level = '', actions = '' } = {}) {
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
          <div class="top"><span class="vname">${nameHl ? `<span class="hl">${esc(v.name)}</span>` : esc(v.name)}</span>${levelBadge}</div>
          <div class="meta">
            <span>${icon('hash')}${hl('serial no', esc(v.serial_no))}</span>
            <span>${icon('phone')}${hl('mobile', esc(fmtMobile(v.mobile)))}</span>
            <span>${icon('pin')}${hl('street', esc(v.street))}</span>
            <span>${icon('vote')}${esc(v.family_votes)} family vote${v.family_votes == 1 ? '' : 's'}</span>
          </div>
          <div class="by">Verified by ${esc(v.verified_by_name || '—')} · ${esc(timeAgo(v.verified_at))}${v.notes ? ` · ${esc(v.notes)}` : ''}</div>
          ${matched.length ? `<div class="chips" style="margin-top:6px">${matched.map((m) => `<span class="badge badge-gray">same ${esc(m)}</span>`).join('')}</div>` : ''}
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
    const dayLabel = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' });

    el.innerHTML = `
      <div class="page-head"><div><h1>${greet}, ${esc(state.user.full_name.split(' ')[0])}</h1><p>Here's how 34 Division is doing.</p></div>
        <a class="btn btn-brand" href="#/add">${icon('plus')}Add voter</a></div>
      ${s.pending_users ? `<div class="banner banner-green">${icon('users')}<span>${fmtNum(s.pending_users)} new volunteer${s.pending_users === 1 ? ' is' : 's are'} waiting for your approval.</span><a class="btn btn-sm btn-primary" href="#/team">Review sign-ups</a></div>` : ''}
      ${s.pending_review ? `<div class="banner banner-amber">${icon('inbox')}<span>${fmtNum(s.pending_review)} uploaded ${s.pending_review === 1 ? 'entry needs' : 'entries need'} a duplicate review.</span><a class="btn btn-sm btn-primary" href="#/review">Review now</a></div>` : ''}
      <div class="grid grid-4">
        <div class="card stat feature"><div class="label"><span class="ico">${icon('shield')}</span>Verified voters</div>
          <div class="value mono">${fmtNum(s.voters)}</div><div class="hint">+${fmtNum(s.today)} today</div></div>
        <div class="card stat"><div class="label"><span class="ico y">${icon('family')}</span>Families</div>
          <div class="value mono">${fmtNum(s.families)}</div><div class="hint">unique mobile numbers</div></div>
        <div class="card stat"><div class="label"><span class="ico g">${icon('vote')}</span>Family votes</div>
          <div class="value mono">${fmtNum(s.family_votes)}</div><div class="hint">total votes across families</div></div>
        <div class="card stat"><div class="label"><span class="ico b">${icon('pin')}</span>Streets</div>
          <div class="value mono">${fmtNum(s.streets)}</div><div class="hint">streets covered</div></div>
      </div>
      <div class="grid grid-2" style="margin-top:20px">
        <div class="card"><div class="card-head"><h3>Verifications · last 7 days</h3><span class="badge badge-gray">${fmtNum(s.daily.reduce((a, d) => a + d.n, 0))} total</span></div>
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

  // ---------------------------------------------------------------- add voter
  async function viewAdd(el, params) {
    const pre = {
      mobile: params.get('mobile') || '',
      street: params.get('street') || '',
      family_votes: params.get('fv') || '1',
    };
    el.innerHTML = `
      <div class="page-head"><div><h1>Add voter</h1><p>We check for duplicates while you type. Nothing is saved until you confirm.</p></div></div>
      ${pre.mobile ? `<div class="banner banner-green">${icon('family')}<span>Adding another member of the same family. Mobile, street and family votes are already filled in.</span></div>` : ''}
      <div class="grid grid-form">
        <form class="card card-pad" id="voter-form" novalidate autocomplete="off">
          <div class="field"><label for="f-name">Voter name</label>
            <input class="input" id="f-name" name="name" placeholder="e.g. Kandula Venkata Rao" required maxlength="120" autocapitalize="words" /></div>
          <div class="row-2">
            <div class="field"><label for="f-serial">Serial number</label>
              <input class="input" id="f-serial" name="serial_no" placeholder="e.g. 245" required maxlength="30" inputmode="text" /></div>
            <div class="field"><label for="f-fv">Family votes</label>
              <div class="stepper"><button type="button" data-step="-1" aria-label="Decrease">−</button>
                <input id="f-fv" name="family_votes" type="number" min="1" max="99" value="${esc(pre.family_votes)}" inputmode="numeric" />
                <button type="button" data-step="1" aria-label="Increase">+</button></div></div>
          </div>
          <div class="field"><label for="f-mobile">Family mobile number</label>
            <div class="input-group"><span class="prefix">+91</span>
              <input class="input" id="f-mobile" name="mobile" placeholder="98480 12345" required inputmode="numeric" maxlength="14" value="${esc(pre.mobile)}" /></div>
            <span class="help">One number for the whole family.</span></div>
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
    loadStreets().then((list) => { $('#street-list').innerHTML = list.map((s) => `<option value="${esc(s.street)}">`).join(''); });

    const values = () => ({
      name: form.name.value.trim(),
      serial_no: form.serial_no.value.trim(),
      mobile: form.mobile.value.replace(/\D/g, '').slice(-10),
      street: form.street.value.trim(),
      family_votes: Number(form.family_votes.value),
      notes: form.notes.value.trim(),
    });

    function setPanel(kind, title, text, matches = [], family = []) {
      const ic = { idle: 'search', checking: 'loader', ok: 'check', warn: 'alert', block: 'ban' }[kind];
      const row = (m) => voterRow(m, { matched: m.matched_on, level: m.level,
        actions: `<button type="button" class="icon-btn" data-family="${esc(m.mobile)}" title="See this family">${icon('family')}</button>` });
      // Compact copy of the status above the save button (visible on phones,
      // where the full panel sits below the form).
      const inline = $('#dup-inline');
      inline.className = `dup-inline ${kind}${kind === 'idle' ? ' hidden' : ''}`;
      inline.innerHTML = `${icon(ic)}<span>${title}</span>${matches.length || family.length ? '<em>See below ↓</em>' : ''}`;
      panel.innerHTML = `
        <div class="dup-state ${kind}"><div class="ico">${icon(ic)}</div><div><h3>${title}</h3><p>${text}</p></div></div>
        ${matches.length ? `<div class="match-list">${matches.map(row).join('')}</div>` : ''}
        ${family.length ? `<div class="section-cap">${icon('family')}Family already verified on this mobile (${family.length})</div>
          <div class="match-list">${family.map(row).join('')}</div>` : ''}`;
    }
    setPanel('idle', 'Duplicate check', 'Start typing the name, serial number or mobile. Matching voters will appear here.');

    let seq = 0;
    const check = debounce(async () => {
      const v = values();
      if (v.name.length < 3 && !v.serial_no && v.mobile.length < 10) {
        setPanel('idle', 'Duplicate check', 'Start typing the name, serial number or mobile. Matching voters will appear here.');
        return;
      }
      const my = ++seq;
      setPanel('checking', 'Checking…', 'Looking through verified voters.');
      try {
        const r = await api('POST', '/api/voters/check', v);
        if (my !== seq) return;
        const fam = r.family || [];
        if (r.level === 'exact') setPanel('block', 'Already verified', 'This voter is already in the list and can’t be entered again.', r.matches, fam);
        else if (r.matches.length) setPanel('warn', `${r.matches.length} possible match${r.matches.length > 1 ? 'es' : ''}`, 'Check that this is a different person before saving. Highlighted fields match.', r.matches, fam);
        else setPanel('ok', 'No duplicates found', fam.length ? 'This is a new member of a family that’s already in the list. You can save.' : 'This looks like a new voter. You can save.', [], fam);
      } catch (e) { if (my === seq) fail(e); }
    }, 350);

    form.addEventListener('input', (e) => {
      if (e.target.name === 'mobile') e.target.value = e.target.value.replace(/[^\d+ ]/g, '');
      e.target.classList.remove('invalid');
      $('#form-err').classList.add('hidden');
      if (e.target.name !== 'notes' && e.target.name !== 'family_votes') check();
    });
    form.addEventListener('click', (e) => {
      const b = e.target.closest('[data-step]');
      if (b) {
        const i = form.family_votes;
        i.value = Math.min(99, Math.max(1, (Number(i.value) || 1) + Number(b.dataset.step)));
      }
    });
    panel.addEventListener('click', (e) => {
      const b = e.target.closest('[data-family]');
      if (b) location.hash = `#/voters?mobile=${encodeURIComponent(b.dataset.family)}`;
    });
    $('#dup-inline').addEventListener('click', () => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    $('#clear-btn').addEventListener('click', () => { if (location.hash === '#/add') router(); else location.hash = '#/add'; });
    if (pre.mobile) { form.name.focus(); check(); } else form.name.focus();

    function clientValidate(v) {
      const errs = [];
      if (v.name.length < 2) errs.push(['name', 'Enter the voter name.']);
      if (!v.serial_no) errs.push(['serial_no', 'Enter the serial number.']);
      if (!/^[6-9]\d{9}$/.test(v.mobile)) errs.push(['mobile', 'Enter a valid 10-digit mobile number.']);
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
        await api('POST', '/api/voters', { ...v, confirm_different: confirmDifferent });
        closeModal();
        showSaved(v);
      } catch (e) {
        if (e.status === 409 && e.data.level === 'exact') {
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

    function showSaved(v) {
      toast(`${v.name} verified`);
      const m = openModal({
        title: '',
        body: `<div class="success-card"><div class="ico">${icon('check')}</div>
          <h2 style="font-size:22px">${esc(v.name)} is verified</h2>
          <p class="muted" style="margin:6px 0 0">Serial ${esc(v.serial_no)} · ${esc(v.street)}</p></div>`,
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
    const q = { q: params.get('q') || '', street: params.get('street') || '', mobile: params.get('mobile') || '', page: 1 };
    el.innerHTML = `
      <div class="page-head"><div><h1>Voters</h1><p id="count-line">Loading…</p></div>
        <div style="display:flex;gap:10px">${isAdmin() ? `<a class="btn btn-ghost" href="/api/export.csv">${icon('download')}Export</a>` : ''}
        <a class="btn btn-brand" href="#/add">${icon('plus')}Add voter</a></div></div>
      ${q.mobile ? `<div class="banner banner-green">${icon('family')}<span>Showing the family with mobile ${esc(fmtMobile(q.mobile))}</span>
        <a class="btn btn-sm btn-ghost" href="#/add?mobile=${encodeURIComponent(q.mobile)}">${icon('plus')}Add member</a>
        <a class="btn btn-sm btn-primary" href="#/voters" style="margin-left:0">Show all</a></div>` : ''}
      <div class="card">
        <div class="toolbar">
          <label class="search">${icon('search')}<input class="input" id="v-q" placeholder="Search name, serial, mobile or street" value="${esc(q.q)}" type="search" /></label>
          <select class="select" id="v-street"><option value="">All streets</option></select>
        </div>
        <div id="v-list"><div class="card-pad"><div class="skeleton" style="height:200px"></div></div></div>
        <div class="list-foot" id="v-foot"></div>
      </div>`;

    loadStreets().then((list) => {
      $('#v-street').innerHTML = '<option value="">All streets</option>' +
        list.map((s) => `<option ${s.street === q.street ? 'selected' : ''} value="${esc(s.street)}">${esc(s.street)} (${s.voters})</option>`).join('');
    });

    async function load() {
      const usp = new URLSearchParams({ q: q.q, street: q.street, mobile: q.mobile, page: q.page });
      const r = await api('GET', `/api/voters?${usp}`);
      $('#count-line').textContent = `${fmtNum(r.total)} verified voter${r.total === 1 ? '' : 's'}${q.q || q.street || q.mobile ? ' match your filters' : ''}`;
      const acts = (v) => `
        <button class="icon-btn" data-family="${esc(v.mobile)}" title="Show family">${icon('family')}</button>
        ${isAdmin() ? `<button class="icon-btn" data-edit="${v.id}" title="Edit">${icon('edit')}</button>
        <button class="icon-btn" data-del="${v.id}" title="Delete">${icon('trash')}</button>` : ''}`;
      $('#v-list').innerHTML = r.voters.length
        ? r.voters.map((v) => voterRow(v, { actions: acts(v) })).join('')
        : emptyState('search', 'No voters found', q.q || q.street ? 'Try a different search or street.' : 'Verified voters will appear here.');
      $('#v-list').__data = r.voters;
      $('#v-foot').innerHTML = r.pages > 1 ? `
        <span>Page ${r.page} of ${r.pages}</span>
        <span style="display:flex;gap:8px"><button class="btn btn-sm btn-ghost" data-page="${r.page - 1}" ${r.page <= 1 ? 'disabled' : ''}>Previous</button>
        <button class="btn btn-sm btn-ghost" data-page="${r.page + 1}" ${r.page >= r.pages ? 'disabled' : ''}>Next</button></span>` : `<span>${fmtNum(r.total)} shown</span><span></span>`;
    }

    $('#v-q').addEventListener('input', debounce((e) => { q.q = e.target.value.trim(); q.page = 1; load().catch(fail); }, 300));
    $('#v-street').addEventListener('change', (e) => { q.street = e.target.value; q.page = 1; load().catch(fail); });
    $('#v-foot').addEventListener('click', (e) => {
      const b = e.target.closest('[data-page]');
      if (b) { q.page = Number(b.dataset.page); load().catch(fail); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });
    $('#v-list').addEventListener('click', async (e) => {
      const fam = e.target.closest('[data-family]');
      const ed = e.target.closest('[data-edit]');
      const del = e.target.closest('[data-del]');
      const data = $('#v-list').__data || [];
      if (fam) location.hash = `#/voters?mobile=${encodeURIComponent(fam.dataset.family)}`;
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
        <div class="field"><label>Mobile</label><input class="input" name="mobile" value="${esc(v.mobile)}" inputmode="numeric" /></div>
        <div class="field"><label>Street</label><input class="input" name="street" value="${esc(v.street)}" /></div>
        <div class="field"><label>Notes</label><input class="input" name="notes" value="${esc(v.notes)}" /></div>
      </form>`,
      foot: `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="do-edit">Save changes</button>`,
    });
    $('#do-edit', m).addEventListener('click', async (e) => {
      const f = $('#edit-form', m);
      const body = Object.fromEntries(new FormData(f));
      busy(e.currentTarget, true, 'Saving…');
      try { await api('PUT', `/api/voters/${v.id}`, body); closeModal(); toast('Voter updated'); onDone(); }
      catch (er) { fail(er); busy(e.currentTarget, false); }
    });
  }

  // ---------------------------------------------------------------- review queue
  async function viewReview(el) {
    el.innerHTML = `<div class="page-head"><div><h1>Review queue</h1><p>Uploaded entries that look like existing voters. Decide each one.</p></div></div>
      <div id="r-list"><div class="card card-pad"><div class="skeleton" style="height:180px"></div></div></div>`;
    async function load() {
      const r = await api('GET', '/api/review');
      state.pending = r.total;
      $$('[data-pending]').forEach((b) => { b.textContent = r.total; b.classList.toggle('hidden', !r.total); });
      $('#r-list').innerHTML = r.items.length
        ? `<p class="muted" style="margin:0 0 14px">${fmtNum(r.total)} waiting${r.total > r.items.length ? ` · showing the first ${r.items.length}` : ''}</p>` +
          r.items.map((it) => `
            <div class="card" style="margin-bottom:16px">
              <div class="card-head"><h3>${esc(it.data.name)}</h3><span class="muted" style="font-size:13px">Uploaded by ${esc(it.uploaded_by_name || '—')} · ${esc(timeAgo(it.created_at))}</span></div>
              <div class="card-pad">${it.matches.length ? compareCards(it.data, it.matches) : `<div class="banner banner-green" style="margin:0">${icon('check')}No matches any more. Safe to add.</div>`}</div>
              <div class="modal-foot">
                <button class="btn btn-ghost" data-act="discard" data-id="${it.id}">${icon('x')}Duplicate, discard</button>
                <button class="btn btn-primary" data-act="accept" data-id="${it.id}">${icon('check')}Different person, add</button>
              </div>
            </div>`).join('')
        : `<div class="card">${emptyState('inbox', 'All clear', 'There are no entries waiting for review.')}</div>`;
    }
    $('#r-list').addEventListener('click', async (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      busy(b, true, b.dataset.act === 'accept' ? 'Adding…' : 'Discarding…');
      try {
        await api('POST', `/api/review/${b.dataset.id}/${b.dataset.act}`);
        toast(b.dataset.act === 'accept' ? 'Added as a new voter' : 'Discarded as duplicate');
      } catch (er) { fail(er); }
      load().catch(fail);
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
          sub: `${esc(rj.dataset.name)} will not be able to sign in. They can sign up again later.`,
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

  async function viewUpload(el) {
    const FIELDS = [
      ['name', 'Voter name', /name|పేరు/i],
      ['serial_no', 'Serial number', /serial|sl\.?\s*no|s\.?\s*no|sno|క్రమ/i],
      ['mobile', 'Mobile', /mobile|phone|cell|contact|ఫోన్|మొబైల్/i],
      ['street', 'Street', /street|road|colony|area|address|వీధి/i],
      ['family_votes', 'Family votes', /family|votes|members|count|ఓట్లు/i],
    ];
    el.innerHTML = `
      <div class="page-head"><div><h1>Upload voter list</h1><p>Upload an Excel or CSV file. Exact duplicates are skipped. Look-alikes go to the review queue.</p></div></div>
      <label class="drop" id="drop"><input type="file" id="file" accept=".xlsx,.xls,.csv" hidden />
        <div class="ico">${icon('upload')}</div><h3 style="font-size:17px">Drop your file here or tap to choose</h3>
        <p class="muted" style="margin:4px 0 0">Excel (.xlsx, .xls) or CSV · first row must be column headings</p></label>
      <div id="u-step"></div>`;

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
      FIELDS.forEach(([k, , re]) => { const i = headers.findIndex((h, idx) => re.test(h) && !Object.values(guess).includes(idx)); guess[k] = i; });

      step.innerHTML = `
        <div class="card" style="margin-top:20px">
          <div class="card-head"><h3>${icon('file')} ${esc(file.name)}</h3><span class="badge badge-gray">${fmtNum(rows.length)} rows</span></div>
          <div class="card-pad">
            <p class="muted" style="margin:0 0 14px">Match each field to a column in your file.</p>
            <div class="map-grid">${FIELDS.map(([k, label]) => `
              <div class="field"><label>${label}</label><select class="select input" data-map="${k}">
                <option value="-1">${k === 'family_votes' ? 'Not in file (use 1)' : '— choose column —'}</option>
                ${headers.map((h, i) => `<option value="${i}" ${guess[k] === i ? 'selected' : ''}>${esc(h || `Column ${i + 1}`)}</option>`).join('')}
              </select></div>`).join('')}</div>
            <h3 style="font-size:14px;margin:6px 0 10px">Preview</h3>
            <div class="table-wrap card" id="u-preview"></div>
            <div id="u-err" class="banner banner-red hidden" style="margin-top:16px"></div>
            <button class="btn btn-brand" id="u-go" style="margin-top:18px">${icon('upload')}Upload ${fmtNum(rows.length)} voters</button>
          </div>
        </div>
        <div id="u-result"></div>`;

      const mapping = () => Object.fromEntries($$('[data-map]').map((s) => [s.dataset.map, Number(s.value)]));
      const mapRow = (r, mp, idx) => ({
        __row: idx + 2,
        name: mp.name >= 0 ? r[mp.name] : '',
        serial_no: mp.serial_no >= 0 ? r[mp.serial_no] : '',
        mobile: mp.mobile >= 0 ? r[mp.mobile] : '',
        street: mp.street >= 0 ? r[mp.street] : '',
        family_votes: mp.family_votes >= 0 ? r[mp.family_votes] : 1,
      });
      const preview = () => {
        const mp = mapping();
        $('#u-preview').innerHTML = `<table class="table"><thead><tr>${FIELDS.map(([, l]) => `<th>${l}</th>`).join('')}</tr></thead><tbody>
          ${rows.slice(0, 5).map((r, i) => { const m = mapRow(r, mp, i); return `<tr>${FIELDS.map(([k]) => `<td>${esc(m[k])}</td>`).join('')}</tr>`; }).join('')}</tbody></table>`;
      };
      preview();
      $$('[data-map]').forEach((s) => s.addEventListener('change', preview));

      $('#u-go').addEventListener('click', async (e) => {
        const mp = mapping();
        const missing = FIELDS.filter(([k]) => k !== 'family_votes' && mp[k] < 0).map(([, l]) => l);
        const err = $('#u-err');
        if (missing.length) { err.innerHTML = `${icon('alert')}Choose a column for: ${esc(missing.join(', '))}`; err.classList.remove('hidden'); return; }
        err.classList.add('hidden');
        const btn = e.currentTarget;
        const all = rows.map((r, i) => mapRow(r, mp, i));
        const total = { added: 0, already_verified: 0, queued: 0, invalid: [] };
        const BATCH = 250;
        try {
          for (let i = 0; i < all.length; i += BATCH) {
            busy(btn, true, `Uploading… ${Math.min(i + BATCH, all.length)} / ${all.length}`);
            const r = await api('POST', '/api/import', { rows: all.slice(i, i + BATCH) });
            total.added += r.added; total.already_verified += r.already_verified; total.queued += r.queued; total.invalid.push(...r.invalid);
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
              <div class="stat"><div class="label"><span class="ico y">${icon('inbox')}</span>Needs review</div><div class="value mono">${fmtNum(total.queued)}</div></div>
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
          ${isAdmin() ? `<div class="card"><div class="card-head"><h3>Admin tools</h3></div>
            <div class="nav" style="padding:8px">
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
