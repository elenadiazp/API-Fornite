import { Type, Rarity, Series, Set, Introduction, Images, Objeto } from './ObjetoClass.js';

function fetchCosmeticos() {
    fetch('https://fortnite-api.com/v2/cosmetics')  
        .then(response => response.json())  // Primero conviertes la respuesta a JSON
        .then(jsondata => {
            procesarJSON(jsondata);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });
}


function procesarJSON(jsondata) {
    const cosmeticos = jsondata.data.br;
    const cosmeticosContainer = document.getElementById("container-cosmetics");
    cosmeticosContainer.innerHTML = "";

    const cantidadLimite = 10;  // Cambia este número según lo que necesites
    const cosmeticosLimitados = cosmeticos.slice(0, cantidadLimite);

    cosmeticosLimitados.forEach(cosmetico => {
        console.log(cosmetico);
       


        
        const type = cosmetico.type ? new Type(cosmetico.type.value || "", cosmetico.type.displayValue || "", cosmetico.type.backendValue || "") : new Type();
        const rarity = cosmetico.rarity ? new Rarity(cosmetico.rarity.value || "", cosmetico.rarity.displayValue || "", cosmetico.rarity.backendValue || "") : new Rarity();
        const series = cosmetico.series ? new Series(cosmetico.series.value || "", cosmetico.series.colors || [], cosmetico.series.backendValue || "") : new Series();
        const set = cosmetico.set ? new Set(cosmetico.set.value || "", cosmetico.set.text || "", cosmetico.set.backendValue || "") : new Set();
        const introduction = cosmetico.introduction ? new Introduction(cosmetico.introduction.chapter || "", cosmetico.introduction.season || "", cosmetico.introduction.text || "", cosmetico.introduction.backendValue || "") : new Introduction();
        const images = cosmetico.images ? new Images(cosmetico.images.smallIcon || "", cosmetico.images.icon || "") : new Images();
        
        const cosmeticoObj = new Objeto(
            // "" Se pone en caso de que falte el valor en el json no cruja
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

function crearCardCosmetico(cosmetico) {
    const cardCol = document.createElement("div");
    cardCol.classList.add('col-3', 'mb-4'); 

    const card = document.createElement("div");
    card.classList.add('card');  

    const img = document.createElement('img');
    img.src = cosmetico.images.icon;
    img.alt = cosmetico.name;
    img.classList.add('card-img-top', 'img-fluid'); 

    const cardBody = document.createElement("div");
    cardBody.classList.add('card-body', 'border-0', 'shadow');

    const cardTitle = document.createElement("h2");
    cardTitle.classList.add('card-title');
    cardTitle.textContent = cosmetico.name;

    const cardText = document.createElement("p");
    cardText.classList.add('card-text');
    cardText.textContent = cosmetico.description;

  
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    card.appendChild(img);
    card.appendChild(cardBody);

   
    cardCol.appendChild(card);

    return cardCol;
}


fetchCosmeticos();
