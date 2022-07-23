let searchForm = document.querySelector("#search-form");
let movie = document.querySelector("#movies");

function apiSearch(event) {
    event.preventDefault();
    let searchText = document.querySelector(".form-control").value;
    let server = `https://api.themoviedb.org/3/search/multi?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru&query=${searchText}`;
    movie.innerHTML = "Загрузка";
    requestApi(server)
        .then(function (result) {
            let output = JSON.parse(result);
            let inner = "";

            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let releaseDate = item.release_date || item.first_air_date;

                inner += `<div class='col-12 col-md-4 col-xl-3'>${nameItem} <div> Дата выхода: ${releaseDate} </div></div>`;
            });

            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML = "Ooops, что-то пошло не так!";
            console.log("error" + reason.status);
        });
}

searchForm.addEventListener("submit", apiSearch);

function requestApi(url) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();
        request.open("GET", url);
        request.addEventListener("load", function () {
            if (request.status !== 200) {
                reject({
                    status: request.status,
                });
                return;
            }

            resolve(request.response);
        });

        request.addEventListener("error", function () {
            reject({
                status: request.status,
            });
        });

        request.send();
    });
}
