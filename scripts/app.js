import { dataFetch } from "./dataFetch.js";

const articlesPath = new URL("../data/mockArticles.json", import.meta.url);
const articleSearchForm = document.querySelector("#article-search-form");
articleSearchForm.addEventListener("input", searchArticleBy);
articleSearchForm.addEventListener("change", searchArticleBy);
articleSearchForm.addEventListener("reset", resetArticleSearchForm);
const articleListContainer = document.querySelector(".article-list");
const categoryList = new Set()
var articleList = []



function createArticle(article) {
    const card = document.createElement("article");
    card.className = "article-card";
    card.style=`border-color: ${article?.color}`
    card.innerHTML = `
        <div class="article-card__image">
            <img src="${article.imagen}">
            <div class="article-card__tag" style="background-color: ${article?.color}">${article.categoria}</div>
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
        <h3 class="article-counter__text">Todas las sagas <span>(${number})</span></h1>
        `  
    } else {
        console.warn("No he podido encontrar article counter")
    }
    
}

function searchArticleBy() {
    const titleValue = document.getElementById("article-search-form__input").value
    const categoryValue = document.getElementById("article-search-form__select").value

    if (!titleValue.length && categoryValue === "all") {
        pintArticles()
    } else {
        pintArticles(
            {
                titulo: titleValue,
                categoria: categoryValue
            }
        )
    }
}

function pintArticles(filter) {
    var filteredArticles;

    if (filter) {
        filteredArticles = articleList.filter(article => {
            const articleTitle = article["titulo"].toLowerCase()
            const filterTitle = filter["titulo"].toLowerCase()
            const articleCategory = article["categoria"].toLowerCase()
            const filterCategory = filter["categoria"]
            
            if (filterCategory === "all") {
                return articleTitle.includes(filterTitle)
            } else {
                return (articleTitle.includes(filterTitle) || filterTitle.length == 0) && articleCategory === filterCategory
            }
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
    createArticleCounter(filteredArticles.length);
}

function setGategoryList(articles) {
    articles.forEach(article => {
        if (article?.categoria) {
            categoryList.add(article.categoria.toLowerCase())
        }
    })
}

function createCategoryList() {
    const select = document.createElement("select");
    select.id = "article-search-form__select"
    select.innerHTML = ` <option value="all">Todas las categorias</option>`
    categoryList.forEach(category => {
        const categoryItem = `
            <option value="${category}">${category}</option>
        `
        select.innerHTML += categoryItem
    })
    articleSearchForm.appendChild(select)
}

function resetArticleSearchForm() {
    document.getElementById("article-search-form__input").value = ""
    document.getElementById("article-search-form__select").value = "all"
    articleSearchForm.submit()
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
    setGategoryList(articles)
    createCategoryList()
    pintArticles()
})