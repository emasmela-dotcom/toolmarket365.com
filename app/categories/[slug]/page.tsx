import { redirect } from 'next/navigation'

/** Category detail pages redirect to the homepage catalog (canonical tool list). */
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  await params
  redirect('/')
}
