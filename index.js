/* Selecting DOM elements */
let cardsInDOM = [];
let selectedTimeFrame = 'daily';

function fetchDOMCards() {
    const cardsNodeList = document.querySelectorAll('.stat-card');
    const cardsArray = Array.from(cardsNodeList);

    const cardObjects = cardsArray.map((card) => {
        return {
            title: card.querySelector('.stat-card-title'),
            current: card.querySelector('.stat-main'),
            previous: card.querySelector('.stat-alt')
        }
    })

    return cardObjects;
}

cardsInDOM = fetchDOMCards();


/* Async Fetch API */
async function fetchData() {
    try {
        const response = await fetch('./data.json');
        if (!response.ok) {
            throw new Error('Server unreachable');
        }
        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error.message)
    }
}

/* Organizing the data received from the Fetch API */
function organizeData(fetchedData, timeFrame) {

    /* timeFrame = 'daily'; */
    const cardsData = fetchedData.map(item => {
        return {
            title: item.title,
            current: item.timeframes[timeFrame].current,
            previous: item.timeframes[timeFrame].previous
        }
    })

    return cardsData;
}


/* Updating the UI with new data */
function updateUI(domCards, data, timeFrame) {

    let timeFrameText = "";
    switch (timeFrame) {
        case 'weekly':
            timeFrameText = "Last Week -";
            break;
        case 'monthly':
            timeFrameText = "Last Month -";
            break;
        default:
            timeFrameText = "Yesterday -";
            break;
    }
    domCards.forEach((card, i) => {
        card.title.innerText = data[i].title;
        card.current.innerText = `${data[i].current}${data[i].current > 1 ? 'Hrs' : 'Hr'}`;
        card.previous.innerText = `${timeFrameText} ${data[i].previous}${data[i].previous > 1 ? 'Hrs' : 'Hr'}`;
    })

}

/* Defining my timeFrame Element Block */
const timeFrameBlock = document.querySelector('ul');
/* Defaulting 'daily' filter */
let lastTimeFrame = timeFrameBlock.querySelector('.date-nav-button');
lastTimeFrame.classList.add('date-nav-active');


fetchData().then((data) => {

    /* Event listener for the selected timeFrame */
    timeFrameBlock.addEventListener('click', (e) => {
        if(lastTimeFrame){
            lastTimeFrame.classList.remove('date-nav-active');
        }
        const timeFrameSelection = e.target;
        selectedTimeFrame = timeFrameSelection.innerText.toLowerCase();
        timeFrameSelection.classList.toggle('date-nav-active');

        const organizedData = organizeData(data, selectedTimeFrame);
        updateUI(cardsInDOM, organizedData, selectedTimeFrame);

        lastTimeFrame = e.target;
    });

    const organizedData = organizeData(data, selectedTimeFrame);
    updateUI(cardsInDOM, organizedData, selectedTimeFrame);
})
    .catch((error) => {
        console.error(error.message);
    });