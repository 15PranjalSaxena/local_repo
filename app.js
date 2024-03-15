dropdowns = document.querySelectorAll('.dropdown select');
messageDetail = document.querySelector('.msg');
clickButton = document.querySelector('form button');
BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/"
fromURL = document.querySelector('.from select');
toURL = document.querySelector('.to select');
let amt = document.querySelector('.amount input');
let amtVul = amt.value;

for (const select of dropdowns) {
    for (let currencyCode in countryList) {
        let newElement = document.createElement("option");
        newElement.innerText = currencyCode;
        newElement.value = currencyCode;
        if(select.name === "from" && currencyCode === "USD" ){
            newElement.selected = "selected";
        }else if(select.name === "to" && currencyCode === "INR"){
            newElement.selected = "selected";
        }
        select.append(newElement);
    }

    select.addEventListener("change", (env)=> {
        updateFlag(env.target);
    })
}


const updateFlag = (env) => {
   let conCode = env.value;
   let countryCode = countryList[conCode];
   let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
   let img = env.parentElement.querySelector("img");
   let FullName = countryNameList[conCode];
   let title = img.setAttribute('title', `${FullName}`); // Assigning by method.
   img.src = newSrc;
}

clickButton.addEventListener("click", async (evt) => {
evt.preventDefault();
if(amtVul === "" || amtVul < 1){
    amtVul = 1;
    amt.value = "1";
}
await fetchData();
});

const fetchData = async () => {
    try {
        // First API Endpoint
        const URL1 = `${BASE_URL}${fromURL.value.toLowerCase()}/${toURL.value.toLowerCase()}.json`;
        const response1 = await fetch(URL1);
        if (!response1.ok) {
            throw new Error('Network response was not ok');
        }
        const data1 = await response1.json();
        console.log('Data from first endpoint:', data1);

    }catch (error) {
        console.error('Error fetching data from second endpoint:', error);
        console.log('Trying second endpoint...');

        try {
        // Second API Endpoint
        const URL2 = `https://open.er-api.com/v6/latest/${fromURL.value}`;
        const response2 = await fetch(URL2);
        if (!response2.ok) {
            throw new Error('Network response was not ok');
        }
        const data2 = await response2.json();
        console.log('Data from second endpoint');
        let responseData = data2.rates;
        let finalData = await calculateBal(responseData, toURL.value);
        }catch (error) {
            console.error('Error fetching backup data:', error);
        }

    }
}

const calculateBal = async (data, value) => {
if(data.hasOwnProperty(value)){
    const result = data[value];
    let finalResult = Math.round(result * amtVul);
    let newMessage = `${amtVul} ${fromURL.value} = ${finalResult} ${toURL.value}`;
    messageDetail.innerText = newMessage;
}


}