(function () {
  function formatCurrency(amount, currency) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
  }

  function stayCardHtml(stay, options) {
    const id = stay.id;
    const img = (stay.images && stay.images[0]) || stay.image_url || '';
    const price = stay.price_per_night != null ? formatCurrency(stay.price_per_night, stay.currency) : '';
    const rating = stay.avg_rating != null ? Number(stay.avg_rating).toFixed(2) : '—';
    const reviewsCount = stay.reviews_count || 0;
    const discount = stay.discount_percent ? `<span class="bg-accent text-white text-xs font-bold px-2.5 py-1 rounded-md">${stay.discount_percent}% OFF</span>` : '';
    const superhost = stay.is_superhost ? '<span class="text-xs font-medium text-primary">Superhost</span>' : '';
    const compact = options && options.compact;
    const detailUrl = 'stay-detail.html?id=' + encodeURIComponent(id);

    if (compact) {
      return `
        <div class="stay-card snap-start flex-shrink-0 w-[280px] rounded-xl overflow-hidden shadow-md bg-white cursor-pointer" data-stay-id="${id}" onclick="window.location.href='${detailUrl}'">
          <div class="relative h-40">
            <img class="w-full h-full object-cover" src="${img}" alt="${(stay.title || '').slice(0, 50)}" />
            <div class="absolute top-2 right-2 flex gap-2">
              <button class="save-btn w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow" onclick="event.stopPropagation(); typeof toggleSave === 'function' && toggleSave(this)"><i class="fa-regular fa-heart text-dark"></i></button>
              <button class="compare-btn w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow" onclick="event.stopPropagation(); typeof addToCompare === 'function' && addToCompare(this)"><i class="fa-solid fa-code-compare text-dark text-sm"></i></button>
            </div>
            ${discount ? `<div class="absolute bottom-2 left-2">${discount}</div>` : ''}
          </div>
          <div class="p-3">
            <h3 class="font-bold text-sm text-dark truncate">${stay.title || ''}</h3>
            <p class="text-xs text-gray-400">${stay.location || ''}</p>
            <div class="flex items-center justify-between mt-2">
              <span class="flex items-center gap-1"><i class="fa-solid fa-star text-accent text-xs"></i><span class="text-xs font-semibold">${rating}</span> <span class="text-xs text-gray-400">${reviewsCount} reviews</span></span>
              <span class="text-sm font-bold text-dark">${price}<span class="text-gray-400 font-normal text-xs">/night</span></span>
            </div>
          </div>
        </div>`;
    }

    return `
      <div class="stay-result-card rounded-2xl overflow-hidden shadow-md bg-white cursor-pointer" data-stay-id="${id}" onclick="if(!event.target.closest('button')) window.location.href='${detailUrl}'">
        <div class="relative">
          <div class="image-carousel-container h-56 overflow-hidden relative">
            <div class="image-carousel flex transition-transform duration-300">
              ${(stay.images || [img]).slice(0, 3).map(u => `<img class="w-full h-56 object-cover flex-shrink-0" src="${u}" alt="" />`).join('')}
            </div>
          </div>
          <div class="absolute top-3 right-3 flex gap-2">
            <button class="save-btn w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md" onclick="event.stopPropagation(); typeof toggleSave === 'function' && toggleSave(this)"><i class="fa-regular fa-heart text-dark"></i></button>
            <button class="compare-btn w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md" onclick="event.stopPropagation(); typeof addToCompare === 'function' && addToCompare(this)"><i class="fa-solid fa-code-compare text-dark"></i></button>
          </div>
          ${discount ? `<div class="absolute top-3 left-3">${discount}</div>` : ''}
        </div>
        <div class="p-4">
          <h3 class="font-bold text-base text-dark mb-1">${stay.title || ''}</h3>
          <p class="text-sm text-gray-400 mb-2">${stay.location || ''}</p>
          <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
            <span><i class="fa-solid fa-user-group"></i> ${stay.guests_max || 0} guests</span>
            <span>•</span>
            <span><i class="fa-solid fa-bed"></i> ${stay.bedrooms || 0} beds</span>
            <span>•</span>
            <span><i class="fa-solid fa-bath"></i> ${stay.baths || 0} bath</span>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <i class="fa-solid fa-star text-accent text-sm"></i>
            <span class="text-sm font-semibold">${rating}</span>
            <span class="text-xs text-gray-400">${reviewsCount} reviews</span>
            ${superhost}
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm font-bold text-dark">${price}<span class="text-gray-400 font-normal">/night</span></span>
          </div>
        </div>
      </div>`;
  }

  window.ItineraData = {
    formatCurrency,
    stayCardHtml,
    async loadStays(params) {
      if (typeof ItineraAPI === 'undefined') return { stays: [] };
      const data = await ItineraAPI.getStays(params);
      return data;
    },
    async loadStay(id) {
      if (typeof ItineraAPI === 'undefined') return null;
      return await ItineraAPI.getStay(id);
    },
    async loadReviews(stayId) {
      if (typeof ItineraAPI === 'undefined') return { reviews: [] };
      return await ItineraAPI.getReviews(stayId);
    },
  };
})();
