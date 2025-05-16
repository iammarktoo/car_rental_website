document.addEventListener("DOMContentLoaded", () => {
  fetch("data/cars.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Only parse JSON if fetch succeeded
    })
    .then(data => {
        allCars = data.cars;
        displayCars(allCars);
        populateDropdown(allCars);
    })
    .catch(error => console.error("Error loading car data:",error));

    const carGrid = document.getElementById("carGrid");
    const dropdown = document.getElementById("carTypeDropdown");
    const searchBox = document.getElementById("searchBox");
    const searchBtn = document.getElementById("searchBtn");
    const suggestions = document.getElementById("suggestions");

    function displayCars(cars) {
        carGrid.innerHTML = "";
        cars.forEach(car=>{
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
            `;
      carGrid.appendChild(carCard);
        });
    }

    function populateDropdown(cars){
        const unicarTypes = [...new Set(cars.map(car => car.carType))];
        uniqueType.forEach(type=>{
            const option = document.createElement("option");
            option.value = type;
            option.textContent = type;
            dropdown.appendChild(option);
        });
    }

    //Live search suggestion logic
    searchBox.addEventListener("input", () => {
        const input = searchBox.value.toLowerCase();
        suggestions.innerHTML = "";

        if (!input) return;

        const filtered = allCars.filter(car=>
            car.brand.toLowerCase().includes(input) ||
            car.carModel.toLowerCase().includes(input)
        );

        const seen = new Set();

        filtered.slice(0,10).forEach(car => {
            const suggestionText = `${car.brand} ${car.carModel}`;
            if (!seen.has(suggestionText)){
                seen.add(suggestionText);
                const li = document.createElement("li");
                li.textContent = suggestionText;
                li.addEventListener("click", () => {
                    searchBox.value = suggestionText;
                    suggestions.innerHTML = "";
                });
                suggestions.appendChild(li);
            }
        });
    });

    //Filter cars by brand/model and type
    searchBtn.addEventListener("click", () =>{
        const query = searchqque.value.toLowerCase();
        const selectedType = dropdown.value;

        const filteredCars = allCars.filter(car =>{
            const matchBrandModel = 
                `${car.brand} ${car.carModel}`.toLowerCase().includes(query);
            const matchType = selectedType === "all" || car.carType === selectedType;
            return matchBrandModel && matchType;
        });

        suggestions.innerHTML = "";
        displayCars(filteredCars);
    });
});


    