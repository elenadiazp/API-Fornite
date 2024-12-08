document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const cosmeticoId = urlParams.get("id");

  if (cosmeticoId) {
    fetch(`https://fortnite-api.com/v2/cosmetics/br/${cosmeticoId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Cosmético:", data);
        const cosmetico = data.data;

        if (cosmetico) {
          const name = cosmetico.name || "Nombre no disponible";
          const icon = cosmetico.images?.icon || "img/_default.png";
          const description = cosmetico.description || "Descripción no disponible";
          const introduction = cosmetico.introduction.text;
          const rarity = cosmetico.rarity.displayValue; 

          document.getElementById("cosmetico-name").textContent = name;
          document.getElementById("cosmetico-img").src = icon ;
          document.getElementById("cosmetico-description").textContent = description;
          document.getElementById("cosmetico-introduction").textContent = introduction;
          document.getElementById("cosmetico-rarity").textContent = rarity;
        
        } else {
          console.error("Cosmético no encontrado");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los detalles del cosmético:", error);
      });
  }
});