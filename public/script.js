async function fetchResults() {
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = '<div class="sensor-card"><p>Cargando datos...</p></div>';

  try {
    // Hacer la petición GET a la API para obtener los datos procesados
    const response = await fetch('/api/procesar');
    const data = await response.json();
    console.log(data);  // Verifica qué está devolviendo el servidor
    
    let resultHtml = '';
    
    // Iterar sobre los sensores y generar el HTML con los resultados
    for (const [sensor, resultado] of Object.entries(data)) {
      resultHtml += `
        <div class="sensor-card">
          <h2>${sensor}</h2>
          <ul>
            <li><span>Promedio:</span> ${resultado.promedio.toFixed(2)}</li>
            <li><span>Desviación estándar:</span> ${resultado.desviacionEstandar.toFixed(2)}</li>
            <li><span>Desviación cuadrática media:</span> ${resultado.desviacionCuadraticaMedia.toFixed(2)}</li>
            <li><span>Error probable:</span> ${resultado.errorProbable.toFixed(2)}</li>
            <li><span>Error límite:</span> ${resultado.errorLimite.toFixed(2)}</li>
          </ul>
        </div>
      `;
    }

    // Mostrar los resultados en la página
    resultsElement.innerHTML = resultHtml;

  } catch (error) {
    resultsElement.innerHTML = `<div class="sensor-card"><p>Error al cargar datos: ${error.message}</p></div>`;
  }
}
