document.addEventListener("DOMContentLoaded", () => {
    fetch("data/cars.json")
    .then(reponse => Response.json())
    .then(data => {
        const carGrid = document.getElementById("carGrid");
        data.cars.forEach(car => {
            const carCard = document.createElement("div");
            carCard.className = car-card;

            carCard.innerHTML = `
          <img src="${car.image}" alt="${car.brand} ${car.carModel}" />
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
    })
    .catch(error => {
        console.error("Error loading car data:", error)
    });
})