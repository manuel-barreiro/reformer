"use client"
import Image from "next/image"
import instagram from "../../public/icons/instagram.svg"
import location from "../../public/icons/location.svg"
import email from "../../public/icons/email.svg"
import whatsapp from "../../public/icons/whatsapp.svg"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const contactInfo = {
  instagram: "@reformerr_",
  email: "reformerclub@gmail.com",
  whatsapp: "+54 9 11 5633 6208 ",
  location: "BUENOS AIRES",
}

export default function ContactInfo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <a
            href={`https://www.instagram.com/${contactInfo.instagram
              .split("")
              .filter((char) => char !== "@")
              .join("")}`}
            target="_blank"
            className="flex items-center gap-2"
          >
            <Image width={30} src={instagram} alt="ig" />
          </a>
        </TooltipTrigger>
        <TooltipContent className="bg-grey_pebble text-pearl">
          <span className="font-dm_mono text-xs font-medium">
            {contactInfo.instagram}
          </span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <a
            href={`tel:${contactInfo.whatsapp.split(" ").join("")}`}
            target="_blank"
            className="flex items-center gap-2"
          >
            <Image width={30} src={whatsapp} alt="ig" />
          </a>
        </TooltipTrigger>
        <TooltipContent className="bg-grey_pebble text-pearl">
          <span className="font-dm_mono text-xs font-medium">
            {contactInfo.whatsapp}
          </span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <a
            href={`mailto:${contactInfo.email}`}
            target="_blank"
            className="flex items-center gap-2"
          >
            <Image width={30} src={email} alt="ig" />
          </a>
        </TooltipTrigger>
        <TooltipContent className="bg-grey_pebble text-pearl">
          <span className="font-dm_mono text-xs font-medium">
            {contactInfo.email}
          </span>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <a target="_blank" className="flex items-center gap-2">
            <Image width={30} src={location} alt="ig" />
          </a>
        </TooltipTrigger>
        <TooltipContent className="bg-grey_pebble text-pearl">
          <span className="font-dm_mono text-xs font-medium">
            {contactInfo.location}{" "}
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
