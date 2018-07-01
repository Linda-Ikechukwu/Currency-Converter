
//Registering the service worker
if ('serviceWorker' in navigator) {
    
      navigator.serviceWorker.register('./sw.js').then(registration => {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    
  }




//getting currency values from api and appending it to <options>
fetch('https://free.currencyconverterapi.com/api/v5/countries')
    .then(response => response.json())
    .then(myJson => {

        let optionHtml = '';
        const fromInput = document.querySelector("#from");
        const toInput =  document.querySelector("#to");
        for (let currency of Object.values(myJson.results)) {
            // console.log(country);
            optionHtml += `<option value="${currency.currencyId}">${currency.currencyName} , ${currency.currencyId}</option>`;
        }
        fromInput.insertAdjacentHTML('afterbegin', optionHtml);
        toInput.insertAdjacentHTML('afterbegin', optionHtml);
    });


//listening for click event and converting
const submitBtn = document.querySelector("#process");

submitBtn.addEventListener('click',function(){
    let userInput = document.querySelector('#amount').value;
    let fromCurr = document.querySelector('#from').value;
    let toCurr = document.querySelector('#to').value;
    let display = document.querySelector('.displayNum');
    
    let query = `${fromCurr}_${toCurr}`;
    const conversionRate = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=ultra`;
     
    
    fetch(conversionRate)
    .then(response => response.json())
    .then(responseValue => {
    
        let unitConversion = responseValue[`${fromCurr}_${toCurr}`]
        let amtConversion = (userInput * unitConversion).toFixed(3);
        display.innerHTML = `${amtConversion} ${toCurr} `;

        let object = {
            symbol: query,
            value: unitConversion
        };

        // save to database
        //this looping method would have been improved if i had more time
        let i = 0
        while(i < 10000){
            saveToDatabase(object);   
        }
        

    }).catch(error => {
        //fetchFromDatabase(query);
        //document.write('Looks like there was a problem: \n', error);
    });

});




    



