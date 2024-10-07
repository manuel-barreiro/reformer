import ProfilePage from "@/components/modules/user/perfil/ProfilePage"
import { mockUserInfo } from "@/components/modules/user/perfil/utils/mockUserInfo"

async function getUserInfo() {
  return mockUserInfo
}

export default async function MiPerfil() {
  const userInfo = await getUserInfo()

  return <ProfilePage userInfo={userInfo} />
}
