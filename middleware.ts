import { NextRequest, userAgent } from "next/server";
import { i18nRouter } from "next-i18n-router";

export const locales: Record<string, string> = {
  en: "English",
  pt: "Português",
};

export type Locale = keyof typeof locales;

export function middleware(request: NextRequest) {
  let i18nRequest = i18nRouter(request, {
    locales: Object.keys(locales),
    defaultLocale: "en",
    routingStrategy: "dynamicSegment",
  });

  // Get the device type
  const { device } = userAgent(request);

  i18nRequest.headers.set(
    "x-device-type",
    device.type === "mobile" ? "mobile" : "desktop"
  );

  return i18nRequest;
}

// only apply this middleware to files in the app directory
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};
