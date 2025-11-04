// const searchForm = document.querySelector("#searchForm");
// const input = document.querySelector("#inputValue");
const tableBody = document.querySelector("tbody");
const loadStationsBtn = document.querySelector("#loadStationsBtn")
const api_token = "ppocAxGDRhwgUUBNNLKJZCRcczajrqfI";
const api_base = "https://www.ncei.noaa.gov/cdo-web/api/v2"
loadStationsBtn.addEventListener("click", async (event) => {
  tableBody.innerHTML = `<tr><td colspan="5">Ładowanie danych ze stacji...</td></tr>`;

  // żeby przepuszczało trzeba wejść na stronę https://cors-anywhere.herokuapp.com/corsdemo i poprosić o dostęp 
  try {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const response = await fetch(`${proxy}${api_base}/datasets`, {
      headers: { token: api_token }
    });

    if (!response.ok) {
      throw new Error(`Błąd: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">Brak danych o stacjach.</td></tr>`;
      return;
    }
    const rows = data.results
      .map((station) => {
        const id = station.id ?? "Brak danych";
        const name = station.name ?? "Brak danych";
        const desc = station.description ?? "Brak danych";
        const start = station.mindate ?? "Brak danych";
        const end = station.maxdate ?? "Brak danych";
        return `
          <tr>
            <td>${id}</td>
            <td>${name}</td>
            <td>${desc}</td>
            <td>${start}</td>
            <td>${end}</td>
          </tr>
        `;
      })
      .join("");

    tableBody.innerHTML = rows;
  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="5">Błąd: ${err.message}</td></tr>`;
  }
});
