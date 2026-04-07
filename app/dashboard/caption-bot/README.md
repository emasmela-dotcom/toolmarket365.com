# Daily Caption Bot

## Overview

The Daily Caption Bot is a **100% template-based** caption generation system that creates 3-5 captions daily based on your content theme and tone preferences. 

**Zero External API Usage** - All captions are generated from pre-defined templates with variable substitution. No OpenAI, no Anthropic, no external costs.

## Features

- **Template-Based Generation**: Uses pre-defined caption templates for each tone/platform combination
- **Zero API Costs**: No external API calls, works immediately out of the box
- **Customizable**: Set your preferred themes, tone, platforms, and target audience
- **Daily Generation**: Automatically generates captions on your schedule
- **Platform-Specific**: Optimized templates for Instagram, Facebook, Twitter, LinkedIn, and TikTok
- **Tone Variations**: Professional, Casual, Funny, Inspirational, and Educational tones
- **Hashtag & Emoji Integration**: Automatically includes relevant hashtags and emojis

## How It Works

1. **Template Selection**: System selects a template based on your tone and platform preferences
2. **Variable Replacement**: Replaces template variables ({theme}, {benefit}, etc.) with your content
3. **Hashtag & Emoji Addition**: Adds relevant hashtags and emojis based on category and tone
4. **Database Storage**: Saves generated captions to your Content Library

## Usage

### Generate Captions

1. Navigate to `/dashboard/caption-bot`
2. Click "Generate Captions" to create a batch of 5 captions
3. Filter by platform or tone using the dropdowns
4. Copy captions to clipboard or mark them as used

### API Endpoints

- `POST /api/bots/captions/generate` - Generate new captions
- `GET /api/bots/captions/daily` - Get today's captions
- `GET /api/bots/captions/unused` - Get unused captions
- `POST /api/bots/captions/[id]/use` - Mark caption as used

## Template System

Templates are organized by:
- **Tone**: professional, casual, funny, inspirational, educational
- **Platform**: instagram, facebook, twitter, linkedin, tiktok
- **Category**: business, motivation, tips, behind-the-scenes, general

Each template uses variables like:
- `{theme}` - Your content theme
- `{benefit}` - Random benefit statement
- `{lesson1}`, `{lesson2}`, `{lesson3}` - Random lesson statements
- `{hashtags}` - Platform-appropriate hashtags

## Database Schema

- `bot_captions` - Stores generated captions
- `bot_user_preferences` - User preferences for generation
- `bot_caption_templates` - Pre-defined caption templates

## No External APIs

This bot is completely self-contained:
- ✅ Template-based generation
- ✅ Local variable substitution
- ✅ Pre-defined hashtag/emoji pools
- ❌ No OpenAI
- ❌ No Anthropic
- ❌ No external API calls
- ❌ No usage costs

## Customization

Users can customize:
- Content themes (business, motivation, tips, etc.)
- Brand tone (professional, casual, funny, etc.)
- Preferred platforms
- Target audience
- Industry
- Daily generation schedule

All customization is stored in `bot_user_preferences` table.
