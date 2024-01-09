document.addEventListener('DOMContentLoaded', () => {
  const characterListElement = document.getElementById('characterList');

  // Abrir o crear la base de datos
  const request = indexedDB.open('swapiDatabase', 1);

  request.onupgradeneeded = (event) => {
      // Crear la tabla 'characters' si no existe
      const db = event.target.result;
      const objectStore = db.createObjectStore('characters', { keyPath: 'id' });

      // Crear un índice por nombre
      objectStore.createIndex('name', 'name', { unique: false });
  };

  request.onsuccess = (event) => {
      const db = event.target.result;

      // Verificar si ya hay datos en la base de datos
      const transaction = db.transaction('characters', 'readonly');
      const objectStore = transaction.objectStore('characters');
      const request = objectStore.getAll();

      request.onsuccess = (event) => {
          const storedData = event.target.result;

          if (storedData.length > 0) {
              // Si hay datos almacenados, mostrarlos
              displayCharacters(storedData);
          } else {
              // Si no hay datos almacenados, obtener datos de la API
              fetch('https://swapi.dev/api/people/?format=json')
                  .then(response => response.json())
                  .then(data => {
                      // Almacenar datos en la base de datos
                      const transaction = db.transaction('characters', 'readwrite');
                      const objectStore = transaction.objectStore('characters');

                      data.slice(0, 20).forEach(character => {
                          objectStore.add(character);
                      });

                      // Mostrar los primeros 20 personajes en la lista
                      displayCharacters(data.slice(0, 20));
                  })
                  .catch(error => console.error('Error fetching data:', error));
          }
      };
  };

  // Manejar errores al abrir la base de datos
  request.onerror = (event) => {
      console.error('Error opening IndexedDB:', event.target.error);
  };
});

// Función para mostrar personajes en la lista
function displayCharacters(characters) {
  const characterListElement = document.getElementById('characterList');
  characters.forEach(character => {
      const listItem = document.createElement('li');
      listItem.textContent = `${character.name} - Gender: ${character.gender}, Height: ${character.height}cm`;
      characterListElement.appendChild(listItem);
  });
}