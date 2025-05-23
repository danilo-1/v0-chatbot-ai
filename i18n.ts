import { getRequestConfig } from "next-intl/server"

export default getRequestConfig(async ({ locale }) => {
  // Ensure we have a valid locale
  const safeLocale = ["en", "pt", "es"].includes(locale) ? locale : "en"

  try {
    return {
      messages: (await import(`./messages/${safeLocale}.json`)).default,
    }
  } catch (error) {
    console.error(`Failed to load messages for locale: ${safeLocale}`, error)
    // Fallback to English if the requested locale's messages can't be loaded
    return {
      messages: (await import(`./messages/en.json`)).default,
    }
  }
})
