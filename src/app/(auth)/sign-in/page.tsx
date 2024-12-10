import Image from "next/image"
import Link from "next/link"
import LoginForm from "@/components/modules/auth/SignInForm"
import { Isotipo } from "@/assets/icons"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SignIn({
  searchParams,
}: {
  searchParams: { verified: string; error: string; reset: string }
}) {
  const isVerified = searchParams.verified === "true"
  const OAuthAccountNotLinked = searchParams.error === "OAuthAccountNotLinked"
  const passwordReset = searchParams.reset === "true"

  return (
    <div className="min-h-[100dvh] w-full bg-pearl text-pearl lg:grid lg:grid-cols-2 lg:bg-transparent">
      <div className="relative hidden lg:block">
        <Image
          src="/images/signin.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="absolute inset-0 -z-10 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <Button
        variant="ghost"
        className="absolute left-4 top-5 p-2 text-midnight lg:text-pearl"
      >
        <Link href="/">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </Button>
      <div
        style={{ cursor: "url(/icons/solGreyPebble.svg),auto" }}
        className="flex min-h-[86dvh] items-center justify-center bg-pearl py-12"
      >
        <div className="relative flex flex-col items-center gap-4 text-midnight">
          <Link href={"/"}>
            <Isotipo className="h-8 w-8" />
          </Link>
          <p className="font-dm_mono text-2xl font-bold">SIGN IN</p>
          <p className="font-dm_sans text-grey_pebble">
            Ingresá con tu email y contraseña
          </p>
          <LoginForm
            isVerified={isVerified}
            OAuthAccountNotLinked={OAuthAccountNotLinked}
            passwordReset={passwordReset}
          />
          <div className="flex w-full flex-col gap-2 text-center text-sm text-midnight">
            <span>
              ¿No tenés cuenta?{" "}
              <Link
                href={"/sign-up"}
                className="font-semibold text-rust duration-300 ease-in-out hover:underline"
              >
                REGISTRATE
              </Link>
            </span>

            <span>
              <Link
                href={"/forgot-password"}
                className="font-semibold text-midnight duration-300 ease-in-out hover:underline"
              >
                Olvidé mi contraseña
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
