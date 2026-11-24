/* ===== PhishGuard — Interaksi & Praktik ===== */

// ---------- Navbar ----------
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
  })
);

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ---------- Reveal on scroll ----------
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Hero particles ----------
(function particles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, pts = [];
  const resize = () => {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  const COUNT = Math.min(90, Math.floor(window.innerWidth / 14));
  for (let i = 0; i < COUNT; i++) {
    pts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.4
    });
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(37,99,235,0.4)';
      ctx.fill();
    }
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.hypot(dx, dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(8,145,178,${0.15 * (1 - d / 110)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ---------- Animated counters ----------
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ============================================================
// PRAKTIK 1 — KUIS DETEKSI PHISHING
// ============================================================
const QUIZ = [
  {
    from: 'PT Bank Nusantara <no-reply@banknusantara.co.id>',
    subject: 'Notifikasi Transaksi Berhasil',
    body: 'Yth. Nasabah, transfer Rp 250.000 dari rekening Anda telah berhasil diproses pada 24 Nov 2026 pukul 09:14 WIB.\n\nTerima kasih telah menggunakan layanan kami.',
    link: null,
    answer: 'safe',
    explain: 'Benar! Ini email notifikasi transaksi standar: domain resmi (.co.id milik bank), tidak ada link, tidak meminta data, dan bahasanya natural.'
  },
  {
    from: 'BCA Security <security@bca-secure-verify.xyz>',
    subject: 'AKUN ANDA TERBLOKIR - VERIFIKASI SEGERA',
    body: 'Sistem kami mendeteksi login mencurigakan. Akun Anda akan DIBLOKIR dalam 2 jam!\n\nKlik link berikut untuk verifikasi identitas: bit.ly/bca-verify',
    link: 'https://bit.ly/bca-verify → (menyembunyikan tujuan asli)',
    answer: 'phish',
    explain: 'Phishing! Domain bukan bca.co.id, ada urgensi ekstrem, link pendek yang menyembunyikan tujuan, dan meminta verifikasi lewat link.'
  },
  {
    from: 'Marketplace Official <promo@marketplace-official.tk>',
    subject: 'Selamat! Anda Terpilih Menerima Voucher Rp 1.000.000',
    body: 'Halo! Anda beruntung menjadi pemenang undian nasional! Klaim voucher Anda sekarang sebelum hangus dalam 3 jam.',
    link: null,
    answer: 'phish',
    explain: 'Phishing! Janji hadiah tak masuk akal, urgensi buatan, dan domain .tk yang murah sering dipakai penipu. Kamu tidak pernah ikut undian.'
  },
  {
    from: 'Pak Andi (Rekan Kerja) <andi@perusahaan.com>',
    subject: 'File Laporan Q3',
    body: 'Halo, tolong cek file laporan Q3 terlampir ya. Terima kasih.\n\n[Lampiran: laporan_Q3.xlsx]',
    link: null,
    answer: 'safe',
    explain: 'Kemungkinan aman — tapi tetap waspada. Lampiran dari rekan kerja normal. Red flag akan muncul jika domain pengirim bukan perusahaan atau ada permintaan aneh.'
  },
  {
    from: 'DANA <cs@dana.id>',
    subject: 'OTP Transaksi Anda',
    body: 'Kode OTP untuk penarikan Rp 500.000 adalah: 882913\nJangan berikan kode ini kepada siapapun.',
    link: null,
    answer: 'safe',
    explain: 'Aman — ini justru pengingat keamanan yang baik dari aplikasi resmi. Domain dana.id asli, dan justru memperingatkan untuk tidak membagikan OTP.'
  },
  {
    from: 'Kantor Pos <support@kantorpos-resi.com>',
    subject: 'Paket Anda Gagal Diantar - Bayar Ongkir',
    body: 'Paket dengan resi JD001234567 tidak dapat diantar. Bayar biaya admin Rp 25.000 dalam 24 jam atau paket dikembalikan.\nKlik: pos-indonesia.top/pay',
    link: 'https://pos-indonesia.top/pay',
    answer: 'phish',
    explain: 'Phishing (smishing-style)! Domain bukan posindonesia.co.id, memancing pembayaran lewat link, dan memanfaatkan ketakutan paket hilang.'
  },
  {
    from: 'HR Department <hr@perusahaan.com>',
    subject: 'Update Data Karyawan - Wajib Sebelum Jumat',
    body: 'Seluruh karyawan wajib memperbarui data melalui portal HR: http://hr-portal.perusahaan.com/update\nAkses hanya bisa dilakukan melalui link ini.',
    link: 'http://hr-portal.perusahaan.com/update (bukan subdomain resmi)',
    answer: 'phish',
    explain: 'Spear phishing! Walau terdengar internal, URL-nya domain terpisah (perusahaan.com subdomain palsu dibuat mirip). Cek selalu domain sebenarnya.'
  },
  {
    from: 'Gojek <promo@gojek.id>',
    subject: 'Cashback 50% untuk Order Pertama',
    body: 'Dapatkan cashback hingga Rp 50.000 untuk pesanan pertamamu minggu ini! Gunakan kode FIRST50. Berlaku untuk pengguna baru.',
    link: null,
    answer: 'safe',
    explain: 'Kemungkinan aman — domain resmi gojek.id, penawaran masuk akal, tidak meminta data sensitif. Tetap cek sebelum mengklik link promosi.'
  }
];

(function initQuiz() {
  const body = document.getElementById('quizBody');
  const questionEl = document.getElementById('quizQuestion');
  const messageEl = document.getElementById('quizMessage');
  const actionsEl = document.getElementById('quizActions');
  const btnNext = document.getElementById('btnNext');
  const resultEl = document.getElementById('quizResult');
  const scoreEl = document.getElementById('quizScore');
  const verdictEl = document.getElementById('quizVerdict');
  const bar = document.getElementById('quizBar');
  const btnSafe = document.getElementById('btnSafe');
  const btnPhish = document.getElementById('btnPhish');
  const btnRestart = document.getElementById('btnRestart');

  let idx = 0, score = 0, answered = false;

  function render() {
    answered = false;
    const q = QUIZ[idx];
    questionEl.innerHTML = `
      <span class="q-from">&#128231; ${escapeHtml(q.from)}</span>
      <span class="q-body">${escapeHtml(q.subject)}\n\n${escapeHtml(q.body)}</span>
      ${q.link ? `<span class="q-link">${escapeHtml(q.link)}</span>` : ''}`;
    messageEl.className = 'quiz-message';
    messageEl.textContent = '';
    actionsEl.classList.remove('hidden');
    btnNext.classList.add('hidden');
    bar.style.width = `${(idx / QUIZ.length) * 100}%`;
  }

  function answer(choice) {
    if (answered) return;
    answered = true;
    const q = QUIZ[idx];
    const correct = choice === q.answer;
    if (correct) score++;
    messageEl.textContent = (correct ? '\u2713 Benar! ' : '\u2717 Kurang tepat. ') + q.explain;
    messageEl.className = 'quiz-message show ' + (correct ? 'correct' : 'wrong');
    actionsEl.classList.add('hidden');
    btnNext.classList.remove('hidden');
    btnNext.textContent = idx === QUIZ.length - 1 ? 'Lihat Hasil &#9733;' : 'Soal Berikutnya &#8594;';
    bar.style.width = `${((idx + 1) / QUIZ.length) * 100}%`;
  }

  btnSafe.addEventListener('click', () => answer('safe'));
  btnPhish.addEventListener('click', () => answer('phish'));
  btnNext.addEventListener('click', () => {
    idx++;
    if (idx >= QUIZ.length) showResult();
    else render();
  });
  btnRestart.addEventListener('click', () => {
    idx = 0; score = 0;
    body.classList.remove('hidden');
    resultEl.classList.add('hidden');
    render();
  });

  function showResult() {
    body.classList.add('hidden');
    resultEl.classList.remove('hidden');
    scoreEl.textContent = `${score}/${QUIZ.length}`;
    const pct = score / QUIZ.length;
    verdictEl.innerHTML = pct === 1
      ? '&#128737; Luar biasa! Kamu detektif phishing ulung. Share pengetahuan ini ke orang-orang tersayang.'
      : pct >= 0.7
        ? '&#128200; Bagus! Sedikit lagi — pelajari kembali bagian Red Flags.'
        : '&#128220; Jangan khawatir, ini latihan. Baca ulang materi Red Flags & Modus Operandi lalu coba lagi.';
  }

  render();
})();

// ============================================================
// CHECKLIST KEAMANAN INTERAKTIF
// ============================================================
(function initChecklist() {
  const grid = document.getElementById('checklistGrid');
  const bar = document.getElementById('checklistBar');
  const pct = document.getElementById('checklistPct');
  const verdict = document.getElementById('checklistVerdict');
  const resetBtn = document.getElementById('checklistReset');
  if (!grid) return;

  const boxes = grid.querySelectorAll('input[type="checkbox"]');
  const total = boxes.length;
  const STORAGE_KEY = 'phishguard_checklist';

  function update() {
    const done = [...boxes].filter(b => b.checked).length;
    const p = Math.round((done / total) * 100);
    bar.style.width = p + '%';
    pct.textContent = p + '%';
    verdict.classList.add('hidden');
    verdict.classList.remove('success', 'warn');
    if (done === total) {
      verdict.textContent = '🏆 Sempurna! Kamu sudah menerapkan hampir semua pertahanan anti-phishing.';
      verdict.classList.remove('hidden');
      verdict.classList.add('success');
    } else if (done >= total * 0.6) {
      verdict.textContent = '👍 Bagus! Tinggal beberapa langkah lagi untuk pertahanan maksimal.';
      verdict.classList.remove('hidden');
      verdict.classList.add('warn');
    }
    const state = {};
    boxes.forEach(b => state[b.dataset.item] = b.checked);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  boxes.forEach(b => b.addEventListener('change', () => {
    b.closest('.check-item').classList.toggle('done', b.checked);
    update();
  }));

  resetBtn.addEventListener('click', () => {
    boxes.forEach(b => { b.checked = false; b.closest('.check-item').classList.remove('done'); });
    verdict.classList.add('hidden');
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    update();
  });

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    boxes.forEach(b => {
      if (saved[b.dataset.item]) {
        b.checked = true;
        b.closest('.check-item').classList.add('done');
      }
    });
  } catch (e) {}
  update();
})();

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ============================================================
// PRAKTIK 2 — PEMERIKSA URL
// ============================================================
(function initUrlChecker() {
  const input = document.getElementById('urlInput');
  const btn = document.getElementById('btnCheckUrl');
  const result = document.getElementById('urlResult');

  const SUSPICIOUS_TLDS = ['tk', 'ml', 'ga', 'cf', 'gq', 'xyz', 'top', 'club', 'online', 'site', 'loan', 'win', 'bid', 'stream', 'download', 'racing', 'date'];
  const BRANDS = ['bni', 'bca', 'bri', 'mandiri', 'paypal', 'gopay', 'ovo', 'dana', 'gojek', 'grab', 'tokopedia', 'shopee', 'bukalapak', 'instagram', 'facebook', 'whatsapp', 'netflix', 'gmail', 'outlook', 'gov', 'kominfo'];

  function analyze(raw) {
    const checks = [];
    let score = 0; // 0 aman, makin besar makin bahaya
    let url;
    try {
      url = new URL(raw.startsWith('http') ? raw : 'http://' + raw);
    } catch {
      return { level: 'danger', checks: ['URL tidak valid / tidak bisa diparse. Waspada!'], score: 99 };
    }
    const host = url.hostname.toLowerCase();
    const hostNoWww = host.replace(/^www\./, '');

    // IP address host
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostNoWww)) {
      checks.push('Hostname berupa alamat IP mentah — situs legit hampir tidak pernah pakai IP.');
      score += 40;
    }
    // Protocol http (bukan https)
    if (url.protocol === 'http:') {
      checks.push('Menggunakan HTTP tanpa enkripsi — data yang kamu masukkan bisa dicuri.');
      score += 15;
    }
    // Punycode / IDN homograph
    if (host.includes('xn--')) {
      checks.push('Mengandung Punycode (xn--) — teknik homograph untuk meniru huruf/brand.');
      score += 35;
    }
    // Brand name ada tapi bukan di posisi awal domain
    const labels = hostNoWww.split('.');
    const sld = labels[labels.length - 2] || '';
    const brandInHost = BRANDS.find(b => hostNoWww.includes(b));
    if (brandInHost && !sld.startsWith(brandInHost) && !sld.endsWith(brandInHost)) {
      checks.push(`Nama brand "${brandInHost}" muncul di domain, tapi BUKAN sebagai nama domain utama — ciri khas typosquatting/peniruan.`);
      score += 30;
    }
    // SLD mirip brand tapi tidak persis
    const brandMatch = BRANDS.find(b => sld.includes(b) && sld !== b && !sld.startsWith(b + '-') && sld !== b + 's');
    if (brandMatch && sld !== brandMatch && !sld.startsWith(brandMatch)) {
      checks.push(`Nama domain "${sld}" meniru brand "${brandMatch}" dengan tambahan karakter.`);
      score += 25;
    }
    // Subdomain dalam (deep subdomain)
    if (labels.length > 2 && hostNoWww.split('.').length >= 3 && labels[labels.length - 1] && labels.length - 2 > 0) {
      const domainParts = hostNoWww.split('.');
      if (domainParts.length > 2) {
        const mainDomain = domainParts.slice(-2).join('.');
        const subs = domainParts.slice(0, -2);
        if (subs.length >= 1 && domainParts.length > 3) {
          checks.push(`Subdomain bertingkat dalam ("${subs.join('.')}" sebelum ${mainDomain}) — sering dipakai untuk menipu.`);
          score += 10;
        }
      }
    }
    // Suspicious TLD
    const tld = hostNoWww.split('.').pop();
    if (SUSPICIOUS_TLDS.includes(tld)) {
      checks.push(`TLD ".${tld}" termasuk ekstensi murah yang sering disalahgunakan penipu.`);
      score += 20;
    }
    // Hyphen / digit di SLD
    if (/-/.test(sld)) {
      checks.push(`Domain utama mengandung tanda hubung — pola umum domain phishing (mis. "bank-secure-login").`);
      score += 10;
    }
    if (/\d/.test(sld)) {
      checks.push(`Domain utama mengandung angka — bisa jadi pengganti huruf (l→1, o→0).`);
      score += 10;
    }
    // Domain sangat panjang
    if (hostNoWww.length > 40) {
      checks.push('Hostname sangat panjang — upaya menyembunyikan nama brand di tengah URL.');
      score += 10;
    }
    // URL path mencurigakan
    const path = url.pathname.toLowerCase();
    if (/login|verify|verifikasi|account|secure|update|confirm|password|otp/i.test(path)) {
      checks.push('Path URL meminta login/verifikasi — normal untuk situs asli, tapi berbahaya jika domain juga mencurigakan.');
      score += 5;
    }
    if (url.username || url.password) {
      checks.push('URL mengandung kredensial di dalamnya (user:pass@domain) — teknik phishing canggih.');
      score += 30;
    }
    // Tidak ada masalah berarti
    if (checks.length === 0) {
      checks.push('Tidak ditemukan pola mencurigakan pada struktur domain. Tetap waspada terhadap konten halaman.');
    }

    let level;
    if (score >= 50) level = 'danger';
    else if (score >= 25) level = 'suspicious';
    else level = 'safe';
    return { level, checks, score, host: hostNoWww };
  }

  function verdictText(level, host) {
    if (level === 'danger') return `&#128680; TIDAK DISARANKAN — "${host}" menunjukkan banyak pola phishing.`;
    if (level === 'suspicious') return `&#9888; WASPADA — "${host}" punya beberapa red flags. Jangan masukkan data sensitif.`;
    return `&#9989; LAYAK DIGUNAKAN — "${host}" tampak bersih secara struktur. Tetap cek sertifikat HTTPS & konten.`;
  }

  function runCheck(url) {
    const res = analyze(url);
    result.className = 'url-result ' + res.level;
    result.innerHTML = `
      <div class="url-verdict">${verdictText(res.level, res.host || '')}</div>
      <ul>${res.checks.map(c => `<li>${escapeHtml(c)}</li>`).join('')}</ul>
      <p style="margin-top:12px;font-size:.8rem;opacity:.7">Skor risiko: ${res.score}/99 — alat edukasi sederhana, bukan pengganti judgment.</p>`;
    result.classList.remove('hidden');
  }

  btn.addEventListener('click', () => {
    const v = input.value.trim();
    if (!v) { input.focus(); return; }
    runCheck(v);
  });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click(); });
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.url;
      runCheck(chip.dataset.url);
      document.getElementById('urlchecker').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
})();
