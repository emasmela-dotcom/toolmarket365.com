import { NextRequest, NextResponse } from "next/server";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  createdAt: Date;
};

const testimonials: Testimonial[] = [];

export async function POST(req: NextRequest) {
  const body = await req.json();

  const newTestimonial: Testimonial = {
    id: Date.now(),
    name: body.name,
    role: body.role || "",
    company: body.company || "",
    content: body.content,
    rating: Number(body.rating) || 5,
    createdAt: new Date(),
  };

  testimonials.push(newTestimonial);

  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({ testimonials });
}
