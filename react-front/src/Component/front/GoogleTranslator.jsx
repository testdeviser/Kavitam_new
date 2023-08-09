// GoogleTranslator.js
import React, { useEffect } from 'react';

const GoogleTranslator = () => {
    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
            {
                pageLanguage: "en",
                includedLanguages: "en,hi,pa", // English, Hindi, and Punjabi languages
                defaultLanguage: "en",
                autoDisplay: false,
            },
            "google_translate_element"
        );
    };

    useEffect(() => {
        var addScript = document.createElement("script");
        addScript.setAttribute(
            "src",
            "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;
    }, []);

    return <div id="google_translate_element"></div>;
};

export default GoogleTranslator;
