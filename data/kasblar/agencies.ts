import type { Agency, AgencyId } from "./types";

/**
 * Huquqni muhofaza qilish organlari — the bodies whose professions the
 * ta'lim klasteri trains. Descriptions state the mission only (no articles).
 */
export const AGENCIES: Agency[] = [
  {
    id: "iiv",
    short: { uz: "IIV", ru: "МВД", en: "MoI" },
    title: {
      uz: "Ichki ishlar vazirligi",
      ru: "Министерство внутренних дел",
      en: "Ministry of Internal Affairs",
    },
    description: {
      uz: "Jamoat tartibini saqlash, huquqbuzarliklar profilaktikasi, jinoyatlarni ochish va tergov qilish, fuqarolar xavfsizligini ta'minlash.",
      ru: "Охрана общественного порядка, профилактика правонарушений, раскрытие и расследование преступлений, обеспечение безопасности граждан.",
      en: "Public order, crime prevention, detection and investigation of crimes, and the safety of citizens.",
    },
    icon: "Shield",
  },
  {
    id: "gvardiya",
    short: { uz: "Milliy gvardiya", ru: "Нацгвардия", en: "National Guard" },
    title: {
      uz: "Milliy gvardiya",
      ru: "Национальная гвардия",
      en: "National Guard",
    },
    description: {
      uz: "Muhim davlat obyektlari va maxsus yuklarni qo'riqlash, ommaviy tadbirlarda jamoat tartibini ta'minlash, favqulodda holatlarda ichki ishlar organlariga ko'maklashish.",
      ru: "Охрана важных государственных объектов и специальных грузов, обеспечение общественного порядка на массовых мероприятиях, содействие ОВД в чрезвычайных ситуациях.",
      en: "Protection of key state facilities and special cargo, public order at mass events, support to the police in emergencies.",
    },
    icon: "ShieldCheck",
  },
  {
    id: "bojxona",
    short: { uz: "Bojxona", ru: "Таможня", en: "Customs" },
    title: {
      uz: "Bojxona qo'mitasi",
      ru: "Таможенный комитет",
      en: "Customs Committee",
    },
    description: {
      uz: "Tovarlar va transport vositalarining bojxona chegarasi orqali o'tishini nazorat qilish, bojxona to'lovlarini undirish, kontrabandaga qarshi kurash.",
      ru: "Контроль перемещения товаров и транспортных средств через таможенную границу, взимание таможенных платежей, борьба с контрабандой.",
      en: "Control of goods and vehicles crossing the customs border, collection of customs payments, counter-smuggling.",
    },
    icon: "PackageSearch",
  },
  {
    id: "prokuratura",
    short: { uz: "Prokuratura", ru: "Прокуратура", en: "Prosecution" },
    title: {
      uz: "Prokuratura organlari",
      ru: "Органы прокуратуры",
      en: "Prosecution Service",
    },
    description: {
      uz: "Qonunlarning aniq va bir xilda ijro etilishi ustidan nazorat, tergovga qadar tekshiruv va tergov qonuniyligini nazorat qilish, sudda davlat ayblovini qo'llab-quvvatlash.",
      ru: "Надзор за точным и единообразным исполнением законов, надзор за законностью доследственной проверки и следствия, поддержание государственного обвинения в суде.",
      en: "Supervision of the exact and uniform execution of laws, oversight of the legality of pre-investigation checks and investigations, state prosecution in court.",
    },
    icon: "Gavel",
  },
  {
    id: "fvv",
    short: { uz: "FVV", ru: "МЧС", en: "MES" },
    title: {
      uz: "Favqulodda vaziyatlar vazirligi",
      ru: "Министерство по чрезвычайным ситуациям",
      en: "Ministry of Emergency Situations",
    },
    description: {
      uz: "Aholi va hududlarni favqulodda vaziyatlardan muhofaza qilish, yong'in xavfsizligini ta'minlash, qidiruv-qutqaruv ishlarini tashkil etish.",
      ru: "Защита населения и территорий от чрезвычайных ситуаций, обеспечение пожарной безопасности, организация поисково-спасательных работ.",
      en: "Protection of the population and territories from emergencies, fire safety, search-and-rescue operations.",
    },
    icon: "LifeBuoy",
  },
];

export const AGENCY_MAP: Record<AgencyId, Agency> = Object.fromEntries(
  AGENCIES.map((a) => [a.id, a])
) as Record<AgencyId, Agency>;

export function getAgency(id: string): Agency | undefined {
  return AGENCIES.find((a) => a.id === id);
}
