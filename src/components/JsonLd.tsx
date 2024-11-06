// components/JsonLd.tsx
export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HealthClub",
          name: "Reformer Wellness Club",
          description:
            "Transformá tu cuerpo, y elevá tu mente en el mejor wellness club",
          image: "https://www.reformer.com.ar/icons/opengraph-image.png",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Colectora Este Panamericana S/N Km. 44",
            addressLocality: "Del Viso",
            addressRegion: "Pilar",
            postalCode: "B1669",
            addressCountry: "AR",
          },
          url: "https://www.reformer.com.ar",
          openingHours: "Mo,Tu,We,Th,Fr,Sa 08:00-21:00",
        }),
      }}
    />
  )
}
