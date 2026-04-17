import { redirect } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  await params
  redirect('/home')
}
