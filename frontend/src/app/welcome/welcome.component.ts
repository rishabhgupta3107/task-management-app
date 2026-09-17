import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Motion constants. Every animation on this page reads from here so timing stays coherent. */
const MOTION = {
  ease: 'power3.out',
  easeExpo: 'expo.out',
  fast: 0.45,
  base: 0.7,
  slow: 1.1,
  stagger: 0.08,
};

interface Kpi {
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  delta: string;
  up: boolean;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('hero') hero!: ElementRef<HTMLElement>;
  @ViewChild('reportCard') reportCard!: ElementRef<HTMLElement>;
  @ViewChild('spark') spark!: ElementRef<SVGPathElement>;

  /** The numbers on the hero report card. Animated by a count-up on load. */
  readonly kpis: Kpi[] = [
    { label: 'Sessions', value: 12480, prefix: '', suffix: '', delta: '18%', up: true },
    { label: 'Conversions', value: 412, prefix: '', suffix: '', delta: '9%', up: true },
    { label: 'Ad spend', value: 7240, prefix: '$', suffix: '', delta: '4%', up: false },
    { label: 'ROAS', value: 4.2, prefix: '', suffix: '×', delta: '22%', up: true },
  ];

  readonly steps = [
    {
      n: '01',
      title: 'Connect the numbers once',
      body: 'Push metrics by CSV, by hand, or straight from your stack with a per-client API token. No brittle integrations to babysit.',
    },
    {
      n: '02',
      title: 'The dashboard builds itself',
      body: 'Pick a template — Paid Ads, SEO, Social, Email — and every KPI, trend and channel split renders against live data.',
    },
    {
      n: '03',
      title: 'Send one link, forever',
      body: 'Your client gets a white-label page that is always current. The month-end report becomes a link you already sent.',
    },
  ];

  readonly features = [
    {
      icon: 'dashboard_customize',
      title: 'White-label by default',
      body: 'Your client’s brand and colour on a page with no login wall — not a $145/month upgrade.',
    },
    {
      icon: 'bolt',
      title: 'Work beside results',
      body: 'Tasks, owners and deadlines live next to the numbers they move. Reporting tools forgot this half.',
    },
    {
      icon: 'insights',
      title: 'Answers, not exports',
      body: 'Throughput, completion rate and overdue risk are computed for you — no pivot tables.',
    },
    {
      icon: 'lock',
      title: 'Isolated per client',
      body: 'Every account, dashboard and metric is scoped server-side. One agency, many clients, no leakage.',
    },
  ];

  private lenis?: Lenis;
  private rafId?: number;
  private ctx?: gsap.Context;
  private reduced = false;

  constructor(private zone: NgZone, private title: Title, private meta: Meta) {
    const desc =
      'HELM gives every client a live white-label marketing dashboard — so month-end reporting stops eating 2–10 hours of your week.';
    this.title.setTitle('HELM — Client reporting that builds itself');
    this.meta.updateTag({ name: 'description', content: desc });
    this.meta.updateTag({ property: 'og:title', content: 'HELM — Client reporting that builds itself' });
    this.meta.updateTag({ property: 'og:description', content: desc });
  }

  ngAfterViewInit(): void {
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.zone.runOutsideAngular(() => {
      if (this.reduced) {
        this.revealAllStatically();
        return;
      }
      this.initSmoothScroll();
      this.ctx = gsap.context(() => {
        this.heroTimeline();
        this.scrollReveals();
        this.cardParallax();
      });
      ScrollTrigger.refresh();
    });
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.lenis?.destroy();
  }

  /** Pointer-tracked tilt gives the report card physical presence without a library. */
  onCardMove(event: PointerEvent): void {
    if (this.reduced || !this.reportCard) return;
    const el = this.reportCard.nativeElement;
    const r = el.getBoundingClientRect();
    const px = (event.clientX - r.left) / r.width - 0.5;
    const py = (event.clientY - r.top) / r.height - 0.5;
    gsap.to(el, {
      rotateY: px * 9,
      rotateX: -py * 9,
      duration: 0.5,
      ease: MOTION.ease,
      transformPerspective: 1000,
    });
  }

  onCardLeave(): void {
    if (this.reduced || !this.reportCard) return;
    gsap.to(this.reportCard.nativeElement, { rotateX: 0, rotateY: 0, duration: 0.8, ease: MOTION.easeExpo });
  }

  private initSmoothScroll(): void {
    this.lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1.15, touchMultiplier: 1.8 });
    this.lenis.on('scroll', ScrollTrigger.update);
    const raf = (t: number) => {
      this.lenis?.raf(t);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  /** One choreographed entrance: eyebrow → headline lines → copy → actions → card → data. */
  private heroTimeline(): void {
    const tl = gsap.timeline({ defaults: { ease: MOTION.ease } });

    tl.from('[data-anim="eyebrow"]', { y: 14, opacity: 0, duration: MOTION.fast })
      .from('[data-anim="line"] > span', { yPercent: 115, duration: MOTION.slow, stagger: 0.09, ease: MOTION.easeExpo }, '-=0.15')
      .from('[data-anim="sub"]', { y: 16, opacity: 0, duration: MOTION.base }, '-=0.65')
      .from('[data-anim="cta"] > *', { y: 14, opacity: 0, duration: MOTION.base, stagger: MOTION.stagger }, '-=0.45')
      .from('[data-anim="trust"] > *', { y: 10, opacity: 0, duration: MOTION.fast, stagger: 0.06 }, '-=0.4')
      .from('[data-anim="card"]', { y: 40, opacity: 0, rotateX: 8, duration: MOTION.slow, ease: MOTION.easeExpo }, '-=0.9')
      .from('[data-anim="kpi"]', { y: 16, opacity: 0, duration: MOTION.base, stagger: MOTION.stagger }, '-=0.55')
      .add(() => this.countUp(), '-=0.5')
      .add(() => this.drawSparkline(), '-=0.5');
  }

  /** KPI numbers tick up to their real value — the page feels alive, not painted. */
  private countUp(): void {
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset['count'] || '0');
      const decimals = target % 1 !== 0 ? 1 : 0;
      const proxy = { v: 0 };
      gsap.to(proxy, {
        v: target,
        duration: 1.5,
        ease: MOTION.easeExpo,
        onUpdate: () => {
          el.textContent = decimals
            ? proxy.v.toFixed(1)
            : Math.round(proxy.v).toLocaleString();
        },
      });
    });
  }

  private drawSparkline(): void {
    const path = this.spark?.nativeElement;
    if (!path) return;
    const len = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: len, strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.6, ease: 'power2.inOut' }
    );
  }

  private scrollReveals(): void {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
      gsap.from(el, {
        y: 28,
        opacity: 0,
        duration: MOTION.base,
        ease: MOTION.ease,
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });

    gsap.utils.toArray<HTMLElement>('[data-reveal-group]').forEach((group) => {
      gsap.from(group.children, {
        y: 26,
        opacity: 0,
        duration: MOTION.base,
        ease: MOTION.ease,
        stagger: MOTION.stagger,
        scrollTrigger: { trigger: group, start: 'top 84%' },
      });
    });
  }

  private cardParallax(): void {
    if (!this.reportCard) return;
    gsap.to(this.reportCard.nativeElement, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: { trigger: this.hero.nativeElement, start: 'top top', end: 'bottom top', scrub: 0.6 },
    });
  }

  /** Reduced-motion: everything is simply present, no transforms, no smooth scroll. */
  private revealAllStatically(): void {
    document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-group]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset['count'] || '0');
      el.textContent = target % 1 !== 0 ? target.toFixed(1) : Math.round(target).toLocaleString();
    });
  }
}
