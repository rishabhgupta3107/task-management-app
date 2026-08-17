import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE = 'HELM';
const DEFAULT_TITLE = 'HELM — Stop tracking. Start commanding.';

/**
 * Sets the document title (as "<route title> · HELM") and, where a route provides `data.description`, the meta description — driven natively by the router's `title` route property. Registered as the app's TitleStrategy.
 */
@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private readonly meta: Meta,
  ) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(snapshot);
    this.title.setTitle(routeTitle ? `${routeTitle} · ${SITE}` : DEFAULT_TITLE);

    // Walk to the deepest matched route that declares a description.
    let route = snapshot.root;
    let description = '';
    while (route.firstChild) {
      route = route.firstChild;
      const d = route.data?.['description'];
      if (typeof d === 'string' && d) description = d;
    }
    if (description) {
      this.meta.updateTag({ name: 'description', content: description });
    }
  }
}
