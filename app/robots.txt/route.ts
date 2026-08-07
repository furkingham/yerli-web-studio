import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

const robots = `User-agent: *
Allow: /
Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://yerli-web-studio.vercel.app'}/sitemap.xml
`;

export function GET() {
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8',
    },
  });
}
