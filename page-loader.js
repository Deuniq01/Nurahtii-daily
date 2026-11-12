(() => {
  const pageFiles = {
    'pg-birthday': 'pages/birthday.html',
    'pg-entry': 'pages/entry.html',
    'pg-home': 'pages/home.html',
    'pg-note': 'pages/note.html',
    'pg-dua': 'pages/dua.html',
    'pg-jar': 'pages/jar.html',
    'pg-countdown': 'pages/countdown.html',
    'pg-mood': 'pages/mood.html',
    'pg-qa': 'pages/qa.html',
    'pg-dq': 'pages/daily-question.html',
    'pg-admin': 'pages/admin.html'
  };
  const host = document.getElementById('pageHost');
  const errorBox = document.getElementById('pageLoadError');
  const errorText = errorBox.querySelector('span');
  const pageLoads = new Map();
  const scriptLoads = new Map();

  async function loadPage(id) {
    const existing = document.getElementById(id);
    if (existing) return existing;

    const path = pageFiles[id];
    if (!path) throw new Error(`Unknown page: ${id}`);
    if (pageLoads.has(id)) return pageLoads.get(id);

    const pending = (async () => {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${path} (HTTP ${response.status})`);
      }

      const template = document.createElement('template');
      template.innerHTML = (await response.text()).trim();
      const pages = template.content.querySelectorAll('.page');
      if (pages.length !== 1 || pages[0].id !== id) {
        throw new Error(`Invalid page fragment: ${path}`);
      }

      host.append(template.content);
      return document.getElementById(id);
    })();

    pageLoads.set(id, pending);
    try {
      return await pending;
    } catch (error) {
      pageLoads.delete(id);
      throw error;
    }
  }

  function loadScript(path) {
    if (scriptLoads.has(path)) return scriptLoads.get(path);

    const pending = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path;
      script.async = false;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${path}`));
      document.head.append(script);
    });

    scriptLoads.set(path, pending);
    pending.catch(() => scriptLoads.delete(path));
    return pending;
  }

  window.loadAppPage = loadPage;
  window.reportPageLoadError = error => {
    console.error('Page loading failed:', error);
    errorText.textContent = 'Part of the experience could not be loaded. Check your connection and reload.';
    errorBox.hidden = false;
  };
  window.clearPageLoadError = () => {
    errorBox.hidden = true;
  };

  document.getElementById('reloadAfterPageError').addEventListener('click', () => {
    window.location.reload();
  });

  (async () => {
    try {
      await loadPage('pg-birthday');
      try {
        await loadScript('birthday-effects.js');
      } catch (error) {
        window.reportPageLoadError(error);
      }
      await loadScript('app.js');
    } catch (error) {
      window.reportPageLoadError(error);
    }
  })();
})();
