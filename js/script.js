function saveToLocalStorage(key,data){
    try{
        localStorage.setItem(key, JSON.stringify(data));
    }catch(error){
        console.error("Error saving to local storage:", error);
    }
}
function loadFromLocalStorage(key){
    try{
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }catch(error){
        console.error("Error loading from local storage:", error);
        return null;
    }
    
}

document.addEventListener("DOMContentLoaded", () => {
  
    const carGrid = document.getElementById("carGrid");
    const dropdown = document.getElementById("carTypeDropdown");
    const searchBox = document.getElementById("searchBox");
    const searchBtn = document.getElementById("searchBtn");
    const suggestions = document.getElementById("suggestions");
    

    let allCars = [];
    let allReservations = [];

    async function fetchAndStoreJSON(filePath, storageKey) {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        saveToLocalStorage(storageKey, data);
        return data;
    }

    async function init(){
        try{
            let rawCars = loadFromLocalStorage("cars");
            let carData = Array.isArray(rawCars) ? rawCars : rawCars?.cars;
            let rawReservations = loadFromLocalStorage("reservations");
            let reservationData = Array.isArray(rawReservations) ? rawReservations : rawReservations?.reservations;
            // If data is not in local storage, fetch it
            if (!carData) {
                carData = await fetchAndStoreJSON("data/cars.json", "cars");
                carData = Array.isArray(carData) ? carData : carData?.cars;

            }
            if (!reservationData) {
                reservationData = await fetchAndStoreJSON("data/reservations.json", "reservations");
                reservationData = Array.isArray(reservationData) ? reservationData : reservationData?.reservations;
            }
            const allCars = Array.isArray(carData) ? carData : carData?.cars;
            const allReservations = Array.isArray(reservationData) ? reservationData : reservationData?.reservations ?? [];

            if (!Array.isArray(allCars)) throw new Error("Cars data is not an array");
            if (!Array.isArray(allReservations)) throw new Error("Reservations data is not an array");

            displayCars(allCars, allReservations);
            populateDropdown(allCars);
        }catch(error){
            console.error("Error initializing data:", error);
        }

    }
    init();
    //Display cars in the grid
    function displayCars(allCars, allReservations){
        //Update car availability based on reservations
        const today = new Date();

        allCars.forEach(car => {
            const carReservations = allReservations.filter(reservation => reservation.vin === car.vin);

            let isAvailable = true;
            carReservations.forEach(reservation => {
                const startDate = new Date(reservation.startDate);
                const endDate = new Date(reservation.endDate);

                if (today >= startDate && today <= endDate) {
                    isAvailable = false;
                }
            });
            car.available = isAvailable;
        });
        carGrid.innerHTML = "";
        allCars.forEach(car=>{
            const carCard = document.createElement("div");
            carCard.className = "car-card";
            carCard.innerHTML = `
                <img src="images/${car.image}" alt="${car.brand} ${car.carModel}" />
                <h3>${car.brand} ${car.carModel}</h3>
                <p><strong>Type:</strong> ${car.carType}</p>
                <p><strong>Year:</strong> ${car.yearOfManufacture}</p>
                <p><strong>Mileage:</strong> ${car.mileage}</p>
                <p><strong>Fuel:</strong> ${car.fuelType}</p>
                <p><strong>Availability:</strong> ${car.available ? "Available" : "Not available"}</p>
                <p><strong>Price:</strong> $${car.pricePerDay}/day</p>
                <p>${car.description}</p>
                <button 
                class = "reserve-btn" ${!car.available ? 'disabled-btn' : ''}
                data-vin = "${car.vin}"
                ${!car.available ? 'disabled' : ''}>
                ${car.available ? 'Reserve' : 'Not Available'}
                </button>
            `;
      carGrid.appendChild(carCard);
        });

        document.querySelectorAll(".reserve-btn").forEach(button => {
            button.addEventListener("click", (e) => {
                const carId = e.target.dataset.vin;
                window.location.href = `reservation.html?carId=${carId}`;
            });
        });
    }

    function populateDropdown(cars){
        const uniqueTypes = [...new Set(cars.map(car => car.carType))];
        uniqueTypes.forEach(type=>{
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            dropdown.appendChild(option);
        });
    }

    //Live search suggestion logic
    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();
        suggestions.innerHTML = "";

        if (!query) return;
        const seen = new Set();
        const suggestionsList = [];

        allCars.forEach(car=>{
            const brand = car.brand
            const model = car.carModel;
            const brandModel = `${brand} ${model}`;


            const brandLower = brand.toLowerCase();
            const modelLower = model.toLowerCase();
            const brandModelLower = brandModel.toLowerCase();
        

        //Match brand
        if (brandLower.startsWith(query) && !seen.has(brandLower)) {
            seen.add(brand);
            suggestionsList.push(brand);
        }
        //Match model
        if (modelLower.startsWith(query) && !seen.has(modelLower)) {
            seen.add(model);
            suggestionsList.push(model);
        }
        //Match brand+model
        if (brandModelLower.startsWith(query) && !seen.has(brandModelLower)) {
            seen.add(brandModel);
            suggestionsList.push(brandModel);
        }
    });
    

        
        suggestionsList.slice(0,10).forEach(text => {
           const li = document.createElement("li");
           li.textContent = text;
              li.addEventListener("click", () => {
                searchBox.value = text;
                suggestions.innerHTML = "";
            });
            suggestions.appendChild(li);
        });
    });
    
        document.addEventListener("click", (event) => {
            if (!searchBox.contains(event.target) && !suggestions.contains(event.target)) {
                suggestions.innerHTML = "";
                }
            });
    


    //Filter cars by brand/model and type
    searchBtn.addEventListener("click", () => {
        const query = searchBox.value.toLowerCase().trim();
        const selectedType = dropdown.value;

        const filteredCars = allCars.filter(car => {
            const brandModel = `${car.brand} ${car.carModel}`.toLowerCase();
            // Determine match: 
            // If query contains a space, try matching the combined brand+model;
            // Otherwise, match the brand alone.
            const matchQuery =
                car.brand.toLowerCase().includes(query) ||
                car.carModel.toLowerCase().includes(query) ||
                brandModel.includes(query);

            // Also filter by car type
            const matchType = selectedType === "all" || car.carType === selectedType;

            return matchQuery && matchType;
        });

        // Clear suggestions and update the displayed car grid
        suggestions.innerHTML = "";
        displayCars(filteredCars, allReservations);
    });

    // Filter cars by type
    dropdown.addEventListener("change", () => {
        const selectedType = dropdown.value;
        const query = searchBox.value.toLowerCase();

        const filteredCars = allCars.filter(car => {
            const matchType = selectedType === "all" || car.carType === selectedType;
            const matchBrand = `${car.brand}`.toLowerCase().includes(query);
            return matchType && matchBrand;
        });
        suggestions.innerHTML = "";
        displayCars(filteredCars, allReservations);
    });
});


