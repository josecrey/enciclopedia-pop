import { dataFetch } from "./dataFetch.js";

const articlesPath = new URL("../data/mockArticles.json", import.meta.url);
const articleSearchInput = document.querySelector("#article-search-input").addEventListener("input", searchArticleByTitle);
const articleListContainer = document.querySelector(".article-list");
var articleList = []


function createArticle(article) {
    const card = document.createElement("article");
    card.className = "article-card";
    card.innerHTML = `
        <div class="article-card__image">
            <img src="${article.imagen}">
            <div class="article-card__tag">${article.categoria}</div>
        </div>
        <div class="article-card__info">
            <h1 class="article-card__title">${article.titulo}</h1>
            <p class="article-card__text">${article.descripcion}</p>
        </div>
    `
    return card
}

function createArticleCounter(number) {
    const counter = document.querySelector(".article-counter");

    if (counter) {
        counter.innerHTML = `
        <h1 class="article-counter__text">Todas las sagas <span>(${number})</span></h1>
        `  
    } else {
        console.warn("No he podido encontrar article counter")
    }
    
}

function searchArticleByTitle() {
    if (this.value.length) {
        pintArticles(
            {
                type: "titulo",
                value: this.value
            }
        )
    } else {
        pintArticles()
    }
}

function pintArticles(filter) {
    var filteredArticles;

    if (filter) {
        filteredArticles = articleList.filter(article => {
            const father = article[filter.type].toLowerCase()
            const child = filter.value.toLowerCase()
            return father.includes(child)
        })
    } else {
        filteredArticles = articleList
    }

    articleListContainer.innerHTML = ""
    filteredArticles.forEach(article => {
        const card = createArticle(article);
        if (articleListContainer) {
            articleListContainer.appendChild(card)
        }
    });
}


async function articleFetch() {
    const data = await dataFetch(articlesPath);
    if (data) {
        console.log(data);
        return data
    } else {
        console.warn("No se pudo cargar el JSON (revisa rutas y servidor).");
    }
}



articleFetch().then(articles => {
    articleList = articles
    createArticleCounter(articles.length);
    pintArticles()
})