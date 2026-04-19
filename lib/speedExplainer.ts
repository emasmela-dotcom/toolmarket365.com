export type SpeedInput = {
  url?: string;
  loadTime?: number; // seconds
  imageSizeMB?: number;
  numRequests?: number;
  usesCDN?: boolean;
  renderBlocking?: boolean;
};

export type SpeedIssue = {
  issue: string;
  explanation: string;
  fix: string;
};

export function analyzeSpeed(input: SpeedInput): SpeedIssue[] {
  const issues: SpeedIssue[] = [];

  if (input.loadTime && input.loadTime > 3) {
    issues.push({
      issue: "Slow Load Time",
      explanation:
        "Your site takes longer than 3 seconds to load, which increases bounce rates and hurts SEO.",
      fix: "Optimize assets, reduce scripts, and enable caching.",
    });
  }

  if (input.imageSizeMB && input.imageSizeMB > 2) {
    issues.push({
      issue: "Large Image Sizes",
      explanation:
        "Heavy images slow down page rendering and increase load time.",
      fix: "Compress images and use modern formats like WebP.",
    });
  }

  if (input.numRequests && input.numRequests > 50) {
    issues.push({
      issue: "Too Many HTTP Requests",
      explanation:
        "Each request adds latency, slowing down the overall load speed.",
      fix: "Combine files, remove unused scripts, and use lazy loading.",
    });
  }

  if (input.usesCDN === false) {
    issues.push({
      issue: "No CDN Detected",
      explanation:
        "Without a CDN, users far from your server experience slower load times.",
      fix: "Use a CDN like Cloudflare or AWS CloudFront.",
    });
  }

  if (input.renderBlocking) {
    issues.push({
      issue: "Render-Blocking Resources",
      explanation:
        "CSS/JS files are blocking the page from rendering quickly.",
      fix: "Use async/defer and inline critical CSS.",
    });
  }

  if (issues.length === 0) {
    issues.push({
      issue: "Good Performance",
      explanation: "Your site is well optimized and loads efficiently.",
      fix: "Maintain current optimizations and monitor performance.",
    });
  }

  return issues;
}
