import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <main class="nf">
      <p class="nf-code">404</p>
      <h1 class="nf-title">Page not found</h1>
      <p class="nf-msg">This route doesn&rsquo;t exist or has moved.</p>
      <a class="nf-btn" routerLink="/welcome">Back to base</a>
    </main>
  `,
  styles: [
    `
      .nf {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 2rem;
        background: var(--bg);
        color: var(--text);
        font-family: var(--font-sans);
      }
      .nf-code {
        font-family: var(--font-mono);
        font-size: 3.5rem;
        margin: 0;
        color: var(--accent);
        letter-spacing: 0.05em;
      }
      .nf-title {
        font-size: 1.4rem;
        margin: 0.5rem 0 0.35rem;
      }
      .nf-msg {
        color: var(--text-muted);
        margin: 0 0 1.6rem;
      }
      .nf-btn {
        display: inline-block;
        padding: 0.7rem 1.4rem;
        border-radius: var(--r-lg, 16px);
        background: var(--accent);
        color: #fff;
        text-decoration: none;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class NotFoundComponent {}
