# Milaap - User Guide

Welcome to **Milaap**, a comprehensive matrimonial platform designed to help you find your perfect match. This guide walks you through all the features and how to use them effectively.

---

## Table of Contents

- [Customer Guide](#customer-guide)
- [Admin Guide](#admin-guide)

---

# Customer Guide

This section provides step-by-step instructions for all customer features.

## 1. Registration

**Navigation Path**: `/register`

### How to Register

1. Visit the **Milaap** website and click on the **"Sign Up"** or **"Register"** button on the home page.
2. Fill in the following information:
   - **Email Address**: Enter a valid email address
   - **Password**: Create a strong password (minimum 8 characters)
   - **Confirm Password**: Re-enter your password
   - **Full Name**: Enter your full name
   - **Gender**: Select your gender (Male/Female)
   - **Date of Birth**: Select your date of birth
3. Click the **"Register"** button to create your account.
4. An activation link will be sent to your email address.
5. Click the activation link in the email to verify and activate your email address.
6. After email verification, your profile will be **submitted for admin review**.

### Profile Approval Process

After you click the activation link, your profile status becomes **"Pending Admin Approval"**:

1. **Submitted for Verification**: Your profile is now in a queue for manual verification by our admin team.
2. **Admin Review**: Our admins will manually verify your profile information, photos, and documents to ensure compliance with our community guidelines.
3. **Admin Decision**:
   - ✅ **Approved**: Your profile is activated and you can immediately start using all features of the platform.
   - ❌ **Rejected**: You'll receive an email explaining why your profile was rejected. You can then resubmit with corrections.
4. **Account Activation**: Once approved, you'll receive a confirmation email and can log in and start browsing matches.

### Important Notes

- **Approval Timeline**: Admin review typically takes **24-48 hours**.
- **Email Notification**: You'll receive an email notification once your profile is approved or rejected.
- **Resubmission**: If rejected, you can correct the information and resubmit for review.
- **Profile Completeness**: Complete your profile with accurate information to increase approval chances.
- **Active Status**: Your account is not fully activated until admin approval.

### Testing Registration

- Use a valid email address to receive the activation link
- Try registering with an existing email to see the validation error
- Verify that the activation link works correctly
- Check that your profile status shows "Pending Admin Approval" after email activation
- Verify you receive admin approval/rejection email
- Confirm profile becomes active after admin approval

---

## 2. Login

**Navigation Path**: `/login`

### How to Log In

1. Go to the login page by clicking the **"Log In"** button on the home page.
2. Enter your **Email Address** and **Password**.
3. Click the **"Log In"** button.
4. If credentials are correct, you'll be redirected to your **Dashboard**.

### Account Status

Your ability to access the platform depends on your approval status:

- **Active**: Full access to all features. You can browse profiles, express interest, message, etc.
- **Pending Admin Approval**: Limited access. You can view your profile but cannot interact with other profiles until approved.
- **Rejected**: You cannot log in. You'll need to register again with corrected information.
- **Suspended**: Your account has been temporarily disabled. Contact support for details.
- **Blocked**: Your account has been permanently disabled due to policy violations.

### Testing Login

- Log in with valid credentials and verify you access your dashboard
- Try logging in with incorrect password to see the error message
- Log in with a pending approval account and verify limited access
- Test login with a rejected/blocked account (should show appropriate error)
- Verify the session persists when you close and reopen the browser
- Check that pending users receive approval notification when status changes

---

## 3. Forgot Password

**Navigation Path**: `/forgot-password`

### How to Reset Your Password

1. On the login page, click the **"Forgot Password?"** link.
2. Enter your registered **Email Address**.
3. Click the **"Send Reset Link"** button.
4. Check your email for a password reset link.
5. Click the link in the email.
6. Enter your **New Password** and **Confirm Password**.
7. Click the **"Reset Password"** button.
8. You can now log in with your new password.

### Testing Forgot Password

- Enter an email that doesn't exist in the system (should show appropriate error)
- Enter a registered email and verify you receive the reset link
- Use the reset link to change your password
- Try logging in with the old password (should fail)
- Log in successfully with the new password

---

## 4. View Your Profile

**Navigation Path**: `/profile`

### How to Access Your Profile

1. After logging in, click on **"Profile"** in the sidebar menu.
2. Your profile page displays your complete information including:
   - **Basic Information**: Name, gender, age, location
   - **Horoscope Details**: Rashi, Nakshatra
   - **Photos**: Your primary and gallery photos
   - **About Section**: Your bio and interests
   - **Verification Status**: Shows if your profile is verified
   - **Profile Completion**: A progress bar showing how complete your profile is

### Profile Completeness

The profile includes the following fields to fill:
- Date of Birth
- Time of Birth (for horoscope)
- Height
- Caste
- Profession
- Education
- About/Bio
- Horoscope (Rashi, Nakshatra)
- Family Information

Complete your profile to increase your visibility and match quality!

### Testing View Profile

- Log in and navigate to your profile
- Verify all your information displays correctly
- Check the profile completion percentage
- Ensure photos are displayed properly

---

## 5. Edit Your Profile

**Navigation Path**: `/profile` (Click Edit Profile Button)

### How to Edit Your Profile

1. Go to your **Profile** page.
2. Click the **"Edit Profile"** button.
3. The **Edit Profile Modal** will open with all editable fields:
   - **Basic Information**: Name, gender, date of birth
   - **Location**: City, state, country
   - **Physical Attributes**: Height, complexion, body type
   - **Professional Information**: Education, profession, income
   - **Family Information**: Father's name, mother's name, family type
   - **About Section**: Bio/description
   - **Preferences**: Age range, height range, location preferences
   - **Photos**: Upload or remove profile photos
4. Make your changes.
5. Click the **"Save"** button to save your changes.
6. Your profile has been updated!

### Testing Edit Profile

- Edit your bio and verify the changes are saved
- Upload a new profile photo
- Update your preferences
- Verify all edits are reflected on your profile page

---

## 6. View Dashboard

**Navigation Path**: `/dashboard`

### How to Use Your Dashboard

1. After logging in, you'll be on the **Dashboard** by default.
2. The dashboard displays:
   - **Quick Stats**: Number of matches, interests, visitors, favorites
   - **Recent Matches**: Cards showing recently matched profiles
   - **Quick Actions**: Links to common features
   - **Recent Activities**: Timeline of recent interactions

### Dashboard Features

- **Matches Count**: See how many profiles match your criteria
- **Visitors Section**: View profiles of people who visited you
- **Interests**: See who expressed interest in you
- **Favorite Profiles**: Quick access to profiles you've saved
- **Success Stories**: View inspiring success stories from the community

### Testing Dashboard

- Log in and verify the dashboard loads correctly
- Check that statistics are accurate
- Verify quick navigation buttons work

---

## 7. Search for Matches

**Navigation Path**: `/search`

### How to Search for Matches

1. Click on **"Search"** in the sidebar menu.
2. Apply filters to narrow down matches:
   - **Age Range**: Set minimum and maximum age
   - **Height Range**: Filter by height in cm
   - **Location**: Select preferred locations
   - **Religion/Caste**: Filter by religion and caste
   - **Education**: Select education level
   - **Profession**: Choose preferred professions
   - **Marital Status**: Single, divorced, widowed, etc.
3. Click **"Apply Filters"** to see matching profiles.
4. Browse through the results.
5. Click on any profile to view more details.

### Testing Search

- Apply various filters and verify results update
- Try combination of filters
- Search with no filters to see all matches
- Verify profile cards display correctly

---

## 8. View Matches

**Navigation Path**: `/matches`

### How to View Your Matches

1. Click on **"Matches"** in the sidebar menu.
2. This page displays profiles that match your preferences.
3. Each match card shows:
   - **Profile Photo**
   - **Basic Information**: Age, location, occupation
   - **Compatibility Score**: Percentage match based on preferences
   - **Action Buttons**: Express Interest, Add to Favorites, View Profile
4. Click **"View Profile"** to see complete details.
5. Click **"Express Interest"** to show your interest to this person.

### Match Recommendations

The system uses AI to recommend compatible matches based on:
- Your preferences
- Your profile information
- Similar interests and values
- Location compatibility

### Testing Matches

- Verify match list loads with your preferences
- Check compatibility scores
- Use action buttons to interact with matches

---

## 9. Express Interest in a Profile

**Navigation Path**: `/matches` or `/profile/:userId`

### How to Express Interest

1. Find a profile you're interested in (from Dashboard, Search, Matches, or direct profile view).
2. Click the **"Express Interest"** button on the profile.
3. A confirmation popup will appear.
4. Click **"Confirm"** to send your interest.
5. A notification will be sent to the other user.
6. The status will change to **"Interest Expressed"**.

### Interest Status

After expressing interest:
- **Pending**: Waiting for the other user's response
- **Accepted**: They accepted your interest - You can now chat!
- **Rejected**: They declined your interest
- **Already Expressed**: You've already expressed interest to this person

### Testing Express Interest

- Express interest in a profile from matches
- Verify the status changes to pending
- Check that notifications are sent
- Try expressing interest in the same profile again (should show already expressed message)

---

## 10. View Mutual Matches

**Navigation Path**: `/mutual-matches`

### How to View Mutual Matches

1. Click on **"Mutual Matches"** in the sidebar menu.
2. This page shows profiles where:
   - You've expressed interest AND they've also expressed interest in you
   - OR both of you are interested in each other
3. Mutual matches indicate high compatibility and interest level.
4. You can immediately start chatting with mutual matches.
5. Click on a profile to view details or start messaging.

### Benefits of Mutual Matches

- Higher chance of meaningful connection
- Both parties have shown interest
- Can skip the waiting period
- Ready to communicate immediately

### Testing Mutual Matches

- Create mutual interest scenarios by:
  - Expressing interest in a profile (in test data)
  - Having another user express interest in you
  - Navigate to mutual matches to verify they appear
- Verify you can access messaging from mutual matches

---

## 11. Accept Interest

**Navigation Path**: `/interests` (Received Tab)

### How to Accept Someone's Interest

1. You'll see a notification when someone expresses interest in you.
2. Navigate to the **"Interests"** page.
3. Click on the **"Received"** tab to see interests from others.
4. View the profile card of the person who expressed interest.
5. Click the **"Accept"** button on their card.
6. A confirmation popup will appear.
7. Click **"Confirm Accept"** to accept their interest.
8. Both users can now start messaging each other.

### After Accepting Interest

- The status changes to **"Matched"**
- You'll appear in their **"Matched"** tab
- Both users get access to each other's contact information (if verified)
- You can start a conversation in the **"Messages"** section

### Testing Accept Interest

- Receive an interest from another user
- Accept the interest and verify status changes
- Check that conversation becomes available
- Verify the other user sees you as matched

---

## 12. Reject Interest

**Navigation Path**: `/interests` (Received Tab)

### How to Reject Someone's Interest

1. Navigate to the **"Interests"** page.
2. Click on the **"Received"** tab.
3. Find the interest you want to reject.
4. Click the **"Reject"** or **"Decline"** button on the card.
5. A confirmation popup will appear.
6. Click **"Confirm Reject"** to decline the interest.
7. The status will change to **"Rejected"**.

### After Rejecting Interest

- The other user is notified that their interest was declined
- They cannot express interest again (or face a cooldown period)
- The conversation won't be opened
- The profile will appear as rejected in your interests history

### Testing Reject Interest

- Reject an interest from a profile
- Verify the status changes to rejected
- Check that no conversation is created
- Verify the user is notified

---

## 13. View User Profile

**Navigation Path**: `/profile/:userId`

### How to View Another User's Profile

1. Click on any profile card from:
   - **Search Results**
   - **Matches**
   - **Visitors**
   - **Interests**
   - **Mutual Matches**
   - **Favorites**
2. Click the **"View Profile"** link or the profile card itself.
3. The profile page opens showing:
   - **Photos**: Profile and gallery photos
   - **Basic Information**: Age, location, occupation, education
   - **About Section**: Their bio and interests
   - **Horoscope**: Rashi, Nakshatra, and compatibility
   - **Family Information**: (if publicly visible)
   - **Verification Badge**: Shows if they're verified
   - **Action Buttons**: Express Interest, Add to Favorites, Block, Report

### Profile Information Visibility

Different information is visible based on:
- Your relationship (stranger, interested, matched, blocked)
- Their privacy settings
- Your membership level

### Testing View Profile

- Click on various profile cards to open full profiles
- Verify all information displays correctly
- Check photo gallery functionality
- Ensure action buttons are visible and functional

---

## 14. Kundli Match (Horoscope Compatibility)

**Navigation Path**: `/kundli-match/:userId`

### How to Check Kundli Compatibility

1. Open a user's **Profile** (follow step 13).
2. Look for the **"Kundli Match"** or **"Horoscope Match"** section.
3. Click the **"Check Kundli Match"** button.
4. The **Kundli Match** page will show:
   - **Compatibility Percentage**: Overall match percentage
   - **Guna Milan**: Scores for 8 different gunas (qualities)
   - **Detailed Analysis**: Strengths and potential challenges
   - **Recommendations**: Astrological insights

### Guna Analysis

The system analyzes compatibility based on:
- Rashi (Moon Sign) compatibility
- Nakshatra (Birth Star) compatibility
- Manglik compatibility
- Overall Guna scoring

### Testing Kundli Match

- Navigate to a user's profile
- Click the Kundli Match button
- Verify compatibility percentage displays
- Check that guna scores are calculated and displayed
- Review the analysis and recommendations

---

## 15. Add to Favorites

**Navigation Path**: `/favourites` (View), `/profile/:userId` (Add)

### How to Save a Profile to Favorites

1. Open a profile (follow step 13).
2. Click the **"Add to Favorites"** button (usually a heart icon).
3. The profile is instantly saved to your favorites.
4. You'll see a confirmation message.

### View Your Favorites

1. Click on **"Favorites"** in the sidebar menu.
2. All your saved profiles will be displayed.
3. You can:
   - View complete profiles
   - Express interest
   - Remove from favorites
   - Share with friends

### Testing Favorites

- Add multiple profiles to favorites
- Navigate to favorites page and verify they appear
- Remove a profile from favorites and verify it's removed
- Check that favorite status persists after logout/login

---

## 16. View Visitors

**Navigation Path**: `/visitors`

### How to See Who Visited Your Profile

1. Click on **"Visitors"** in the sidebar menu.
2. This page shows all users who visited your profile.
3. Visitor cards display:
   - **Profile Photo**
   - **Basic Information**: Age, location, occupation
   - **Visit Date**: When they visited
   - **Action Buttons**: Express Interest, View Profile, Add to Favorites
4. Click any profile to see more details.

### Who Appears as Visitors

- Users who viewed your profile
- Users who clicked on your name
- Users who searched and found your profile
- Users who came from recommendations

### Benefits

- Identify who's interested in you
- See potential matches proactively
- Express interest to visitors first

### Testing Visitors

- Have another user view your profile
- Navigate to visitors page and verify they appear
- Verify you can express interest in visitors
- Check that visit timestamps are accurate

---

## 17. View Messages

**Navigation Path**: `/messages` or `/messages/:userId`

### How to Message Other Users

1. Click on **"Messages"** in the sidebar menu.
2. The messages page shows all your conversations:
   - **Conversation List**: All users you're messaging with
   - **Chat View**: Open conversation with selected user
3. Click on a conversation to open the chat.
4. Type your message in the **"Message Input"** field.
5. Click **"Send"** or press Enter to send your message.
6. The message is delivered instantly.

### Accessing Messages

Messages are available:
- After mutual interest/match
- After accepting someone's interest
- After premium features unlock

### Message Features

- **Real-time Notifications**: Get notified of new messages
- **Read Status**: See if message was read
- **Typing Indicator**: See when someone is typing
- **Media Sharing**: Share photos/documents (if enabled)
- **Block User**: Option to block conversation

### Testing Messages

- Start a conversation with a matched user
- Send and receive messages
- Verify messages display in real-time
- Check notification functionality
- Verify read receipts

---

## 18. View Your Interests

**Navigation Path**: `/interests`

### How to Check Interest Sent and Received

1. Click on **"Interests"** in the sidebar menu.
2. The page has multiple tabs:
   - **Received**: Interests others sent to you
   - **Sent**: Interests you sent to others
   - **Matched**: Interests that were accepted
   - **Rejected**: Interests that were declined

### Received Interests Tab

Shows profiles that expressed interest in you:
- Accept the interest to start matching
- Reject to decline
- View their profile for more info

### Sent Interests Tab

Shows profiles you expressed interest in:
- **Pending**: Waiting for their response
- **Accepted**: They accepted! You can chat
- **Rejected**: They declined your interest
- **Expired**: The interest request expired

### Matched Interests Tab

Shows all successful matches:
- Both parties expressed and accepted
- Ready to communicate
- Share contact information

### Testing Interests

- Send interests to multiple profiles
- Track their status (pending, accepted, rejected)
- Accept an incoming interest
- Reject an incoming interest
- Verify tabs update correctly

---

## 19. Block a User

**Navigation Path**: `/profile/:userId` (Actions Menu) or `/settings` (Manage Blocks)

### How to Block Someone

1. Open a user's **Profile** (follow step 13).
2. Click the **"Block"** button (usually in the more options menu).
3. A confirmation popup will appear asking to confirm.
4. Click **"Confirm Block"**.
5. The user is now blocked.

### What Happens When You Block

- They cannot see your profile
- They cannot send you messages
- They cannot express interest in you
- Previous conversations are hidden from your view
- They won't appear in your search results
- You won't appear in their search results

### View Blocked Users

1. Go to **"Settings"**.
2. Find the **"Blocked Users"** section.
3. View all users you've blocked.
4. Option to unblock any user

### Testing Block

- Block a user from their profile
- Verify they can't interact with your profile
- Check that conversation is hidden
- Unblock the user and verify they can interact again
- Verify blocked user list updates

---

## 20. Report a User

**Navigation Path**: `/profile/:userId` (Actions Menu)

### How to Report Inappropriate Behavior

1. Open a user's **Profile** (follow step 13).
2. Click the **"Report"** button (usually in the more options menu).
3. The **"Report User"** modal will open.
4. Select the reason for reporting:
   - **Fake Profile**: The profile appears to be fraudulent
   - **Inappropriate Content**: Photos or messages are inappropriate
   - **Harassment**: The user is harassing you
   - **Scam**: Suspected scam or fraud
   - **Offensive Language**: Abusive messages or comments
   - **Other**: Any other reason
5. Add additional details in the text field.
6. Click **"Submit Report"**.
7. The report is sent to the admin team for review.

### What Happens After Reporting

- The admin team investigates the report
- Appropriate action is taken (warning, suspension, or deletion)
- The reported user may be contacted
- Serious violations may result in account termination
- You won't receive updates about the investigation

### Testing Report

- Report a user with various reasons
- Verify the form submits successfully
- Check that you receive a confirmation message
- Verify the report appears in admin panel (if you have access)

---

## 21. Verification

**Navigation Path**: `/verification`

### How to Verify Your Profile

1. Click on **"Verification"** in the sidebar menu.
2. The verification page shows:
   - **Current Status**: Your verification status (Unverified/Verified/Rejected)
   - **Verification Methods**: Options to verify
   - **Benefits**: Why verification matters

### Verification Methods

1. **Photo Verification**:
   - Upload a clear photo of yourself
   - Our system verifies it matches your profile photos
   - Takes 24-48 hours for review

2. **Email Verification**:
   - Verify the email you used during registration
   - Receive a verification link and click it

3. **Phone Verification**:
   - Verify your phone number
   - Receive an OTP and enter it

4. **Document Verification** (Premium):
   - Upload government ID
   - Our team manually verifies
   - Takes 3-5 business days

### Benefits of Verification

- ✅ Verification badge on your profile
- ✅ Higher visibility in search
- ✅ More trust from other users
- ✅ Better match recommendations
- ✅ Unlock premium features

### Testing Verification

- Navigate to verification page
- Submit photo for verification
- Check verification status updates
- Verify the badge appears on your profile once verified
- Test with invalid document (should reject)

---

## 22. Change Password

**Navigation Path**: `/settings` → Change Password Section

### How to Change Your Password

1. Click on **"Settings"** in the sidebar menu.
2. Find the **"Change Password"** section.
3. Click **"Change Password"** button.
4. A modal will open asking for:
   - **Current Password**: Your existing password
   - **New Password**: Your new password (minimum 8 characters)
   - **Confirm Password**: Re-enter your new password
5. Click **"Change Password"** to save.
6. You'll see a confirmation message.
7. Use your new password for future logins.

### Testing Change Password

- Navigate to settings
- Change your password successfully
- Log out and log in with the new password
- Try changing with incorrect current password (should fail)

---

## 23. Success Stories

**Navigation Path**: `/success-stories` (View), Click "Submit Your Story" button (Submit)

### How to View and Submit Success Stories

1. Click on **"Success Stories"** in the sidebar menu.
2. Browse stories of successful matches in the community.
3. Each story shows:
   - **Photos**: Couple photos
   - **Story**: Their love story
   - **Journey**: How they met on Milaap
   - **Date**: When they joined and connected

### Submit Your Own Story

1. Click **"Submit Your Story"** button.
2. Fill in the story form:
   - **Story Title**: A catchy title
   - **Your Story**: Tell your love story
   - **Photos**: Upload couple photos
   - **Date Met**: When you met on Milaap
   - **Current Status**: Engaged, Married, Dating
3. Click **"Submit"**.
4. The story will be reviewed by admins.
5. Once approved, it appears on the Success Stories page.

### Benefits of Sharing

- Inspire others
- Boost visibility (featured story)
- Celebrate your relationship
- Help others with real success examples

### Testing Success Stories

- Browse the success stories page
- Read a complete story
- Verify photos display correctly
- Submit a test story and verify it appears

---

## 24. Settings

**Navigation Path**: `/settings`

### How to Manage Your Account Settings

1. Click on **"Settings"** in the sidebar menu.
2. The settings page includes several sections:

### Notification Settings

- **Email Notifications**: Enable/disable email alerts
- **Interest Notifications**: Get notified when someone expresses interest
- **Message Notifications**: Get notified of new messages
- **Visitor Notifications**: Get notified of profile visitors
- **Marketing Emails**: Receive promotional emails

### Privacy Settings

- **Profile Visibility**: Who can see your profile
- **Age Display**: Show or hide your age
- **Location Privacy**: Show exact location or just city
- **Contact Display**: Show contact information to matches
- **Online Status**: Show when you're active

### Account Settings

- **Change Password**: Update your password
- **Email Address**: Change registered email
- **Phone Number**: Update phone number
- **Delete Account**: Permanently delete your account

### Blocked Users

- **Manage Blocks**: View, unblock, or block users
- **Blocked List**: See all blocked users

### Testing Settings

- Toggle various notification settings
- Change privacy settings
- Verify changes persist after logout/login
- Test blocking/unblocking functionality

---

## 25. Support and Help

**Navigation Path**: Support/Help link in footer or sidebar

### How to Get Help

1. Click on **"Support"** or **"Help"** in the sidebar menu.
2. Browse frequently asked questions
3. Contact options:
   - **Live Chat**: Chat with support team
   - **Email Support**: Send an email
   - **Call Us**: Phone support during business hours
   - **FAQ**: Find answers to common questions

### Common Support Topics

- Account issues
- Profile management
- Messaging and communication
- Subscription and billing
- Verification support
- Safety and security concerns
- Technical issues

### Testing Support

- Navigate to support page
- Verify contact options are displayed
- Check FAQ functionality
- Test live chat (if available)

---

# Admin Guide

This section provides step-by-step instructions for all admin features.

## 1. Admin Registration and Login

**Navigation Path**: `/login` (use admin credentials)

### How Admins Register

1. Contact the Super Admin to create an admin account.
2. You'll receive credentials via email.
3. Go to the login page and enter:
   - **Email Address**: Your admin email
   - **Password**: Your admin password
4. Click **"Log In"**.
5. You'll be redirected to the **Admin Dashboard**.

### Admin Roles

- **Super Admin**: Full system access, can manage admins and settings
- **Admin**: Can moderate content, manage users, review reports
- **Moderator**: Limited access, reviews content and reports

### Testing Admin Login

- Log in with admin credentials
- Verify you access the admin dashboard
- Check that customer users cannot access admin area

---

## 2. Admin Dashboard

**Navigation Path**: `/admin/dashboard`

### How to Use the Admin Dashboard

1. After logging in as admin, you'll see the **Admin Dashboard**.
2. The dashboard displays:
   - **System Statistics**:
     - Total users
     - Active users (logged in last 24 hours)
     - New registrations (today, this week, this month)
     - Total profiles verified
     - Total successful matches
   - **Quick Actions**: Links to common admin tasks
   - **Recent Activities**: Latest events in the system
   - **Reports Overview**: New reports waiting for review
   - **Pending Tasks**: Verification requests, registration approvals

### Key Metrics

- **User Growth**: Track new registrations
- **Engagement**: Active users, messages sent, interests expressed
- **Verification Rate**: Percentage of verified profiles
- **Report Trends**: Types and volume of reports

### Dashboard Navigation

- Click on metrics to see detailed data
- Use quick action buttons for fast access
- View charts and graphs for trends

### Testing Dashboard

- Log in as admin and verify dashboard loads
- Check that statistics are accurate
- Verify all quick action links work

---

## 3. User Management

**Navigation Path**: `/admin/user-management`

### How to Manage Users

1. Click on **"User Management"** in the admin sidebar.
2. The page displays a table of all users:
   - **User ID**: Unique identifier
   - **Name**: User's full name
   - **Email**: Email address
   - **Status**: Active, Suspended, Deleted, Pending
   - **Verification**: Verified status
   - **Join Date**: When they registered
   - **Actions**: Edit, View, Block, Suspend, Delete

### User Actions

#### Edit User

1. Click the **"Edit"** button next to a user.
2. The edit modal opens with user information.
3. You can modify:
   - User's personal information
   - Email address
   - Status
   - Verification status
   - Membership tier
4. Click **"Save Changes"**.

#### View User Profile

1. Click the **"View Profile"** button.
2. See the complete user profile.
3. View all their information, photos, and activity.

#### Suspend User

1. Click the **"Suspend"** button.
2. Select suspension duration (7 days, 30 days, Permanent).
3. Enter reason for suspension.
4. Click **"Confirm Suspend"**.
5. The user cannot access their account during suspension.

#### Block User

1. Click the **"Block"** button.
2. Select reason (Violation, Fraud, Harassment, etc.).
3. Click **"Confirm Block"**.
4. The user's account is permanently blocked.

#### Delete User Account

1. Click the **"Delete"** button.
2. Confirm the deletion.
3. The user account and all data are permanently deleted.

### Search and Filter Users

- **Search by Name**: Find users by name
- **Search by Email**: Find users by email address
- **Filter by Status**: View only active, suspended, or deleted users
- **Filter by Verification**: View verified or unverified profiles
- **Filter by Join Date**: See users who joined in specific period

### Testing User Management

- Search for a specific user
- Apply various filters
- Edit a user's information
- Suspend a user temporarily
- Verify the user sees suspension message on login
- Unblock a suspended user

---

## 4. Registration Requests Management

**Navigation Path**: `/admin/registration-requests`

### How to Manage Registration Requests

1. Click on **"Registration Requests"** in the admin sidebar.
2. This page shows all pending registration approvals:
   - **User Details**: Name, email, date of birth
   - **Submitted Date**: When they registered and activated their email
   - **Status**: Pending, Approved, Rejected
   - **Actions**: View Details, Approve, Reject

### Verification Checklist

Before approving or rejecting a registration, verify the following:

#### Profile Information Verification

- [ ] **Name and Email**: Verify name matches profile information
- [ ] **Age and DOB**: Confirm user is of legal age (18+)
- [ ] **Profile Photo**: Clear, recent photo of the user (not old/edited)
- [ ] **Profile Completeness**: All mandatory fields are filled
- [ ] **Bio/Description**: Appropriate and genuine content

#### Red Flags (Potential Rejections)

- Fake or spam profile indicators
- Incomplete or suspicious information
- Profile photos appear to be stolen/fake
- Age inconsistencies
- Multiple accounts from same person
- Policy violations detected
- Inappropriate profile content

### Review Registration Request

1. Click **"View Details"** to see:
   - Complete user information
   - Profile data they submitted
   - All uploaded photos and documents
   - Bio and interests
   - Verification status
2. Review all information carefully.
3. Check for any red flags or suspicious activity.
4. Make your approval or rejection decision.

### Approve Registration

1. After reviewing the user's profile:
2. Click the **"Approve"** button.
3. Optionally add approval notes (visible to your team).
4. Confirm the approval.
5. The user's profile is now **ACTIVATED**.
6. An **approval email** is sent to the user.
7. The user can now access their account and start using all features:
   - Browse profiles
   - Express interest
   - Send messages
   - View visitors
   - Use all platform features

### Reject Registration

1. If profile has issues or policy violations:
2. Click the **"Reject"** button.
3. **Select rejection reason** (shown to user):
   - Incomplete information
   - Invalid/unclear documents
   - Age restrictions (appears to be too young)
   - Duplicate account (account already exists)
   - Policy violation
   - Inappropriate content
   - Fake profile
   - Other
4. **Add rejection notes** (mandatory):
   - Explain specifically what needs to be corrected
   - Provide guidance for resubmission
   - Example: "Please provide a clearer profile photo showing your face clearly"
5. Click **"Confirm Reject"**.
6. A **rejection email** is sent to the user with:
   - Reason for rejection
   - Instructions on how to fix issues
   - Resubmission process
7. User can **reapply** after making corrections by:
   - Updating their profile information
   - Resubmitting for admin review
   - Repeating the verification process

### Batch Actions

- Select multiple registrations using checkboxes
- **Approve All**: Approve all selected at once
- **Reject All**: Reject all selected at once
- **Reassign**: Assign to another admin for review
- **Bulk Notes**: Add notes for multiple records

### Best Practices

- **Be thorough**: Take time to carefully review each profile
- **Be fair**: Apply consistent standards to all applicants
- **Be clear**: Provide helpful rejection reasons
- **Be timely**: Review pending requests within 24-48 hours
- **Document decisions**: Keep notes on why you approved/rejected
- **Contact support**: For suspicious or unclear cases, escalate to support team

### Approval Statistics

Track your performance metrics:
- **Total Reviewed**: Number of registrations reviewed
- **Approval Rate**: Percentage of approvals vs rejections
- **Average Review Time**: How long reviews take
- **Resubmission Rate**: How many rejected users reapply

### Testing Registration Management

- Submit a new registration with complete information
- Go to admin panel and verify it appears as pending
- Approve the registration with valid information
- Verify the user receives approval email
- Try logging in with the approved account
- Verify all features are accessible after approval
- Submit another registration with issues
- Reject it with specific feedback
- Verify the user receives rejection email
- Test user's ability to resubmit corrected profile

---

## 5. Verification Requests

**Navigation Path**: `/admin/verification-requests`

### How to Review Verification Requests

1. Click on **"Verification Requests"** in the admin sidebar.
2. This page shows all pending verification submissions:
   - **User Info**: Name, email, verification type
   - **Submission Date**: When they applied
   - **Type**: Photo, Phone, Email, Document
   - **Status**: Pending, Approved, Rejected

### Verification Types

1. **Photo Verification**: User submits a selfie
   - Compare with profile photos
   - Ensure photo is clear and recent
   - Approve if matching

2. **Document Verification**: User submits ID
   - Check document authenticity
   - Verify identity matches user
   - Ensure all information is clear

3. **Phone Verification**: User submits phone number
   - OTP verification
   - Usually auto-approved

4. **Email Verification**: User confirms email
   - Usually auto-approved once link clicked

### Review Verification

1. Click on a verification request.
2. View the submitted documents/photos.
3. Compare with profile information.
4. Check for any red flags:
   - Fuzzy or unclear documents
   - Information doesn't match profile
   - Multiple accounts with same identity
   - Signs of fraud

### Approve Verification

1. If verification is valid, click **"Approve"**.
2. The user gets a verification badge.
3. Their profile visibility increases.
4. Approval email is sent.

### Reject Verification

1. If something looks suspicious:
2. Click **"Reject"**.
3. Select reason:
   - Document not clear
   - Information doesn't match
   - Suspicious/Fraud
   - Invalid document
4. Add notes explaining rejection.
5. Click **"Confirm Reject"**.
6. User can resubmit with clearer documents.

### Testing Verification

- Submit a photo for verification as a customer
- Go to admin panel and review the submission
- Approve the verification
- Verify the badge appears on your profile
- Try submitting with an invalid document

---

## 6. Reports Management

**Navigation Path**: `/admin/reports`

### How to Handle User Reports

1. Click on **"Reports"** in the admin sidebar.
2. This page shows all reported users:
   - **Reported User**: Who was reported
   - **Reporter**: Who made the report
   - **Reason**: Type of violation
   - **Date Reported**: When report was submitted
   - **Status**: New, Under Review, Resolved, Dismissed

### Report Categories

- **Fake Profile**: Profile appears to be fraudulent
- **Inappropriate Content**: Offensive photos or messages
- **Harassment**: User is harassing others
- **Scam/Fraud**: Suspected fraud or scam activity
- **Offensive Language**: Abusive messages
- **Other**: Other violations

### Review Report

1. Click on a report to view details:
   - Reporter's complaint
   - Screenshots or evidence (if provided)
   - Reported user's profile
   - User's messaging history
   - Previous violations

### Investigation Process

1. **Gather Evidence**:
   - Review chat messages
   - Check profile photos and information
   - Look at user's activity history
   - Check for pattern of violations

2. **Decision**:
   - **Dismiss**: No violation found
   - **Warning**: First offense, send warning email
   - **Suspend**: Temporary suspension (7-30 days)
   - **Ban**: Permanent account deletion

3. **Document Decision**:
   - Add notes about your findings
   - Set action taken
   - Save documentation

### Actions Available

1. **Send Warning**: First-time offenders
   - Email warning about behavior
   - Explain specific violation
   - Set deadline for compliance

2. **Suspend Account**: Serious violations
   - Account disabled for 7-30 days
   - User cannot access account
   - After suspension, account is reactivated

3. **Permanent Ban**: Repeated violations or serious crimes
   - Account deleted permanently
   - User banned from using service
   - Contact law enforcement if needed

4. **Contact Law Enforcement**: For serious crimes
   - Document evidence
   - Report to appropriate authorities
   - Maintain confidentiality

### Testing Reports

- Submit multiple reports as different users
- Go to admin panel and review reports
- Approve one report and take action
- Dismiss another report
- Verify the user receives notifications based on action taken

---

## 7. Story Submissions Management

**Navigation Path**: `/admin/story-submissions`

### How to Review Success Stories

1. Click on **"Story Submissions"** in the admin sidebar.
2. This page shows all submitted success stories:
   - **Couple Names**: Names from the story
   - **Submission Date**: When submitted
   - **Status**: Pending, Approved, Rejected
   - **Actions**: Review, Approve, Reject, Edit

### Review Story Submission

1. Click **"Review"** to view:
   - Complete story text
   - Photos submitted
   - Couple information
   - How they met details
   - Current relationship status

### Check for Violations

- Story content is appropriate
- Photos are suitable
- No inappropriate language
- No advertising or spam
- No personal information exposed
- Photos are actual couple (not random images)

### Approve Story

1. Review the story for quality and appropriateness.
2. Click **"Approve"**.
3. Optional: Feature the story (appears on homepage)
4. The story is published on Success Stories page.
5. User receives confirmation email.

### Reject Story

1. If story contains violations:
2. Click **"Reject"**.
3. Select reason:
   - Inappropriate content
   - Spam or advertising
   - Fake/unrelated content
   - Poor quality
   - Policy violation
4. Add notes explaining rejection.
5. User can resubmit after making corrections.

### Feature Story

1. For exceptional stories:
2. Check the **"Feature"** checkbox when approving.
3. Story appears prominently on homepage.
4. Gets increased visibility.
5. Rewards successful couples.

### Testing Story Management

- Submit a success story as a customer
- Go to admin panel and review it
- Approve the story
- Verify it appears on the success stories page
- Submit a story with inappropriate content and test rejection

---

## 8. Verification Logs

**Navigation Path**: `/admin/service-requests`

### How to Track Verification Activity

1. Click on **"Service Requests"** or **"Verification Logs"** in the admin sidebar.
2. This page shows complete verification history:
   - **User**: Who submitted verification
   - **Type**: Type of verification
   - **Submission Date**: When submitted
   - **Status**: Approved, Rejected, Pending
   - **Admin**: Which admin reviewed
   - **Review Date**: When reviewed
   - **Notes**: Admin's comments

### Filter Logs

- **By Status**: Approved, Rejected, Pending
- **By Type**: Photo, Document, Phone, Email
- **By Date Range**: See specific period
- **By User**: Find specific user's verifications
- **By Admin**: See which admin reviewed

### Analyze Trends

- **Approval Rate**: Percentage of approvals vs rejections
- **Time to Review**: Average review time
- **Common Rejections**: Most frequent rejection reasons
- **Peak Submission Times**: When most verifications are submitted

### Export Data

- Download logs as CSV
- Use for reporting
- Audit trail documentation

### Testing Verification Logs

- Submit various verification requests
- Approve some and reject others
- View the logs
- Filter by different criteria
- Check that all activities are properly logged

---

## 9. Communication Management

**Navigation Path**: `/admin/communication`

### How to Manage Platform Communication

1. Click on **"Communication"** in the admin sidebar (Super Admin only).
2. This section allows you to:
   - Send bulk emails
   - Create notifications
   - Manage push notifications
   - Create in-app announcements

### Send Bulk Email

1. Click **"Send Bulk Email"**.
2. Select recipient group:
   - All users
   - Verified users only
   - Premium members
   - Inactive users
   - Custom list
3. Write email:
   - **Subject**: Email subject
   - **Body**: Email content
   - **CTA Button**: Optional action button
4. Preview email template.
5. Click **"Send"**.
6. Track email delivery status.

### Create In-App Announcement

1. Click **"Create Announcement"**.
2. Fill in details:
   - **Title**: Announcement headline
   - **Message**: Content
   - **Type**: Info, Warning, Alert, Feature
   - **Target**: All users or specific group
   - **Duration**: How long to display
3. Click **"Publish"**.
4. Users see announcement when they log in.

### Create Push Notification

1. Click **"New Push Notification"**.
2. Enter:
   - **Title**: Notification title
   - **Message**: Short message
   - **Action**: Link or action to perform
   - **Target**: All or specific group
3. Click **"Send"**.
4. Users receive notification on their devices.

### Track Communication

- **Delivery Status**: How many received
- **Open Rate**: How many opened
- **Click Rate**: How many clicked CTA
- **Bounce Rate**: Failed deliveries

### Testing Communication

- Send a test email
- Create an announcement and verify it displays
- Check push notifications on mobile devices
- Verify unsubscribe functionality

---

## 10. Reporting and Analytics

**Navigation Path**: `/admin/reporting`

### How to Access Reports

1. Click on **"Reporting"** in the admin sidebar (Super Admin only).
2. This section provides comprehensive analytics:

### User Analytics

- **New Users**: Registration trends
- **Active Users**: Daily/weekly/monthly active users
- **User Growth**: Growth rate over time
- **Retention**: How many users return
- **Churn**: Users who become inactive

### Engagement Analytics

- **Messages Sent**: Total messages per day/week/month
- **Interests Expressed**: Matching activity
- **Profile Views**: Browsing behavior
- **Success Matches**: Successful pairings
- **Premium Conversions**: Free to paid upgrades

### Revenue Analytics

- **Subscription Revenue**: Total subscription income
- **Revenue by Plan**: Which plans are popular
- **Refunds**: Refund amounts and reasons
- **LTV**: Customer lifetime value
- **MRR**: Monthly recurring revenue

### Content Analytics

- **Verification Rate**: Percentage of verified profiles
- **Profile Completion**: Average profile completion
- **Photo Uploads**: Profile photo trends
- **Success Stories**: Story submissions and approvals

### Report Export

- **Download Reports**: PDF, Excel formats
- **Schedule Reports**: Set up automatic delivery
- **Custom Reports**: Create specific report types
- **Email Reports**: Get reports via email

### Testing Reports

- Navigate to reports section
- View various analytics charts
- Check data accuracy
- Download a report
- Verify charts display correctly

---

## 11. Safety and Security

**Navigation Path**: Admin Settings → Safety & Security

### How to Monitor Safety

1. Go to **"Settings"** → **"Safety & Security"**.
2. Monitor:
   - **Suspicious Activity**: Patterns of fraud
   - **Failed Logins**: Multiple failed login attempts
   - **IP Monitoring**: Unusual login locations
   - **Data Breaches**: Compromised accounts

### Security Actions

1. **Reset User Password**: Force password change
2. **2FA Enforcement**: Require two-factor authentication
3. **Session Termination**: Log user out from all devices
4. **Account Lockdown**: Temporary account freeze
5. **Backup Codes**: Generate new backup codes

### Testing Security Features

- Try logging in with wrong password multiple times
- Verify account gets locked after failed attempts
- Use "Forgot Password" to unlock
- Check 2FA setup
- Verify login notifications

---

## 12. Admin Settings and Access Control

**Navigation Path**: Admin Settings → Admin Management

### How to Manage Admin Accounts

1. Click on **"Settings"** in the admin sidebar.
2. Click on **"Admin Management"** (Super Admin only).
3. View list of all admin users.

### Create New Admin

1. Click **"Add Admin"**.
2. Enter:
   - **Email**: Admin email
   - **Name**: Admin name
   - **Role**: Admin, Moderator, Analyst
   - **Permissions**: Select specific permissions
3. Click **"Create Admin"**.
4. Temporary password sent to email.

### Edit Admin

1. Click **"Edit"** next to admin.
2. Update:
   - **Name**
   - **Role**
   - **Permissions**
   - **Status**: Active, Inactive
3. Click **"Save"**.

### Admin Roles and Permissions

**Super Admin**:
- Full system access
- Manage all users
- Manage other admins
- Access analytics
- System settings

**Admin**:
- User management
- Report handling
- Verification review
- Story approval
- Cannot manage other admins

**Moderator**:
- Report handling
- Story approval
- Limited user actions
- No access to analytics

### Admin Activity Logs

1. Click on **"Activity Logs"**.
2. View all actions taken by admins:
   - User suspensions
   - Verifications approved/rejected
   - Warnings issued
   - Stories reviewed
   - Timestamp of each action

### Testing Admin Management

- Create a new admin account
- Log in as the new admin
- Verify they have appropriate permissions
- Edit the admin's role and permissions
- Verify access is updated
- View activity logs

---

## 13. System Settings

**Navigation Path**: Admin Settings → System Settings

### How to Configure System Settings

1. Click on **"Settings"** in the admin sidebar.
2. Click on **"System Settings"**.

### Platform Configuration

- **Site Name**: Platform name
- **Logo/Branding**: Upload logo and branding images
- **Theme Colors**: Customize color scheme
- **Domain**: Configure domain settings

### Email Configuration

- **SMTP Settings**: Email server configuration
- **Email Templates**: Customize email templates
- **Sender Email**: Email address for system emails
- **Reply-To Email**: Support email address

### Payment Configuration

- **Payment Gateway**: Configure payment processor
- **Currency**: Set platform currency
- **Tax Settings**: Configure tax rates
- **Pricing Tiers**: Set membership pricing

### Content Moderation

- **Auto-Moderation**: Enable AI content filtering
- **Keyword Blocking**: Block specific words
- **Inappropriate Images**: Auto-detect and flag
- **Spam Detection**: Detect spam messages

### Testing Settings

- Update system settings
- Verify changes are applied
- Send test email
- Check that changes reflect across platform

---

## 14. Compliance and Legal

**Navigation Path**: Admin Settings → Compliance

### How to Manage Compliance

1. Go to **"Settings"** → **"Compliance"**.
2. Manage:
   - **Terms of Service**: Update T&Cs
   - **Privacy Policy**: Update privacy policy
   - **GDPR Compliance**: Data deletion, exports
   - **Legal Holds**: Hold data for legal issues
   - **Data Retention**: Set data deletion policies

### GDPR Tools

- **Data Export**: Export user data on request
- **Right to Deletion**: Delete user account and data
- **Consent Management**: Track user consents
- **Data Processing**: Log all data processing

### Testing Compliance

- Request data export as user
- Process the export request as admin
- Verify data is complete
- Test right to deletion

---

## 15. Support Ticket Management

**Navigation Path**: Admin Support/Help Section

### How to Handle Support Tickets

1. Click on **"Support"** in the admin sidebar.
2. View all customer support tickets:
   - **Ticket ID**: Unique ticket number
   - **User**: Who submitted ticket
   - **Category**: Issue category
   - **Status**: Open, In Progress, Resolved, Closed
   - **Priority**: Low, Medium, High, Urgent
   - **Created**: When ticket was submitted

### Categories

- Account Issues
- Technical Problems
- Billing/Payment
- Verification Help
- Abuse/Safety
- Feature Requests
- Other

### Respond to Ticket

1. Click on a ticket to view full details.
2. Read the user's issue and attachments.
3. Write your response in the reply field.
4. Click **"Send Response"**.
5. Update ticket status to "In Progress".
6. Follow up until issue is resolved.

### Resolve Ticket

1. Once issue is fixed:
2. Click **"Resolve Ticket"**.
3. Add summary of actions taken.
4. User receives notification.
5. Ticket can be closed after user confirms.

### Escalate Ticket

1. For complex issues:
2. Click **"Escalate"**.
3. Select department (Technical, Billing, etc.).
4. Add notes for the team.
5. Ticket moves to specialist team.

### Testing Support

- Submit a support ticket as a customer
- Check ticket appears in admin panel
- Reply to the ticket
- Resolve the ticket
- Verify you receive resolution notification

---

## Appendix: Quick Reference

### Key Paths for Customers

| Action | Path |
|--------|------|
| Register | `/register` |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Profile | `/profile` |
| Edit Profile | `/profile` (click Edit) |
| Search | `/search` |
| Matches | `/matches` |
| Interests | `/interests` |
| Messages | `/messages` |
| Favorites | `/favourites` |
| Visitors | `/visitors` |
| Settings | `/settings` |
| Verification | `/verification` |
| Success Stories | `/success-stories` |

### Key Paths for Admin

| Action | Path |
|--------|------|
| Admin Login | `/login` |
| Dashboard | `/admin/dashboard` |
| User Management | `/admin/user-management` |
| Registration Requests | `/admin/registration-requests` |
| Verification Requests | `/admin/verification-requests` |
| Reports | `/admin/reports` |
| Story Submissions | `/admin/story-submissions` |
| Verification Logs | `/admin/service-requests` |
| Communication | `/admin/communication` |
| Reporting | `/admin/reporting` |

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Can't log in | Use "Forgot Password" to reset |
| Profile not visible | Complete profile and get verified |
| Messages not working | Accept/match interest first |
| Verification rejected | Resubmit with clearer documents |
| Can't express interest | Check if user is already blocked |
| Membership not working | Clear browser cache and refresh |

### Testing Checklist

- [ ] Registration and activation
- [ ] Login and logout
- [ ] Password reset
- [ ] Profile creation and editing
- [ ] Search and filtering
- [ ] Expressing interest
- [ ] Accepting/rejecting interests
- [ ] Messaging functionality
- [ ] Favorites functionality
- [ ] Visitor tracking
- [ ] Profile blocking
- [ ] User reporting
- [ ] Verification process
- [ ] Membership upgrade
- [ ] Settings management
- [ ] Admin dashboard access
- [ ] User management
- [ ] Report handling
- [ ] Story approvals
- [ ] Communication features

---

## Support and Feedback

For more information or to report issues with this guide, contact the support team or visit the help section in the application.

**Last Updated**: January 2026
**Version**: 1.0
