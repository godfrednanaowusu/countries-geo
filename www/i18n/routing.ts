import {defineRouting} from 'next-intl/routing';
import {defaultLocale, locales} from '@/messages/config';

export const routing = defineRouting({
  locales,
  defaultLocale
});
