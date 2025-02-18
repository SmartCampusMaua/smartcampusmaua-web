import { NextRequest, NextResponse } from 'next/server';

// Defina a URL da API do NestJS que verifica o estado da sessão
const CHECK_SESSION_URL = `${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_SERVER_PORT}/api/auth/check-session`;
const SMARTCAMPUSMAUA_WEB = `${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_WEB_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_WEB_PORT}`;

export async function middleware(request: NextRequest) {
  // Obtém o cookie da requisição
  const cookies = request.headers.get('cookie') || '';

  // Faz uma chamada à API do NestJS para verificar o estado da sessão
  const response = await fetch(CHECK_SESSION_URL, {
    headers: {
      Cookie: cookies,
    },
  });

  const { isAuthenticated } = await response.json();

  if (isAuthenticated) {
    // Se estiver autenticado, permita o acesso
    if (request.nextUrl.pathname.endsWith('/')) {
      return NextResponse.redirect(new URL('/modulos', request.url))
    }
  } else {
    if (request.nextUrl.pathname.endsWith('/modulos')) {

      // return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_WEB_URL}:${process.env.NEXT_PUBLIC_SMARTCAMPUSMAUA_WEB_PORT}`))
      return NextResponse.redirect(new URL(SMARTCAMPUSMAUA_WEB))
    }
  }
}

// Define as rotas ou padrões de URL que o middleware deve aplicar
export const config = {
  matcher: ['/', '/login', '/modulos', '/gms/devices', '/gms/alerts', '/gms/settings', '/gms/evse', '/gms/post'], // Adapte para as suas rotas protegidas
};