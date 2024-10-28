import ResetPasswordForm from "@/components/modules/auth/ResetPasswordForm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Isotipo } from "@/assets/icons"
import Image from "next/image"

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { token: string }
}) {
  return (
    <div className="h-auto w-full text-pearl lg:grid lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="/images/resetPassword.jpg"
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
        <Link href="/sign-in">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </Button>
      <div className="flex min-h-[100dvh] items-center justify-center bg-pearl py-12">
        <div className="flex flex-col items-center gap-4 text-midnight">
          <Link href={"/"}>
            <Isotipo className="h-8 w-8" />
          </Link>
          <p className="font-dm_mono text-2xl font-bold">NUEVA CONTRASEÑA</p>
          <p className="font-dm_sans text-grey_pebble">
            Ingresá tu nueva contraseña
          </p>
          <ResetPasswordForm token={searchParams.token} />
        </div>
      </div>
    </div>
  )
}
