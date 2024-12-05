function fetchNews() {
    fetch('https://fortnite-api.com/v2/news?language=es')
        .then(response => response.json())  // Primero conviertes la respuesta a JSON
        .then(jsondata => {
            procesarJSON(jsondata);
            procesarJSON2(jsondata);
        })
        
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });

}
function procesarJSON(jsondata) {
    const objetos = jsondata.data.br.motds;
    const container = document.getElementById("container-shop");

   objetos.forEach(objeto => {


        const cardCol = document.createElement("div");
        cardCol.classList.add('col-12','col-md-6','col-lg-4', 'mb-4');

        const card = document.createElement("div");
        card.classList.add('card','h-100');
        card.addEventListener('click', () => {
            window.location.href = 'noticiaAmpliada.html';
        });

        const img = document.createElement('img');
        img.src = objeto.image;
        img.alt = objeto.title;
        img.classList.add('card-img-top', 'img-fluid');

        const cardBody = document.createElement("div");
        cardBody.classList.add('card-body', 'border-0', 'shadow');

       
        const cardTitle = document.createElement("h2");
        cardTitle.classList.add('card-title','luckiest-guy-regular');
        cardTitle.textContent = objeto.title;

/*        const cardText = document.createElement("p");
        cardText.classList.add('card-text');
        cardText.textContent = objeto.body;*/


        cardBody.appendChild(cardTitle);
      /*  cardBody.appendChild(cardText);*/
        card.appendChild(img);
        card.appendChild(cardBody);


        cardCol.appendChild(card);
        container.appendChild(cardCol);

        return cardCol;
    });
  
}
function procesarJSON2(jsondata) {
    const objetos = jsondata.data.stw.messages;
    const container = document.getElementById("container1");

   objetos.forEach(objeto => {

        const cardCol = document.createElement("div");
        cardCol.classList.add('col-lg-6','col-12', 'mb-4');

        const card = document.createElement("div");
        card.classList.add('card','h-100');
        card.addEventListener('click', () => {
            window.location.href = 'noticiaAmpliada.html';
        });

        const img = document.createElement('img');
        img.src = objeto.image;
        img.alt = objeto.title;
        img.classList.add('card-img-top', 'img-fluid');

        const cardBody = document.createElement("div");
        cardBody.classList.add('card-body', 'border-0', 'shadow');
        
        const cardTitle = document.createElement("h2",);
        cardTitle.classList.add('card-title','luckiest-guy-regular');
        cardTitle.textContent = objeto.title;

        /*const cardText = document.createElement("p");
        cardText.classList.add('card-text');
        cardText.textContent = objeto.body*/
       
       
        cardBody.appendChild(cardTitle);
       /* cardBody.appendChild(cardText);*/
       
        card.appendChild(img);
        card.appendChild(cardBody);

       
        cardCol.appendChild(card);
        container.appendChild(cardCol);

        return cardCol;
    });
  
}
fetchNews();
