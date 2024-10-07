import HeaderToggle from "@/components/modules/user/common/HeaderToggle"
import { UserInfo } from "./utils/mockUserInfo"
import UserInfoForm from "./components/UserInfoForm"

interface ProfilePageProps {
  userInfo: UserInfo
}

export default function ProfilePage({ userInfo }: ProfilePageProps) {
  return (
    <section className="md:h-96">
      <HeaderToggle title="Mi Perfil" />
      <UserInfoForm userInfo={userInfo} />
    </section>
  )
}
