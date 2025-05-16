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

        const filtered = allCars.filter(car=>
            car.brand.toLowerCase().includes(query) ||
            car.carModel.toLowerCase().includes(query)
        );

        const seen = new Set();

        filtered.slice(0,10).forEach(car => {
            const brand = car.brand;
            const queryLower = query.toLowerCase();
            const brandLower = brand.toLowerCase();
            // Only match brands that start with the input characters
            if (brandLower.startsWith(queryLower) && !seen.has(brand)) {
                seen.add(brand);
                const li = document.createElement("li");
                li.textContent = brand;
                li.addEventListener("click", () => {
                    searchBox.value = brand;
                    suggestions.innerHTML = "";
                });
                suggestions.appendChild(li);
            }
        });
        document.addEventListener("click", (event) => {
            if (!searchBox.contains(event.target) && !suggestions.contains(event.target)) {
                suggestions.innerHTML = "";
                }
            });
    });


    //Filter cars by brand/model and type
    searchBtn.addEventListener("click", () =>{
        const query = searchBox.value.toLowerCase();
        const selectedType = dropdown.value;

        const filteredCars = allCars.filter(car =>{
            const matchBrand = 
                `${car.brand}`.toLowerCase().includes(query);
            const matchType = selectedType === "all" || car.carType === selectedType;
            return matchBrand && matchType;
        });

        suggestions.innerHTML = "";
        displayCars(filteredCars);
    });
    //Filter cars by type
    dropdown.addEventListener("change", () => {
        const selectedType = dropdown.value;
        const query = searchBox.value.toLowerCase();

        const filteredCars = allCars.filter(car => {
            const matchType = selectedType === "all" || car.carType === selectedType;
            const matchBrand = `${car.brand}`.toLowerCase().includes(query);
            return matchType && matchBrand;
        });
        suggestions.innerHTML = "";
        displayCars(filteredCars);
    })
});


    