import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface OrbitCard {
  title: string;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  meta: string;
}

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('ring') ring!: ElementRef<HTMLDivElement>;
  @ViewChildren('orbitCard') orbitCards!: QueryList<ElementRef<HTMLDivElement>>;
  @ViewChildren('reveal') reveals!: QueryList<ElementRef<HTMLElement>>;

  private lenis?: Lenis;
  private rafId?: number;
  private triggers: ScrollTrigger[] = [];

  readonly orbit: OrbitCard[] = [
    { title: 'Ship v2 API gateway', status: 'IN_PROGRESS', priority: 'HIGH', meta: 'due 2d' },
    { title: 'Rotate prod credentials', status: 'TO_DO', priority: 'HIGH', meta: 'due today' },
    { title: 'Draft incident postmortem', status: 'TO_DO', priority: 'MEDIUM', meta: 'due 4d' },
    { title: 'Migrate to Postgres 16', status: 'DONE', priority: 'MEDIUM', meta: 'closed' },
    { title: 'Review Q3 roadmap', status: 'IN_PROGRESS', priority: 'LOW', meta: 'due 1w' },
    { title: 'Onboard new operator', status: 'TO_DO', priority: 'LOW', meta: 'due 3d' },
    { title: 'Patch CVE-2026-1180', status: 'IN_PROGRESS', priority: 'HIGH', meta: 'due 6h' },
    { title: 'Archive stale tasks', status: 'DONE', priority: 'LOW', meta: 'closed' },
    { title: 'Tune alert thresholds', status: 'TO_DO', priority: 'MEDIUM', meta: 'due 5d' },
    { title: 'Publish status page', status: 'IN_PROGRESS', priority: 'MEDIUM', meta: 'due 2d' },
  ];

  readonly features = [
    {
      icon: 'bolt',
      title: 'Keyboard-first',
      body: 'Hit ⌘K to command anything — create, jump, filter, or triage without lifting your hands off the keyboard.',
    },
    {
      icon: 'grid_view',
      title: 'Glanceable density',
      body: 'A terminal-grade board where status, priority and deadlines read at a glance. No hunting, no bloat.',
    },
    {
      icon: 'speed',
      title: 'Instant everything',
      body: 'Optimistic updates and buttery transitions. The interface never makes you wait for your own work.',
    },
    {
      icon: 'shield',
      title: 'Secure by default',
      body: 'Per-user isolation, JWT auth, and a hardened backend. Your work stays yours.',
    },
  ];

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.positionOrbit();
      this.initSmoothScroll();
      this.initAnimations();
    });
  }

  ngOnDestroy(): void {
    this.triggers.forEach((t) => t.kill());
    ScrollTrigger.getAll().forEach((t) => t.kill());
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    this.lenis?.destroy();
  }

  /** Places each orbit card evenly around a large circle, rotated tangentially (the "curve"). */
  private positionOrbit(): void {
    const cards = this.orbitCards.toArray();
    const count = cards.length;
    const radius = 620;
    cards.forEach((cardRef, i) => {
      const angle = (360 / count) * i;
      cardRef.nativeElement.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px) rotate(${-angle}deg)`;
    });
  }

  private initSmoothScroll(): void {
    this.lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    this.lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => {
      this.lenis?.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };
    this.rafId = requestAnimationFrame(raf);
  }

  private initAnimations(): void {
    // Scroll-linked rotation of the orbit ring.
    const rotate = gsap.fromTo(
      this.ring.nativeElement,
      { rotate: -28 },
      {
        rotate: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      }
    );
    if (rotate.scrollTrigger) {
      this.triggers.push(rotate.scrollTrigger);
    }

    // Parallax drift + fade on the ring as the hero leaves.
    const drift = gsap.to(this.ring.nativeElement, {
      yPercent: 12,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
    });
    if (drift.scrollTrigger) {
      this.triggers.push(drift.scrollTrigger);
    }

    // Staggered reveal for everything marked #reveal.
    this.reveals.forEach((el) => {
      const trigger = ScrollTrigger.create({
        trigger: el.nativeElement,
        start: 'top 85%',
        onEnter: () => el.nativeElement.classList.add('in'),
      });
      this.triggers.push(trigger);
    });

    ScrollTrigger.refresh();
  }
}
