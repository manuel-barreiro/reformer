import Servicio from "./Servicio"
import yoga from "/public/images/yoga.webp"
import pilates from "/public/images/pilates.webp"
import { ServicioInfo } from "@/lib/types"

const pilatesInfo: ServicioInfo[] = [
  {
    name: "POWER STRENGTH CORE",
    intensity: 4,
    zone: "Musculatura del tren superior",
  },
  {
    name: "POWER STRENGTH YIN",
    intensity: 4,
    zone: "Inferior (glúteos y piernas)",
  },
  {
    name: "FLEXIBILIDAD",
    intensity: 3,
    zone: "Elongación musculatura integral",
  },
  {
    name: "RECOVERY",
    intensity: 2,
    zone: "Recovery para lesiones o imbalances",
  },
  {
    name: "INDIVIDUALES",
    intensity: "Personalizada",
    zone: "Foco en puntos a elección",
  },
]
const yogaInfo: ServicioInfo[] = [
  {
    name: "HATHA",
    description:
      "Se sigue el abordaje tradicional del astangayoga clásico pero más vinculado a la quietud. Se busca la permanencia y la observación en cada asana para luego conectar más con la meditación. Clase para todos los niveles.	",
  },
  {
    name: "VINYASA",
    description:
      "Se caracteriza por el dinamismo en la práctica del asana que están vinculadas con un flow más enérgico. La energía se centra en el fluir al ritmo de la respiración de una postura a otra. La inhalación nos llena de Prana al subir y se exhala al bajar (apana), limpiando el cuerpo internamente.",
  },
  {
    name: "EMBARAZADAS",
  },
]

export default function Servicios() {
  return (
    <section
      className="grid h-auto scroll-mt-28 grid-cols-1 md:grid-cols-2"
      id="servicios"
    >
      <Servicio service="pilates" img={pilates} info={pilatesInfo} />
      <Servicio service="yoga" img={yoga} info={yogaInfo} />
    </section>
  )
}
