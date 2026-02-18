# Itinera – testRigor Test Plan & Test Cases

**App:** Itinera (travel/stays/itinerary – static HTML + JS, no backend)  
**Scope:** All pages, navigation, forms, modals, and client-side behavior (localStorage, toasts, validation).

---

## Codebase discovery summary

- **Entry point:** `index.html` (Discover home). No SPA router; multi-page app with direct navigation to `.html` files.
- **Navigation:** Bottom nav (Discover, Stays, Trips, Map, Budget, Profile); header search pill and profile icon; back buttons; inline links (e.g. See all, View Plan, Compare).
- **Key flows:** Browse → Search → Results → Stay detail → Room selection → Booking summary → Checkout → Confirmation; My Trips → View Plan → Trip planner; Compare stays; Profile/Settings; Rewards; Budget; Map explorer.
- **Auth:** No login page. Profile shows hardcoded user (Aariyan Verma) and a “Log Out” button (UI only). No username/password in scope.
- **Config:** Relative paths; base URL is configurable (local file or server). Search dates and compare/saved lists persist in `localStorage`.

---

## A) Test Plan Summary

### Test suites

| Suite | Purpose | Focus |
|-------|--------|--------|
| **Smoke** | Critical path | Home load, nav to all main pages, search → results, stay detail, trip list, profile, rewards, budget, map. |
| **Regression** | Broad coverage | All nav links, forms (search, trip planner add-activity, profile settings), modals (calendar, filters, sort, quick view), compare/save, booking flow steps. |
| **Negative / Edge** | Invalid inputs & boundaries | Empty/missing required fields, invalid dates (past, check-out before check-in), guest/room limits, compare limit (3), error messages and toasts. |
| **UI / Navigation** | Layout and navigation | Bottom nav active state, back button, deep links (e.g. search-results.html?destination=…), breadcrumb-style flows. |
| **Forms / Validation** | Input and validation | Destination required, dates required, search validation messages; trip planner “Add to Itinerary” form; profile currency/language modals. |
| **Responsive-critical** | Key flows on small viewport | Same critical paths as smoke, verified on mobile viewport (e.g. 375px); bottom nav and sticky CTAs visible. |

### Coverage matrix (Pages × Features × Tests)

| Page / Route | Features | Smoke | Regression | Negative |
|--------------|----------|-------|------------|----------|
| index.html | Hero, chips, featured carousel, trending stays, rewards teaser, compare tray, nav | ✓ | ✓ | — |
| search.html | Destination, dates, guests/rooms, filters, Search Stays, Clear | ✓ | ✓ | ✓ |
| search-results.html | Results list, Filters, Sort, Map, Quick view, compare/save | ✓ | ✓ | ✓ |
| stay-detail.html | Gallery, Reserve, save/compare/share | ✓ | ✓ | — |
| stay-quick-view.html | Quick view content, View details, Select rooms | — | ✓ | — |
| room-selection.html | Dates summary, room cards, add-ons, Continue | ✓ | ✓ | ✓ |
| booking-summary.html | Price lock, summary, Continue to checkout | ✓ | ✓ | — |
| checkout.html | Stepper (Guest, Preferences, Payment, Review), Place booking | ✓ | ✓ | ✓ |
| confirmation.html | Success, voucher, View trip, Discover | ✓ | ✓ | — |
| my-trips.html | Upcoming/Past tabs, View Plan, Cancel, Export, Share | ✓ | ✓ | ✓ |
| trip-planner.html | Day tabs, add activity, Edit/Remove, Add to Itinerary sheet | ✓ | ✓ | ✓ |
| compare-stays.html | Compare grid, Remove, Clear all, Choose stay | ✓ | ✓ | ✓ |
| map-explorer.html | Map, controls, Search this area, place preview | ✓ | ✓ | — |
| budget-dashboard.html | Period, categories, Add expense | ✓ | ✓ | — |
| rewards-dashboard.html | Level, XP, missions | ✓ | ✓ | — |
| profile.html | Profile header, settings, Currency/Language modals, Clear data, Log Out | ✓ | ✓ | ✓ |

---

## App map (Page → purpose → CTAs → key UI text)

| Page | Purpose | Primary CTAs | Key UI text for locators |
|------|--------|--------------|---------------------------|
| index.html | Discover home | Search pill, Profile, See all, View all, chip buttons (Trending, Beaches, …), Featured cards, Quick view, View Rewards Dashboard, Compare (tray) | "Itinera", "Where to?", "Where will your next adventure take you?", "Featured Destinations", "Trending Stays", "View Rewards Dashboard", "Discover", "Stays", "Trips", "Map", "Budget", "Profile" |
| search.html | Search stays | Back, Clear, Check-in/Check-out (opens calendar), Search Stays | "Search Stays", "Where are you going?", "When are you traveling?", "Who's traveling?", "Search destinations, cities, landmarks...", "Add date", "Adults", "Clear", "Search Stays", "Apply Dates", "Select Dates", "More Filters" |
| search-results.html | Results list | Search summary pill, Filters, Sort, Map, Quick view, Load more | "Paris, France" (or destination), "Filters", "Sort", "Map", "stays in", "Quick view", "Load more results", "Close", "Reset", "Show 342 stays", "Sort by", "Recommended" |
| stay-detail.html | Stay details | Back, Share, Save, Compare, Reserve, View all photos | "Ocean View Villa with Private Pool", "Malibu, California", "Reserve", "View all photos" |
| stay-quick-view.html | Quick view modal/sheet | Close, View details, Select rooms | "View details", "Select rooms" |
| room-selection.html | Select rooms & add-ons | Back, Change dates, Continue to summary | "Select Rooms & Add-ons", "Available Rooms", "Continue to summary", "Change dates" |
| booking-summary.html | Booking summary | Back, Help, Continue to checkout | "Booking Summary", "Step 3 of 4", "Price locked", "Continue to checkout" |
| checkout.html | Secure checkout | Back, Help, step navigation, Place booking | "Secure Checkout", "Step", "of 4", "Guest", "Preferences", "Payment", "Review", "Place booking" |
| confirmation.html | Booking confirmed | View trip, Discover more | "Booking Confirmed", "You're all set!", "View trip", "Discover more" |
| my-trips.html | My trips | Filter, Profile, Upcoming/Past tabs, View Plan, Booking, Export, Share, Cancel | "My Trips", "Upcoming", "Past", "View Plan", "Export", "Share", "Cancel", "Discover Destinations" (empty state) |
| trip-planner.html | Trip itinerary | Back, Add (+), day tabs, Add Morning/Afternoon/Evening Activity, Edit, Remove, Add to Itinerary sheet, Save | "Tokyo Adventure 2024", "Day 1", "Add to Itinerary", "Add Morning Activity", "Edit", "Remove", "Add to Itinerary", "Save" (in sheet) |
| compare-stays.html | Compare stays | Back, Clear all, Remove (per stay), Choose stay, Back to results | "Compare Stays", "Clear all", "Choose stay", "No Stays to Compare", "Back to results" |
| map-explorer.html | Map view | Back, Layers, Location, Zoom, Saved, Itinerary, Categories, Search this area | "Map Explorer", "Search this area", "Saved", "Itinerary" |
| budget-dashboard.html | Budget | Export, period buttons, Details, Add expense FAB | "Budget Dashboard", "This Month", "Add expense" |
| rewards-dashboard.html | Rewards | Back, View All | "Rewards", "Level", "XP", "Missions" |
| profile.html | Profile & settings | Back, Help, Theme, Currency, Language, Notifications, Clear Local Data, Log Out | "Profile & Settings", "Log Out", "Clear Local Data", "Select Currency", "Select Language", "Yes, Clear All Data", "Cancel" |

---

## B) Reusable Rules (testRigor)

Use these as **Rules** in testRigor; reference them with **use rule "Rule Name"**.

### Rule: Navigate to Home
- open URL from string with parameters "${baseUrl}/index.html"
- check that page contains "Itinera"
- check that page contains "Discover"

### Rule: Navigate to Search
- open URL from string with parameters "${baseUrl}/search.html"
- check that page contains "Search Stays"
- check that page contains "Where are you going?"

### Rule: Navigate to My Trips
- open URL from string with parameters "${baseUrl}/my-trips.html"
- check that page contains "My Trips"

### Rule: Navigate to Profile
- open URL from string with parameters "${baseUrl}/profile.html"
- check that page contains "Profile & Settings"

### Rule: Search with valid criteria (use after Navigate to Search)
- enter "${destination}" into "Search destinations, cities, landmarks..."
- click "Check-in"
- wait for 2 seconds
- click "Apply Dates" (if calendar is open and dates already selected, otherwise select two dates then click Apply Dates)
- click "Search Stays"
- check that page contains "stays in" or "stays in ${destination}"

*Note: If calendar requires explicit date selection, add steps: click a future date for check-in, then click a later date for check-out, then click "Apply Dates".*

### Rule: Open Trip Planner from My Trips
- use rule "Navigate to My Trips"
- click "View Plan" below the text "Santorini Escape" or "Tokyo Adventure"
- check that page contains "Day 1" or "Mar 15" or "Tokyo Adventure"

### Rule: Add one activity to itinerary (from Trip Planner)
- use rule "Open Trip Planner from My Trips"
- click the button with "+" in the header (Add item) or click "Add Morning Activity"
- wait for 2 seconds
- enter "Test Activity" into "Activity Name" or into field with placeholder "e.g. Visit Fushimi Inari Shrine"
- click "Add to Itinerary" (the primary button in the sheet)
- check that page contains "Added to itinerary" or "Trip Completeness"

### Rule: Save / wishlist a stay (from Home or Results)
- open URL from string with parameters "${baseUrl}/index.html"
- click the first "Quick view" or click the first featured card (e.g. "Santorini, Greece")
- on the stay card or detail page click the save/heart button (if present and not already saved)
- check that page contains "Saved to wishlist" or that the heart icon is filled

### Rule: Add stays to compare (from Home or Results)
- open URL from string with parameters "${baseUrl}/index.html"
- click the compare button (code-compare icon) on the first Ocean View Villa or first stay card
- check that page contains "Compare Stays" or "1/3 selected" or "Added to compare"
- click "Compare" in the compare tray (if visible)
- check that page contains "Compare Stays" or "Choose stay"

### Rule: Delete / Cleanup compare list
- open URL from string with parameters "${baseUrl}/compare-stays.html"
- if page contains "Clear all" then click "Clear all"
- if page contains "No Stays to Compare" then skip
- check that page contains "No Stays to Compare" or "Compare Stays"

### Rule: Logout (UI only – no login exists)
- use rule "Navigate to Profile"
- scroll to "Log Out"
- click "Log Out"
- check that page contains "Itinera" or "Discover" (user returns to home or previous page depending on app behavior)

*Note: There is no login in the app. "Log Out" is a UI action only; no credentials.*

### Rule: Clear search form
- use rule "Navigate to Search"
- click "Clear"
- check that page contains "Add date" and that destination field is empty

---

## C) Test Data / Variables (testRigor)

Create these **Global Variables** (or suite variables) in testRigor:

| Variable name | Example value | Usage |
|---------------|---------------|--------|
| baseUrl | `http://localhost:8080` or `file:///C:/path/to/Final Project` | Prepend to all open URL steps, e.g. `${baseUrl}/index.html`. |
| destination | Paris | Search destination text; also used in assertions (e.g. "stays in Paris"). |
| destination2 | Tokyo | Second destination for multi-search or comparison. |
| startDate | (optional) | If you drive dates via API or hidden fields; otherwise use UI calendar. |
| endDate | (optional) | Same as above. |

**Reference in steps:**
- `open URL from string with parameters "${baseUrl}/search.html"`
- `enter "${destination}" into "Search destinations, cities, landmarks..."`
- `check that page contains "stays in ${destination}"`

**Note:** No `username`/`password` variables—app has no login.

---

## D) Test Cases (ready for testRigor)

Format: one testRigor step per line; each test ends with a validation step.

---

### Smoke tests (10–15)

**SMOKE_01 – Home loads and shows main sections**
- Description: Verify the Discover home page loads and displays hero, destinations, and trending.
- Preconditions: baseUrl is set.
- Test Data: baseUrl.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - check that page contains "Itinera"
  - check that page contains "Where will your next adventure take you?"
  - check that page contains "Featured Destinations"
  - check that page contains "Trending Stays"
- Validations:
  - check that page contains "Trending Stays"

**SMOKE_02 – Bottom nav: Discover**
- Description: Home opens and Discover is visible and active.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - check that page contains "Discover"
  - check that page contains "Stays"
- Validations:
  - check that page contains "Discover"

**SMOKE_03 – Bottom nav: Stays (Search)**
- Description: Navigate to Search via bottom nav.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click "Stays"
  - check that page contains "Search Stays"
  - check that page contains "Where are you going?"
- Validations:
  - check that url contains "search.html"

**SMOKE_04 – Bottom nav: Trips**
- Description: Navigate to My Trips via bottom nav.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click "Trips"
  - check that page contains "My Trips"
- Validations:
  - check that url contains "my-trips.html"

**SMOKE_05 – Bottom nav: Map**
- Description: Navigate to Map Explorer via bottom nav.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click "Map"
  - check that page contains "Map" or "Map Explorer"
- Validations:
  - check that url contains "map-explorer.html"

**SMOKE_06 – Bottom nav: Budget**
- Description: Navigate to Budget Dashboard via bottom nav.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click "Budget"
  - check that page contains "Budget"
- Validations:
  - check that url contains "budget-dashboard.html"

**SMOKE_07 – Bottom nav: Profile**
- Description: Navigate to Profile via bottom nav.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click "Profile"
  - check that page contains "Profile & Settings"
- Validations:
  - check that url contains "profile.html"

**SMOKE_08 – Search to results (valid destination + dates)**
- Description: Enter destination, select dates, submit search and reach results.
- Preconditions: baseUrl set; destination = Paris (or any valid label).
- Test Data: baseUrl, destination.
- Steps:
  - open URL from string with parameters "${baseUrl}/search.html"
  - enter "${destination}" into "Search destinations, cities, landmarks..."
  - click "Check-in"
  - wait for 2 seconds
  - click a date that shows in the calendar (e.g. "15" or "20")
  - click a later date in the calendar (e.g. "22" or "27")
  - click "Apply Dates"
  - click "Search Stays"
  - wait for 3 seconds
  - check that page contains "stays in" or "stays"
- Validations:
  - check that url contains "search-results.html"

**SMOKE_09 – Results to stay detail**
- Description: From search results open a stay and land on stay detail.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/search-results.html"
  - click the first "Quick view" or click the first stay card title (e.g. "Elegant Apartment Near Eiffel Tower")
  - check that page contains "Elegant Apartment" or "Ocean View Villa" or "Reserve"
- Validations:
  - check that page contains "Reserve" or "per night"

**SMOKE_10 – My Trips: View Plan**
- Description: Open My Trips and open a trip plan.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/my-trips.html"
  - check that page contains "View Plan"
  - click "View Plan"
  - check that page contains "Day 1" or "Trip Completeness" or "Morning"
- Validations:
  - check that url contains "trip-planner.html"

**SMOKE_11 – Rewards dashboard**
- Description: Open Rewards from home.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click "View Rewards Dashboard"
  - check that page contains "Rewards" or "Level" or "XP"
- Validations:
  - check that url contains "rewards-dashboard.html"

**SMOKE_12 – Profile: open and see sections**
- Description: Profile page shows account and settings.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/profile.html"
  - check that page contains "Profile & Settings"
  - check that page contains "Account" or "Personal Information"
  - check that page contains "Log Out"
- Validations:
  - check that page contains "Log Out"

**SMOKE_13 – Compare flow: add and open Compare**
- Description: From home add a stay to compare and open Compare page.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click the compare icon on the first featured card (or click "Compare" if tray is visible after adding)
  - wait for 1 second
  - click "Compare" in the bottom tray
  - check that page contains "Compare Stays" or "Choose stay"
- Validations:
  - check that url contains "compare-stays.html"

**SMOKE_14 – Booking flow: Stay detail → Room selection**
- Description: From stay detail go to room selection.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/stay-detail.html"
  - scroll to "Reserve"
  - click "Reserve"
  - check that page contains "Select Rooms" or "Continue to summary"
- Validations:
  - check that url contains "room-selection.html" or "booking-summary.html"

**SMOKE_15 – Confirmation page**
- Description: Confirmation page shows success.
- Preconditions: baseUrl set.
- Steps:
  - open URL from string with parameters "${baseUrl}/confirmation.html"
  - check that page contains "Booking Confirmed" or "You're all set!"
- Validations:
  - check that page contains "Booking Confirmed" or "You're all set!"

---

### Regression tests (20–40)

**REG_01 – Header search pill goes to Search**
- open URL from string with parameters "${baseUrl}/index.html"
- click "Where to?"
- check that page contains "Search Stays"
- check that url contains "search.html"

**REG_02 – Profile icon goes to Profile**
- open URL from string with parameters "${baseUrl}/index.html"
- click the profile image or the profile icon in header
- check that page contains "Profile & Settings"
- check that url contains "profile.html"

**REG_03 – Featured “See all”**
- open URL from string with parameters "${baseUrl}/index.html"
- click "See all" next to "Featured Destinations"
- check that page contains "stays" or "Paris" or destination
- check that url contains "search-results"

**REG_04 – Trending “View all”**
- open URL from string with parameters "${baseUrl}/index.html"
- click "View all" in Trending Stays
- check that url contains "search-results"

**REG_05 – Destination chips (Trending selected)**
- open URL from string with parameters "${baseUrl}/index.html"
- click "Trending"
- check that page contains "Featured Destinations"

**REG_06 – Featured card opens results by destination**
- open URL from string with parameters "${baseUrl}/index.html"
- click "Santorini, Greece" card (or the first featured card)
- check that url contains "search-results.html"
- check that page contains "Santorini" or "stays"

**REG_07 – Search: Clear resets form**
- open URL from string with parameters "${baseUrl}/search.html"
- enter "Paris" into "Search destinations, cities, landmarks..."
- click "Clear"
- check that page contains "Add date"
- check that "Search destinations, cities, landmarks..." field is empty or placeholder visible

**REG_08 – Search: Recent search click fills destination**
- open URL from string with parameters "${baseUrl}/search.html"
- click "Paris, France" in Recent Searches section (if present)
- check that "Paris, France" appears in the destination field or page shows Paris

**REG_09 – Search: More Filters expand**
- open URL from string with parameters "${baseUrl}/search.html"
- click "More Filters"
- check that page contains "Property Type" or "Bedrooms" or "Amenities"

**REG_10 – Search: Price chip selection**
- open URL from string with parameters "${baseUrl}/search.html"
- click "$100 - $250" (or "Under $100")
- check that page contains "Search Stays"

**REG_11 – Search: Rating 4.0+ toggle**
- open URL from string with parameters "${baseUrl}/search.html"
- click the toggle next to "Rating 4.0+"
- check that page contains "Filter" or "Rating"

**REG_12 – Search: Guests Adults plus/minus**
- open URL from string with parameters "${baseUrl}/search.html"
- click the plus button next to "Adults"
- check that the adults count increases or is at least 2
- click the minus button next to "Adults"
- check that page contains "Adults" or "Who's traveling?"

**REG_13 – Results: Filters drawer open and close**
- open URL from string with parameters "${baseUrl}/search-results.html"
- click "Filters"
- check that page contains "Price Range" or "Property Type"
- click "Close" or "Reset"
- check that page contains "Filters" or "Sort"

**REG_14 – Results: Sort sheet**
- open URL from string with parameters "${baseUrl}/search-results.html"
- click "Sort"
- check that page contains "Sort by" or "Recommended" or "Price: Low to High"
- click "Close"
- check that page contains "Filters"

**REG_15 – Results: Map button**
- open URL from string with parameters "${baseUrl}/search-results.html"
- click "Map"
- check that page contains "Map View" or "Interactive map"

**REG_16 – Results: Quick view sheet**
- open URL from string with parameters "${baseUrl}/search-results.html"
- click the first "Quick view"
- check that page contains "View details" or "Select rooms" or "Elegant Apartment"
- click close on quick view (X or overlay)
- check that page contains "Load more" or "stays in"

**REG_17 – Results: Load more**
- open URL from string with parameters "${baseUrl}/search-results.html"
- scroll to bottom
- click "Load more results"
- check that page contains "stays" or listing cards

**REG_18 – Stay detail: Back**
- open URL from string with parameters "${baseUrl}/stay-detail.html"
- click the back button (arrow)
- check that url does not contain "stay-detail" or page contains "Discover" or "stays"

**REG_19 – Stay detail: View all photos**
- open URL from string with parameters "${baseUrl}/stay-detail.html"
- click "View all photos"
- check that page contains "photos" or gallery or close button

**REG_20 – Trip planner: Day tab switch**
- open URL from string with parameters "${baseUrl}/trip-planner.html"
- click "Day 2"
- check that page contains "Day 2" or "Mar 16"

**REG_21 – Trip planner: Add activity sheet open**
- open URL from string with parameters "${baseUrl}/trip-planner.html"
- click "Add Morning Activity" or the "+" in header
- check that page contains "Add to Itinerary" and "Activity Name" or "Category"

**REG_22 – Trip planner: Add to Itinerary submit**
- open URL from string with parameters "${baseUrl}/trip-planner.html"
- click "Add Morning Activity" or "+"
- enter "Test Museum Visit" into the activity name field (placeholder "e.g. Visit Fushimi Inari Shrine")
- click "Add to Itinerary" (primary button in sheet)
- check that page contains "Added to itinerary" or "Trip Completeness" or "72%"

**REG_23 – Trip planner: Remove activity**
- open URL from string with parameters "${baseUrl}/trip-planner.html"
- click "Remove" on the first itinerary card (e.g. Tsukiji Outer Market)
- check that page contains "Item removed" or the card disappears

**REG_24 – Trip planner: Smart suggestions “Add to Itinerary”**
- open URL from string with parameters "${baseUrl}/trip-planner.html"
- scroll to "Smart Suggestions"
- click "Add to Itinerary" on first suggestion (e.g. Meiji Shrine)
- check that "Add to Itinerary" sheet opens or "Activity details prefilled" appears

**REG_25 – My Trips: Past tab**
- open URL from string with parameters "${baseUrl}/my-trips.html"
- click "Past"
- check that page contains "Completed" or "Paris City Break" or "Past"

**REG_26 – My Trips: Export button**
- open URL from string with parameters "${baseUrl}/my-trips.html"
- click "Export" on first trip card
- check that page contains "My Trips" or "Export"

**REG_27 – Compare: Clear all**
- open URL from string with parameters "${baseUrl}/compare-stays.html"
- if page contains "Clear all" then click "Clear all"
- check that page contains "No Stays to Compare" or "Compare Stays"

**REG_28 – Compare: Choose stay**
- open URL from string with parameters "${baseUrl}/compare-stays.html"
- if page contains "Choose stay" then click "Choose stay"
- check that url contains "stay-detail" or "search-results" or page shows a stay

**REG_29 – Profile: Theme toggle**
- open URL from string with parameters "${baseUrl}/profile.html"
- click the Theme toggle (light/dark)
- check that page contains "Dark mode" or "Light mode" or "Theme"

**REG_30 – Profile: Currency modal**
- open URL from string with parameters "${baseUrl}/profile.html"
- click "USD" or the currency selector button
- check that page contains "Select Currency"
- click "EUR - Euro" or another currency
- check that page contains "Currency changed" or "EUR" or "Euro"

**REG_31 – Profile: Language modal**
- open URL from string with parameters "${baseUrl}/profile.html"
- click "EN" or the language selector
- check that page contains "Select Language"
- click "Spanish" or another language
- check that page contains "Language changed" or "Spanish"

**REG_32 – Profile: Clear Local Data cancel**
- open URL from string with parameters "${baseUrl}/profile.html"
- scroll to "Clear Local Data"
- click "Clear Local Data"
- check that page contains "Clear All Data?" or "Yes, Clear All Data"
- click "Cancel"
- check that page contains "Profile & Settings"

**REG_33 – Room selection: Continue to summary**
- open URL from string with parameters "${baseUrl}/room-selection.html"
- click "Continue to summary"
- check that url contains "booking-summary" or page contains "Booking Summary"

**REG_34 – Booking summary: Continue to checkout**
- open URL from string with parameters "${baseUrl}/booking-summary.html"
- scroll to bottom
- click "Continue to checkout"
- check that url contains "checkout.html"

**REG_35 – Checkout: step labels**
- open URL from string with parameters "${baseUrl}/checkout.html"
- check that page contains "Secure Checkout" and "Guest" and "Payment" or "Review"

**REG_36 – Confirmation: View trip**
- open URL from string with parameters "${baseUrl}/confirmation.html"
- click "View trip"
- check that url contains "my-trips" or "trip-planner" or page contains "My Trips"

**REG_37 – Map explorer: Search this area**
- open URL from string with parameters "${baseUrl}/map-explorer.html"
- check that page contains "Map" or "Search this area"
- click "Search this area"
- check that page contains "Map" or "Search"

**REG_38 – Budget: Period buttons**
- open URL from string with parameters "${baseUrl}/budget-dashboard.html"
- click "This Month" or "Week"
- check that page contains "Budget" or "Add expense"

**REG_39 – Rewards: page content**
- open URL from string with parameters "${baseUrl}/rewards-dashboard.html"
- check that page contains "Level" or "XP" or "Missions" or "Rewards"

**REG_40 – Back button from Search**
- open URL from string with parameters "${baseUrl}/search.html"
- click the back button (arrow)
- check that url contains "index.html" or page contains "Discover"

---

### Negative / Edge tests (10–20)

**NEG_01 – Search: Empty destination**
- Description: Submit search without destination shows error.
- Steps:
  - open URL from string with parameters "${baseUrl}/search.html"
  - leave "Search destinations, cities, landmarks..." empty
  - click "Check-in"
  - wait for 1 second
  - click a future date
  - click a later date
  - click "Apply Dates"
  - click "Search Stays"
  - check that page contains "Please enter a destination" or "Please complete all required fields"
- Validations:
  - check that page contains "Please enter a destination" or "Please complete all required fields"

**NEG_02 – Search: No dates**
- Description: Submit search without dates shows error.
- Steps:
  - open URL from string with parameters "${baseUrl}/search.html"
  - enter "Paris" into "Search destinations, cities, landmarks..."
  - do not open calendar or select dates
  - click "Search Stays"
  - check that page contains "Please select valid dates" or "Please complete all required fields"
- Validations:
  - check that page contains "Please select valid dates" or "Please complete all required fields"

**NEG_03 – Search: Apply dates without both selected**
- Description: In calendar, Apply with only check-in shows message.
- Steps:
  - open URL from string with parameters "${baseUrl}/search.html"
  - click "Check-in"
  - wait for 2 seconds
  - click one date only (check-in)
  - click "Apply Dates"
  - check that page contains "Please select both" or "Select check-out" or toast/error
- Validations:
  - check that page contains "Please select both" or "check-out" or "Select"

**NEG_04 – Search: Adults minimum 1**
- Description: Adults cannot go below 1.
- Steps:
  - open URL from string with parameters "${baseUrl}/search.html"
  - click the minus button for Adults repeatedly until disabled
  - check that the adults count is 1 or the minus button is disabled
- Validations:
  - check that page contains "Adults" and count is at least 1

**NEG_05 – Search: Rooms minimum 1**
- Description: Rooms cannot go below 1.
- Steps:
  - open URL from string with parameters "${baseUrl}/search.html"
  - click the minus button for Rooms until disabled
  - check that rooms count is 1
- Validations:
  - check that page contains "Rooms" and count is 1

**NEG_06 – Compare: Max 3 stays**
- Description: Adding more than 3 stays to compare shows limit message (if test starts from empty compare).
- Preconditions: Clear compare list first or use clean session.
- Steps:
  - open URL from string with parameters "${baseUrl}/index.html"
  - click compare on first featured card
  - click compare on second featured card
  - click compare on third featured card
  - click compare on fourth featured card (if visible)
  - check that page contains "only compare up to 3" or "Compare limit reached" or "3/3 selected"
- Validations:
  - check that page contains "3" and "compare" or "Compare limit"

**NEG_07 – Trip planner: Add activity with empty name (optional)**
- Description: Submit Add to Itinerary with empty activity name if validation exists.
- Steps:
  - open URL from string with parameters "${baseUrl}/trip-planner.html"
  - click "Add Morning Activity" or "+"
  - leave Activity Name empty
  - click "Add to Itinerary"
  - check that page contains "Activity Name" or "Added" or sheet still open
- Validations:
  - check that page contains "Add to Itinerary" or "Activity" or "Added"

**NEG_08 – Profile: Clear data confirmation**
- Description: Clear Local Data shows confirmation; cancel keeps data.
- Steps:
  - open URL from string with parameters "${baseUrl}/profile.html"
  - click "Clear Local Data"
  - check that page contains "Clear All Data?" or "Yes, Clear All Data"
  - click "Cancel"
  - check that page contains "Profile & Settings"
- Validations:
  - check that page contains "Profile & Settings"

**NEG_09 – Invalid URL / 404 handling (if server returns 404)**
- Description: Non-existent page behavior (optional; depends on hosting).
- Steps:
  - open URL from string with parameters "${baseUrl}/nonexistent.html"
  - check that page contains "404" or "Not Found" or that url still contains "nonexistent"
- Validations:
  - check that page contains "404" or "Not Found" or url contains "nonexistent"

**NEG_10 – Results: Close Filters without applying**
- Description: Open Filters then close; results unchanged.
- Steps:
  - open URL from string with parameters "${baseUrl}/search-results.html"
  - click "Filters"
  - check that page contains "Price Range" or "Property Type"
  - click "Close"
  - check that page contains "Filters" and "Sort"
- Validations:
  - check that page contains "Filters"

**NEG_11 – Search: Destination dropdown close on outside click**
- open URL from string with parameters "${baseUrl}/search.html"
- enter "Par" into "Search destinations, cities, landmarks..."
- check that dropdown or "Recent Searches" appears
- click somewhere else on the page (e.g. "When are you traveling?")
- check that page contains "Search Stays" or "Where are you going?"

**NEG_12 – My Trips: Cancel trip – keep trip**
- open URL from string with parameters "${baseUrl}/my-trips.html"
- click "Cancel" on first trip card
- check that page contains "Cancel Trip?" or "Yes, Cancel Trip"
- click "Keep Trip"
- check that page contains "My Trips" and "View Plan"

**NEG_13 – Past trip: Rebook**
- open URL from string with parameters "${baseUrl}/my-trips.html"
- click "Past"
- click "Rebook" on first past trip (if present)
- check that page contains "Search" or "Discover" or url changes

**NEG_14 – Empty compare: Back to results**
- open URL from string with parameters "${baseUrl}/compare-stays.html"
- if page contains "No Stays to Compare" then click "Back to results"
- check that url contains "search-results" or "index" or page contains "stays"

**NEG_15 – Profile: Log Out**
- open URL from string with parameters "${baseUrl}/profile.html"
- scroll to "Log Out"
- click "Log Out"
- check that page contains "Itinera" or "Discover" or url is index or profile

**NEG_16 – Stay detail: Reserve without dates (if applicable)**
- open URL from string with parameters "${baseUrl}/stay-detail.html"
- click "Reserve"
- if room-selection or booking-summary loads, check that page shows dates or "Change dates"
- check that page contains "Continue" or "Select Rooms" or "Booking"

**NEG_17 – Currency modal: Close without change**
- open URL from string with parameters "${baseUrl}/profile.html"
- click currency selector (e.g. "USD")
- check that page contains "Select Currency"
- click the X or close button
- check that page contains "Profile & Settings" and "USD"

**NEG_18 – Language modal: Close without change**
- open URL from string with parameters "${baseUrl}/profile.html"
- click language selector (e.g. "EN")
- check that page contains "Select Language"
- click close
- check that page contains "Profile & Settings"

**NEG_19 – Search: Special characters in destination**
- open URL from string with parameters "${baseUrl}/search.html"
- enter "<script>alert(1)</script>" into "Search destinations, cities, landmarks..."
- click "Search Stays" (with or without dates)
- check that page does not execute script and shows error or results or "stays"

**NEG_20 – Very long destination string**
- open URL from string with parameters "${baseUrl}/search.html"
- enter "AAAAAAAAAA..." (e.g. 500 chars) into destination field
- click "Search Stays" (with dates if required)
- check that page does not crash and shows validation or results or error

---

## E) Locator hardening recommendations

Minimal HTML changes to improve test stability (prefer visible text and labels).

| File | Element / area | Recommendation |
|------|------------------|----------------|
| index.html | Search pill (icon + "Where to?") | Add `aria-label="Open search"` on the button; keep "Where to?" as visible text. |
| index.html | Profile icon (image/avatar) | Add `aria-label="Profile"` on `#profile-icon` or the button wrapping the image. |
| index.html | Featured / stay cards “heart” (save) | Add `aria-label="Save to wishlist"` on each `.save-btn`. |
| index.html | Compare icon (fa-code-compare) | Add `aria-label="Add to compare"` on each `.compare-btn`. |
| index.html | Bottom nav items | Ensure each nav button has a unique label (Discover, Stays, Trips, Map, Budget, Profile); add `aria-label` if only icon + span. |
| search.html | Check-in / Check-out buttons | Add `id="check-in-btn"` and `id="check-out-btn"` (already present); add `aria-label="Select check-in date"` and `aria-label="Select check-out date"`. |
| search.html | Search Stays (sticky CTA) | Add `id="search-stays-btn"` (already present) and ensure visible text "Search Stays". |
| search.html | Clear button | Keep visible text "Clear"; add `aria-label="Clear search form"` if desired. |
| search-results.html | Filters / Sort / Map | Keep visible text "Filters", "Sort", "Map"; add `data-testid="filter-btn"` etc. for fallback. |
| search-results.html | Multiple "Quick view" buttons | Add `aria-label="Quick view [stay name]"` using the card title so each is unique. |
| stay-detail.html | Reserve button | Keep visible "Reserve" text; add `data-testid="reserve-btn"` or `aria-label="Reserve this stay"`. |
| stay-detail.html | Share / Save / Compare (icon only) | Add `aria-label="Share"`, `aria-label="Save to wishlist"`, `aria-label="Add to compare"` on respective buttons. |
| my-trips.html | Multiple "View Plan" / "Export" / "Cancel" | Wrap each in a container with trip name; or add `aria-label="View Plan Santorini Escape"` etc. so labels are unique per trip. |
| trip-planner.html | Add item (+) button | Add `aria-label="Add activity to itinerary"` on `#add-item-btn`. |
| trip-planner.html | Edit / Remove (many per page) | Prefer "Edit [activity name]" / "Remove [activity name]" in aria-label; or ensure first Edit/Remove is locatable by preceding heading (e.g. "Tsukiji Outer Market"). |
| profile.html | Theme / Currency / Language toggles | Add `aria-label="Theme toggle"`, `aria-label="Currency selector"`, `aria-label="Language selector"` on the control buttons. |
| profile.html | Log Out | Keep text "Log Out"; add `id="logout-btn"` (already present) and `aria-label="Log out"`. |
| compare-stays.html | Remove stay (X) per card | Add `aria-label="Remove from compare"` on each `.remove-stay-btn`. |
| Global (all pages) | Back button | Add `aria-label="Go back"` on `#back-btn` or back arrow buttons. |

**General**
- Prefer **visible labels** (e.g. "Search Stays", "Apply Dates", "Clear") for testRigor steps.
- Use **unique button text** where there are multiple similar actions (e.g. "View Plan" for Santorini vs Tokyo).
- Add **data-testid** only where necessary (e.g. `data-testid="search-stays-submit"`) for critical CTAs that may change copy.
- Keep **placeholders** consistent (e.g. "Search destinations, cities, landmarks...") so `enter into "placeholder text"` works.

---

**End of document.** Paste sections B–D into testRigor as Rules and Test Cases; configure variables per section C; apply E in the codebase for stable locators.
