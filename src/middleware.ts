import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/", "/checkout"]
const authRoutes = ["/sign-in", "/sign-up"]
const apiAuthPrefix = "/api/auth"

export default auth((req) => {
  const { nextUrl } = req
  const userRole = req.auth?.user.role
  console.log({ userRole })
  const isLoggedIn = !!req.auth

  console.log({ isLoggedIn, path: nextUrl.pathname })

  // Permitir todas las rutas de API de autenticación
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next()
  }

  // Permitir acceso a rutas públicas sin importar el estado de autenticación
  if (publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Redirigir a /paquetes si el usuario está logueado y trata de acceder a rutas de autenticación
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/paquetes", nextUrl))
  }

  // Redirigir a /sign-in si el usuario no está logueado y trata de acceder a una ruta protegida
  if (
    !isLoggedIn &&
    !authRoutes.includes(nextUrl.pathname) &&
    !publicRoutes.includes(nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  // Redirigir a /paquetes si el rol del usuario es user e intenta acceder a /admin
  if (!userRole && nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/paquetes", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
