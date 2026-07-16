import { redirect } from 'next/navigation'

/** `/tools` index redirects to the homepage catalog (canonical tool list). */
export default function ToolsIndexPage() {
  redirect('/')
}
