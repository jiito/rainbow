import 'react-native-gesture-handler';
import './shim';
import './src/model/config';

import lang from 'i18n-js';
import { resources } from './src/languages';

// Languages (i18n)
lang.defaultLocale = 'en';
lang.locale = 'en';
lang.fallbacks = true;

lang.translations = Object.assign(
  {},
  ...Object.keys(resources).map(key => ({
    [key]: resources[key].translation,
  }))
);

// eslint-disable-next-line import/no-commonjs
require('./src/App');
