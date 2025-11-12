function initPagination(loadFunction) {
  const paginationBar = document.querySelector(".pagination-bar");
  if (!paginationBar) return;

  paginationBar.addEventListener("click", function (e) {
    e.preventDefault();
    const next = e.target.closest(".nextbtn");
    const prev = e.target.closest(".prevbtn");

    if (next && state.currentPage < state.totalPages) {
      loadFunction(++state.currentPage);
      localStorage.setItem("currentPage", state.currentPage);
    } else if (prev && state.currentPage > 1) {
      loadFunction(--state.currentPage);
      localStorage.setItem("currentPage", state.currentPage);
    }
  });
}