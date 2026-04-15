export type AudienceInput = {
  niche: string;
  product: string;
  problem: string;
};

export type AudienceSegmentResult = {
  segment: string;
  painPoints: string[];
  platforms: string[];
  messaging: string[];
  recommendedOffer: string;
};

export function findAudience(input: AudienceInput): AudienceSegmentResult[] {
  const { niche, product, problem } = input;

  const audiences = [
    {
      segment: `Beginners in ${niche}`,
      painPoints: [
        `Struggling to understand ${niche}`,
        `Overwhelmed by too many options`,
        `Fear of wasting money/time`,
      ],
      platforms: ["YouTube", "Reddit", "TikTok"],
      messaging: [
        `Start ${niche} without wasting time`,
        `Beginner-friendly way to solve ${problem}`,
        `No experience? No problem.`,
      ],
    },
    {
      segment: `Intermediate ${niche} users`,
      painPoints: [
        `Stuck at the same level`,
        `Not seeing results`,
        `Need better systems/tools`,
      ],
      platforms: ["Twitter/X", "LinkedIn", "Discord"],
      messaging: [
        `Level up your ${niche} results`,
        `Fix what's holding you back in ${niche}`,
        `Upgrade how you approach ${problem}`,
      ],
    },
    {
      segment: `Professionals offering ${niche} services`,
      painPoints: [
        `Client acquisition is inconsistent`,
        `Time-consuming processes`,
        `Scaling issues`,
      ],
      platforms: ["LinkedIn", "Email", "Communities"],
      messaging: [
        `Get more clients for your ${niche} service`,
        `Automate ${problem}`,
        `Scale without burnout`,
      ],
    },
    {
      segment: `${niche} business owners`,
      painPoints: [
        `Low conversions`,
        `Poor marketing ROI`,
        `Hard to stand out`,
      ],
      platforms: ["Google", "Facebook Groups", "Industry forums"],
      messaging: [
        `Increase revenue in your ${niche} business`,
        `Fix your ${problem} fast`,
        `Stand out in a crowded market`,
      ],
    },
  ];

  return audiences.map((audience) => ({
    ...audience,
    recommendedOffer: `${product} that helps ${audience.segment.toLowerCase()} solve ${problem}`,
  }));
}
