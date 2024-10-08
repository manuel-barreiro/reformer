import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

const publicRoutes = ["/"]
const authRoutes = ["/sign-in", "/sign-up"]
const apiAuthPrefix = "/api/auth"
const apiRoutes = ["/api/create_preference"] // Add other API routes as needed

export default auth((req) => {
  const { nextUrl } = req
  const userRole = req.auth?.user.role
  const isLoggedIn = !!req.auth

  console.log({ isLoggedIn, path: nextUrl.pathname })

  // Allow all authentication API routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next()
  }

  // Allow API calls from /checkout only if user is logged in
  if (
    nextUrl.pathname === "/checkout" ||
    apiRoutes.some((route) => nextUrl.pathname.startsWith(route))
  ) {
    if (isLoggedIn) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL("/sign-in", nextUrl))
    }
  }

  // Allow access to public routes regardless of authentication status
  if (publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Redirect to /paquetes if the user is logged in and tries to access auth routes
  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/paquetes", nextUrl))
  }

  // Redirect to /sign-in if the user is not logged in and tries to access a protected route
  if (
    !isLoggedIn &&
    !authRoutes.includes(nextUrl.pathname) &&
    !publicRoutes.includes(nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  // Redirect to /paquetes if the user role is user and tries to access /admin
  if (!userRole && nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/paquetes", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
