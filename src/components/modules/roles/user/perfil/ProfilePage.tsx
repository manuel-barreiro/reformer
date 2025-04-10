import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import UserInfoForm from "./components/UserInfoForm"
import { auth } from "@/auth"
import { getProfile } from "@/actions/profile"

interface UserInfo {
  name: string
  surname: string
  phone: string
  email: string
  id: string
}

export default async function ProfilePage() {
  const session = await auth()
  const userId = session?.user?.id
  const userInfo: UserInfo = userId
    ? {
        ...(await getProfile(userId)),
        name: (await getProfile(userId))?.name || "",
        surname: (await getProfile(userId))?.surname || "",
        phone: (await getProfile(userId))?.phone || "",
        email: (await getProfile(userId))?.email || "",
        id: (await getProfile(userId))?.id || "",
      }
    : {
        name: "",
        surname: "",
        phone: "",
        email: "",
        id: "",
      }

  return (
    <section className="h-full">
      <UserInfoForm userInfo={userInfo} />
    </section>
  )
}
