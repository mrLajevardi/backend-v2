import { AcceptLanguageResolver, I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

export const i18nOptions: I18nOptions = {
  fallbackLanguage: 'fa',
  resolvers: [AcceptLanguageResolver],
  loaderOptions: {
    path: path.join(__dirname, '../../localization/i18n/'),
    watch: true,
    includeSubfolders: true,
  },
};
