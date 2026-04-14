export type AffiliateLink = {
  id: string;
  slug: string;
  url: string;
  title?: string;
  clicks: number;
  createdAt: number;
};

const links: Record<string, AffiliateLink> = {};

export function createLink(link: AffiliateLink) {
  links[link.slug] = link;
  return link;
}

export function getLink(slug: string) {
  return links[slug];
}

export function incrementClicks(slug: string) {
  if (links[slug]) {
    links[slug].clicks += 1;
  }
}

export function getAllLinks() {
  return Object.values(links);
}
