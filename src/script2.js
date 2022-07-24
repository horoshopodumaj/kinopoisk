let searchForm = document.querySelector("#search-form");
let movie = document.querySelector("#movies");
let urlPoster = "https://image.tmdb.org/t/p/w500";

function apiSearch(event) {
    event.preventDefault();
    let searchText = document.querySelector(".form-control").value;

    if (searchText.trim().length === 0) {
        movie.innerHTML = `<h2 class='col-12 text-center text-danger item'>Неверный запрос</h2>`;
        return;
    }
    let server = `https://api.themoviedb.org/3/search/multi?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru&query=${searchText}`;
    movie.innerHTML = "<div class='spinner'></div>";

    fetch(server)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then(function (output) {
            let inner = "";
            console.log(output);
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let releaseDate = item.release_date || item.first_air_date;
                let poster = item.poster_path
                    ? urlPoster + item.poster_path
                    : "./img/no_poster.jpg";
                inner += `
                <div class='col-12 col-md-6 col-xl-3 item'>
                <img src=${poster} class='img_poster' alt='${nameItem}'>
                    <h5>${nameItem}</h5>
                    <div>Дата выхода: ${releaseDate} </div>
                </div>`;
            });

            movie.innerHTML = inner;
        })
        .catch(function (reason) {
            movie.innerHTML = "Ooops, что-то пошло не так!";
            console.log("error: " + reason);
        });
}

searchForm.addEventListener("submit", apiSearch);
