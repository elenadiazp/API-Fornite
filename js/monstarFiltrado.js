document.addEventListener('DOMContentLoaded', function() {
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
        chapter: ["1", "2", "3", "4","5"], // Puedes ajustar según los capítulos reales
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

            // Verificar si el cosmético ya existe en la lista de favoritos
            fetch(`http://localhost:3000/favoritos?id=${cosmetico.id}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                  alert('El cosmético ya está en la lista de favoritos.');
                } else {
                    // Si no existe, agregarlo a la lista de favoritos
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

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(buyButton);
        cardBody.appendChild(favoriteButton);
        card.appendChild(img);
        card.appendChild(cardBody);
        cardCol.appendChild(card);

        return cardCol;
    }

    // Función para mostrar cosméticos
    function mostrarCosmeticos() {
        const cosmeticosContainer = document.getElementById("container-cosmetics");
        cosmeticosContainer.innerHTML = "";  // Limpiamos el contenedor antes de mostrar los nuevos cosméticos

        cosmeticosData.forEach(cosmetico => {
            const cosmeticoCard = crearCardCosmetico(cosmetico);
            cosmeticosContainer.appendChild(cosmeticoCard);
        });
    }

    // Función para obtener los datos de la API
    function fetchCosmeticos() {
        fetch('https://fortnite-api.com/v2/cosmetics?language=es') // Hacemos la petición a la API
            .then(response => response.json())  // Primero conviertes la respuesta a JSON
            .then(jsondata => {
                cosmeticosData = jsondata.data.br; // Guardamos los datos completos
                mostrarCosmeticos(); // Muestra los primeros cosméticos
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
            });
    }

    // Inicializar la carga de cosméticos
    fetchCosmeticos();
});