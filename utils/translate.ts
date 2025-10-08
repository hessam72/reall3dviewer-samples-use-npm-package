type TranslationKey = 'document_status' | 'body_status';

const translations: Record<TranslationKey, Record<string, string>> = {
    document_status: {
        'single_page': 'سند تک برگ',
        'multi_page': 'سند چند برگ',
        'active_plate': 'پلاک فعال',
        
    },
   
    body_status: {
        'paint': 'رنگ کامل',
        'partial_paint': 'رنگ جزئی',
        'replaced': 'تعویض شده',
        'spray_paint': 'پاشش رنگ',
        'intact': 'سالم',
    }
};

export const translate = (key: TranslationKey, value: string): string => {
    if (!translations[key]) {
        console.warn(`No translations found for key: ${key}`);
        return value;
    }

    const translation = translations[key][value];
    if (!translation) {
        console.warn(`No translation found for value: ${value} in key: ${key}`);
        return value;
    }

    return translation;
};