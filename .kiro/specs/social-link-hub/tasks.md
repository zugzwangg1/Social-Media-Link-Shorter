# Implementation Plan - Social Link Hub

- [x] 1. Initialize project structure and dependencies


  - Create backend folder with Express.js setup
  - Create frontend folder with React setup
  - Install core dependencies (Express, Mongoose, JWT, Passport, bcrypt, Helmet, express-rate-limit, express-validator)
  - Install frontend dependencies (React, React Router, Axios)
  - Set up environment configuration
  - Configure MongoDB connection
  - _Requirements: 10.1, 10.4_



- [ ] 2. Implement database models and schemas
  - Create User model with validation
  - Create Link model with validation
  - Create Analytics model
  - Create PasswordReset model


  - Set up database indexes for performance
  - _Requirements: 1.1, 3.1, 7.1, 12.1_

- [ ] 3. Implement authentication service
  - Create password hashing utilities with bcrypt
  - Implement user registration logic
  - Implement login authentication
  - Create JWT token generation and validation
  - Implement session management
  - _Requirements: 1.1, 1.5, 2.1_

- [ ]* 3.1 Write property test for password hashing
  - **Property 3: Password hashing**
  - **Validates: Requirements 1.5**

- [ ]* 3.2 Write property test for user registration
  - **Property 1: User registration creates account**
  - **Validates: Requirements 1.1**

- [ ]* 3.3 Write property test for short URL generation
  - **Property 2: Short URL generation**
  - **Validates: Requirements 1.4**



- [ ]* 3.4 Write property test for authentication
  - **Property 4: Authentication with valid credentials**
  - **Validates: Requirements 2.1**

- [ ] 4. Implement security middleware
  - Set up Helmet.js for security headers
  - Implement rate limiting middleware
  - Create input sanitization middleware
  - Implement XSS protection with output escaping
  - Create CSRF token validation middleware
  - Implement account lockout logic for failed login attempts
  - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ]* 4.1 Write property test for input sanitization
  - **Property 37: Input sanitization**
  - **Validates: Requirements 11.2**

- [x]* 4.2 Write property test for account lockout


  - **Property 36: Account lockout after failed attempts**
  - **Validates: Requirements 11.1**

- [ ]* 4.3 Write property test for secure session cookies
  - **Property 40: Secure session cookies**
  - **Validates: Requirements 11.5**

- [ ] 5. Implement OAuth authentication
  - Configure Passport.js with Google OAuth strategy
  - Configure Passport.js with Microsoft OAuth strategy
  - Create OAuth callback handlers
  - Implement OAuth user creation/login logic
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_



- [ ]* 5.1 Write property test for OAuth token exchange
  - **Property 6: OAuth token exchange**
  - **Validates: Requirements 14.2**

- [ ]* 5.2 Write property test for OAuth new user creation
  - **Property 8: OAuth new user creation**
  - **Validates: Requirements 14.4**

- [ ] 6. Implement authentication API endpoints
  - POST /api/auth/register endpoint
  - POST /api/auth/login endpoint
  - POST /api/auth/logout endpoint
  - GET /api/auth/me endpoint


  - GET /api/auth/google and callback endpoints
  - GET /api/auth/microsoft and callback endpoints
  - Add authentication middleware for protected routes
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 14.1, 14.6_

- [ ]* 6.1 Write unit tests for registration edge cases
  - Test duplicate email rejection
  - Test duplicate username rejection
  - Test invalid input validation
  - _Requirements: 1.2, 1.3_

- [ ] 7. Implement password reset functionality
  - Create password reset token generation
  - Implement token hashing and storage
  - POST /api/auth/password-reset endpoint
  - POST /api/auth/password-reset/:token endpoint
  - Implement token expiration logic
  - Implement session invalidation on password reset
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_



- [ ]* 7.1 Write property test for reset token generation
  - **Property 41: Reset token generation**
  - **Validates: Requirements 12.1**

- [ ]* 7.2 Write property test for password reset and token invalidation
  - **Property 43: Password reset and token invalidation**
  - **Validates: Requirements 12.3**

- [ ]* 7.3 Write property test for session invalidation
  - **Property 45: Session invalidation on password reset**
  - **Validates: Requirements 12.5**

- [ ] 8. Implement link service and validation
  - Create URL validation utility
  - Implement link creation logic
  - Implement link update logic
  - Implement link deletion logic
  - Implement link reordering logic


  - Implement link toggle (active/inactive) logic
  - _Requirements: 3.1, 3.3, 4.1, 4.2, 4.3, 8.1_

- [ ]* 8.1 Write property test for link creation
  - **Property 10: Link creation with validation**
  - **Validates: Requirements 3.1, 3.4**

- [ ]* 8.2 Write property test for invalid URL rejection
  - **Property 11: Invalid URL rejection**
  - **Validates: Requirements 3.3**

- [ ]* 8.3 Write property test for link reordering data preservation
  - **Property 16: Reordering data preservation**
  - **Validates: Requirements 4.4**

- [x] 9. Implement link API endpoints


  - GET /api/links endpoint (get user's links)
  - POST /api/links endpoint (create link)
  - PUT /api/links/:id endpoint (update link)
  - DELETE /api/links/:id endpoint (delete link)
  - PUT /api/links/reorder endpoint (reorder links)
  - PUT /api/links/:id/toggle endpoint (toggle active status)
  - Add authorization checks for link ownership
  - _Requirements: 3.1, 3.2, 3.3, 3.5, 4.1, 4.2, 4.3, 8.1, 8.3, 13.2_

- [ ]* 9.1 Write property test for link ordering preservation
  - **Property 12: Link ordering preservation**
  - **Validates: Requirements 3.5**

- [ ]* 9.2 Write property test for authorization verification
  - **Property 47: Authorization verification**
  - **Validates: Requirements 13.2**

- [ ] 10. Implement profile service
  - Create profile retrieval logic


  - Implement profile update logic
  - Implement username change logic with validation
  - Create file upload handling with Multer
  - Implement image validation (format, size)
  - Implement theme color update logic
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 9.1, 9.2, 9.3_

- [ ]* 10.1 Write property test for profile updates persistence
  - **Property 17: Profile updates persistence**
  - **Validates: Requirements 5.1**

- [ ]* 10.2 Write property test for username uniqueness validation
  - **Property 32: Username uniqueness validation**
  - **Validates: Requirements 9.1**



- [ ]* 10.3 Write property test for file upload validation
  - **Property 49: File upload validation**
  - **Validates: Requirements 13.4**

- [ ] 11. Implement profile API endpoints
  - GET /api/profile/:username endpoint (public profile)
  - PUT /api/profile endpoint (update profile)
  - PUT /api/profile/username endpoint (change username)
  - POST /api/profile/picture endpoint (upload picture)
  - PUT /api/profile/theme endpoint (update theme)
  - Add authorization checks
  - _Requirements: 5.1, 5.2, 5.3, 6.1, 6.2, 9.1, 9.4_

- [ ]* 11.1 Write property test for short URL profile retrieval
  - **Property 21: Short URL profile retrieval**
  - **Validates: Requirements 6.1**



- [ ]* 11.2 Write unit test for 404 handling
  - Test non-existent profile returns 404
  - _Requirements: 6.2_

- [ ] 12. Implement analytics service
  - Create atomic counter increment utilities
  - Implement profile view tracking
  - Implement link click tracking
  - Create analytics retrieval logic


  - _Requirements: 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

- [ ]* 12.1 Write property test for atomic click counter
  - **Property 26: Atomic click counter increment**
  - **Validates: Requirements 7.3**

- [ ]* 12.2 Write property test for atomic view counter
  - **Property 27: Atomic view counter increment**
  - **Validates: Requirements 7.4**



- [ ]* 12.3 Write property test for link click tracking
  - **Property 23: Link click tracking and redirect**
  - **Validates: Requirements 6.4**

- [x] 13. Implement analytics API endpoints



  - GET /api/analytics endpoint (get user analytics)
  - POST /api/analytics/view/:username endpoint (increment view)
  - POST /api/analytics/click/:linkId endpoint (increment click)
  - Add rate limiting for analytics endpoints
  - _Requirements: 6.4, 6.5, 7.1, 7.2, 13.3_



- [ ]* 13.1 Write property test for rate limit enforcement
  - **Property 48: Rate limit enforcement**
  - **Validates: Requirements 13.3**

- [ ] 14. Implement error handling and logging
  - Create centralized error handler middleware
  - Implement error response formatting
  - Set up logging for database errors
  - Add validation error handling
  - _Requirements: 10.2_



- [ ]* 14.1 Write property test for database error handling
  - **Property 35: Database error handling**
  - **Validates: Requirements 10.2**

- [ ] 15. Set up frontend project structure
  - Create React app with routing
  - Set up Axios for API calls
  - Create authentication context
  - Set up protected route components
  - Create space theme CSS variables and base styles
  - _Requirements: 2.3, 6.3_



- [ ] 16. Implement space theme components
  - Create SpaceBackground component with animated starfield
  - Create StarField particle effects
  - Create glassmorphism card components
  - Implement cosmic color palette
  - Add floating animations and transitions
  - Create LoadingSpinner with space theme
  - _Requirements: 6.3_

- [ ] 17. Implement authentication pages
  - Create LoginPage with email/password and OAuth buttons
  - Create RegisterPage with form validation
  - Create OAuthCallback handler component
  - Create PasswordResetRequest page
  - Create PasswordResetForm page
  - Add form validation and error display
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 12.1, 14.1_


- [ ]* 17.1 Write property test for dashboard redirect
  - **Property 5: Dashboard redirect after login**
  - **Validates: Requirements 2.3**

- [ ] 18. Implement dashboard components
  - Create Dashboard layout with space theme
  - Create ProfileEditor component
  - Create LinkManager component with drag-and-drop reordering
  - Create LinkItem component with edit/delete/toggle

  - Create Analytics display component
  - Create UsernameEditor component
  - _Requirements: 3.5, 4.1, 4.2, 4.3, 5.1, 5.2, 5.3, 7.1, 7.2, 8.4, 9.1_

- [ ]* 18.1 Write property test for inactive link dashboard visibility
  - **Property 31: Inactive link dashboard visibility**
  - **Validates: Requirements 8.4**

- [ ] 19. Implement public profile page
  - Create PublicProfile component with space theme
  - Create ProfileHeader with picture, name, bio
  - Create LinkButton components with hover effects
  - Implement link click tracking

  - Implement profile view tracking
  - Handle inactive link filtering
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 8.2, 8.3_

- [ ]* 19.1 Write property test for profile display completeness
  - **Property 22: Profile display completeness**

  - **Validates: Requirements 6.3**

- [ ]* 19.2 Write property test for inactive link exclusion
  - **Property 29: Inactive link public exclusion**
  - **Validates: Requirements 8.2**

- [ ]* 19.3 Write property test for active link inclusion
  - **Property 30: Active link public inclusion**
  - **Validates: Requirements 8.3**


- [ ] 20. Implement profile changes immediate visibility
  - Add real-time profile update mechanism
  - Ensure public profile reflects changes immediately
  - Add optimistic UI updates
  - _Requirements: 5.4_

- [ ]* 20.1 Write property test for immediate visibility
  - **Property 20: Profile changes immediate visibility**


  - **Validates: Requirements 5.4**

- [ ] 21. Implement API integration in frontend
  - Create authentication API service
  - Create profile API service
  - Create link API service
  - Create analytics API service
  - Add JWT token management
  - Add request/response interceptors
  - Add error handling
  - _Requirements: 13.1_

- [x]* 21.1 Write property test for authentication verification


  - **Property 46: Authentication verification**
  - **Validates: Requirements 13.1**

- [ ] 22. Implement responsive design
  - Add mobile breakpoints
  - Optimize space theme for mobile
  - Make touch-friendly buttons
  - Test on various screen sizes
  - _Requirements: 6.3_

- [ ] 23. Add CSRF protection to frontend
  - Implement CSRF token retrieval
  - Add CSRF token to state-changing requests
  - Handle CSRF validation errors
  - _Requirements: 11.4_

- [ ]* 23.1 Write property test for CSRF validation
  - **Property 39: CSRF token validation**
  - **Validates: Requirements 11.4**

- [ ] 24. Implement XSS protection in frontend
  - Add output escaping for user-generated content
  - Sanitize displayed URLs and text
  - Test with XSS attack vectors
  - _Requirements: 11.3_

- [ ]* 24.1 Write property test for output escaping
  - **Property 38: Output escaping for XSS prevention**
  - **Validates: Requirements 11.3**

- [ ] 25. Set up production configuration
  - Configure environment variables
  - Set up MongoDB Atlas connection
  - Configure OAuth credentials
  - Set up HTTPS enforcement
  - Configure CORS properly
  - Set up file upload limits
  - _Requirements: 10.1, 13.5_

- [ ]* 25.1 Write integration tests for complete user flows
  - Test register → login → add links → view profile flow
  - Test OAuth login flow
  - Test password reset flow
  - _Requirements: 1.1, 2.1, 3.1, 6.1_

- [ ] 26. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
