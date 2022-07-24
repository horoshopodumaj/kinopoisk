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
            if (output.results.length === 0) {
                inner = `<h2 class='col-12 text-center text-info item'>К сожалению, ничего не найдено</h2>`;
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let releaseDate = item.release_date || item.first_air_date;
                let poster = item.poster_path
                    ? urlPoster + item.poster_path
                    : "./img/no_poster.jpg";

                let dataInfo = "";
                if (item.media_type !== "person")
                    dataInfo = `data-id = ${item.id} data-type=${item.media_type}`;
                inner += `
                <div class='col-12 col-md-6 col-xl-3 item'>
                <img src=${poster} class='img_poster' alt='${nameItem}' ${dataInfo}>
                    <h5>${nameItem}</h5>
                    <div>Дата выхода: ${releaseDate} </div>
                </div>`;
            });

            movie.innerHTML = inner;

            addEventMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = "Ooops, что-то пошло не так!";
            console.log("error: " + reason);
        });
}

searchForm.addEventListener("submit", apiSearch);

function addEventMedia() {
    let media = movie.querySelectorAll("[data-id]");
    media.forEach(function (elem) {
        elem.style.cursor = "pointer";
        elem.addEventListener("click", showFullInfo);
    });
}

function showFullInfo() {
    console.log(this);
}

document.addEventListener("DOMContentLoaded", () => {
    fetch(
        "https://api.themoviedb.org/3/trending/all/week?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru"
    )
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then(function (output) {
            let inner = `<h4 class='col-12 text-center text-info item'>Популярное за неделю</h2>`;
            if (output.results.length === 0) {
                inner = `<h2 class='col-12 text-center text-info item'>К сожалению, ничего не найдено</h4>`;
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let releaseDate = item.release_date || item.first_air_date;
                let poster = item.poster_path
                    ? urlPoster + item.poster_path
                    : "./img/no_poster.jpg";

                let dataInfo = "";
                if (item.media_type !== "person")
                    dataInfo = `data-id = ${item.id} data-type=${item.media_type}`;
                inner += `
                <div class='col-12 col-md-6 col-xl-3 item'>
                <img src=${poster} class='img_poster' alt='${nameItem}' ${dataInfo}>
                    <h5>${nameItem}</h5>
                    <div>Дата выхода: ${releaseDate} </div>
                </div>`;
            });

            movie.innerHTML = inner;

            addEventMedia();
        })
        .catch(function (reason) {
            movie.innerHTML = "Ooops, что-то пошло не так!";
            console.log("error: " + reason);
        });
});
