function fetchFavoritos() {
    fetch('http://localhost:3000/favoritos')
      .then(response => response.json())
      .then(jsondata => {
        mostrarFavoritos(jsondata);
      })
      .catch(error => {
        console.error('Error al cargar los datos:', error);
      });
  }

// Función para mostrar los favoritos
function mostrarFavoritos(favoritos) {
  const container = document.getElementById("container-cosmetics");
  container.innerHTML = "";  // Limpiamos el contenedor antes de mostrar los nuevos favoritos

  if (favoritos.length === 0) {
    const noFavoritesMessage = document.createElement("p");
    noFavoritesMessage.textContent = "No hay favoritos guardados.";
    noFavoritesMessage.classList.add('text-center', 'text-black', 'mt-4');
    container.appendChild(noFavoritesMessage);
    return;
  }

  favoritos.forEach(favorito => {
    const cardCol = document.createElement("div");
    cardCol.classList.add('col-12', 'col-sm-6', 'col-md-4', 'col-lg-3', 'mb-4');

    const card = document.createElement("div");
    card.classList.add('card', 'text-center', 'border-0', 'shadow', 'h-100');
    card.style.backgroundColor = '#1c1e21';
    card.style.color = '#fff';

    const img = document.createElement('img');
    img.src = favorito.images.icon || 'img/_default.png';
    img.alt = favorito.name;
    img.classList.add('card-img-top', 'p-3', 'rounded', 'img-fluid');

    const cardBody = document.createElement("div");
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add('card-title', 'luckiest-guy-regular');
    cardTitle.textContent = favorito.name;

    const cardText = document.createElement("p");
    cardText.classList.add('card-text');
    cardText.textContent = favorito.description;

    // Botón para eliminar favorito
    const deleteButton = document.createElement("button");
    deleteButton.classList.add('btn', 'btn-danger', 'mt-2');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', () => {
      eliminarFavorito(favorito.id);
    });

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardBody.appendChild(deleteButton);
    card.appendChild(img);
    card.appendChild(cardBody);
    cardCol.appendChild(card);
    container.appendChild(cardCol);
  });
}

// Función para eliminar un favorito
function eliminarFavorito(id) {
  fetch(`http://localhost:3000/favoritos/${id}`, {
    method: 'DELETE'
  })
  .then(response => {
    if (response.ok) {
      console.log('Favorito eliminado');
      fetchFavoritos(); // Recargar la lista de favoritos
    } else {
      console.error('Error al eliminar el favorito');
    }
  })
  .catch(error => {
    console.error('Error al eliminar el favorito:', error);
  });
}

// Inicializar la carga de favoritos
fetchFavoritos();