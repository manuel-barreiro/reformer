import Servicio from "./Servicio"
import { yoga, pilates, masajes } from "../../../public"
import { ServicioInfo } from "../../../types"

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
const masajesInfo: ServicioInfo[] = [
  {
    name: "DRENAJE LINFÁTICO",
    description:
      "Masaje suave para movilizar líquidos y toxinas del sistema circulatorio, recomendado para reducir celulitis y edemas. Se sugieren inicialmente 2 sesiones semanales.	",
  },
  {
    name: "TONIFICADOR-REDUCTOR",
    description:
      "Masaje intenso para romper adiposos y mejorar el metabolismo local, complementario de una alimentación saludable y ejercicio regular",
  },
]

export default function Servicios() {
  return (
    <section className="grid h-auto grid-cols-1 sm:grid-cols-3">
      <Servicio service="pilates" img={pilates} info={pilatesInfo} />
      <Servicio service="yoga" img={yoga} info={yogaInfo} />
      <Servicio service="masajes" img={masajes} info={masajesInfo} />
    </section>
  )
}
