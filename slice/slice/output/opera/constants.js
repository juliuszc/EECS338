

var READING_LEVELS = {
    1: {
        threshold: 90,
        message: ' You are currently reading at the same level as an 11-year old. Try to step it up!'
    },
    2: {
        threshold: 60,
        message: ' You are currently reading at the level of a high schooler. Not bad, but you can do better!'
    },
    3: {
        threshold: 30,
        message: ' You are currently reading at the level of a college student. Good work!'
    },
    4: {
        message: ' You are reading at an extremely high level. Be proud of yourself!'
    }
}

var ALCHEMY_CATEGORY_MAP = {
    'undefined': 'Other',
    'unknown': 'Other',
    'computer_internet': 'Technology',
    'arts_entertainment': 'Entertainment',
    'recreation': 'Entertainment',
    'science_technology': 'Science',
    'religion': 'Other',
    'business': 'Business',
    'culture_politics': 'Politics',
    'sports': 'Sports',
    'health': 'Other',
    'gaming': 'Entertainment',
    'law_crime': 'Other',
    'politics': 'Politics',
    'science': 'Science',
    'entertainment': 'Entertainment',
    'technology': 'Technology',
    'social': 'Social',
    'streaming': 'Streaming',
    'email': 'Email',
    'shopping': 'Shopping'
};
MAIN_CATEGORY_MAP = {
    'politics': 'Reading',
    'business': 'Reading',
    'sports': 'Reading',
    'entertainment': 'Reading',
    'science-technology': 'Reading',
    'education': 'Reading',
    'healthy-living': 'Reading',
    'arts': 'Reading',
    'religion': 'Reading',
    'food': 'Reading',
    'other': 'Other',
    'social': 'Social',
    'streaming': 'Streaming',
    'email': 'Email',
    'shopping':'Shopping'
}
CATEGORY_MAP = {
    'politics': 'Politics',
    'business': 'Business',
    'sports': 'Sports',
    'entertainment': 'Culture',
    'science-technology': 'SciTech',
    'education': 'Culture',
    'healthy-living': 'Culture',
    'arts': 'Culture',
    'religion': 'Culture',
    'food': 'Culture',
    'other': 'Other',
}

var _CATEGORY_NAMES = [
    'Politics',
    'Business',
    'Technology',
    'Sports',
    'Science',
    'Entertainment',
    'Other',
]

var CATEGORY_NAMES = [
    'Politics',
    'Business',
    'SciTech',
    'Sports',
    'Culture',
    'Other'
]

var _MAIN_CATEGORY_NAMES = [
    'Reading',
	'Social',
    'Streaming',
    'Email',
    'Shopping'
]

var MAIN_CATEGORY_NAMES = [
    'Reading',
	'Social',
    'Streaming',
    'Email',
    'Shopping'
]
var _PIE_CHART_COLORS = [
    '#3498DB', // Politics
    '#9B59B6', // Business
    '#E67E22', // Technology
    '#2ECC71', // Sports
    '#E74C3C', // Science
    '#F1C40F', // Entertainment
    '#e377c2', // Other
    '#0a007c', //Social Media
    '#FFFF00' //Streaming
];

var PIE_CHART_COLORS = [
    '#3498DB', // Politics
    '#9B59B6', // Business
    '#E74C3C', // SciTech
    '#2ECC71', // Sports
    '#F1C40F', // Culture
    '#e377c2', // Other
    '#0a007c', //Social Media
    '#FFFF00' //Streaming
];