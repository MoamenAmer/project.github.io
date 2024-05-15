const apiKey = 'sk-proj-q7h6uxJYa63N2SEXkZtqT3BlbkFJR0W59EEVneBnuTTwpwYG'; // Replace this with your actual API key

const searchButton = document.getElementById('searchButton');
const languageButton = document.getElementById('languageButton');
const diseaseInput = document.getElementById('diseaseInput');
const resultContainer = document.getElementById('resultContainer');
let language = 'en'; // Default language is English

searchButton.addEventListener('click', () => {
    const disease = diseaseInput.value.trim();
    if (disease !== '') {
        getResultWithDelay(disease); // Use getResultWithDelay instead of getResult
    }
});

languageButton.addEventListener('click', () => {
    toggleLanguage();
});

async function getResultWithDelay(disease) { // Use getResultWithDelay instead of getResult
    const delay = 2000; // 2 second delay
    await new Promise(resolve => setTimeout(resolve, delay)); // Introduce delay

    getResult(disease); // Call getResult after the delay
}

async function getResult(disease) {
    console.log('Fetching data for disease:', disease);

    const url = `https://api.openai.com/v1/completions`;

    const requestBody = {
        model: 'gpt-3.5-turbo-instruct',
        prompt: `Information about ${disease} with max 200 words`,
        max_tokens: 100,
        temperature: 0.2,
        n: 1,
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error data:', errorData);
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message}`);
        }

        const data = await response.json();
        console.log('Received data:', data);

        const description = data.choices[0].text.trim();

        console.log('Description:', description);

        displayResult(description);
    } catch (error) {
        console.error('Error fetching data:', error);
        resultContainer.textContent = 'An error occurred. Please try again later.';
    }
}


function displayResult(description) {
    resultContainer.innerHTML = `
        <p>${description}</p>
    `;
}

function toggleLanguage() {
    if (language === 'en') {
        language = 'ar';
        document.documentElement.lang = 'ar';
        document.body.classList.add('arabic');
    } else {
        language = 'en';
        document.documentElement.lang = 'en';
        document.body.classList.remove('arabic');
    }
    
    // Update button text
    languageButton.textContent = translations['Switch Language'][language];

    // Update other text elements
    document.getElementById('searchButton').textContent = translations['Search'][language];
    document.getElementById('upin').textContent = translations['Disease Information'][language];
    //document.getElementById('diseaseInput').ariaPlaceholder = translations['Enter a disease...'][language];
    document.getElementById('resultContainer').querySelectorAll('p').forEach((p, index) => {
        p.textContent = translations[p.getAttribute('data-key')][language];
    });
}

const translations = {
    'Disease Information': {
        en: 'Disease Information',
        ar: 'معلومات المرض'
    },
    'Enter a disease...': {
        en: 'Enter a disease...',
        ar: 'اكتب اسم المرض'
    },
    'Search': {
        en: 'Search',
        ar: 'بحث'
    },
    'Switch Language': {
        en: 'Switch Language',
        ar: 'تغيير اللغة'
    },
    'Description': {
        en: 'Description',
        ar: 'الوصف'
    },
    'Prevention': {
        en: 'Prevention',
        ar: 'الوقاية'
    },
    'Effects': {
        en: 'Effects',
        ar: 'الآثار'
    }
};

// Initial text setting
languageButton.textContent = translations['Switch Language'][language];
document.getElementById('searchButton').textContent = translations['Search'][language];
document.getElementById('resultContainer').querySelectorAll('p').forEach((p, index) => {
    p.textContent = translations[p.getAttribute('data-key')][language];
});
