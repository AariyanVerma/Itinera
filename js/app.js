const USER_INFO = {
    name: 'Aariyan Verma',
    email: 'Aariyan.Verma@gmail.com',
    getProfilePhoto: function() {
        return localStorage.getItem('profilePhoto') || './assets/profile.jpg';
    }
};

let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

function addToCompare(button) {
    const stayCard = button.closest('.stay-card, .stay-result-card, .featured-card');
    if (!stayCard) return;
    
    const stayId = stayCard.dataset.stayId || `stay-${Date.now()}`;
    stayCard.dataset.stayId = stayId;
    
    if (compareList.length >= 3) {
        showToast('You can only compare up to 3 stays', 'error');
        return;
    }
    
    if (compareList.includes(stayId)) {
        compareList = compareList.filter(id => id !== stayId);
        button.classList.remove('bg-primary', 'text-white');
        button.classList.add('bg-white/90', 'text-dark');
        showToast('Removed from compare', 'info');
    } else {
        compareList.push(stayId);
        button.classList.add('bg-primary', 'text-white');
        button.classList.remove('bg-white/90', 'text-dark');
        showToast('Added to compare', 'success');
    }
    
    localStorage.setItem('compareList', JSON.stringify(compareList));
    updateCompareTray();
}

function updateCompareTray() {
    const tray = document.getElementById('compare-tray');
    const countEl = document.getElementById('compare-count');
    
    if (tray && countEl) {
        if (compareList.length > 0) {
            tray.classList.remove('hidden');
            countEl.textContent = compareList.length;
        } else {
            tray.classList.add('hidden');
        }
    }
}

let savedStays = JSON.parse(localStorage.getItem('savedStays') || '[]');

function toggleSave(button) {
    const stayCard = button.closest('.stay-card, .stay-result-card, .featured-card');
    if (!stayCard) return;
    
    const stayId = stayCard.dataset.stayId || `stay-${Date.now()}`;
    stayCard.dataset.stayId = stayId;
    
    const heartIcon = button.querySelector('i');
    
    if (savedStays.includes(stayId)) {
        savedStays = savedStays.filter(id => id !== stayId);
        heartIcon.classList.remove('fa-solid', 'text-primary');
        heartIcon.classList.add('fa-regular', 'text-dark');
        showToast('Removed from saved', 'info');
    } else {
        savedStays.push(stayId);
        heartIcon.classList.remove('fa-regular', 'text-dark');
        heartIcon.classList.add('fa-solid', 'text-primary');
        showToast('Saved to wishlist', 'success');
    }
    
    localStorage.setItem('savedStays', JSON.stringify(savedStays));
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-20 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce pointer-events-auto ${
        type === 'error' ? 'bg-primary text-white' : 
        type === 'success' ? 'bg-secondary text-white' : 
        'bg-dark text-white'
    }`;
    
    const icon = type === 'error' ? 'fa-circle-exclamation' : 
                 type === 'success' ? 'fa-check-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span class="font-semibold text-sm">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateCompareTray();
    
    document.querySelectorAll('.save-btn').forEach(btn => {
        const stayCard = btn.closest('.stay-card, .stay-result-card, .featured-card');
        if (stayCard && stayCard.dataset.stayId) {
            const stayId = stayCard.dataset.stayId;
            if (savedStays.includes(stayId)) {
                const heartIcon = btn.querySelector('i');
                if (heartIcon) {
                    heartIcon.classList.remove('fa-regular', 'text-dark');
                    heartIcon.classList.add('fa-solid', 'text-primary');
                }
            }
        }
    });
    
    document.querySelectorAll('.compare-btn').forEach(btn => {
        const stayCard = btn.closest('.stay-card, .stay-result-card, .featured-card');
        if (stayCard && stayCard.dataset.stayId) {
            const stayId = stayCard.dataset.stayId;
            if (compareList.includes(stayId)) {
                btn.classList.add('bg-primary', 'text-white');
                btn.classList.remove('bg-white/90', 'text-dark');
            }
        }
    });
    
    updateProfileImages();
});

function updateProfileImages() {
    const profilePhoto = USER_INFO.getProfilePhoto();
    
    const headerProfileImgs = document.querySelectorAll('#header-profile-img, #user-profile-img');
    headerProfileImgs.forEach(img => {
        img.src = profilePhoto;
        img.onerror = function() {
            this.style.display = 'none';
            const icon = this.nextElementSibling;
            if (icon && icon.classList.contains('fa-user')) {
                icon.style.display = 'flex';
            }
        };
    });
    
    const profilePhotoEl = document.getElementById('profile-photo');
    if (profilePhotoEl && !localStorage.getItem('profilePhoto')) {
        const savedPhoto = localStorage.getItem('profilePhoto');
        if (savedPhoto) {
            profilePhotoEl.src = savedPhoto;
        }
    }
}

function navigateTo(page) {
    window.location.href = page;
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function calculateNights(checkIn, checkOut) {
    const oneDay = 24 * 60 * 60 * 1000;
    const firstDate = new Date(checkIn);
    const secondDate = new Date(checkOut);
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
}

const SEARCH_DATES = {
    save: function(checkIn, checkOut) {
        if (checkIn && checkOut) {
            localStorage.setItem('searchCheckIn', checkIn.toISOString());
            localStorage.setItem('searchCheckOut', checkOut.toISOString());
        }
    },
    
    get: function() {
        const checkInStr = localStorage.getItem('searchCheckIn');
        const checkOutStr = localStorage.getItem('searchCheckOut');
        
        if (checkInStr && checkOutStr) {
            return {
                checkIn: new Date(checkInStr),
                checkOut: new Date(checkOutStr)
            };
        }
        return null;
    },
    
    formatShort: function(date) {
        if (!date) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}`;
    },
    
    formatLong: function(date) {
        if (!date) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    
    formatLongWithDay: function(date) {
        if (!date) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
    
    formatRange: function(checkIn, checkOut) {
        if (!checkIn || !checkOut) return '';
        return `${this.formatShort(checkIn)}-${this.formatShort(checkOut)}`;
    },
    
    formatRangeWithYear: function(checkIn, checkOut) {
        if (!checkIn || !checkOut) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[checkIn.getMonth()]} ${checkIn.getDate()}-${months[checkOut.getMonth()]} ${checkOut.getDate()}, ${checkOut.getFullYear()}`;
    },
    
    updateAllDateDisplays: function() {
        const dates = this.get();
        if (!dates) return;
        
        document.querySelectorAll('[data-date="check-in"]').forEach(el => {
            el.textContent = this.formatLong(dates.checkIn);
        });
        
        document.querySelectorAll('[data-date="check-out"]').forEach(el => {
            el.textContent = this.formatLong(dates.checkOut);
        });
        
        document.querySelectorAll('[data-date="check-in-with-day"]').forEach(el => {
            el.textContent = this.formatLongWithDay(dates.checkIn);
        });
        
        document.querySelectorAll('[data-date="check-out-with-day"]').forEach(el => {
            el.textContent = this.formatLongWithDay(dates.checkOut);
        });
        
        document.querySelectorAll('[data-date="check-in-short"]').forEach(el => {
            el.textContent = this.formatShort(dates.checkIn);
        });
        
        document.querySelectorAll('[data-date="check-out-short"]').forEach(el => {
            el.textContent = this.formatShort(dates.checkOut);
        });
        
        document.querySelectorAll('[data-date="range"]').forEach(el => {
            el.textContent = this.formatRange(dates.checkIn, dates.checkOut);
        });
        
        document.querySelectorAll('[data-date="range-year"]').forEach(el => {
            el.textContent = this.formatRangeWithYear(dates.checkIn, dates.checkOut);
        });
        
        document.querySelectorAll('[data-date="nights"]').forEach(el => {
            const nights = calculateNights(dates.checkIn, dates.checkOut);
            el.textContent = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
        });
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCompare,
        toggleSave,
        showToast,
        formatCurrency,
        formatDate,
        calculateNights
    };
}

