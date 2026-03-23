document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('portfolio.config.json');
    if (!res.ok) throw new Error('portfolio.config.json not found');
    const config = await res.json();
    render(config);
  } catch (e) {
    console.error(e);
    const el = document.getElementById('cover-name');
    if (el) el.textContent = 'portfolio.config.json not found — see README';
  }
});

function render(c) {
  // Nav bar
  const nav = document.getElementById('nav-title');
  if (nav) nav.textContent = `${c.profile.username} PORTFOLIO — ${c.meta.subtitle}`.toUpperCase();

  // Document title
  document.title = `${c.profile.username} Portfolio — ${c.meta.subtitle}`;
  document.documentElement.lang = c.meta.lang || 'en';

  renderCover(c);
  renderWorks(c.works);
  renderSkillsPage(c);
  updatePageNumbers();
}

// ── Cover Page ──

function renderCover(c) {
  setText('cover-year', `PORTFOLIO ${c.meta.portfolioYear}`);
  setText('cover-username', c.profile.username);
  setHTML('cover-name', c.profile.name.formatted);
  setText('cover-title', c.profile.title);

  const phil = document.getElementById('cover-philosophy');
  if (phil) {
    phil.innerHTML = `${c.profile.philosophy.headline}<br><span style="font-size:12px;line-height:1.8;">${c.profile.philosophy.body}</span>`;
  }

  const contacts = document.getElementById('cover-contacts');
  if (contacts) {
    contacts.innerHTML = c.contacts.map(ct => `
      <div>
        <div style="font-size:9px;letter-spacing:2px;color:var(--text-muted);text-transform:uppercase;font-family:'Syne',sans-serif;margin-bottom:3px;">${esc(ct.label)}</div>
        <div style="font-size:11px;color:var(--text);">${esc(ct.value)}</div>
      </div>
    `).join('');
  }
}

// ── Works ──

function renderWorks(works) {
  const container = document.getElementById('works-container');
  if (!container) return;

  works.forEach(work => {
    if (work.type === 'product-grid') {
      container.appendChild(buildProductGridPage(work));
    } else {
      container.appendChild(buildStandardWorkPage(work));
    }
  });
}

function buildStandardWorkPage(w) {
  const tpl = document.getElementById('tpl-work-standard');
  const page = tpl.content.cloneNode(true);

  page.querySelector('[data-slot="section-label"]').textContent = `WORK — ${w.year}`;
  page.querySelector('[data-slot="title"]').textContent = w.title;
  page.querySelector('[data-slot="subtitle"]').textContent = w.subtitle;

  const img = page.querySelector('[data-slot="image"] img');
  img.src = w.image;
  img.alt = w.imageAlt || w.title;

  page.querySelector('[data-slot="description"]').textContent = w.description;

  // Metrics
  const metricsEl = page.querySelector('[data-slot="metrics"]');
  w.metrics.forEach(m => {
    const span = document.createElement('span');
    span.className = 'metric';
    span.textContent = m;
    metricsEl.appendChild(span);
  });

  // Key points
  const kpEl = page.querySelector('[data-slot="keypoints"]');
  w.keyPoints.forEach((kp, i) => {
    const div = document.createElement('div');
    div.className = 'keypoint';
    div.innerHTML = `<span class="keypoint-num">${String(i + 1).padStart(2, '0')}</span>${esc(kp)}`;
    kpEl.appendChild(div);
  });

  // Tech stack
  const techEl = page.querySelector('[data-slot="techstack"]');
  w.techStack.forEach(t => {
    const span = document.createElement('span');
    span.className = 'tag';
    span.textContent = t;
    techEl.appendChild(span);
  });

  // Optional link
  const linkEl = page.querySelector('[data-slot="link"]');
  if (w.link) {
    linkEl.textContent = w.link.text;
    linkEl.style.display = '';
  } else {
    linkEl.remove();
  }

  return page;
}

function buildProductGridPage(w) {
  const tpl = document.getElementById('tpl-work-product-grid');
  const page = tpl.content.cloneNode(true);

  page.querySelector('[data-slot="section-label"]').textContent = `WORK — ${w.year}`;
  page.querySelector('[data-slot="title"]').textContent = w.title;
  page.querySelector('[data-slot="subtitle"]').textContent = w.subtitle;

  // Products
  const grid = page.querySelector('[data-slot="product-grid"]');
  (w.products || []).forEach(p => {
    const card = document.createElement('div');
    card.style.cssText = 'background:var(--bg-card);border:1px solid var(--border);border-radius:4px;padding:16px;';
    card.innerHTML = `
      <div style="width:100%;height:100px;background:linear-gradient(135deg,#18181b,#1f1f23);border-radius:3px;overflow:hidden;margin-bottom:12px;">
        <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.name)}" style="width:100%;height:100%;object-fit:cover;display:block;">
      </div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:6px;font-family:'Syne',sans-serif;">${esc(p.name)}</div>
      <div style="font-size:11px;line-height:1.7;color:var(--text-muted);">${esc(p.description)}</div>
    `;
    grid.appendChild(card);
  });

  // Extra cards
  const extraContainer = page.querySelector('[data-slot="extra-cards"]');
  (w.extraCards || []).forEach(ec => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginBottom = '20px';
    card.innerHTML = `
      <div class="card-label">${esc(ec.label)}</div>
      <p style="font-size:12px;line-height:1.8;color:var(--text-muted);margin:0;">${esc(ec.text)}</p>
    `;
    extraContainer.appendChild(card);
  });

  // Iterations
  const iterContainer = page.querySelector('[data-slot="iterations"]');
  if (w.iterations && w.iterations.items.length > 0) {
    const label = document.createElement('div');
    label.className = 'tech-label';
    label.style.marginBottom = '12px';
    label.textContent = w.iterations.label;
    iterContainer.appendChild(label);

    const iterGrid = document.createElement('div');
    iterGrid.style.cssText = `display:grid;grid-template-columns:repeat(${w.iterations.items.length}, 1fr);gap:8px;`;
    w.iterations.items.forEach(it => {
      const item = document.createElement('div');
      item.style.cssText = 'background:var(--bg-card);border:1px solid var(--border);border-radius:3px;padding:10px;text-align:center;';
      item.innerHTML = `
        <div style="width:100%;aspect-ratio:1/1;background:#18181b;border-radius:2px;overflow:hidden;margin-bottom:8px;">
          <img src="${esc(it.image)}" alt="${esc(it.alt)}" style="width:100%;height:100%;object-fit:contain;display:block;background:#18181b;">
        </div>
        <div style="font-size:9px;color:var(--text-muted);line-height:1.4;">${esc(it.caption)}</div>
      `;
      iterGrid.appendChild(item);
    });
    iterContainer.appendChild(iterGrid);
  }

  // Tags
  const tagsContainer = page.querySelector('[data-slot="tags"]');
  if (w.tags && w.tags.length > 0) {
    const tagLabel = document.createElement('div');
    tagLabel.className = 'tech-label';
    tagLabel.textContent = w.tagsLabel || 'TECH STACK';
    tagsContainer.appendChild(tagLabel);

    const tagDiv = document.createElement('div');
    w.tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tagDiv.appendChild(span);
    });
    tagsContainer.appendChild(tagDiv);
  }

  return page;
}

// ── Skills Page ──

function renderSkillsPage(c) {
  // Skills grid
  const skillsGrid = document.getElementById('skills-container');
  if (skillsGrid) {
    c.skills.forEach(cat => {
      const card = document.createElement('div');
      card.className = 'card';
      let html = `<div class="card-label">${esc(cat.category)}</div>`;
      cat.items.forEach((item, i) => {
        const border = i < cat.items.length - 1 ? 'border-bottom:1px solid var(--border);' : '';
        html += `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;${border}">
            <span style="font-size:12px;color:var(--text);">${esc(item.name)}</span>
            <span style="font-size:10px;color:var(--text-muted);font-family:'Syne',sans-serif;">${esc(item.since)}</span>
          </div>
        `;
      });
      card.innerHTML = html;
      skillsGrid.appendChild(card);
    });
  }

  // Education
  const eduEl = document.getElementById('education-container');
  if (eduEl) {
    eduEl.innerHTML = `
      <div class="card-label">EDUCATION</div>
      <div style="font-size:13px;color:var(--text);margin-bottom:4px;">${esc(c.education.institution)}</div>
      <div style="font-size:11px;color:var(--text-muted);">${esc(c.education.period)}</div>
      <div style="font-size:12px;color:var(--text-muted);margin-top:10px;line-height:1.7;">${esc(c.education.description)}</div>
    `;
  }

  // Footer contact
  const footer = document.getElementById('footer-contact');
  if (footer) {
    const contactLines = c.contacts
      .filter(ct => ['email', 'portfolio', 'booth'].includes(ct.label.toLowerCase()) || c.contacts.indexOf(ct) < 3)
      .slice(0, 3)
      .map(ct => esc(ct.value))
      .join('<br>');

    footer.innerHTML = `
      <div>
        <div style="font-size:24px;font-weight:800;font-family:'Syne',sans-serif;margin-bottom:8px;">${esc(c.profile.name.display)}</div>
        <div style="font-size:11px;color:var(--text-muted);line-height:1.8;">${contactLines}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px;letter-spacing:4px;color:var(--accent);font-family:'Syne',sans-serif;font-weight:700;">${esc(c.profile.username)}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">${esc(c.meta.copyright)}</div>
      </div>
    `;
  }
}

// ── Page Numbers ──

function updatePageNumbers() {
  const pages = document.querySelectorAll('.page');
  let num = 0;
  pages.forEach(page => {
    const pn = page.querySelector('.page-num');
    if (pn) {
      num++;
      pn.textContent = String(num + 1).padStart(2, '0');
    }
  });
}

// ── Helpers ──

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function esc(str) {
  if (!str) return '';
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
