(function () {
  const TOKEN_KEY = 'itinera_token';
  const USER_KEY = 'itinera_user';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  }

  function isAuthPage() {
    const path = window.location.pathname || '';
    return /login\.html$|signup\.html$/i.test(path);
  }

  function isProtectedPage() {
    const path = window.location.pathname || '';
    return /checkout\.html|booking-summary\.html|room-selection\.html|profile\.html|my-trips\.html|trip-planner\.html|budget-dashboard\.html|rewards-dashboard\.html/i.test(path);
  }

  function redirectToLogin() {
    const returnUrl = encodeURIComponent(window.location.href);
    window.location.replace('login.html?returnUrl=' + returnUrl);
  }

  window.Auth = {
    getToken,
    getUser,
    setSession,
    logout() {
      clearSession();
      if (window.ItineraAPI) window.ItineraAPI.getToken = () => null;
      window.location.replace('index.html');
    },
    init(options = {}) {
      const { requireAuth = false, onUser } = options;
      if (requireAuth && !getToken()) {
        redirectToLogin();
        return;
      }
      if (isProtectedPage() && !getToken()) {
        redirectToLogin();
        return;
      }
      if (getToken() && isAuthPage()) {
        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl');
        window.location.replace(returnUrl || 'index.html');
        return;
      }
      if (onUser && getUser()) onUser(getUser());
    },
  };
})();
