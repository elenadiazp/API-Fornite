import { Type, Rarity, Series, Set, Introduction, Images, Objeto } from './Objeto.js';



let cosmeticosData = []; // Aquí guardamos todos los cosméticos
let currentBatch = 0; // Para saber cuántos hemos mostrado hasta ahora
const batchSize = 8; // Número de cosméticos que se muestran por vez

// Función para obtener los datos de la API
function fetchCosmeticos() {
    fetch('https://fortnite-api.com/v2/cosmetics?language=es') // Hacemos la petición a la API
        .then(response => response.json())  // Primero conviertes la respuesta a JSON
        .then(jsondata => {
            cosmeticosData = jsondata.data.br; // Guardamos los datos completos
            mostrarCosmeticos(); // Muestra los primeros cosméticos
            lazyLoadCosmeticos(); // Inicia el lazy loading
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

// Función para mostrar un lote de cosméticos
function mostrarCosmeticos() {
    const cosmeticosContainer = document.getElementById("container-cosmetics");
    const start = currentBatch * batchSize; // Establecemos el índice de inicio
    const end = start + batchSize; // Establecemos el índice de fin
    
    const cosmeticosLimitados = cosmeticosData.slice(start, end); // Obtenemos el lote de cosméticos

    cosmeticosLimitados.forEach(cosmetico => {
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

    currentBatch++; // Aumentamos el número de lote mostrado
}

// Función para cargar más cosméticos cuando el usuario se acerque al final
function lazyLoadCosmeticos() {
    const loading = document.getElementById("loading-indicator");

    const options = {
        rootMargin: '200px',  // Se activa antes de llegar al final de la página
        threshold: 1.0  // Cargar cuando el 100% del objetivo sea visible
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (currentBatch * batchSize < cosmeticosData.length) {
                    mostrarCosmeticos(); // Si hay más datos, mostramos el siguiente lote
                } else {
                    loading.textContent = "No hay más cosméticos"; // Cuando ya no hay más elementos
                }
            }
        });
    }, options);

    observer.observe(loading); // Observar el indicador de carga
}

// Crear la tarjeta de cosmético
function crearCardCosmetico(cosmetico) {
    const cardCol = document.createElement("div");
    cardCol.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4'); 

    const card = document.createElement("div");
    card.classList.add('card', 'text-center', 'border-0', 'shadow', 'h-100');  
    card.style.backgroundColor = '#1c1e21';
    card.style.color = '#fff';

    const img = document.createElement('img');
    img.src = cosmetico.images.icon ? cosmetico.images.icon : 'img/_default.png';
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

    const buyButton = document.createElement("button");
    buyButton.classList.add('btn', 'btn-primary', 'me-2'); // Añadir margen a la derecha
    buyButton.style.backgroundColor = '#00aaff';
    buyButton.style.border = 'none';
    buyButton.textContent = 'Comprar';

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add('btn', 'btn-danger', 'me-2'); // Añadir margen a la derecha
    favoriteButton.style.backgroundColor = '#ff0000';
    favoriteButton.style.border = 'none';
    favoriteButton.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i>';

    // Añadir enlace para detalles
    const detailsLink = document.createElement("a");
    detailsLink.href = `objetoAmpliado.html?id=${cosmetico.id}`;
    detailsLink.textContent = 'Ver detalles';
    detailsLink.style.color = '#fff';   
    detailsLink.style.backgroundColor = '#ff7800';
    detailsLink.classList.add('btn', 'mt-2');

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-2');
    buttonContainer.appendChild(buyButton);
    buttonContainer.appendChild(favoriteButton);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(buttonContainer);
    cardBody.appendChild(detailsLink);
    card.appendChild(img);
    card.appendChild(cardBody);
    cardCol.appendChild(card);

    return cardCol;
}
// Inicializar la carga de cosméticos
fetchCosmeticos();
