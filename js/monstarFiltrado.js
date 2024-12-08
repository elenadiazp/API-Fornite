import { Type, Rarity, Series, Set, Introduction, Images, Objeto } from './class/Objeto.js';


    const filterCategory = document.getElementById("filterCategory");
    const filterValue = document.getElementById("filterValue");

    // Opciones de rarezas y capítulos
    const categories = {
        rarity: [
            "Epic",
            "Rare",
            "Uncommon",
            "Legendary",
            "Unattainable",
            "Common",
            "Mythic"
        ],
        chapter: ["1", "2", "3", "4","5"],// Puedes ajustar según los capítulos reales
        type: [
            "backpack",
            "emote",
            "glider",
            "outfit",
            "pickaxe",
            "spray",
            "wrap"
        ]
    };

    // Función para actualizar las opciones del segundo desplegable
    filterCategory.addEventListener('change', function() {
       
        const selectedCategory = filterCategory.value;
        updateFilterValueOptions(categories[selectedCategory]);
    });

    // Función que actualiza las opciones del segundo desplegable según la categoría seleccionada
    function updateFilterValueOptions(options) {
        filterValue.innerHTML = "<option value=''>Selecciona un valor</option>";
        if (options) {
            options.forEach(option => {
                const newOption = document.createElement("option");
                newOption.value = option;
                newOption.textContent = option.charAt(0).toUpperCase() + option.slice(1);
                filterValue.appendChild(newOption);
            });
        }
    }

    // Evento cuando cambia la selección del filtro
    filterValue.addEventListener('change', function() {
        const selectedCategory = filterCategory.value;
        const selectedValue = filterValue.value;

        if (selectedCategory && selectedValue) {
            sendFilterRequest(selectedCategory, selectedValue);
        }
    });


let currentBatch = 0;  // Número de lote inicial
const batchSize = 10;  // Tamaño de cada lote
let cosmeticosData = []; // Array para almacenar los datos de cosméticos obtenidos

// Función para enviar la solicitud GET con los parámetros de filtro
function sendFilterRequest(category, value) {
    let url = `https://fortnite-api.com/v2/cosmetics/br/search/all?`;

    // Ajustar el filtro según la categoría seleccionada
    if (category === "chapter") {
        url += `introductionChapter=${value}`;
    } else if (category === "rarity") {
        url += `rarity=${value}`;
    } else if (category === "type") {
        url += `type=${value}`;
    }

    fetch(url)
    .then(response => response.json())
    .then(jsondata => {
        console.log(jsondata);  // Para verificar la estructura de los datos

        if (jsondata && jsondata.data) {
            cosmeticosData = jsondata.data;  // Si 'data' es un array directo
            // O si los cosméticos están dentro de 'items':
            // cosmeticosData = jsondata.data.items;

            currentBatch = 0;  // Reinicia la paginación al aplicar un nuevo filtro
            mostrarCosmeticos();  // Muestra los cosméticos filtrados
        } else {
            console.error("No se encontraron datos.");
        }
    })
    .catch(error => {
        console.error("Error en la solicitud GET:", error);
    });

}

function mostrarCosmeticos() {
    const cosmeticosContainer = document.getElementById("container-cosmetics");
    cosmeticosContainer.innerHTML = "";  // Limpiamos el contenedor antes de mostrar los nuevos cosméticos

    // Recorremos todos los cosméticos disponibles sin hacer uso de 'slice'
    cosmeticosData.forEach(cosmetico => {
        const type = cosmetico.type ? new Type(cosmetico.type.value || "", cosmetico.type.displayValue || "", cosmetico.type.backendValue || "") : new Type();
        const rarity = cosmetico.rarity ? new Rarity(cosmetico.rarity.value || "", cosmetico.rarity.displayValue || "", cosmetico.rarity.backendValue || "") : new Rarity();
        const series = cosmetico.series ? new Series(cosmetico.series.value || "", cosmetico.series.colors || [], cosmetico.series.backendValue || "") : new Series();
        const set = cosmetico.set ? new Set(cosmetico.set.value || "", cosmetico.set.text || "", cosmetico.set.backendValue || "") : new Set();
        const introduction = cosmetico.introduction ? new Introduction(cosmetico.introduction.chapter || "", cosmetico.introduction.season || "", cosmetico.introduction.text || "", cosmetico.introduction.backendValue || "") : new Introduction();
        const images = cosmetico.images ? new Images(cosmetico.images.smallIcon || "", cosmetico.images.icon || "") : new Images();
        
        const cosmeticoObj = new Objeto(
            cosmetico.id || "",  
            cosmetico.name || "",  
            type,
            cosmetico.description || "",  
            rarity,
            series,
            set,
            introduction,
            images,
            cosmetico.added || "" 
        );

        const cosmeticoCard = crearCardCosmetico(cosmeticoObj);
        cosmeticosContainer.appendChild(cosmeticoCard);
    });
}



// Crear la tarjeta de cosmético
function crearCardCosmetico(cosmetico) {
    const cardCol = document.createElement("div");
    cardCol.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4' ); 

    const card = document.createElement("div");
    card.classList.add('card', 'text-center', 'border-0', 'shadow','h-100');  
    card.style.backgroundColor = '#1c1e21';
    card.style.color = '#fff';

    const img = document.createElement('img');
    img.src = cosmetico.images.icon || 'img/_default.png';
    img.alt = cosmetico.name;
    img.classList.add('card-img-top', 'p-3', 'rounded', 'img-fluid'); 
    
    const cardBody = document.createElement("div");
    cardBody.classList.add('card-body');
    
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add('card-title', 'luckiest-guy-regular');
    cardTitle.textContent = cosmetico.name;
    
    const cardText = document.createElement("p");
    cardText.classList.add('card-text');
    cardText.textContent = cosmetico.description;
    
    const cardText2 = document.createElement("p");
    cardText2.classList.add('card-text');
    cardText2.textContent = cosmetico.rarity.backendValue;
    
    const buyButton = document.createElement("a");
    buyButton.classList.add('btn', 'btn-primary', 'me-2'); // Añadir margen a la derecha
    buyButton.style.backgroundColor = '#00aaff';
    buyButton.style.border = 'none';
    buyButton.textContent = 'Ver detalles';
    buyButton.href = `objetoAmpliado.html?id=${cosmetico.id}`;
    
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add('btn', 'btn-danger');
    favoriteButton.style.backgroundColor = '#ff0000';
    favoriteButton.style.border = 'none';
    favoriteButton.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i>';
    
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(cardText2);
    cardBody.appendChild(buyButton);
    cardBody.appendChild(favoriteButton);
    card.appendChild(img);
    card.appendChild(cardBody);
    
    cardCol.appendChild(card);
    
    return cardCol;
}