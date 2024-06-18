import Servicio from "./Servicio"
import { yoga, pilates, masajes } from "../../../public"

export default function Servicios() {
  return (
    <section className="grid h-auto grid-cols-1 sm:grid-cols-3">
      <Servicio service="pilates" img={pilates} />
      <Servicio service="yoga" img={yoga} />
      <Servicio service="masajes" img={masajes} />
    </section>
  )
}
