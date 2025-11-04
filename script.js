const searchForm = document.querySelector("#searchForm");
const input = document.querySelector("#inputValue");
const tableBody = document.querySelector("tbody");

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const countryName = input.value.trim();
  if (!countryName) return;

  tableBody.innerHTML = `<tr><td colspan="5">Ładowanie danych...</td></tr>`;

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        tableBody.innerHTML = `<tr><td colspan="5">Nie znaleziono kraju o podanej nazwie.</td></tr>`;
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
        const languages = country?.languages
          ? Object.values(country.languages).join(", ")
          : "Brak danych";

        return `
          <tr>
            <td>${name}</td>
            <td>${capital}</td>
            <td>${population}</td>
            <td>${region}</td>
            <td>${languages}</td>
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
