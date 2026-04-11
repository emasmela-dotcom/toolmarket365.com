/** Ambient types so optional dynamic import type-checks without the package installed */
declare module '@anthropic-ai/sdk' {
  export default class Anthropic {
    constructor(options: { apiKey: string })
    messages: {
      create(params: {
        model: string
        max_tokens: number
        messages: Array<{ role: string; content: string }>
      }): Promise<{
        content: Array<{ type: 'text'; text: string } | { type: string }>
      }>
    }
  }
}
