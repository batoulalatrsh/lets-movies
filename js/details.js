const Key = "8390efbbbf016b233a8e951b4a115bb2";
const movieContainer = document.querySelector(".movie-detail");
const recommendationsContainer = document.querySelector(
  ".recommendations-container"
);
const [type, id] = window.location.hash.slice(1).split("-");
const endpoint = type === "tv" ? "tv" : "movie";

//Check if ther is no movie return
window.addEventListener("load", function (e) {
  try {
    if (!id) return;
    loadMovieDetails(id, endpoint);
  } catch (e) {
    console.log("Error loading movie:", e);
  }
});

//Load movie details
const loadMovieDetails = async function (id, endpoint) {
  try {
    // Fetch movie/tv details
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}/${id}?api_key=${Key}&language=en-US`
    );
    const movie = await res.json();

    if (!res.ok || movie.success === false) {
      console.log("❌ Not found:", movie);
      return;
    }

    renderMovieDetail(movie);

    // Fetch recommendations (movie or tv)
    const recRes = await fetch(
      `https://api.themoviedb.org/3/${endpoint}/${id}/recommendations?api_key=${Key}&language=en-US&page=1`
    );
    const recommendations = await recRes.json();

    if (!recRes.ok || recommendations.success === false) {
      console.log("❌ Recommendations not found");
      return;
    }
    renderMovieRecommendations(recommendations.results);
  } catch (e) {
    console.log("Movie/TV not found ⁉️", e);
  }
};

//Show movie details
const renderMovieDetail = function (movie) {
  //Change the media query dynamically and check if there is image or NOT
  const mediaQuery = window.matchMedia("(max-width:768px)");
  const type = mediaQuery.matches ? "poster_path" : "backdrop_path";
  const bgImage = movie[type] ? movie[type] : "../public/imgs/notfound.jpg";

  const html = `
    <div
      id="landing"
      style="background-image: url('https://image.tmdb.org/t/p/original${bgImage}');"
      class="h-screen bg-cover bg-center bg-no-repeat flex items-center relative pt-24 overflow-hidden "
    >
      <div class="inset-0 absolute bg-black/55"></div>

      <!-- Movie detail loaded here -->

      <div
        class="relative container px-6 flex flex-col md:flex-row gap-10 items-center z-10 max-w-7xl"
      >
        <!-- Movie Poster -->
        <div class="w-1/3 flex justify-center">
          <img
            src="https://image.tmdb.org/t/p/original${movie.poster_path}"
            alt="${movie.title}"
            class="hidden md:block lg:h-[33rem] md:w-96 rounded-lg shadow-lg shadow-gray-700"
          />
        </div>

        <!-- Movie Info -->
        <div
          class="w-full md:w-2/3 relative bottom-0 md:bottom-auto translate-y-32 md:translate-0 text-cream-primary flex flex-col text-center md:text-left items-center md:items-start"
        >
          <h1 class="t-2 text-4xl md:text-6xl font-bold mb-4">${
            movie.title || movie.name
          }</h1>
          <p class="text-cream-primary leading-relaxed mb-0 md:mb-6 text-sm md:text-md lg:text-lg">
           ${movie.overview}
          </p>
          <!-- Movie small details -->
          <div class="text-lg md:text-xl flex gap-8">
            <p>
              <i class="fa-solid fa-calendar-days text-icons"></i>
              <span class="font-bold">${
                (movie.release_date || movie.first_air_date).split("-")[0]
              }</span>
            </p>
            <p>
              <i class="fa-solid fa-star text-icons"></i>
              <span class="font-bold">${movie.vote_average}</span>
            </p>
            <p>
              <i class="fa-solid fa-eye text-icons"></i>
              <span class="font-bold">${movie.popularity}</span>
            </p>
          </div>

          <!-- Movie genere -->

          <div class="mt-4 flex gap-8 text-cream-primary">
          ${movie.genres
            ?.map(
              (gen) => `
                <p>
                  <span class="movie-genere"></span>${gen.name}
                </p>
              `
            )
            .join("")}
          </div>

          <div
            class="mt-12 md:mt-16 flex gap-12 text-cream-primary font-bold"
          >
            <button
              class="w-fit px-12 py-2 bg-linear-to-r from-primary to-secondary rounded-full transition-transform duration-300 hover:scale-105"
            >
              <a href="#"> Watch Now</a>
            </button>
            <button
              class="add-btn w-fit px-2.5 py-2 border-4 border-icons rounded-full transition-transform duration-300 hover:scale-105"
            >
            <i class="fa-solid fa-plus font-extrabold"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    `;
  movieContainer.insertAdjacentHTML("beforeend", html);
  const addBtn = document.querySelector(".add-btn");
  updateAddButton(addBtn, movie); //to update it for the first time
  addBtn.addEventListener("click", () => toggleWatchlist(movie, addBtn));
};

//Implement render recommendations function
const renderMovieRecommendations = function (movies) {
  recommendationsContainer.innerHTML = ""; // clear old
  movies.forEach((mov) => {
    const poster = mov.poster_path
      ? `https://image.tmdb.org/t/p/w500${mov.poster_path}`
      : "../public/imgs/notfound.jpg";
    const html = `
       <a href="./detailsPage.html#movie-${mov.id}" class="movie-card">
      <div class="bg-movie w-[160px] sm:w-[200px] rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-cream-primary/40 transition-all duration-300">
        <div class="relative">
            <img
                src="${poster}"
                alt="${mov.title || mov.name}"
                class="w-full h-56 md:h-64 object-cover"
            />
        </div>
        <div class="p-2 max-h-14">
            <h3 class="font-semibold text-white truncate">${
              mov.title || mov.name
            }</h3>
            <p class="text-sm text-gray-400 mb-2 hidden sm:block">
            ${mov.overview || ""}
            </p>
        </div>
      </div>
    </a>
    `;
    recommendationsContainer.insertAdjacentHTML("beforeend", html);
  });
};

//Implement book mark task
const getWatchlist = function () {
  return JSON.parse(localStorage.getItem("watchList")) || [];
};
const isInWatchlist = function (id) {
  const list = getWatchlist();
  return list.some((item) => item.id === id);
};
const toggleWatchlist = function (movie, addBtn) {
  let list = getWatchlist();
  if (isInWatchlist(movie.id)) {
    list = list.filter((item) => item.id !== movie.id);
  } else {
    list.push({
      id: movie.id,
      poster: movie.poster_path,
      title: movie.title || movie.name,
      type: endpoint,
      overview: movie.overview,
    });
  }
  localStorage.setItem("watchList", JSON.stringify(list));
  updateAddButton(addBtn, movie);
};
//Update buttom style
const updateAddButton = function (addBtn, movie) {
  addBtn.classList.remove("bg-transparent", "bg-icons");
  if (isInWatchlist(movie.id)) {
    addBtn.classList.add("bg-icons");
  } else {
    addBtn.classList.add("bg-transparent");
  }
};

//
window.addEventListener("hashchange", function () {
  const [type, id] = window.location.hash.slice(1).split("-");
  if (!id) return;
  //Clear old container
  movieContainer.innerHTML = "";
  recommendationsContainer.innerHTML = "";

  //Load new movie
  loadMovieDetails(id, type);
});
