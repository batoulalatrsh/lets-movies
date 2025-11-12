const apiKey = "8390efbbbf016b233a8e951b4a115bb2";
const searchContainer = document.getElementById("search-container");
const searchFormPage = document.querySelector(".search-form-page");
const searchInputPage = document.querySelector(".search-input-page");

//Get input field from url
const params = new URLSearchParams(window.location.search);
const query = params.get("q") || "";
searchInputPage.value = query;

//Load search result
const loadSearchResult = async function (query) {
  try {
    searchContainer.innerHTML = ""; // clear old results
    const data = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(
        query
      )}`
    );
    const res = await data.json();
    console.log(res);
    renderSearchResult(res.results);
  } catch (err) {
    console.log(err);
  }
};
// Render function
const renderSearchResult = function (movies) {
  if (!movies || movies.length === 0) {
    searchContainer.innerHTML = `<p class="text-center text-gray-400 mt-10 md:text-2xl">No results found.</p>`;
    return;
  }

  movies.forEach((mov) => {
    const html = `
    <a href="../pages/detailsPage.html#${mov.type}-${
      mov.id
    }" class="movie-card">
      <div class="bg-[#0d1321] flex sm:block w-96 sm:w-[180px] md:w-[200px] h-30 sm:h-auto  sm:rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-cream-primary/40 transition-all duration-300">
        <div class="relative">
            <img
                src="https://image.tmdb.org/t/p/w500${mov.poster_path}}"
                alt="${mov.title || mov.name}"
                class="w-full h-full sm:h-56 md:h-64 object-cover"
            />
        </div>
        <div class="w-64 p-2 max-h-14">
            <h3 class="font-semibold text-white truncate">${
              mov.title || mov.name
            }</h3>
            <p class="text-sm text-gray-400 mb-2 hidden sm:block">
            ${mov.overview || ""}
            </p>
            <div class="sm:hidden text-[12px] flex gap-4 mt-4">
            <p>
              <i class="fa-solid fa-calendar-days text-icons text-[12px]"></i>
              <span >${
                (mov.release_date || mov.first_air_date).split("-")[0]
              }</span>
            </p>
            <p>
              <i class="fa-solid fa-star text-icons"></i>
              <span >${mov.vote_average}</span>
            </p>
            <p>
              <i class="fa-solid fa-eye text-icons"></i>
              <span >${mov.popularity}</span>
            </p>
          </div>
        </div>
      </div>
    </a>
    `;
    searchContainer.insertAdjacentHTML("beforeend", html);
  });
};
// Load results initially
if (query) loadSearchResult(query);

// Research in he same page
searchFormPage.addEventListener("submit", (e) => {
  e.preventDefault();
  const newQuery = searchInputPage.value.trim();
  if (!newQuery) {
    resultsContainer.innerHTML = "";
    return;
  }
  // Update URL (optional but nice)
  history.replaceState(null, "", `?q=${encodeURIComponent(newQuery)}`);

  // Reload results
  loadSearchResult(newQuery);
});
