const articles = [
    {
        id: "article-1",
        title: "Озера Карпат: ранкове сяйво",
        description: "Короткий опис статті про неймовірні сходи сонця над озером у горах.",
        date: "10 лютого 2026",
        photo: "https://images.unsplash.com/photo-1746345883879-75ebff21a3d4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: "article-2",
        title: "Прогулянка старим містом",
        description: "Розповідь про вузькі вулички, кав'ярні та несподівані відкриття.",
        date: "28 січня 2026",
        photo: "https://images.unsplash.com/photo-1700740395620-747d65203698?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: "article-3",
        title: "Морський бриз та дорога вздовж узбережжя",
        description: "Маршрут для тих, хто любить дорогу, море та відкриття.",
        date: "5 грудня 2025",
        photo: "https://images.unsplash.com/photo-1498623116890-37e912163d5d?w=600&q=80"
    },
    {
        id: "article-4",
        title: "Трекінг: крок за кроком",
        description: "Поради для підготовки до тривалих походів і вибору спорядження.",
        date: "20 листопада 2025",
        photo: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80"
    },
    {
        id: "article-5",
        title: "Ніч під зорями: ідеї для кемпінгу",
        description: "Як облаштувати табір і зберегти комфорт у дикій природі.",
        date: "2 жовтня 2025",
        photo: "https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=702&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
        id: "article-6",
        title: "Водоспади і скелі: фотографічні точки",
        description: "Кращі місця для фотографій та безпечні маршрути.",
        date: "15 вересня 2025",
        photo: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80"
    }
];

function getCommentsKey(articleId) {
    return "lab2:comments:" + articleId;
}

function readComments(articleId) {
    const raw = localStorage.getItem(getCommentsKey(articleId));

    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        return [];
    }
}

function saveComments(articleId, comments) {
    localStorage.setItem(getCommentsKey(articleId), JSON.stringify(comments));
}

function appendCommentToList(commentsList, commentData) {
    const commentItem = document.createElement("li");
    commentItem.className = "comment-item";

    const author = document.createElement("strong");
    author.textContent = commentData.name;

    const text = document.createElement("p");
    text.textContent = commentData.text;

    commentItem.appendChild(author);
    commentItem.appendChild(text);
    commentsList.appendChild(commentItem);
}

function renderSavedComments(articleId, commentsList) {
    const savedComments = readComments(articleId);
    let index = 0;

    while (index < savedComments.length) {
        appendCommentToList(commentsList, savedComments[index]);
        index += 1;
    }
}

function createCommentForm(articleId, commentsList) {
    const form = document.createElement("form");
    form.className = "comment-form";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.placeholder = "Ваше ім'я";

    const textInput = document.createElement("textarea");
    textInput.name = "comment";
    textInput.placeholder = "Ваш коментар";
    textInput.rows = 3;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "btn comment-submit";
    submitButton.textContent = "Відправити";

    const errorMessage = document.createElement("p");
    errorMessage.className = "comment-error";

    form.appendChild(nameInput);
    form.appendChild(textInput);
    form.appendChild(submitButton);
    form.appendChild(errorMessage);

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const authorValue = nameInput.value.trim();
        const commentValue = textInput.value.trim();

        if (authorValue !== "" && commentValue !== "") {
            const newComment = {
                name: authorValue,
                text: commentValue
            };

            appendCommentToList(commentsList, newComment);

            const currentComments = readComments(articleId);
            currentComments.push(newComment);
            saveComments(articleId, currentComments);

            nameInput.value = "";
            textInput.value = "";
            errorMessage.textContent = "";
        } else {
            errorMessage.textContent = "Будь ласка, заповніть ім'я та текст коментаря.";
        }
    });

    return form;
}

function createArticleCard(articleData) {
    const articleElement = document.createElement("article");
    articleElement.className = "card";
    articleElement.id = articleData.id;

    const image = document.createElement("img");
    image.src = articleData.photo;
    image.alt = articleData.title;

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = articleData.title;

    const description = document.createElement("p");
    description.textContent = articleData.description;

    const date = document.createElement("time");
    date.textContent = articleData.date;

    const likeButton = document.createElement("button");
    likeButton.type = "button";
    likeButton.className = "btn like-btn";
    likeButton.textContent = "Подобається";

    likeButton.addEventListener("click", function () {
        articleElement.classList.toggle("liked");
    });

    const commentsBlock = document.createElement("div");
    commentsBlock.className = "comments-block";

    const commentsList = document.createElement("ul");
    commentsList.className = "comments-list";

    const commentsForm = createCommentForm(articleData.id, commentsList);

    renderSavedComments(articleData.id, commentsList);

    commentsBlock.appendChild(commentsForm);
    commentsBlock.appendChild(commentsList);

    body.appendChild(title);
    body.appendChild(description);

    // Створюю Flex-коробочку для дати і кнопки
    const metaDiv = document.createElement("div");
    metaDiv.className = "article-meta";

    // Кладу дату і кнопку всередину цієї коробочки
    metaDiv.appendChild(date);
    metaDiv.appendChild(likeButton);

    // Додаю коробочку в тіло картки
    body.appendChild(metaDiv);

    body.appendChild(commentsBlock);

    articleElement.appendChild(image);
    articleElement.appendChild(body);

    return articleElement;
}

function renderArticles() {
    const container = document.getElementById("articles-container");

    if (!container) {
        console.warn("Контейнер #articles-container не знайдено.");
        return;
    }

    const section = document.createElement("section");
    section.id = "articles";
    section.className = "container section";

    const heading = document.createElement("h2");
    heading.textContent = "Статті";

    const grid = document.createElement("div");
    grid.className = "articles-grid";

    let index = 0;
    while (index < articles.length) {
        const articleCard = createArticleCard(articles[index]);
        grid.appendChild(articleCard);
        index += 1;
    }

    section.appendChild(heading);
    section.appendChild(grid);

    container.innerHTML = "";
    container.appendChild(section);
}

renderArticles();