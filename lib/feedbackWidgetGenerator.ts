export type FeedbackWidgetInput = {
  projectTitle: string
  webhookUrl?: string
}

export type FeedbackWidgetResult = {
  htmlEmbed: string
  setupNotes: string[]
}

export function generateFeedbackWidgetSnippet(input: FeedbackWidgetInput): FeedbackWidgetResult {
  const t = input.projectTitle.trim() || 'Feedback'
  const wh = (input.webhookUrl || 'https://hooks.example.com/feedback').trim()

  const htmlEmbed = `<!-- ${t} — paste before </body> -->
<button id="tm365-fb" type="button" style="position:fixed;bottom:1rem;right:1rem;z-index:9999;padding:0.6rem 1rem;border-radius:9999px;border:none;background:#111827;color:#fff;font-weight:600;cursor:pointer;">Feedback</button>
<div id="tm365-panel" hidden style="position:fixed;bottom:4rem;right:1rem;z-index:9999;width:min(22rem,92vw);padding:1rem;border-radius:0.5rem;background:#fff;color:#111;border:1px solid #e5e7eb;box-shadow:0 8px 24px rgba(0,0,0,.15);">
  <p style="margin:0 0 .5rem;font-weight:600;">${t.replace(/</g, '')}</p>
  <textarea id="tm365-msg" rows="4" style="width:100%;box-sizing:border-box;margin-bottom:.5rem;"></textarea>
  <button type="button" id="tm365-send" style="width:100%;padding:.5rem;border-radius:.375rem;border:none;background:#2563eb;color:#fff;font-weight:600;">Send</button>
</div>
<script>(function(){var b=document.getElementById("tm365-fb"),p=document.getElementById("tm365-panel"),s=document.getElementById("tm365-send"),m=document.getElementById("tm365-msg");b.onclick=function(){p.hidden=!p.hidden};s.onclick=function(){fetch("${wh.replace(/"/g, '')}",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:m.value})}).catch(function(){});p.hidden=true;m.value=""}})();</script>`

  const setupNotes = [
    'Point webhookUrl to your own API route; never expose secrets in static HTML.',
    'Add rate limiting and spam honeypot server-side.',
    'Style the button to match your brand tokens.',
  ]

  return { htmlEmbed, setupNotes }
}
