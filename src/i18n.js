import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        //debug: true,
        //lng:'zh_CN',

        /*interpolation: {
          escapeValue: false, // not needed for react as it escapes by default
        },*/
        // we init with resources
        resources: {
            en: {
                translation: {
                    "Page":"Page",
                    "of":"of"
                }
            },
            zh_cn: {
                translation:{
                    "Page": "第",
                    "of": "页,共"
                }
            },
            fr: {
                translation:{
                    "Page": "Page",
                    "of": "de"
                }
            },
            pt_br: {
                translation:{
                    "Page": "Página",
                    "of": "de"
                }
            }
        },


        // have a common namespace used around the full app
        //ns: ["translations"],
        //defaultNS: "translations",

        //keySeparator: false, // we use content as keys


    });

export default i18n;
