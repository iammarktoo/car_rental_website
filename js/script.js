document.addEventListener("DOMContentLoaded", () => {
  fetch("data/cars.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json(); // Only parse JSON if fetch succeeded
    })
    .then(data => {
      const carGrid = document.getElementById("carGrid");
      data.cars.forEach(car => {
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
    })
    .catch(error => {
      console.error("Error loading car data:", error);
    });
});
