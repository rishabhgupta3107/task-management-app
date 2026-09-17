import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found',
  template: `
    <main class="nf">
      <div class="nf-grid" aria-hidden="true"></div>
      <div class="nf-glow" aria-hidden="true"></div>

      <a class="nf-brand" routerLink="/welcome">
        <span class="nf-mark">◤</span> HELM
      </a>

      <div class="nf-card card">
        <span class="nf-eyebrow mono">ERROR 404</span>
        <h1 class="nf-title">Off the map.</h1>
        <p class="nf-msg">
          That route doesn't exist, moved, or you don't have access to it.
        </p>
        <div class="nf-actions">
          <a class="btn btn-primary" routerLink="/app/focus">Back to the app</a>
          <a class="btn" routerLink="/welcome">Landing page</a>
        </div>
      </div>
    </main>
  `,
  styles: [
    `
      .nf {
        position: relative;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 24px;
        overflow: hidden;
        background: var(--bg);
      }
      .nf-grid {
        position: absolute;
        inset: 0;
        background-image: linear-gradient(var(--grid-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
        background-size: 46px 46px;
        mask-image: radial-gradient(circle at 50% 45%, black, transparent 75%);
      }
      .nf-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 680px;
        height: 680px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, var(--accent-glow), transparent 60%);
        filter: blur(50px);
        opacity: 0.6;
        pointer-events: none;
      }
      .nf-brand {
        position: absolute;
        top: 22px;
        left: 28px;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-weight: 800;
        letter-spacing: 0.14em;
        font-size: 15px;
        color: var(--text);
        text-decoration: none;
      }
      .nf-mark { color: var(--accent); }

      .nf-card {
        position: relative;
        z-index: 2;
        width: 460px;
        max-width: 100%;
        padding: 40px 36px;
        text-align: center;
        animation: fade-up var(--dur-3) var(--ease) both;
      }
      .nf-eyebrow {
        display: block;
        font-size: 11px;
        letter-spacing: 0.28em;
        color: var(--accent);
        margin-bottom: 14px;
      }
      .nf-title {
        font-size: 30px;
        letter-spacing: -0.03em;
        color: var(--text);
        margin: 0;
      }
      .nf-msg {
        color: var(--text-muted);
        font-size: 14px;
        line-height: 1.6;
        margin: 10px 0 26px;
      }
      .nf-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
        flex-wrap: wrap;
      }
    `,
  ],
})
export class NotFoundComponent {}
