import HeaderToggle from "@/components/modules/roles/common/HeaderToggle"
import { UserInfo } from "./utils/mockUserInfo"
import UserInfoForm from "./components/UserInfoForm"

interface ProfilePageProps {
  userInfo: UserInfo
}

export default function ProfilePage({ userInfo }: ProfilePageProps) {
  return (
    <section className="h-full">
      <HeaderToggle title="Mi Perfil" />
      <UserInfoForm userInfo={userInfo} />
    </section>
  )
}
