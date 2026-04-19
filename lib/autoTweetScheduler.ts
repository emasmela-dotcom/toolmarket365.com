import { TwitterApi } from "twitter-api-v2";

export type ScheduledTweet = {
  id: number;
  text: string;
  postAt: string;
  posted: boolean;
};

const tweets: ScheduledTweet[] = [];

function getRwClient(): TwitterApi["readWrite"] | null {
  const appKey = process.env.TWITTER_API_KEY;
  const appSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_SECRET;

  if (!appKey || !appSecret || !accessToken || !accessSecret) {
    return null;
  }

  const client = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });

  return client.readWrite;
}

export function scheduleTweet(text: string, postAt: string): ScheduledTweet {
  const tweet: ScheduledTweet = {
    id: Date.now(),
    text,
    postAt,
    posted: false,
  };
  tweets.push(tweet);
  return tweet;
}

export function getScheduledTweets(): ScheduledTweet[] {
  return tweets.map((t) => ({ ...t }));
}

export async function processDueTweets(): Promise<void> {
  const now = new Date();
  const rw = getRwClient();

  for (const tweet of tweets) {
    if (!tweet.posted && new Date(tweet.postAt) <= now) {
      if (!rw) {
        console.log(
          "[auto-tweet-scheduler] Missing Twitter env vars; would post:",
          tweet.text
        );
        tweet.posted = true;
        continue;
      }
      try {
        await rw.v2.tweet(tweet.text);
        tweet.posted = true;
        console.log("Tweet posted:", tweet.text);
      } catch (err) {
        console.error("Error posting tweet:", err);
      }
    }
  }
}

export function ensureTweetSchedulerWorker(): void {
  const g = globalThis as typeof globalThis & {
    __tweetSchedulerWorkerStarted?: boolean;
  };
  if (g.__tweetSchedulerWorkerStarted) return;
  g.__tweetSchedulerWorkerStarted = true;

  const MINUTE_MS = 60 * 1000;
  setInterval(() => {
    void processDueTweets();
  }, MINUTE_MS);
}
