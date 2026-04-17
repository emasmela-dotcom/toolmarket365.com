import { redirect } from 'next/navigation'

/** Listing at `/tools` was removed; categories and hero live on `/home`. */
export default function ToolsIndexPage() {
  redirect('/home')
}
