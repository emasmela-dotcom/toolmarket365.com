import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const runtime = 'nodejs'

// CRON job: Process scheduled Instagram posts
export async function GET(request: NextRequest) {
  try {
    // Verify cron job authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!sql) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const now = new Date()
    // On free tier, cron runs hourly, so check posts from last hour to next hour
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneHourAhead = new Date(now.getTime() + 60 * 60 * 1000)

    // Get posts due for posting
    const duePosts = await sql`
      SELECT 
        p.id, p.account_id, p.content, p.media_urls, p.media_types,
        p.post_type, p.caption, p.hashtags, p.mentions, p.location_id,
        p.location_name, a.access_token, a.username
      FROM instagram_posts p
      INNER JOIN instagram_accounts a ON p.account_id = a.id
      WHERE p.status = 'scheduled'
        AND p.scheduled_for >= ${oneHourAgo}
        AND p.scheduled_for <= ${oneHourAhead}
      ORDER BY p.scheduled_for ASC
    `

    console.log(`Found ${duePosts.length} Instagram posts due for posting`)

    const results = []

    for (const post of duePosts) {
      try {
        console.log(`Processing Instagram post ${post.id} for @${post.username}`)
        
        // Post to Instagram via API
        const postResult = await postToInstagram(post)
        results.push(postResult)

        if (postResult.success) {
          // Update post status to published
          await sql`
            UPDATE instagram_posts
            SET 
              status = 'published',
              posted_at = NOW(),
              instagram_post_id = ${postResult.postId},
              instagram_permalink_url = ${postResult.postUrl},
              updated_at = NOW()
            WHERE id = ${post.id}
          `

          console.log(`✅ Instagram post published successfully: ${postResult.postId}`)
        } else {
          // Update post status to failed
          await sql`
            UPDATE instagram_posts
            SET 
              status = 'failed',
              error_message = ${postResult.error},
              updated_at = NOW()
            WHERE id = ${post.id}
          `

          console.error(`❌ Failed to publish Instagram post: ${postResult.error}`)
        }
      } catch (error) {
        console.error(`Error processing Instagram post ${post.id}:`, error)
        
        await sql`
          UPDATE instagram_posts
          SET 
            status = 'failed',
            error_message = ${error instanceof Error ? error.message : 'Unknown error'},
            updated_at = NOW()
          WHERE id = ${post.id}
        `
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    })

  } catch (error) {
    console.error('Error in Instagram scheduling cron job:', error)
    return NextResponse.json({ error: 'Failed to process scheduled posts' }, { status: 500 })
  }
}

async function postToInstagram(post: any) {
  try {
    const { access_token, content, media_urls, post_type, caption, hashtags, mentions, location_id } = post

    // Build final caption with hashtags and mentions
    let finalCaption = caption || content
    if (hashtags && hashtags.length > 0) {
      finalCaption += '\n\n' + hashtags.join(' ')
    }
    if (mentions && mentions.length > 0) {
      finalCaption += '\n\n' + mentions.map((m: string) => `@${m}`).join(' ')
    }

    // Handle different post types
    if (post_type === 'story') {
      return await postInstagramStory(access_token, media_urls[0], finalCaption)
    } else if (post_type === 'reel') {
      return await postInstagramReel(access_token, media_urls[0], finalCaption)
    } else {
      return await postInstagramFeed(access_token, media_urls, finalCaption, location_id)
    }
  } catch (error) {
    console.error('Error posting to Instagram:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post to Instagram'
    }
  }
}

async function postInstagramFeed(accessToken: string, mediaUrls: string[], caption: string, locationId?: string) {
  try {
    // Step 1: Create media container
    const mediaContainerData: any = {
      image_url: mediaUrls[0], // Instagram Basic Display API supports single image for now
      caption: caption.substring(0, 2200), // Instagram caption limit
      access_token: accessToken
    }

    if (locationId) {
      mediaContainerData.location_id = locationId
    }

    const containerResponse = await fetch('https://graph.facebook.com/v18.0/me/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mediaContainerData)
    })

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json().catch(() => ({}))
      throw new Error(`Failed to create media container: ${errorData.error?.message || containerResponse.statusText}`)
    }

    const containerData = await containerResponse.json()
    const creationId = containerData.id

    // Step 2: Publish the media
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/me/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken
      })
    })

    if (!publishResponse.ok) {
      const errorData = await publishResponse.json().catch(() => ({}))
      throw new Error(`Failed to publish media: ${errorData.error?.message || publishResponse.statusText}`)
    }

    const publishData = await publishResponse.json()

    return {
      success: true,
      postId: publishData.id,
      postUrl: `https://instagram.com/p/${publishData.id}`
    }
  } catch (error) {
    console.error('Error posting Instagram feed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post feed'
    }
  }
}

async function postInstagramStory(accessToken: string, mediaUrl: string, caption: string) {
  try {
    // Create story container
    const storyData = {
      media_type: 'STORIES',
      image_url: mediaUrl,
      caption: caption.substring(0, 150), // Story text limit
      access_token: accessToken
    }

    const containerResponse = await fetch('https://graph.facebook.com/v18.0/me/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(storyData)
    })

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json().catch(() => ({}))
      throw new Error(`Failed to create story container: ${errorData.error?.message || containerResponse.statusText}`)
    }

    const containerData = await containerResponse.json()

    return {
      success: true,
      postId: containerData.id,
      postUrl: `https://instagram.com/stories/${containerData.id}`
    }
  } catch (error) {
    console.error('Error posting Instagram story:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post story'
    }
  }
}

async function postInstagramReel(accessToken: string, videoUrl: string, caption: string) {
  try {
    // Create reel container
    const reelData = {
      media_type: 'REELS',
      video_url: videoUrl,
      caption: caption.substring(0, 150), // Reel caption limit
      access_token: accessToken
    }

    const containerResponse = await fetch('https://graph.facebook.com/v18.0/me/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reelData)
    })

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json().catch(() => ({}))
      throw new Error(`Failed to create reel container: ${errorData.error?.message || containerResponse.statusText}`)
    }

    const containerData = await containerResponse.json()

    return {
      success: true,
      postId: containerData.id,
      postUrl: `https://instagram.com/reel/${containerData.id}`
    }
  } catch (error) {
    console.error('Error posting Instagram reel:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to post reel'
    }
  }
}
