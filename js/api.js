(function () {
  const BASE = window.ITINERA_API_BASE || '';

  function getToken() {
    return localStorage.getItem('itinera_token');
  }

  function headers(includeAuth = false) {
    const h = { 'Content-Type': 'application/json' };
    if (includeAuth && getToken()) h['Authorization'] = 'Bearer ' + getToken();
    return h;
  }

  async function request(method, path, body, auth = false) {
    const url = BASE + path;
    const opt = { method, headers: headers(auth) };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) opt.body = JSON.stringify(body);
    const res = await fetch(url, opt);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw { status: res.status, ...data };
    return data;
  }

  window.ItineraAPI = {
    getToken,
    isLoggedIn() {
      return !!getToken();
    },

    async signup(email, password, full_name) {
      return request('POST', '/api/auth/signup', { email, password, full_name });
    },
    async login(email, password) {
      return request('POST', '/api/auth/login', { email, password });
    },
    async me() {
      return request('GET', '/api/auth/me', null, true);
    },

    async getStays(params = {}) {
      const q = new URLSearchParams(params).toString();
      return request('GET', '/api/stays' + (q ? '?' + q : ''));
    },
    async getStay(id) {
      return request('GET', '/api/stays/' + id);
    },

    async getReviews(stayId) {
      return request('GET', '/api/reviews?stayId=' + encodeURIComponent(stayId));
    },
    async postReview(stayId, rating, comment) {
      return request('POST', '/api/reviews', { stay_id: stayId, rating, comment }, true);
    },

    async getBookings() {
      return request('GET', '/api/bookings', null, true);
    },
    async createBooking(data) {
      return request('POST', '/api/bookings', data, true);
    },

    async getUser() {
      return request('GET', '/api/users/me', null, true);
    },
    async updateUser(data) {
      return request('PATCH', '/api/users/me', data, true);
    },

    async getSavedStays() {
      return request('GET', '/api/saved-stays', null, true);
    },
    async addSavedStay(stayId) {
      return request('POST', '/api/saved-stays', { stay_id: stayId }, true);
    },
    async removeSavedStay(stayId) {
      return request('DELETE', '/api/saved-stays?stay_id=' + encodeURIComponent(stayId), null, true);
    },
  };
})();
