export { auth as middleware } from '@/lib/auth';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] // Esto incluye `/api/*`
};
