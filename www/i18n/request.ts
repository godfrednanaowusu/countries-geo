import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // Typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  // console.log(`requested: ${requested}`)
  // console.log(`defaultLocale: ${routing.defaultLocale}`)
  // console.log(`locales: ${routing.locales}`)
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  // console.log(`locale: ${locale}`)
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default
  };
});