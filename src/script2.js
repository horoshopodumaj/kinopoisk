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
    let url = "";
    if (this.dataset.type === "movie") {
        url = `
        https://api.themoviedb.org/3/movie/${this.dataset.id}?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru`;
    } else if (this.dataset.type === "tv") {
        url = `
        https://api.themoviedb.org/3/tv/${this.dataset.id}?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru`;
    } else {
        movie.innerHTML = `<h2 class='col-12 text-center text-info item'>Произошла ошибка, повторите позже</h2>`;
    }
    let typeMedia = this.dataset.type;
    let idMedia = this.dataset.id;

    fetch(url)
        .then(function (value) {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then(function (output) {
            let genres = [];
            output.genres.forEach((item) => {
                genres.push(item.name);
            });
            let poster = output.poster_path
                ? urlPoster + output.poster_path
                : "./img/no_poster.jpg";
            movie.innerHTML = `
            <h4 class='col-12 text-center text-info'>${
                output.name || output.title
            }</h4>
            <div class='col-4'>
                <img src=${poster} alt='${output.name || output.title}'>
                ${
                    output.homepage
                        ? `<p class="text-center"><a href='${output.homepage}' target='_blank'>Официальная страница</a></p>`
                        : ""
                }
                ${
                    output.imdb_id
                        ? `<p class="text-center"><a href='https://imdb.com/title/${output.imdb_id}' target='_blank'>Cтраница на IMDB.com</a></p>`
                        : ""
                }
            </div>
            <div class='col-8'>
                <p>${output.overview}</p>
                <p>Рейтинг: ${output.vote_average}</p>
                <p>Статус: ${output.status}</p>
                <p>Премьера: ${output.release_date || output.first_air_date}</p>
                ${
                    output.last_episode_to_air
                        ? `<p>Вышло ${output.number_of_seasons} сезон(а), в последнем сезоне вышло ${output.last_episode_to_air.episode_number} серий.</p>`
                        : ""
                }
                <p>Жанры: ${genres}</p>

                <br>
                <div class='youtube'></div>
            </div>
            `;

            getVideo(typeMedia, idMedia);
        })
        .catch(function (reason) {
            movie.innerHTML = "Ooops, что-то пошло не так!";
            console.log("error: " + reason);
        });
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
            let inner = `<h4 class='col-12 text-center text-info item'>Популярное за неделю</h4>`;
            if (output.results.length === 0) {
                inner = `<h2 class='col-12 text-center text-info item'>К сожалению, ничего не найдено</h2>`;
            }
            output.results.forEach(function (item) {
                let nameItem = item.name || item.title;
                let poster = item.poster_path
                    ? urlPoster + item.poster_path
                    : "./img/no_poster.jpg";

                let dataInfo = `data-id = ${item.id} data-type=${item.media_type}`;
                inner += `
                <div class='col-12 col-md-6 col-xl-3 item'>
                <img src=${poster} class='img_poster' alt='${nameItem}' ${dataInfo}>
                    <h5>${nameItem}</h5>
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

function getVideo(type, id) {
    let youtube = movie.querySelector(".youtube");
    fetch(
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=a11a1a6a5a534565f99c09241f77ff27&language=ru`
    )
        .then((value) => {
            if (value.status !== 200) {
                return Promise.reject(new Error(value.status));
            }
            return value.json();
        })
        .then((output) => {
            console.log(output);
            let videoFrame = `<h5 class='col-12 text-info'>Видео</h5>`;
            output.results.forEach((item) => {
                videoFrame += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${item.key}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            });
            youtube.innerHTML = videoFrame;
        })
        .catch((reason) => {
            youtube.innerHTML = "Видео отсутствует";
            console.log("error: " + reason);
        });
}
