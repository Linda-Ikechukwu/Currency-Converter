if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB");
}

// open database 
function openDatabase(){
	// return db instances
	const DB_NAME 	= 'Converter';
	const database 	= indexedDB.open(DB_NAME, 1);

	// on error catch errors 
	database.onerror = (event) => {
		console.log('error opening web database');
		return false;
	};

	// check db version
	database.onupgradeneeded = function(event) {
	  	// listen for the event response
	  	var upgradeDB = event.target.result;

	  	// create an objectStore for this database
	  	var objectStore = upgradeDB.createObjectStore("currencies");
	};

	// return db instance
	return database;
}

// save to currencies object
function saveToDatabase(data){
	// init database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = (event) => {

		// console.log('database has been openned !');
		const query = event.target.result;

	  	// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(data.symbol);

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const dbData = event.target.result;
	  		const store  = query.transaction("currencies", "readwrite").objectStore("currencies");

	  		if(!dbData){ 
	  			// save data into currency object
				store.add(data, data.symbol);
				console.log(data +"and" +data.symbol);
	  		}else{
	  			// update data existing currency object
				store.put(data, data.symbol);
				console.log(data +"and" +data.symbol);
	  		};
	  	}
	}
}

// fetch from web database
function fetchFromDatabase(symbol,value) {
	// init database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = (event) => {

		// console.log('database has been openned !');
		const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(value);
		console.log(value)

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const data = event.target.result;
	  		// console.log(data);
	  		if(data == null){
				  alert('You are currently offline... check internet connectivity and try again.');
			  }
		                	
		       

			  let userInput = document.querySelector('#amount').value;
			  let result = document.querySelector('.result');
			  let amtConversion = (userInput * data.value).toFixed(3);
        
              result.innerHTML = `${amtConversion} ${toCurr} `;

			
	  	}
	}
}
