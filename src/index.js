let searchForm = document.querySelector("#search-form");
let movie = document.querySelector("#movies");

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
    request.addEventListener("readystatechange", () => {
        if (request.readyState !== 4) {
            movie.innerHTML = "Загрузка";
            return;
        }

        if (request.status !== 200) {
            movie.innerHTML = "Ooops, что-то пошло не так!";
            console.log("error" + request.status);
            return;
        }

        let output = JSON.parse(request.responseText);
        let inner = "";

        output.results.forEach(function (item) {
            let nameItem = item.name || item.title;
            let releaseDate = item.release_date || item.first_air_date;

            inner += `<div class='col-12 col-md-4 col-xl-3'>${nameItem} <div> Дата выхода: ${releaseDate} </div></div>`;
        });

        movie.innerHTML = inner;
    });
}
