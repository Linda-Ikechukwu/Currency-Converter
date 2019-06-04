//checking if indexeddb exists in browser and opening database
if (!window.indexedDB) {
	window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
} 
else{
  const dbName = "converter";

  var request = indexedDB.open(dbName);

//handling request errors
  request.onerror = (event) =>{
   console.log('Failed to open database', event.target.errorCode);
   }
}


//Registering the service worker
if ('serviceWorker' in navigator) {
    
      navigator.serviceWorker.register('./sw.js').then(registration => {
        // Registration was successful
       console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        //registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    
  }




//getting currency values from api and appending it to <options>
fetch('https://free.currconv.com/api/v7/countries?apiKey=3dd786f5584529a919c2')
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


//function to convert

 function convert() {
    let userInput = document.querySelector('#amount').value;
    let fromCurr = document.querySelector('#from').value;
    let toCurr = document.querySelector('#to').value;
    let result = document.querySelector('.result');
    console.log(result);
    
    let query = `${fromCurr}_${toCurr}`;
    const conversionRate = `https://free.currconv.com/api/v7/convert?q=${query}&compact=ultra&apiKey=3dd786f5584529a919c2`;


     
    
    fetch(conversionRate)
    .then(response => response.json())
    .then(responseValue => {
    
        let unitConversion = responseValue[`${query}`];
        console.log(unitConversion);
        let amtConversion = (userInput * unitConversion).toFixed(3);
        
        result.innerHTML = `${amtConversion} ${toCurr} `;

        console.log(result.innerHTML);

        let object = {
            symbol: query,
            value: unitConversion
        };
       
        
        saveToDatabase(object);
            
        

        // save to database
        //this looping method would have been improved if i had more time
        //let i = 0
        //while(i < 10000){
         //   saveToDatabase(object);   
       // }
        

    }).catch(error => {
        fetchFromDatabase(query, unitConversion);
        document.write('Looks like there was a problem: \n', error);
    });
    
};




    



