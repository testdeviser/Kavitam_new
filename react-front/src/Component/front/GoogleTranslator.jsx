// GoogleTranslator.jsx
import React, { useEffect } from 'react';

const GoogleTranslator = ({ id }) => {
    useEffect(() => {
        const googleTranslateScript = document.createElement("script");
        googleTranslateScript.type = "text/javascript";
        googleTranslateScript.async = true;
        googleTranslateScript.src = `//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit_${id}`;

        document.head.appendChild(googleTranslateScript);

        window[`googleTranslateElementInit_${id}`] = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "en,hi,pa",
                    defaultLanguage: "en",
                    autoDisplay: false,
                },
                id
            );
        };

        return () => {
            // Cleanup the added script and function
            delete window[`googleTranslateElementInit_${id}`];
            document.head.removeChild(googleTranslateScript);
        };
    }, [id]);

    return <div id={id}></div>;
};

export default GoogleTranslator;
