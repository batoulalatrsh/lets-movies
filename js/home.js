const apiKey = "8390efbbbf016b233a8e951b4a115bb2";
const state = {
  items: [],
  watchList: {},
  currentPage: 1,
};
//To determine if we are in tv page or movies page
const getCurrentType = function () {
  const path = window.location.pathname;
  if (path.includes("index")) return "movie";
  if (path.includes("series")) return "tv";
  return null;
};
const curItem = getCurrentType();

// Restore scroll position + page
const restoreScrollState = function (type) {
  window.addEventListener("beforeunload", () => {
    localStorage.setItem(`scrollPosition${type}`, window.scrollY);
    localStorage.setItem(`currentPage${type}`, state.currentPage);
  });

  //Save scroll position cuz if we reload page save old position
  window.addEventListener("load", () => {
    //Load previus page number
    const savedPage = localStorage.getItem(`currentPage${type}`);
    if (savedPage) {
      state.currentPage = parseInt(savedPage);
    }

    //Load previus scroll position
    const scrollPos = localStorage.getItem(`scrollPosition${type}`);
    if (scrollPos) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(scrollPos));
      }, 200);
    }
    //load page
    loadItems(state.currentPage);
  });
};
restoreScrollState(curItem);

const viewItems = function (type) {
  //Determine suitable container
  const container =
    type === "movie"
      ? document.querySelector(".movies-container")
      : document.querySelector(".series-container");
  if (!container) return;

  container.innerHTML = "";
  state.items.forEach((mov) => {
    const poster = mov.poster_path
      ? "https://image.tmdb.org/t/p/w500" + mov.poster_path
      : "../public/imgs/notfound.jpg";
    const html = `
    <a href="../pages/detailsPage.html#${type}-${mov.id}" class="movie-card">
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
    container.insertAdjacentHTML("beforeend", html);
  });
};

const loadItems = async function (pagenum = 1) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/${curItem}/popular?api_key=${apiKey}&language=en-US&page=${pagenum}`
    );
    if (!res.ok) throw new Error("Failed to fetch movies/tv shows");
    const items = await res.json();
    state.totalPages = items.total_pages;
    state.items = items.results;
    viewItems(curItem);
  } catch (e) {
    console.log(e);
  }
};
loadItems();

//Fetch pagination component
fetch("../components/pagination.html")
  .then((res) => res.text())
  .then((data) => {
    document.querySelector("#pagination").innerHTML = data;

    // After load the component activate it
    //Check if this function is loaded
    if (typeof initPagination === "function") {
      initPagination(loadItems);
    }
  });

//Set watch now button automatically
const watchBtn = document.getElementById("watch-now");
watchBtn.addEventListener("click", () => {
  if (curItem === "movie")
    window.location.href = `/pages/detailsPage.html#movie-585`;
  if (curItem === "tv") window.location.href = `./detailsPage.html#tv-1668`;
});
