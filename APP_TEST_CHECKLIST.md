# AWARE App Functionality Test Checklist

## Pre-Test Setup
1. ✅ Create `.env.local` with your Stripe keys
2. ✅ Run `npm run dev`
3. ✅ Open `http://localhost:3000`

## Core Navigation Test
- [ ] **Home Page**: Loads with hero section, problem/solution sections
- [ ] **Header Navigation**: All links work (Labs, Stories, About)
- [ ] **Mobile Menu**: Toggle works, all links accessible
- [ ] **Footer**: All links work (About, Privacy, Terms, Contact)

## Labs Section Test
- [ ] **Labs List** (`/labs`): Shows lab cards with progress bars
- [ ] **Search**: Type in search box, results filter correctly
- [ ] **Lab Detail** (`/labs/neuro-lab`): 
  - [ ] Shows lab info, milestones, team, budget
  - [ ] Tabs work (About, Updates, Milestones, Team)
  - [ ] "Donate Now" button works
- [ ] **Lab Detail** (`/labs/cancer-research`): Same tests as above

## Donation Flow Test
- [ ] **Donation Form** (`/donate/neuro-lab`):
  - [ ] Amount selection works ($10, $25, $50, Custom)
  - [ ] Custom amount input works
  - [ ] Milestone selection works (optional)
  - [ ] Note field works
  - [ ] "Continue to Payment" button works
- [ ] **Review Step**:
  - [ ] Shows correct amount, lab, milestone, note
  - [ ] "Back" button works
  - [ ] "Confirm & Continue to Stripe" button works
- [ ] **Stripe Integration**:
  - [ ] Redirects to Stripe Checkout
  - [ ] Use test card: `4242 4242 4242 4242`
  - [ ] Complete payment
  - [ ] Returns to success page
  - [ ] Test cancel flow

## Other Pages Test
- [ ] **About Page** (`/about`): Loads with mission, values, team
- [ ] **Contact Page** (`/contact`): Form works, shows success message
- [ ] **Feed Page** (`/feed`): Posts load, like buttons work
- [ ] **Privacy Page** (`/privacy`): Content loads
- [ ] **Terms Page** (`/terms`): Content loads

## Error Handling Test
- [ ] **Invalid Donation**: Try $0 amount, should show error
- [ ] **Network Error**: Disconnect internet, try donation
- [ ] **Missing Stripe Keys**: Remove keys, should show error

## Mobile Responsiveness Test
- [ ] **Mobile Navigation**: Menu toggles correctly
- [ ] **Lab Cards**: Stack properly on mobile
- [ ] **Donation Form**: All fields accessible on mobile
- [ ] **Stripe Checkout**: Works on mobile

## SEO Test
- [ ] **Page Titles**: Each page has unique, descriptive title
- [ ] **Meta Descriptions**: Each page has description
- [ ] **Sitemap**: Visit `/sitemap.xml` - should work
- [ ] **Robots**: Visit `/robots.txt` - should work

## Performance Test
- [ ] **Page Load Speed**: All pages load quickly
- [ ] **Images**: Lab images load (or show placeholder gracefully)
- [ ] **No Console Errors**: Check browser console for errors

## Stripe Test Cards
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)

## Expected Results
✅ All navigation works smoothly
✅ Donation flow redirects to Stripe and returns successfully
✅ All pages load with proper content
✅ Mobile experience is functional
✅ No critical errors in console
✅ SEO metadata is present

## If Something Fails
1. Check browser console for errors
2. Verify `.env.local` file exists and has correct keys
3. Restart dev server after adding environment variables
4. Check that all required dependencies are installed (`npm install`)


