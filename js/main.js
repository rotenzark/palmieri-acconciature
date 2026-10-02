/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'palmieri-acconciature',
    /* nessun WhatsApp dichiarato: il telefono e la prenotazione su Treatwell */
    whatsapp: { number: '', message: '', ids: [] },
    /* la scheda Google e Treatwell (2/10/2026): martedì–sabato 9–19 con orario continuato, domenica e lunedì chiuso */
    hours: {
      0: [], 1: [],
      2: [['09:00', '19:00']], 3: [['09:00', '19:00']], 4: [['09:00', '19:00']], 5: [['09:00', '19:00']], 6: [['09:00', '19:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1100,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Palmieri Acconciature: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.parete": "The wall",
      "n.salone": "The salon",
      "n.permanente": "One by one",
      "n.servizi": "Services",
      "n.recensioni": "Reviews",
      "n.orari": "Hours",
      "t.prenota": "Book",
      "t.prenotaonline": "Book online",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.r1": "PALMIERI ACCONCIATURE, VIA MECENATE 38",
      "h.r2": "SINCE 1970",
      "h.r3": "FIRST CARLO, THEN UMBERTO:",
      "h.r4": "BLOW-DRY, CUT, COLOUR AND PERMS.",
      "h.r5": "FOR OVER FIFTY YEARS, YOUR",
      "h.r6": "HAIRDRESSER.",
      "h.google": "on Google, 37 reviews",
      "h.treatwell": "on Treatwell, 117 reviews",
      "p.occhio": "The wall",
      "p.titolo": "A sonnet, line by line",
      "p.testo1": "At the back of the salon there is a white wall with a sonnet by Pablo Neruda, painted by hand in black capitals: the linking lines small, the important words huge. You see it as soon as you walk in, and it is where the look of this page comes from.",
      "p.citf": "Pablo Neruda, from Sonnet XIV of «One Hundred Love Sonnets», on our wall (in Italian: «One by one I must count them and praise them»)",
      "p.testo2": "It is about hair, counted one by one. A good way of saying how we work.",
      "a.parete": "The white wall at the back of the salon: a sonnet in black capitals painted by hand, small lines and huge lines, and at the bottom the signature P. Neruda.",
      "s.occhio": "The salon",
      "s.titolo": "On Via Mecenate since 1970",
      "s.a1": "Carlo opens the salon on Via Mecenate.",
      "s.a2": "Umberto takes it over and carries it on.",
      "s.oggi": "Today",
      "s.a3": "Umberto, stylist, and Stefania, blow-dry.",
      "s.testo1": "Inside there are three bell lamps, tall mirrors, black chairs and heat lamps on arms above the stations; the green hood dryer for colour, the window onto the street. We work straight through, Tuesday to Saturday from 9am to 7pm.",
      "s.testo2": "Umberto keeps going on colour and cutting courses, and tells about it on our page: «Ready to learn new things.»",
      "a.salone": "The salon: three white bell lamps, two tall mirrors with black chairs in front, the green hood dryer and the window onto the street.",
      "a.lampade": "The heat lamps on arms above a station, the dark granite top, the black chairs; in the mirror the rest of the salon.",
      "f.occhio": "One by one",
      "f.titolo2": "The perm, one roller at a time",
      "f.intro": "We specialise in waving and colour techniques. A perm «sets the curls for good»: the head is divided into sections, each section is wound on its own roller, one at a time; then the lotion, the rest, and the rollers come out. Here we have drawn it: small rollers give curls, big ones give waves.",
      "f.titolo": "The perm, one by one",
      "f.desc": "A head seen from behind, with long straight auburn hair divided into nine sections, over a light blue cape. One at a time the rollers climb from the ends to the nape winding the section, and above they are counted: one, two, up to nine. Then the lotion drops, the rest, and the rollers come out one by one: the sections fall in curls. In the second mode the rollers are big and the result is soft waves.",
      "f.p0": "ONE",
      "f.p1": "TWO",
      "f.p2": "THREE",
      "f.p3": "FOUR",
      "f.p4": "FIVE",
      "f.p5": "SIX",
      "f.p6": "SEVEN",
      "f.p7": "EIGHT",
      "f.p8": "NINE",
      "f.p9": "LOTION",
      "f.p10": "REST",
      "f.ricci": "CURLS.",
      "f.onde": "WAVES.",
      "f.d0": "Nine sections, nine small rollers: at the end, curls.",
      "f.d1": "Nine sections, nine big rollers: at the end, soft waves.",
      "f.modi": "The perm",
      "f.b0": "Curls",
      "f.b1": "Waves",
      "v.occhio": "Services",
      "v.titolo": "Blow-dry, cut, colour, perm, care",
      "v.piega": "BLOW-DRY",
      "v.piega1": "Blow-dry with shampoo and conditioner",
      "v.piega2": "Straight blow-dry with the flat iron",
      "v.piega3": "Curly blow-dry with the curling iron",
      "v.taglio": "CUT",
      "v.taglio1": "Women’s cut, chosen for the shape of the face and the hair",
      "v.taglio2": "Cut and dry",
      "v.taglio3": "Men’s shampoo and cut",
      "v.taglio4": "Children’s cut and cut for ages 11 to 16",
      "v.colore": "COLOUR",
      "v.colore1": "4D Color: up to four shades side by side, for intense nuances",
      "v.colore2": "Root colour, also ammonia-free",
      "v.colore3": "Root colour and repair: while the colour sets, a treatment polishes lengths and ends. «Two services in one.»",
      "v.colore4": "Full colour and highlights, for natural reflections",
      "v.perm": "PERM",
      "v.perm1": "Curls that last: the perm, with blow-dry and restructuring cream",
      "v.perm2": "Soft waves with the big rollers",
      "v.cura": "CARE",
      "v.cura1": "Cashmere keratin treatment: «it is not straightening, it does not change the shape of the hair»",
      "v.cura2": "Scalp scrub and purifying treatment, with steam and ozone",
      "v.cura3": "Lotion, cream and nourishment",
      "v.nota": "Prices and times are on Treatwell, where you can also book:",
      "v.link": "our booking page",
      "l.occhio": "From behind",
      "l.titolo": "Our work, as we post it",
      "l.intro": "From our Facebook page: colours and blow-dries, seen from behind, in the chair or in front of the wall.",
      "a.ramati": "A client from behind in the chair: auburn hair, straight at the top and in ringlets at the ends; behind, the green hood dryer and the shelves.",
      "c.ramati": "Auburn, with ringlets at the ends",
      "a.sfumature": "Wavy brown hair lightening towards blonde ends, from behind, with the words Sfumature Paris.",
      "c.sfumature": "The shading",
      "a.bob": "A cool blonde bob seen from behind; in the mirror you can read the wall with the sonnet.",
      "c.bob": "Cool blonde, in a bob",
      "a.pellicola": "Lightened hair wrapped in clear film, over the light blue cape.",
      "c.pellicola": "Setting, in the film",
      "a.pellicolap": "Hair in the film, from behind, in front of the wall with the sonnet.",
      "c.pellicolap": "In front of the wall",
      "l.citf": "from our Facebook page («For some things, film cannot be replaced.»)",
      "l.nota": "New work is on our page:",
      "r.occhio": "Reviews",
      "r.titolo": "Who sits in our chair",
      "r.g18": "Google, 2018",
      "r.g20": "Google, 2020",
      "r.g22": "Google, 2022",
      "r.g23": "Google, 2023",
      "r.g26": "Google, 2026",
      "r.t23": "Treatwell, 2023",
      "r.t25": "Treatwell, 2025",
      "r.nota": "From the reviews on Google and Treatwell, as they were written, in Italian; […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "o.occhio": "Hours and directions",
      "o.titolo": "Via Mecenate 38",
      "o.ffacciata": "Our sign, on Via Mecenate (we blurred the posters in the window)",
      "a.facciata": "The grey stone front: the two white light boxes of the sign, —Palmieri— and Acconciature in blue, two windows and the door; inside you can see the wall with the sonnet.",
      "w.dove": "Where",
      "w.dovev": "Via Mecenate 38, 20138 Milan",
      "w.tram": "Tram",
      "w.tramv": "the 27 at the Via Mecenate – Via Zante stop, about 100 metres away; the 12 at the Piazza Ovidio terminus, about 400 metres away",
      "w.bus": "Bus",
      "w.busv": "the 45 and the 175 on Via Salomone, about 300 metres away",
      "w.metro": "Metro",
      "w.metrov": "M4, Repetti stop, about 900 metres away",
      "w.auto": "By car",
      "w.autov": "Tangenziale Est ring road, Mecenate exit",
      "w.tel": "Phone",
      "w.mappa": "Map: Palmieri Acconciature, Via Mecenate 38, Milan",
      "o.orari": "Hours",
      "o.cap": "Opening hours",
      "o.nota": "Open straight through, no lunch break. Hours from our Google listing and Treatwell (October 2026).",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "q.occhio": "Questions",
      "q.titolo": "Before you come",
      "q.d1": "How do I book?",
      "q.r1": "Online on Treatwell, at any time, or by calling the salon on 02 506 1882.",
      "q.d2": "Are you open straight through?",
      "q.r2": "Yes: Tuesday to Saturday from 9am to 7pm, no break. We are closed on Sundays and Mondays.",
      "q.d3": "Do you also do men and children?",
      "q.r3": "Yes: men’s shampoo and cut, children’s cut and cut for ages 11 to 16.",
      "q.d4": "Does the keratin treatment straighten the hair?",
      "q.r4": "No: it is not straightening and it does not change the shape of the hair. It is a cashmere keratin treatment that gives body to fine or treated hair and protects it; the effect lasts several weeks.",
      "q.d5": "Where are you?",
      "q.r5": "At Via Mecenate 38, Milan, a short walk from the Via Mecenate – Via Zante stop of tram 27.",
      "f2.orario": "Tuesday–Saturday 9am–7pm, open straight through · closed Sundays and Mondays",
      "f2.treatwell": "Book on Treatwell",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · <a href=\"privacy.html\">Privacy</a> · hours, ratings and reviews from the Google and Treatwell listings (October 2026); photos from the Google listing, our Facebook page and Treatwell. We redrew the sign and the perm; the sonnet on the wall is by Pablo Neruda.",
      "f2.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ PALMIERI ACCONCIATURE — parrucchiere, Via Mecenate 38, dal 1970 ══════════
     la FIRMA — «la permanente, uno a uno»: nove ciocche lisce di spalle; uno alla volta i bigodini salgono dalla punta alla nuca e
     sopra si contano (UNO… NOVE), la lozione, il riposo, poi si tolgono uno a uno e le ciocche scendono ricce (o a onde). Lo stato
     è M (Ricci / Onde), T (0…1) e V (0 al suo posto; fino a 1 le ciocche salgono di poco e si spengono; da −1 a 0 arrivano le
     prossime, di nuovo lisce). Senza JS e alla fine: Ricci, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): le ciocche lisce.
     Reduced-motion: tutto subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante
     l'animazione la ferma dov'è. */
  var DATI = {"vb":[640,700],"via":-14,"modi":[{"nome":"Ricci","ciocche":[{"x":182,"a":11,"y0":634,"y1":362.4,"g":0.056,"ll":[287.9,287.9,287.9,287.9,287.9,287.9,287.9,287.9,288],"lr":[313.8,315.3,315,313.8,312.4,310.1,307.8,305.9,304.7],"f":[0.04,0.07],"s":[0.745,0.05]},{"x":216.5,"a":9.4,"y0":624,"y1":368.7,"g":0.059,"ll":[271.6,271.6,271.6,271.6,271.6,271.6,271.6,271.6,271.6],"lr":[309.4,310.9,310.5,309.5,308,305.7,303.8,301.7,300.7],"f":[0.095,0.07],"s":[0.77,0.05]},{"x":251,"a":6.9,"y0":636,"y1":373.7,"g":0.057,"ll":[278.6,278.6,278.6,278.6,278.6,278.6,278.6,278.6,278.6],"lr":[311.3,312.7,312.4,311.3,309.9,307.5,305.5,303.5,302.4],"f":[0.15,0.07],"s":[0.795,0.05]},{"x":285.5,"a":3.6,"y0":626,"y1":376.9,"g":0.06,"ll":[265.4,265.4,265.4,265.4,265.4,265.4,265.4,265.4,265.4],"lr":[307.8,309.2,308.9,307.9,306.4,304.2,302.1,300.2,299.3],"f":[0.205,0.07],"s":[0.82,0.05]},{"x":320,"a":0,"y0":638,"y1":378,"g":0.058,"ll":[276.3,276.3,276.3,276.3,276.3,276.3,276.3,276.3,276.3],"lr":[310.7,312.1,311.7,310.7,309.3,306.9,304.9,302.9,301.8],"f":[0.26,0.07],"s":[0.845,0.05]},{"x":354.5,"a":-3.6,"y0":628,"y1":376.9,"g":0.06,"ll":[267.4,267.4,267.4,267.4,267.4,267.4,267.4,267.4,267.4],"lr":[308.3,309.7,309.4,308.3,307,304.7,302.6,300.7,299.7],"f":[0.315,0.07],"s":[0.87,0.05]},{"x":389,"a":-6.9,"y0":634,"y1":373.7,"g":0.058,"ll":[276.6,276.7,276.6,276.6,276.6,276.6,276.6,276.6,276.6],"lr":[310.8,312.2,311.8,310.8,309.3,307,305,303,301.9],"f":[0.37,0.07],"s":[0.895,0.05]},{"x":423.5,"a":-9.4,"y0":622,"y1":368.7,"g":0.059,"ll":[269.6,269.6,269.6,269.6,269.6,269.6,269.6,269.6,269.6],"lr":[308.9,310.3,310,308.9,307.6,305.1,303.2,301.3,300.2],"f":[0.425,0.07],"s":[0.92,0.05]},{"x":458,"a":-11,"y0":632,"y1":362.4,"g":0.056,"ll":[285.9,285.9,285.9,285.9,285.9,285.9,285.9,285.9,285.9],"lr":[313.3,314.7,314.4,313.4,311.8,309.5,307.3,305.4,304.3],"f":[0.48,0.07],"s":[0.945,0.055]}],"gocce":[{"f":[0.565,0.03]},{"f":[0.574,0.03]},{"f":[0.583,0.03]},{"f":[0.592,0.03]},{"f":[0.601,0.03]},{"f":[0.61,0.03]},{"f":[0.619,0.03]},{"f":[0.628,0.03]},{"f":[0.637,0.03]}],"parole":[{"f":[0.04,0.095]},{"f":[0.095,0.15]},{"f":[0.15,0.205]},{"f":[0.205,0.26]},{"f":[0.26,0.315]},{"f":[0.315,0.37]},{"f":[0.37,0.425]},{"f":[0.425,0.48]},{"f":[0.48,0.56]},{"f":[0.56,0.675]},{"f":[0.675,0.745]},{"f":[0.745,null]}]},{"nome":"Onde","ciocche":[{"x":182,"a":11,"y0":634,"y1":368.4,"g":0.076,"ll":[287.9,287.9,287.9,287.9,287.9,287.9,287.9,287.9,288],"lr":[261.7,262,261.7,261.7,261.9,262.4,263,263.6,263.8],"f":[0.04,0.07],"s":[0.745,0.05]},{"x":216.5,"a":9.4,"y0":624,"y1":374.7,"g":0.081,"ll":[271.6,271.6,271.6,271.6,271.6,271.6,271.6,271.6,271.6],"lr":[249,249.3,249.1,248.9,249.2,249.7,250.4,250.9,251.3],"f":[0.095,0.07],"s":[0.77,0.05]},{"x":251,"a":6.9,"y0":636,"y1":379.7,"g":0.079,"ll":[278.6,278.6,278.6,278.6,278.6,278.6,278.6,278.6,278.6],"lr":[254.4,254.8,254.4,254.4,254.6,255.1,255.8,256.4,256.6],"f":[0.15,0.07],"s":[0.795,0.05]},{"x":285.5,"a":3.6,"y0":626,"y1":382.9,"g":0.083,"ll":[265.4,265.4,265.4,265.4,265.4,265.4,265.4,265.4,265.4],"lr":[244.2,244.6,244.2,244.1,244.4,244.9,245.6,246.2,246.5],"f":[0.205,0.07],"s":[0.82,0.05]},{"x":320,"a":0,"y0":638,"y1":384,"g":0.08,"ll":[276.3,276.3,276.3,276.3,276.3,276.3,276.3,276.3,276.3],"lr":[252.6,253,252.8,252.6,252.8,253.3,254,254.6,254.9],"f":[0.26,0.07],"s":[0.845,0.05]},{"x":354.5,"a":-3.6,"y0":628,"y1":382.9,"g":0.082,"ll":[267.4,267.4,267.4,267.4,267.4,267.4,267.4,267.4,267.4],"lr":[245.7,246.1,245.8,245.7,245.9,246.4,247.1,247.7,248],"f":[0.315,0.07],"s":[0.87,0.05]},{"x":389,"a":-6.9,"y0":634,"y1":379.7,"g":0.08,"ll":[276.6,276.7,276.6,276.6,276.6,276.6,276.6,276.6,276.6],"lr":[252.9,253.2,253,252.8,253.1,253.6,254.2,254.8,255.1],"f":[0.37,0.07],"s":[0.895,0.05]},{"x":423.5,"a":-9.4,"y0":622,"y1":374.7,"g":0.082,"ll":[269.6,269.6,269.6,269.6,269.6,269.6,269.6,269.6,269.6],"lr":[247.4,247.8,247.5,247.4,247.6,248.1,248.8,249.4,249.7],"f":[0.425,0.07],"s":[0.92,0.05]},{"x":458,"a":-11,"y0":632,"y1":368.4,"g":0.077,"ll":[285.9,285.9,285.9,285.9,285.9,285.9,285.9,285.9,285.9],"lr":[260.1,260.5,260.2,260.1,260.3,260.8,261.5,262,262.3],"f":[0.48,0.07],"s":[0.945,0.055]}],"gocce":[{"f":[0.565,0.03]},{"f":[0.574,0.03]},{"f":[0.583,0.03]},{"f":[0.592,0.03]},{"f":[0.601,0.03]},{"f":[0.61,0.03]},{"f":[0.619,0.03]},{"f":[0.628,0.03]},{"f":[0.637,0.03]}],"parole":[{"f":[0.04,0.095]},{"f":[0.095,0.15]},{"f":[0.15,0.205]},{"f":[0.205,0.26]},{"f":[0.26,0.315]},{"f":[0.315,0.37]},{"f":[0.37,0.425]},{"f":[0.425,0.48]},{"f":[0.48,0.56]},{"f":[0.56,0.675]},{"f":[0.675,0.745]},{"f":[0.745,null]}]}],"tempi":{"inizio":300,"perm":7600,"servi":420,"arriva":480,"permV":6400}};
  /* la permanente a (M, T, V) — una sola fonte: la usano _pal_firma.mjs (l'HTML allo stato finale), main.js (via pal_main.cjs) e
     la prova (firma-prova.mjs). T = 1, V = 0 dà gli stessi attributi dell'HTML; T = 0 gli stessi pixel dell'attesa (il CSS).
     Nove ciocche lisce, di spalle. Uno a uno i bigodini salgono dalla punta alla nuca e la ciocca si avvolge (sopra si contano:
     UNO, DUE… NOVE); la lozione cade goccia a goccia, il riposo; poi i bigodini si tolgono, uno a uno, e la ciocca scende riccia
     (o a onde, coi bigodini grandi). Col V la scena sale di poco e si spegne; la prossima arriva, coi capelli di nuovo lisci. */
  function creaPerm(svg, D) {
    var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
    var r1 = function (n) { return Math.round(n * 10) / 10; };
    var r3 = function (n) { return Math.round(n * 1000) / 1000; };
    /* la fine di una fase arriva a 1 esatto (#256) */
    var fase = function (t, w) { return t >= w[0] + w[1] - 1e-9 ? 1 : c01((t - w[0]) / w[1]); };
    var dolce = function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
    var esce = function (u) { return 1 - Math.pow(1 - u, 3); };
    var q = function (sel) { return svg.querySelector(sel); };
    var servito = q('.servito');
    var uno = function (cl, m, k, j) { return q('.' + cl + '[data-m="' + m + '"][data-k="' + k + '"]' + (j === undefined ? '' : '[data-j="' + j + '"]')); };
    var pezzi = D.modi.map(function (M, m) {
      return {
        ciocche: M.ciocche.map(function (C, k) {
          return {
            lisci: C.ll.map(function (_, j) { return uno('pm-liscio', m, k, j); }),
            ricci: C.lr.map(function (_, j) { return uno('pm-riccio', m, k, j); }),
            rullo: uno('pm-rullo', m, k), giro: uno('pm-giro', m, k)
          };
        }),
        gocce: M.gocce.map(function (_, k) { return uno('pm-goccia', m, k); }),
        parole: M.parole.map(function (_, k) { return uno('pm-parola', m, k); })
      };
    });
    function disegna(m, t, v) {
      var P = pezzi[m], M = D.modi[m], k, j;
      for (k = 0; k < P.ciocche.length; k++) {
        var C = M.ciocche[k], Q = P.ciocche[k];
        /* avvolgere: il bigodino sale dalla punta alla nuca, la ciocca liscia si accorcia sotto di lui */
        var w = dolce(fase(t, C.f));
        /* srotolare: il bigodino si toglie (sale un poco e sparisce) e la ciocca scende riccia dalla nuca alla punta */
        var u = fase(t, C.s), via = dolce(c01(u / 0.4));
        var resta = 1 - w * (1 - C.g);
        for (j = 0; j < Q.lisci.length; j++) {
          Q.lisci[j].setAttribute('stroke-dashoffset', r1(C.ll[j] * (1 - resta)));
          Q.lisci[j].setAttribute('opacity', u > 0 ? 0 : 1);
        }
        for (j = 0; j < Q.ricci.length; j++) {
          Q.ricci[j].setAttribute('stroke-dashoffset', r1(C.lr[j] * (1 - esce(u))));
          Q.ricci[j].setAttribute('opacity', u > 0 ? 1 : 0);
        }
        Q.rullo.setAttribute('transform', 'translate(' + C.x + ' ' + r1(C.y0 + (C.y1 - C.y0) * w - 14 * via) + ') rotate(' + C.a + ')');
        Q.rullo.setAttribute('opacity', r3(dolce(fase(t, [C.f[0] - 0.012, 0.012])) * (1 - via)));
        Q.giro.setAttribute('opacity', r3(w));
      }
      /* la lozione: una goccia per bigodino */
      for (k = 0; k < P.gocce.length; k++) {
        var g = fase(t, M.gocce[k].f);
        P.gocce[k].setAttribute('transform', 'translate(0 ' + r1(-96 * (1 - dolce(g))) + ')');
        P.gocce[k].setAttribute('opacity', r3(g > 0 && g < 1 ? Math.sin(Math.PI * g) : 0));
      }
      /* la parola grande sopra: UNO… NOVE, LOZIONE, RIPOSO, RICCI (l'ultima resta) */
      for (k = 0; k < P.parole.length; k++) {
        var W = M.parole[k].f;
        P.parole[k].setAttribute('opacity', r3(dolce(fase(t, [W[0], 0.012])) * (W[1] === null ? 1 : 1 - dolce(fase(t, [W[1], 0.012])))));
      }
      /* col V la scena sale di poco e si spegne; la prossima arriva */
      servito.setAttribute('transform', 'translate(0 ' + r1(D.via * v) + ')');
      servito.setAttribute('opacity', r3(1 - Math.abs(v)));
    }
    var completo = !!servito && pezzi.every(function (P) {
      return P.gocce.every(Boolean) && P.parole.every(Boolean) && P.ciocche.every(function (Q) { return Q.rullo && Q.giro && Q.lisci.every(Boolean) && Q.ricci.every(Boolean); });
    });
    return { disegna: disegna, pezzi: pezzi, completo: completo };
  }

  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('perm-firma'), svgF = prendi('permSvg'), leggiF = prendi('permLeggi');
  var PERM = svgF ? creaPerm(svgF, DATI) : null;
  var BOTTONI = [].slice.call(document.querySelectorAll('.perm__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  function annunciaF(m) {
    var el = document.querySelector('.perm__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    PERM.disegna(m, t, v);
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* gli altri modi tornano come nell'HTML (#257) */
    DATI.modi.forEach(function (_, k) { if (k !== destinazioneF.m) PERM.disegna(k, 1, 0); });
    PERM.disegna(destinazioneF.m, 1, 0);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa resta le ciocche lisce */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: le ciocche lisce */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + TF.perm, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + TF.perm });
  }
  /* il gesto: scegliere che cosa guardare. Se è quello che si sta già facendo, niente; altrimenti tutto si ferma dov'è,
     la scena scende e si spegne, arriva dall'alto la prossima, vuota, e si rifà da capo. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(TF.permV, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la firma è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è quella
     del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && PERM && PERM.completo && BOTTONI.length === DATI.modi.length) {
    try { clearTimeout(window.__attesaPerm); } catch (e) {}
    window.__perm = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__perm.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la firma sotto la piega (sul telefono): parte quando se ne vede abbastanza; fino ad allora resta le ciocche lisce */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__perm.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
