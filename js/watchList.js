const watchlistContainer = document.querySelector(".watchlist-container");

const viewWatclist = function () {
  const list = JSON.parse(localStorage.getItem("watchList"));
  //Check if watchlist is empty write warning message
  if (list.length === 0) {
    const html = `<div
        class="flex py-16 font-semibold text-2xl md:text-4xl tracking-wide flex-col text-center justify-between gap-4"
      >
        <p class="text-6xl md:text-8xl">
          <i class="fa-solid fa-heart-crack"></i>
        </p>
        <p>Your watchlist is empty!!</p>
      </div>`;
    watchlistContainer.insertAdjacentHTML("beforebegin", html);
    return;
  }
  list.forEach((mov) => {
    const html = `
    <a href="../pages/detailsPage.html#${mov.type}-${
      mov.id
    }" class="movie-card">
      <div class="bg-[#0d1321] w-full max-w-[180px] md:max-w-[200px] rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:shadow-cream-primary/40 transition-all duration-300">
        <div class="relative">
            <img
                src="https://image.tmdb.org/t/p/w500${mov.poster}}"
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
    watchlistContainer.insertAdjacentHTML("beforeend", html);
  });
};
viewWatclist();
