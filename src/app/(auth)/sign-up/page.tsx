import Image from "next/image"
import Link from "next/link"
import { Isotipo } from "@/assets/icons"
import RegisterForm from "@/components/modules/auth/SignUpForm"

export default function SignUp() {
  return (
    <div className="min-h-[100dvh] w-full text-pearl lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/signUp.jpg"
          alt="Image"
          width="1920"
          height="1080"
          className="absolute inset-0 -z-10 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div
        style={{ cursor: "url(icons/solGreyPebble.svg),auto" }}
        className="flex min-h-[100dvh] items-center justify-center bg-pearl py-12"
      >
        <div className="flex flex-col items-center gap-4 text-midnight">
          <Link href={"/"}>
            <Isotipo className="h-8 w-8" />
          </Link>
          <p className="font-dm_mono text-2xl font-bold">SIGN UP</p>
          <p className="font-dm_sans text-grey_pebble">
            Ingresá tus datos para crear tu cuenta
          </p>
          <RegisterForm />
          <div className="flex w-full flex-col gap-2 text-center text-sm text-midnight">
            <span>
              ¿Ya tenés cuenta?{" "}
              <Link
                href={"/sign-in"}
                className="font-semibold text-rust duration-300 ease-in-out hover:underline"
              >
                INICIÁ SESIÓN
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
