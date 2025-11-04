const searchForm = document.querySelector("#searchForm");
const capitalInput = document.querySelector("#inputValue");
const tableBody = document.querySelector("tbody");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const capitalName = capitalInput.value.trim();
  if (!capitalName) return;

  tableBody.innerHTML = `<tr><td colspan="5">Ładowanie danych...</td></tr>`;

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/capital/${encodeURIComponent(capitalName)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        tableBody.innerHTML = `<tr><td colspan="5">Nie znaleziono kraju o podanej stolicy.</td></tr>`;
        return;
      }
      throw new Error("Nie udało się pobrać danych z API.");
    }

    const countries = await response.json();

    const rows = countries
      .map((country) => {
        const name = country?.name?.official ?? "Brak danych";
        const capital = Array.isArray(country?.capital)
          ? country.capital.join(", ")
          : country?.capital ?? "Brak danych";
        const population = country?.population
          ? country.population.toLocaleString()
          : "Brak danych";
        const region = country?.region ?? "Brak danych";
        const subregion = country?.subregion ?? "Brak danych";

        return `
          <tr>
            <td>${name}</td>
            <td>${capital}</td>
            <td>${population}</td>
            <td>${region}</td>
            <td>${subregion}</td>
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
