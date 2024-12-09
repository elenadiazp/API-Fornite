import { Type, Rarity, Series, Set, Introduction, Images, Objeto } from './class/Objeto.js';

let cosmeticosData = []; // Aquí guardamos todos los cosméticos
let currentBatch = 0; // Para saber cuántos hemos mostrado hasta ahora
const batchSize = 8; // Número de cosméticos que se muestran por vez

// Función para obtener los datos de la API
function fetchCosmeticos() {
    fetch('https://fortnite-api.com/v2/cosmetics?language=es')
        .then(response => response.json()) // Convertimos la respuesta a JSON
        .then(jsondata => {
            cosmeticosData = jsondata.data.br || []; // Guardamos los datos
            mostrarCosmeticos(); // Mostramos los primeros cosméticos
            lazyLoadCosmeticos(); // Inicia el lazy loading
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}

// Función para mostrar un lote de cosméticos
function mostrarCosmeticos() {
    const cosmeticosContainer = document.getElementById("container-cosmetics");
    const start = currentBatch * batchSize;
    const end = start + batchSize;

    const cosmeticosLimitados = cosmeticosData.slice(start, end);

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

    currentBatch++;
}

// Función para cargar más cosméticos cuando el usuario se acerque al final
function lazyLoadCosmeticos() {
    const loading = document.getElementById("loading-indicator");

    const options = {
        rootMargin: '200px',
        threshold: 1.0
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (currentBatch * batchSize < cosmeticosData.length) {
                    mostrarCosmeticos();
                } else {
                    loading.textContent = "No hay más cosméticos";
                }
            }
        });
    }, options);

    observer.observe(loading);
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

    const buyButton = document.createElement("a");
    buyButton.classList.add('btn', 'btn-primary', 'me-2');
    buyButton.style.backgroundColor = '#00aaff';
    buyButton.style.border = 'none';
    buyButton.textContent = 'Ver detalles';
    buyButton.href = `objetoAmpliado.html?id=${cosmetico.id}`;

    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add('btn', 'btn-danger', 'me-2');
    favoriteButton.style.backgroundColor = '#ff0000';
    favoriteButton.style.border = 'none';
    favoriteButton.innerHTML = '<i class="fa fa-heart" aria-hidden="true"></i>';

    favoriteButton.addEventListener('click', () => {
        const favorito = {
            id: cosmetico.id,
            name: cosmetico.name,
            type: cosmetico.type,
            description: cosmetico.description,
            rarity: cosmetico.rarity,
            series: cosmetico.series,
            set: cosmetico.set,
            introduction: cosmetico.introduction,
            images: cosmetico.images,
            added: cosmetico.added
        };

        fetch(`http://localhost:3000/favoritos?id=${cosmetico.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    alert('El cosmético ya está en la lista de favoritos.');
                } else {
                    fetch('http://localhost:3000/favoritos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(favorito)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Favorito guardado:', data);
                        })
                        .catch(error => {
                            console.error('Error al guardar el favorito:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error al verificar el favorito:', error);
            });
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'mt-2');
    buttonContainer.appendChild(buyButton);
    buttonContainer.appendChild(favoriteButton);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(buttonContainer);

    card.appendChild(img);
    card.appendChild(cardBody);
    cardCol.appendChild(card);

    return cardCol;
}

// Inicializar la carga de cosméticos
fetchCosmeticos();
