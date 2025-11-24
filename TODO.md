# Point of Sale App - Feature Roadmap

## Future Features

### 🔲 QR Codes for Payments
- [x] Research and choose QR code format (Czech QR platba/SPAYD, EPC QR, etc.)
- [x] Implement QR code generation library
- [x] Add payment configuration (bank account, IBAN, etc.)
- [x] Display QR code in POS view (modal or fixed display)
- [x] Include order number as variable symbol
- [x] Test QR code scanning with banking apps

### 🔲 Czech Language and Currency Consistency
- [x] Review all text strings in the app for Czech language
- [x] Ensure all user-facing text is in Czech
- [x] Verify all currency values are in Czech Crown (CZK)
- [x] Check formatting of prices (e.g., "100,-" format)
- [x] Fix any remaining English text or placeholders

### 🔲 Deployment via Netlify
- [x] Create Netlify account
- [x] Configure build settings for Vite/React
- [ ] Set up continuous deployment from Git repository
- [ ] Configure custom domain (if needed)
- [ ] Set up environment variables
- [ ] Test deployment and production build
- [ ] Configure PWA settings for mobile use

### 🔲 Database Integration
- [ ] Choose database solution (Firebase, Supabase, or custom backend)
- [ ] Design database schema for:
  - [ ] Orders (persistent storage)
  - [ ] Products (centralized management)
  - [ ] Statistics/Analytics
  - [ ] Order history
- [ ] Implement authentication (if multi-user)
- [ ] Migrate from localStorage to database
- [ ] Add sync functionality
- [ ] Handle offline mode / sync conflicts
- [ ] Add data backup/export functionality

### 🔲 Simple Security
- [ ] Implement basic access control/PIN protection
- [ ] Add password/PIN to access admin features
- [ ] Protect sensitive operations (delete orders, edit completed orders)
- [ ] Optional: Add session timeout/auto-lock
- [ ] Secure statistics view
- [ ] Consider device-specific authentication
- [ ] Add option to enable/disable security features

---

## Nice-to-Have Features

- [ ] Advanced statistics and reporting

---

_Last updated: 2025-11-23_
