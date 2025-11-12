document.addEventListener("DOMContentLoaded", () => {
  //Download header automatically
  const headerContainer = document.getElementById("header");
  if (!header) return;
  fetch("../components/header.html")
    .then((res) => res.text())
    .then((data) => {
      headerContainer.innerHTML = data;

      //Implement humburger buttom
      const humburgerIcon = document.querySelector(".humburger-icon");
      const navMenu = document.querySelector("#nav-menu");

      humburgerIcon?.addEventListener("click", () => {
        navMenu?.classList.toggle("hidden");
      });

      //Active current page
      activeCurrentPage();

      //Active search btn(ww active it here to insure that head DOM is downloaded)
      if (typeof initSearch === "function") initSearch();
    })
    .catch((err) => {
      console.log("Failed to load header:", err);
    });
});

//Implement active current page function
const activeCurrentPage = function () {
  const curPage = window.location.href;
  const pageMap = {
    index: ".home-btn",
    series: ".series-btn",
    watchLis: ".watchlist-btn",
  };
  for (const [key, value] of Object.entries(pageMap)) {
    if (curPage.includes(key)) {
      const btn = document.querySelector(value);
      btn?.classList.add("active");
      break;
    }
  }
};
