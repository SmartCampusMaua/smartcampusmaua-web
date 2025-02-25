import "server-only";

const dictionaries = {
  en: () =>
    import("./dictionaries/en-us.json").then((module) => module.default),
  pt: () =>
    import("./dictionaries/pt-br.json").then((module) => module.default),
  es: () =>
    import("./dictionaries/es-es.json").then((module) => module.default),
};

const dictionary = async (locale: "en" | "pt" | "es") => dictionaries[locale]();

export async function getDictionary(lang?: string) {
  let locale: "en" | "pt" | "es";
  switch (lang) {
    case "pt-BR":
      locale = "pt";
      break;
    case "es-ES":
      locale = "es";
      break;
    case "en-US":
    default:
      locale = "en";
  }
  return await dictionary(locale);
}
