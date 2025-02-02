import { NextResponse } from "next/server"
import { auth } from "./auth"

const publicRoutes = ["/", "/api/notify", "/api/cron/update-statuses"]
const authRoutes = ["/sign-in", "/sign-up"]
const apiAuthPrefix = "/api/auth"
const apiRoutes = ["/api/create_preference", "/api/packages"]
const passwordRoutes = ["/forgot-password", "/reset-password"]
const adminRoutes = ["/admin/pagos", "/admin/paquetes", "/admin/calendario"]
const userRoutes = ["/paquetes", "/reservas", "/calendario", "/perfil"]

export default auth((req) => {
  const { nextUrl } = req
  const userRole = req.auth?.user.role
  const isLoggedIn = !!req.auth

  // console.log("MIDDLEWARE", req.auth?.user)

  // If user is logged in, redirect them away from password reset routes
  if (passwordRoutes.includes(nextUrl.pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(
        new URL(userRole === "admin" ? "/admin/pagos" : "/paquetes", nextUrl)
      )
    }

    // Only check for token on reset-password page
    if (nextUrl.pathname === "/reset-password") {
      const token = nextUrl.searchParams.get("token")
      if (!token) {
        return NextResponse.redirect(new URL("/forgot-password", nextUrl))
      }
    }

    return NextResponse.next()
  }

  // Allow all authentication API routes
  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next()
  }

  // Handle /checkout and API routes
  if (
    nextUrl.pathname === "/checkout" ||
    apiRoutes.some((route) => nextUrl.pathname.startsWith(route))
  ) {
    if (isLoggedIn) {
      return NextResponse.next()
    } else {
      // Store the original URL in the search params
      const signInUrl = new URL("/sign-in", nextUrl)
      signInUrl.searchParams.set("callbackUrl", nextUrl.pathname)
      return NextResponse.redirect(signInUrl)
    }
  }

  // Allow access to public routes regardless of authentication status
  if (publicRoutes.includes(nextUrl.pathname)) {
    return NextResponse.next()
  }

  // Redirect to /sign-in if the user is not logged in and tries to access a protected route
  if (
    !isLoggedIn &&
    !authRoutes.includes(nextUrl.pathname) &&
    !publicRoutes.includes(nextUrl.pathname)
  ) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl))
  }

  // Role-based redirection
  if (isLoggedIn) {
    if (userRole === "admin") {
      // Redirect admin to /admin/pagos if they try to access auth routes
      if (authRoutes.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/admin/pagos", nextUrl))
      }
      // Redirect admin to /admin/pagos if they try to access /admin
      if (nextUrl.pathname === "/admin") {
        return NextResponse.redirect(new URL("/admin/pagos", nextUrl))
      }
      // Redirect admin to /admin/pagos if they try to access user routes
      if (userRoutes.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/admin/pagos", nextUrl))
      }
      // Allow admin to access admin routes
      if (adminRoutes.includes(nextUrl.pathname)) {
        return NextResponse.next()
      }
    } else if (userRole === "user") {
      if (authRoutes.includes(nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/paquetes", nextUrl))
      }
      // Redirect user to /paquetes if they try to access admin routes
      if (
        nextUrl.pathname.startsWith("/admin") ||
        adminRoutes.includes(nextUrl.pathname)
      ) {
        return NextResponse.redirect(new URL("/paquetes", nextUrl))
      }
      // Allow user to access user routes
      if (userRoutes.includes(nextUrl.pathname)) {
        return NextResponse.next()
      }
    }
  }

  // For any other case, allow the request to proceed
  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  unstable_allowDynamic: ["**/node_modules/@react-email*/**/*.mjs*"],
}
