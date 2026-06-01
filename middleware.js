import { next, rewrite } from '@vercel/functions';

const HORIZONTE33_HOST = 'horizonte33.alexiscreuzot.com';

export default function middleware(request) {
  const host = request.headers.get('host')?.split(':')[0];
  if (host !== HORIZONTE33_HOST) {
    return next();
  }

  const url = new URL(request.url);
  const { pathname } = url;

  if (pathname.startsWith('/horizonte33')) {
    return next();
  }

  url.pathname =
    pathname === '/' ? '/horizonte33/' : `/horizonte33${pathname}`;

  return rewrite(url);
}
