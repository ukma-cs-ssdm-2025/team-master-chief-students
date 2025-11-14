# ADR-003: Use JWT for Authentication and Session Management

## Status
Accepted

## Context
The expense tracking application requires a secure and scalable authentication system.  
Main requirements:  
- Protection of user passwords from compromise  
- Secure data transmission between client and server  
- Scalability in distributed environment (Kubernetes, multiple API instances)  
- Convenience for users (minimize repeated logins)

## Decision
Implement authentication based on **JWT tokens**:  
- **Passwords** are stored in the database only as hashes (`bcrypt` with salt and work factor ≥ 10).  
- **Client login**: `POST /auth/login` sends credentials over HTTPS.  
- **API** after validation returns two tokens:  
  - **Access Token** (short-lived, 15 min)  
  - **Refresh Token** (long-lived, 7–30 days, stored in secure storage)  
- Client sends all subsequent requests with `Authorization: Bearer <access_token>`.  
- Refresh tokens are stored in DB / Redis for revocation.  
- All communication occurs over HTTPS (TLS 1.2+).  

## Consequences
- ✅ Scaling without need for sticky sessions in load balancer  
- ✅ Modern standard, compatible with web and mobile clients  
- ✅ Password protection through bcrypt  
- ✅ Support for session timeout and token revocation mechanism  
- ⚠️ Infrastructure needed for managing refresh tokens (e.g., Redis)  
- ⚠️ In case of access token compromise, it will be active until its TTL expires  
- ❌ More complex security management compared to regular sessions

## Implementation
Sprint 2: Add Auth module to backend, implement login logic and token generation  
Sprint 2: Integrate Redis / PostgreSQL for storing refresh tokens  
Sprint 2: Implement middleware for validating access tokens in each API call  
Sprint 2: Configure token rotation and revocation, add security testing
