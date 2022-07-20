let searchForm = document.querySelector("#search-form");

function apiSearch(event) {
    event.preventDefault();
    let searchText = document.querySelector(".form-control").value;
    let server = `https://api.themoviedb.org/3/search/multi?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru&query=${searchText}`;

    requestApi("GET", server);
}

searchForm.addEventListener("submit", apiSearch);

function requestApi(method, url) {
    let request = new XMLHttpRequest();
    request.open(method, url);
    request.send();
}
