console.log("seeing the file");
const display = document.querySelector('.displayNum');
let userInput = document.querySelector('#amount').value;

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB");
}

// opening  database 
function openDatabase(){
	// return db instances
	const DB_NAME 	= 'converter';
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
	  	var objectStore = upgradeDB.createObjectStore("currencies", {keyPath: 'query'});
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

		console.log('database has been openned !');
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
	  		}else{
	  			// update data existing currency object
				store.put(data, data.symbol);
	  		};
	  	}
	}
}

// fetch from web database
function fetchFromDatabase(symbol) {
	// init database
	const db = openDatabase();
	
	// on success add user
	db.onsuccess = (event) => {

		// console.log('database has been openned !');
		const query = event.target.result;

		// check if already exist symbol
		const currency = query.transaction("currencies").objectStore("currencies").get(symbol);

		// wait for users to arrive
	  	currency.onsuccess = (event) => {
	  		const data = event.target.result;
	  		// console.log(data);
	  		if(data == null){
                  
                  const errMsg = "You are currently offline,You need to convert this pair online first";
                   display.innerHTML = errMsg;
				// hide error message
				setTimeout((e) => {
					display.html("");
				}, 1000 * 3);

				// void
				return;
	  		}

			 console.log(data);
			 console.log(data.value);
            
             let pairs = symbol.split('_');
			let fr = pairs[0];
			let to = pairs[1];

			let unitConversion = object.value;
			let amtConversion = (userInput * unitConversion).toFixed(3);
            display.innerHTML = `${amtConversion} ${to} `;
	  	}
	}
}

