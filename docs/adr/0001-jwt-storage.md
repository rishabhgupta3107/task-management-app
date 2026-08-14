# ADR 0001 — JWT storage model

**Status:** Accepted
**Date:** 2026-08
**Decision owner:** Rishabh Gupta

## Context

HELM authenticates with a stateless JWT (HS256, 1-hour access token). The token must live
somewhere in the browser. The two realistic options:

1. **`localStorage` + strict XSS hygiene** — the SPA reads the token and attaches it as an
   `Authorization: Bearer` header. Simple; the token is readable by any JavaScript, so its
   security rests entirely on there being no XSS.
2. **`httpOnly` cookie + CSRF token** — the server sets the token in an `httpOnly` cookie the
   JS cannot read; a separate CSRF token defends state-changing requests. Stronger against XSS
   token theft, but reintroduces CSRF handling and changes the whole auth flow.

## Threat-model assessment (as of this decision)

- The frontend is **Angular 17 with AOT**, which contextually auto-escapes all interpolation.
- A code audit found **no `innerHTML`/`[innerHTML]`, no `bypassSecurityTrust*`, no `eval`, and no
  `document.write`** — i.e. no HTML-injection sinks. The XSS attack surface is minimal.
- No third-party/embedded scripts run in the app origin. No user-generated HTML is rendered.
- Data sensitivity is moderate (task/productivity data), not financial or regulated PII.

## Decision

**Keep the token in `localStorage`, and harden the origin against XSS** rather than moving to
`httpOnly` cookies at this time. Concretely:

- A strict **Content-Security-Policy** is served by nginx (`script-src 'self'`), so even if an
  injection sink were introduced later, injected inline/remote scripts would not execute.
- Additional headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`.
- Angular's default output encoding is relied upon and must **not** be bypassed
  (`bypassSecurityTrustHtml` etc. are prohibited without a security review).
- The token interceptor already logs the user out on `401`, limiting the window of a stale token.

This keeps the implementation simple and avoids the CSRF complexity, while the CSP provides
defense-in-depth that substantially closes the localStorage-token risk.

## When to revisit (switch to httpOnly cookie + CSRF)

Move to `httpOnly` cookies if any of these become true:

- We render user-supplied HTML/rich text, embed third-party scripts, or add `[innerHTML]` usage.
- We handle higher-sensitivity data (payments, health, regulated PII).
- We need refresh-token rotation with long-lived sessions.

At that point: set the JWT as an `httpOnly; Secure; SameSite=Strict` cookie on login, read it from
the cookie in `JwtFilter`, drop the `Authorization` header from the interceptor, re-enable Spring
Security CSRF with a `XSRF-TOKEN` cookie, and set `withCredentials` on the Angular HTTP client.

## Consequences

- **Pro:** minimal code, no CSRF surface, strong XSS mitigation via CSP.
- **Con:** the token is still technically readable by JS, so discipline around the "no HTML sinks /
  no `bypassSecurityTrust`" rule is a standing requirement (worth a lint rule / PR checklist item).
