function initSearch() {
  const searchBtn = document.querySelector(".search-btn");
  const searchSection = document.querySelector(".search-bar");
  const searchLayer = document.querySelector(".search-layer");
  const searchForm = document.querySelector(".search-form");
  const btnsContainer = document.querySelector(".btns-container");
  const iconsContainer = document.querySelector(".icons-container");

  if (!searchBtn || !searchSection || !searchForm || !searchLayer) return;

  //open and close search bar
  const openSearch = function () {
    btnsContainer.classList.add("hidden");
    iconsContainer.classList.add("hidden");
    searchSection.classList.remove("hidden");
    searchLayer.classList.remove("hidden");
    // searchInput.focus();
  };
  const closeSearch = function () {
    btnsContainer.classList.remove("hidden");
    iconsContainer.classList.remove("hidden");
    searchSection.classList.add("hidden");
    searchLayer.classList.add("hidden");
  };
  searchBtn.addEventListener("click", openSearch);
  searchLayer.addEventListener("click", closeSearch);

  //implement search mechanism

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = searchSection.querySelector(".search-input").value.trim();

    if (!query) return;
    window.location.href = `../pages/searchPage.html?q=${query}`;
  });
}
