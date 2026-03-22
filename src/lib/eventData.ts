import eventNetworking from "@/assets/event-networking.jpg";
import eventCooking from "@/assets/event-cooking.jpg";
import eventMusic from "@/assets/event-music.jpg";
import eventArt from "@/assets/event-art.jpg";
import eventPhoto from "@/assets/event-photo.jpg";
import eventWellness from "@/assets/event-wellness.jpg";

export interface Event {
  id: string;
  title: string;
  titleEs: string;
  description: string;
  descriptionEs: string;
  fullDescription?: string;
  fullDescriptionEs?: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  price: number;
  isFree?: boolean;
  category: string;
  categoryKey: string;
  image: string;
  spotsLeft: number;
  totalSpots: number;
  host: string;
  hostRole?: string;
  hostRoleEs?: string;
  hostEventsCount?: number;
  hostAvatarColor?: string;
  isRecurring?: boolean;
  highlights?: string[];
  highlightsEs?: string[];
  meetupUrl?: string;
  whatsappUrl?: string;
  seriesId?: string;
}

export interface EventSeries {
  id: string;
  name: string;
  nameEs: string;
  emoji: string;
  description: string;
  descriptionEs: string;
  longDescription: string;
  longDescriptionEs: string;
  frequency: string;
  frequencyEs: string;
  whoItsFor: string;
  whoItsForEs: string;
  colorAccent: string;
  totalPastAttendees: number;
  totalPastEditions: number;
}

export const categoryColors: Record<string, string> = {
  gastronomy: "bg-orange-100 text-orange-700",
  networking: "bg-blue-100 text-blue-700",
  "music-culture": "bg-purple-100 text-purple-700",
  workshop: "bg-emerald-100 text-emerald-700",
  wellness: "bg-teal-100 text-teal-700",
};

export const events: Event[] = [
  {
    id: "1",
    title: "Mediterranean Wine & Tapas Evening",
    titleEs: "Noche de Vinos y Tapas Mediterráneas",
    description: "Join sommelier Laura Martínez for an exclusive evening of premium Alicante wines paired with artisan tapas at a historic courtyard venue.",
    descriptionEs: "Únete a la sumiller Laura Martínez para una noche exclusiva de vinos premium de Alicante maridados con tapas artesanales.",
    fullDescription: "An unforgettable evening exploring the finest wines from the Alicante D.O. region, expertly paired with locally sourced tapas. Sommelier Laura Martínez will guide you through five premium wines, sharing stories of the vineyards and winemakers behind each bottle. The evening takes place in a restored 18th-century courtyard in Alicante's historic quarter, with ambient live guitar. You'll taste artisan cheeses, cured meats, and seasonal small plates — all prepared by a local chef using market-fresh ingredients. Whether you're a wine enthusiast or a curious beginner, this is a warm, social, and educational experience you won't forget.",
    fullDescriptionEs: "Una noche inolvidable explorando los mejores vinos de la D.O. Alicante, maridados con tapas de origen local. La sumiller Laura Martínez te guiará a través de cinco vinos premium, compartiendo historias de los viñedos y enólogos detrás de cada botella. La velada tiene lugar en un patio restaurado del siglo XVIII en el casco histórico de Alicante, con guitarra en vivo ambiental. Degustarás quesos artesanales, embutidos curados y pequeños platos de temporada — todo preparado por un chef local con ingredientes frescos del mercado.",
    date: "2026-04-12",
    time: "20:00",
    location: "Casco Antiguo, Alicante",
    address: "Calle Mayor 14, 03002 Alicante",
    price: 45,
    isFree: false,
    category: "Gastronomy",
    categoryKey: "gastronomy",
    image: eventCooking,
    spotsLeft: 8,
    totalSpots: 20,
    host: "Laura Martínez",
    hostRole: "Sommelier & Event Curator",
    hostRoleEs: "Sumiller y Curadora de Eventos",
    hostEventsCount: 24,
    hostAvatarColor: "hsl(16, 65%, 48%)",
    isRecurring: true,
    highlights: [
      "🍷 5 premium Alicante D.O. wines",
      "🧀 Artisan tapas by local chef",
      "🎸 Live ambient guitar",
      "📍 Historic 18th-century courtyard",
      "👥 Small group (max 20)",
    ],
    highlightsEs: [
      "🍷 5 vinos premium D.O. Alicante",
      "🧀 Tapas artesanales de chef local",
      "🎸 Guitarra ambiental en vivo",
      "📍 Patio histórico del siglo XVIII",
      "👥 Grupo reducido (máx. 20)",
    ],
    meetupUrl: "https://www.meetup.com/aftr-events",
    whatsappUrl: "https://chat.whatsapp.com/example1",
    seriesId: "tapas-evenings",
  },
  {
    id: "2",
    title: "Professional Networking Rooftop",
    titleEs: "Networking Profesional en Terraza",
    description: "Connect with entrepreneurs, freelancers and professionals at a sunset rooftop overlooking the Mediterranean. Curated introductions included.",
    descriptionEs: "Conecta con emprendedores, freelancers y profesionales en una terraza al atardecer con vistas al Mediterráneo.",
    fullDescription: "Our signature networking event brings together Alicante's most driven professionals in an unforgettable rooftop setting. Enjoy curated introductions — no awkward mingling. We use a structured format: short icebreakers, rotating conversations, and themed discussion tables (tech, creative, wellness, hospitality). Drinks and canapés included. Whether you're new to the city or a long-time resident, this is the fastest way to build genuine professional connections in Alicante.",
    fullDescriptionEs: "Nuestro evento de networking insignia reúne a los profesionales más motivados de Alicante en una terraza inolvidable. Disfruta de presentaciones curadas — sin socialización incómoda. Usamos un formato estructurado: rompehielos, conversaciones rotativas y mesas temáticas (tech, creativo, wellness, hostelería). Bebidas y canapés incluidos.",
    date: "2026-04-18",
    time: "19:30",
    location: "Hotel Meliá, Alicante",
    address: "Plaza del Puerto 3, 03001 Alicante",
    price: 25,
    isFree: false,
    category: "Networking",
    categoryKey: "networking",
    image: eventNetworking,
    spotsLeft: 15,
    totalSpots: 40,
    host: "Marc de Vries",
    hostRole: "Community Builder",
    hostRoleEs: "Constructor de Comunidad",
    hostEventsCount: 36,
    hostAvatarColor: "hsl(197, 62%, 42%)",
    isRecurring: true,
    highlights: [
      "🤝 Curated introductions",
      "🍸 Drinks & canapés included",
      "🌅 Sunset Mediterranean views",
      "💬 Themed discussion tables",
      "🔄 Recurring monthly event",
    ],
    highlightsEs: [
      "🤝 Presentaciones curadas",
      "🍸 Bebidas y canapés incluidos",
      "🌅 Vistas al atardecer mediterráneo",
      "💬 Mesas temáticas de discusión",
      "🔄 Evento mensual recurrente",
    ],
    meetupUrl: "https://www.meetup.com/aftr-events",
    whatsappUrl: "https://chat.whatsapp.com/example2",
    seriesId: "networking-rooftop",
  },
  {
    id: "3",
    title: "Live Jazz & Mediterranean Dinner",
    titleEs: "Jazz en Vivo y Cena Mediterránea",
    description: "An intimate evening of live jazz performance with a 4-course Mediterranean dinner at a charming Alicante courtyard venue.",
    descriptionEs: "Una noche íntima de jazz en vivo con una cena mediterránea de 4 platos en un encantador patio alicantino.",
    fullDescription: "Immerse yourself in an evening where world-class jazz meets Valencian gastronomy. A trio of local jazz musicians performs while you enjoy a 4-course Mediterranean dinner crafted by chef Ana Beltrán. The intimate courtyard setting (max 30 guests) ensures an exclusive, memorable experience. Menu highlights include fresh seafood ceviche, slow-cooked lamb, and a citrus dessert paired with local digestif.",
    fullDescriptionEs: "Sumérgete en una velada donde el jazz de primer nivel se encuentra con la gastronomía valenciana. Un trío de músicos de jazz locales actúa mientras disfrutas de una cena mediterránea de 4 platos elaborada por la chef Ana Beltrán. El íntimo patio (máx. 30 invitados) asegura una experiencia exclusiva e inolvidable.",
    date: "2026-04-25",
    time: "20:30",
    location: "La Taberna del Gourmet, Alicante",
    address: "Calle San Fernando 10, 03002 Alicante",
    price: 55,
    isFree: false,
    category: "Music & Culture",
    categoryKey: "music-culture",
    image: eventMusic,
    spotsLeft: 4,
    totalSpots: 30,
    host: "Ana Beltrán",
    hostRole: "Chef & Cultural Producer",
    hostRoleEs: "Chef y Productora Cultural",
    hostEventsCount: 18,
    hostAvatarColor: "hsl(280, 45%, 50%)",
    highlights: [
      "🎷 Live jazz trio performance",
      "🍽️ 4-course Mediterranean dinner",
      "🥂 Wine pairing available",
      "📍 Intimate courtyard (max 30)",
      "👨‍🍳 By chef Ana Beltrán",
    ],
    highlightsEs: [
      "🎷 Trío de jazz en vivo",
      "🍽️ Cena mediterránea de 4 platos",
      "🥂 Maridaje de vinos disponible",
      "📍 Patio íntimo (máx. 30)",
      "👨‍🍳 Por la chef Ana Beltrán",
    ],
    meetupUrl: "https://www.meetup.com/aftrsocialclub/",
    whatsappUrl: "https://chat.whatsapp.com/H0GxCmzpHZQBPxQNMLLXxW",
  },
  {
    id: "4",
    title: "Watercolor Painting Workshop",
    titleEs: "Taller de Acuarela",
    description: "Learn watercolor techniques inspired by Alicante's coastal landscapes. All materials provided. Suitable for beginners and intermediates.",
    descriptionEs: "Aprende técnicas de acuarela inspiradas en los paisajes costeros de Alicante. Todo el material incluido.",
    fullDescription: "Spend a relaxing morning learning watercolor painting with artist Elena Campos in her sunlit El Campello studio. You'll explore wet-on-wet, dry brush, and layering techniques while painting Alicante's coastal scenery. All materials are provided — premium watercolor paper, professional-grade paints, and brushes. You'll leave with your own finished piece and newfound skills. Suitable for complete beginners and intermediate painters. Coffee and pastries included.",
    fullDescriptionEs: "Pasa una mañana relajante aprendiendo acuarela con la artista Elena Campos en su luminoso estudio de El Campello. Explorarás técnicas de húmedo sobre húmedo, pincel seco y capas mientras pintas los paisajes costeros de Alicante. Todo el material incluido. Café y pasteles incluidos.",
    date: "2026-05-03",
    time: "10:00",
    location: "Estudio Arte Sol, El Campello",
    address: "Avenida de la Generalitat 45, 03560 El Campello",
    price: 35,
    isFree: false,
    category: "Workshop",
    categoryKey: "workshop",
    image: eventArt,
    spotsLeft: 6,
    totalSpots: 12,
    host: "Elena Campos",
    hostRole: "Artist & Workshop Leader",
    hostRoleEs: "Artista y Líder de Talleres",
    hostEventsCount: 31,
    hostAvatarColor: "hsl(82, 25%, 42%)",
    highlights: [
      "🎨 All materials provided",
      "☕ Coffee & pastries included",
      "🖼️ Take home your painting",
      "👩‍🎨 Led by artist Elena Campos",
      "🌊 Coastal landscape inspiration",
    ],
    highlightsEs: [
      "🎨 Todo el material incluido",
      "☕ Café y pasteles incluidos",
      "🖼️ Llévate tu pintura a casa",
      "👩‍🎨 Dirigido por Elena Campos",
      "🌊 Inspiración en paisajes costeros",
    ],
    meetupUrl: "https://www.meetup.com/aftr-events",
    whatsappUrl: "https://chat.whatsapp.com/example4",
  },
  {
    id: "5",
    title: "Street Photography Masterclass",
    titleEs: "Masterclass de Fotografía Callejera",
    description: "Explore Alicante's old town with pro photographer David Ruiz. Learn composition, light, and storytelling through the lens.",
    descriptionEs: "Explora el casco antiguo de Alicante con el fotógrafo profesional David Ruiz. Aprende composición, luz y narrativa visual.",
    fullDescription: "Walk through Alicante's most photogenic streets with award-winning photographer David Ruiz. This hands-on masterclass covers composition rules, natural light mastery, and visual storytelling. You'll shoot the Barrio de Santa Cruz, the Esplanade, and hidden alleyways — learning to see the city through an artist's eye. Bring any camera (phone is fine). Ends with a group review session at a local café. Limited to 10 participants for personalized feedback.",
    fullDescriptionEs: "Recorre las calles más fotogénicas de Alicante con el fotógrafo premiado David Ruiz. Esta masterclass práctica cubre reglas de composición, dominio de la luz natural y narrativa visual. Fotografiarás el Barrio de Santa Cruz, la Explanada y callejones ocultos. Limitado a 10 participantes.",
    date: "2026-05-10",
    time: "09:30",
    location: "Plaza del Ayuntamiento, Alicante",
    address: "Plaza del Ayuntamiento 1, 03002 Alicante",
    price: 40,
    isFree: false,
    category: "Workshop",
    categoryKey: "workshop",
    image: eventPhoto,
    spotsLeft: 10,
    totalSpots: 10,
    host: "David Ruiz",
    hostRole: "Photographer & Educator",
    hostRoleEs: "Fotógrafo y Educador",
    hostEventsCount: 15,
    hostAvatarColor: "hsl(38, 40%, 45%)",
    highlights: [
      "📸 Any camera welcome (phone OK)",
      "🚶 Walking tour through old town",
      "☕ Group review at local café",
      "👤 Max 10 for personal feedback",
      "🏆 Led by award-winning pro",
    ],
    highlightsEs: [
      "📸 Cualquier cámara (móvil OK)",
      "🚶 Tour a pie por el casco antiguo",
      "☕ Revisión grupal en café local",
      "👤 Máx. 10 para feedback personal",
      "🏆 Dirigido por profesional premiado",
    ],
    meetupUrl: "https://www.meetup.com/aftr-events",
    whatsappUrl: "https://chat.whatsapp.com/example5",
  },
  {
    id: "6",
    title: "Sunrise Rooftop Wellness Session",
    titleEs: "Sesión de Bienestar al Amanecer en Terraza",
    description: "Start your Saturday with guided meditation, breathwork, and gentle movement on a panoramic terrace overlooking the sea.",
    descriptionEs: "Comienza tu sábado con meditación guiada, respiración y movimiento suave en una terraza panorámica frente al mar.",
    fullDescription: "Begin your weekend with intention. This 90-minute wellness session combines guided meditation, breathwork exercises, and gentle movement (no yoga mat required — chairs and cushions provided). Set on a panoramic rooftop terrace overlooking Playa San Juan, you'll watch the sun rise over the Mediterranean as you reconnect with yourself. Healthy breakfast included afterwards: fresh fruit, granola, juices, and herbal teas. All levels welcome — no prior experience needed.",
    fullDescriptionEs: "Comienza tu fin de semana con intención. Esta sesión de bienestar de 90 minutos combina meditación guiada, ejercicios de respiración y movimiento suave. Ubicada en una terraza panorámica con vistas a la Playa San Juan, verás amanecer sobre el Mediterráneo. Desayuno saludable incluido. Todos los niveles bienvenidos.",
    date: "2026-05-17",
    time: "07:30",
    location: "Terraza Azul, Playa San Juan",
    address: "Avenida de Niza 38, 03540 Playa San Juan, Alicante",
    price: 22,
    isFree: false,
    category: "Wellness",
    categoryKey: "wellness",
    image: eventWellness,
    spotsLeft: 12,
    totalSpots: 25,
    host: "Sara Navarro",
    hostRole: "Wellness Coach",
    hostRoleEs: "Coach de Bienestar",
    hostEventsCount: 42,
    hostAvatarColor: "hsl(170, 45%, 40%)",
    isRecurring: true,
    highlights: [
      "🧘 Guided meditation & breathwork",
      "🌅 Sunrise over the Mediterranean",
      "🥣 Healthy breakfast included",
      "🪑 No mat needed — cushions provided",
      "🔄 Every Saturday morning",
    ],
    highlightsEs: [
      "🧘 Meditación guiada y respiración",
      "🌅 Amanecer sobre el Mediterráneo",
      "🥣 Desayuno saludable incluido",
      "🪑 Sin esterilla — cojines incluidos",
      "🔄 Todos los sábados por la mañana",
    ],
    meetupUrl: "https://www.meetup.com/aftr-events",
    whatsappUrl: "https://chat.whatsapp.com/example6",
    seriesId: "sunrise-wellness",
  },
];

export function getRelatedEvents(currentId: string, category: string, max = 4): Event[] {
  return events
    .filter(e => e.id !== currentId)
    .sort((a, b) => (a.category === category ? -1 : 1) - (b.category === category ? -1 : 1))
    .slice(0, max);
}

export const eventSeries: EventSeries[] = [
  {
    id: "tapas-evenings",
    name: "Wine & Tapas Evenings",
    nameEs: "Noches de Vinos y Tapas",
    emoji: "🍷",
    description: "A recurring series of premium wine and tapas experiences in Alicante's most charming venues.",
    descriptionEs: "Una serie recurrente de experiencias premium de vinos y tapas en los locales más encantadores de Alicante.",
    longDescription: "Every month, sommelier Laura Martínez curates a new wine and tapas pairing in a different historic venue across Alicante. Each edition features a unique selection of Alicante D.O. wines paired with seasonal tapas by local chefs. It's social, educational, and always intimate — max 20 guests per evening. Whether you're a seasoned oenophile or just love good food and conversation, this series is your monthly ritual in the Mediterranean.",
    longDescriptionEs: "Cada mes, la sumiller Laura Martínez cura un nuevo maridaje de vinos y tapas en un local histórico diferente de Alicante. Cada edición presenta una selección única de vinos D.O. Alicante maridados con tapas de temporada. Es social, educativa e íntima — máximo 20 invitados por noche. Tu ritual mensual en el Mediterráneo.",
    frequency: "Every 2nd Saturday",
    frequencyEs: "Cada 2º sábado",
    whoItsFor: "Wine lovers, foodies, expats looking to connect over great food and local culture. No expertise required — just curiosity and an appetite.",
    whoItsForEs: "Amantes del vino, foodies, expatriados que buscan conectar a través de buena comida y cultura local. No se requiere experiencia — solo curiosidad y apetito.",
    colorAccent: "hsl(16, 65%, 48%)",
    totalPastAttendees: 312,
    totalPastEditions: 16,
  },
  {
    id: "networking-rooftop",
    name: "Rooftop Networking",
    nameEs: "Networking en Terraza",
    emoji: "🤝",
    description: "Monthly professional networking at sunset rooftops across Alicante. Curated introductions, no awkward mingling.",
    descriptionEs: "Networking profesional mensual en terrazas al atardecer en Alicante. Presentaciones curadas, sin socialización incómoda.",
    longDescription: "Our signature networking series gathers Alicante's most driven entrepreneurs, freelancers, and professionals every month at a different rooftop venue. Each edition uses a structured format — icebreakers, rotating conversations, and themed tables (tech, creative, wellness, hospitality). Drinks and canapés are always included. This isn't a meetup — it's where real connections happen. Many attendees have found business partners, clients, and close friends through this series.",
    longDescriptionEs: "Nuestra serie de networking insignia reúne a los emprendedores, freelancers y profesionales más motivados de Alicante cada mes en una terraza diferente. Cada edición usa un formato estructurado — rompehielos, conversaciones rotativas y mesas temáticas. Bebidas y canapés siempre incluidos. No es un meetup — es donde ocurren conexiones reales.",
    frequency: "Every 3rd Thursday",
    frequencyEs: "Cada 3er jueves",
    whoItsFor: "Entrepreneurs, freelancers, remote workers, and professionals who want quality connections — not business card exchanges. All industries welcome.",
    whoItsForEs: "Emprendedores, freelancers, trabajadores remotos y profesionales que buscan conexiones de calidad. Todas las industrias bienvenidas.",
    colorAccent: "hsl(197, 62%, 42%)",
    totalPastAttendees: 487,
    totalPastEditions: 14,
  },
  {
    id: "sunrise-wellness",
    name: "Sunrise Wellness",
    nameEs: "Bienestar al Amanecer",
    emoji: "🌅",
    description: "Weekly Saturday morning wellness — meditation, breathwork, and gentle movement with sea views.",
    descriptionEs: "Bienestar semanal los sábados — meditación, respiración y movimiento suave con vistas al mar.",
    longDescription: "Every Saturday at 7:30am, a small group gathers on a panoramic terrace overlooking Playa San Juan to start the weekend with intention. Led by wellness coach Sara Navarro, each session combines guided meditation, breathwork, and gentle movement (no yoga mat needed — cushions provided). Afterwards, enjoy a healthy breakfast together: fresh fruit, granola, juices, and herbal teas. It's become one of Alicante's most beloved weekend rituals — a calm, connected start to every Saturday.",
    longDescriptionEs: "Cada sábado a las 7:30, un pequeño grupo se reúne en una terraza panorámica con vistas a la Playa San Juan. Dirigido por la coach Sara Navarro, cada sesión combina meditación guiada, respiración y movimiento suave. Después, disfruta de un desayuno saludable juntos. Se ha convertido en uno de los rituales de fin de semana más queridos de Alicante.",
    frequency: "Every Saturday",
    frequencyEs: "Todos los sábados",
    whoItsFor: "Anyone looking for a calm, social, screen-free start to the weekend. All levels welcome — no experience needed. Come alone or bring a friend.",
    whoItsForEs: "Cualquiera que busque un comienzo tranquilo, social y sin pantallas para el fin de semana. Todos los niveles bienvenidos. Ven solo o con un amigo.",
    colorAccent: "hsl(170, 45%, 40%)",
    totalPastAttendees: 628,
    totalPastEditions: 38,
  },
];

export function getEventsBySeriesId(seriesId: string): Event[] {
  return events
    .filter(e => e.seriesId === seriesId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export interface Collaborator {
  id: string;
  name: string;
  type: string;
  typeEs: string;
  bio: string;
  bioEs: string;
  image: string;
  instagram: string;
  linkedin: string;
  eventsHosted: number;
}

export const collaborators: Collaborator[] = [
  {
    id: "1",
    name: "Sabor Alicante",
    type: "Gastronomy & Wine",
    typeEs: "Gastronomía y Vinos",
    bio: "Premium food and wine experiences celebrating the best of Valencian cuisine.",
    bioEs: "Experiencias gastronómicas premium celebrando lo mejor de la cocina valenciana.",
    image: eventCooking,
    instagram: "https://instagram.com/saboralicante",
    linkedin: "https://linkedin.com/company/saboralicante",
    eventsHosted: 24,
  },
  {
    id: "2",
    name: "Cultura Viva",
    type: "Music & Culture",
    typeEs: "Música y Cultura",
    bio: "Bringing live music and cultural experiences to intimate Mediterranean venues.",
    bioEs: "Llevando música en vivo y experiencias culturales a lugares íntimos mediterráneos.",
    image: eventMusic,
    instagram: "https://instagram.com/culturaviva",
    linkedin: "https://linkedin.com/company/culturaviva",
    eventsHosted: 18,
  },
  {
    id: "3",
    name: "Arte Mediterráneo",
    type: "Art & Workshops",
    typeEs: "Arte y Talleres",
    bio: "Creative workshops and art experiences in stunning studio spaces across Alicante.",
    bioEs: "Talleres creativos y experiencias artísticas en estudios increíbles de Alicante.",
    image: eventArt,
    instagram: "https://instagram.com/artemediterraneo",
    linkedin: "https://linkedin.com/company/artemediterraneo",
    eventsHosted: 31,
  },
  {
    id: "4",
    name: "Zen Alicante",
    type: "Wellness & Mindfulness",
    typeEs: "Bienestar y Mindfulness",
    bio: "Holistic wellness sessions combining meditation, movement, and the Mediterranean lifestyle.",
    bioEs: "Sesiones de bienestar holístico combinando meditación, movimiento y el estilo de vida mediterráneo.",
    image: eventWellness,
    instagram: "https://instagram.com/zenalicante",
    linkedin: "https://linkedin.com/company/zenalicante",
    eventsHosted: 42,
  },
];

export interface VenuePartner {
  id: string;
  name: string;
  type: string;
  typeEs: string;
  city: string;
  eventsHosted: number;
}

export const venuePartners: VenuePartner[] = [
  { id: "v1", name: "La Taberna del Puerto", type: "Restaurant & Bar", typeEs: "Restaurante y Bar", city: "Alicante", eventsHosted: 34 },
  { id: "v2", name: "Rooftop Mediterráneo", type: "Rooftop Terrace", typeEs: "Terraza", city: "Alicante", eventsHosted: 28 },
  { id: "v3", name: "Espacio Creativo", type: "Art Studio", typeEs: "Estudio de Arte", city: "Alicante", eventsHosted: 19 },
  { id: "v4", name: "Café Central", type: "Café & Coworking", typeEs: "Café y Coworking", city: "Alicante", eventsHosted: 22 },
  { id: "v5", name: "Jardín Botánico", type: "Garden Venue", typeEs: "Jardín", city: "Elche", eventsHosted: 11 },
];

export const categories = [
  "All",
  "Gastronomy",
  "Networking",
  "Music & Culture",
  "Workshop",
  "Wellness",
];

export const categoriesEs: Record<string, string> = {
  "All": "Todos",
  "Gastronomy": "Gastronomía",
  "Networking": "Networking",
  "Music & Culture": "Música y Cultura",
  "Workshop": "Taller",
  "Wellness": "Bienestar",
};

export interface Host {
  id: string;
  name: string;
  initials: string;
  avatar?: string;
  avatarColor: string;
  flag: string;
  role: string;
  roleEs: string;
  bio: string;
  bioEs: string;
  eventsHosted: number;
  joinedYear: number;
  instagram?: string;
  linkedin?: string;
}

export const hosts: Host[] = [
  {
    id: "h1",
    name: "Laura Martínez",
    initials: "LM",
    avatarColor: "hsl(16, 65%, 48%)",
    flag: "🇪🇸",
    role: "Sommelier & Event Curator",
    roleEs: "Sumiller y Curadora de Eventos",
    bio: "Curating wine & tapas experiences that bring people together around great food.",
    bioEs: "Creando experiencias de vino y tapas que unen a la gente alrededor de buena comida.",
    eventsHosted: 24,
    joinedYear: 2022,
    instagram: "https://instagram.com/lauramartinez",
    linkedin: "https://linkedin.com/in/lauramartinez",
  },
  {
    id: "h2",
    name: "Marc de Vries",
    initials: "MV",
    avatarColor: "hsl(197, 62%, 42%)",
    flag: "🇳🇱",
    role: "Community Builder",
    roleEs: "Constructor de Comunidad",
    bio: "Dutch expat connecting professionals and creatives across the Costa Blanca.",
    bioEs: "Expat holandés conectando profesionales y creativos por toda la Costa Blanca.",
    eventsHosted: 36,
    joinedYear: 2021,
    instagram: "https://instagram.com/marcdevries",
    linkedin: "https://linkedin.com/in/marcdevries",
  },
  {
    id: "h3",
    name: "Ana Beltrán",
    initials: "AB",
    avatarColor: "hsl(280, 45%, 50%)",
    flag: "🇪🇸",
    role: "Chef & Cultural Producer",
    roleEs: "Chef y Productora Cultural",
    bio: "Blending gastronomy and live culture into unforgettable Mediterranean nights.",
    bioEs: "Combinando gastronomía y cultura en vivo en noches mediterráneas inolvidables.",
    eventsHosted: 18,
    joinedYear: 2022,
    instagram: "https://instagram.com/anabeltran",
  },
  {
    id: "h4",
    name: "Elena Campos",
    initials: "EC",
    avatarColor: "hsl(82, 25%, 42%)",
    flag: "🇦🇷",
    role: "Artist & Workshop Leader",
    roleEs: "Artista y Líder de Talleres",
    bio: "Argentine artist running creative workshops in studios across Alicante.",
    bioEs: "Artista argentina dirigiendo talleres creativos en estudios por todo Alicante.",
    eventsHosted: 31,
    joinedYear: 2021,
    instagram: "https://instagram.com/elenacampos",
    linkedin: "https://linkedin.com/in/elenacampos",
  },
  {
    id: "h5",
    name: "David Ruiz",
    initials: "DR",
    avatarColor: "hsl(38, 40%, 45%)",
    flag: "🇪🇸",
    role: "Photographer & Educator",
    roleEs: "Fotógrafo y Educador",
    bio: "Teaching street photography through guided walks in Alicante's old town.",
    bioEs: "Enseñando fotografía callejera a través de paseos guiados por el casco antiguo.",
    eventsHosted: 15,
    joinedYear: 2023,
    linkedin: "https://linkedin.com/in/davidruiz",
  },
  {
    id: "h6",
    name: "Sara Navarro",
    initials: "SN",
    avatarColor: "hsl(170, 45%, 40%)",
    flag: "🇨🇴",
    role: "Wellness Coach",
    roleEs: "Coach de Bienestar",
    bio: "Colombian wellness coach bringing mindfulness and movement to the Mediterranean.",
    bioEs: "Coach de bienestar colombiana trayendo mindfulness y movimiento al Mediterráneo.",
    eventsHosted: 42,
    joinedYear: 2021,
    instagram: "https://instagram.com/sananavarro",
    linkedin: "https://linkedin.com/in/saranavarro",
  },
  {
    id: "h7",
    name: "Tomás Lindgren",
    initials: "TL",
    avatarColor: "hsl(210, 50%, 45%)",
    flag: "🇸🇪",
    role: "Tech Meetup Organizer",
    roleEs: "Organizador de Meetups Tech",
    bio: "Swedish developer running Digital Builders meetups for remote workers.",
    bioEs: "Desarrollador sueco organizando meetups de Digital Builders para trabajadores remotos.",
    eventsHosted: 22,
    joinedYear: 2022,
    instagram: "https://instagram.com/tomaslindgren",
  },
  {
    id: "h8",
    name: "Priya Sharma",
    initials: "PS",
    avatarColor: "hsl(340, 55%, 50%)",
    flag: "🇮🇳",
    role: "Language Exchange Host",
    roleEs: "Host de Intercambio de Idiomas",
    bio: "Multilingual host creating spaces for language practice and cultural exchange.",
    bioEs: "Host multilingüe creando espacios para práctica de idiomas e intercambio cultural.",
    eventsHosted: 28,
    joinedYear: 2022,
    linkedin: "https://linkedin.com/in/priyasharma",
  },
];
