document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const openButton = document.getElementById('openModal');
    const closeButton = document.getElementById('closeModal');

    // Открытие модального окна
    openButton.addEventListener('click', () => {
        document.body.style.overflow = 'hidden';
        modal.style.opacity = '1'; 
        modal.style.pointerEvents = 'all'; 
        modal.classList.remove('hide'); 
        modal.classList.add('show'); 
    });

    // Закрытие модального окна
    closeButton.addEventListener('click', () => {
        modal.classList.remove('show'); 
        modal.classList.add('hide'); // Добавляем класс "hide" для анимации закрытия

        // Скрываем модальное окно после завершения анимации
        setTimeout(() => {
            modal.style.opacity = '0'; // Скрываем окно
            modal.style.pointerEvents = 'none'; // Отключаем взаимодействие
            modal.classList.remove('hide'); // Убираем "hide", чтобы сбросить состояние
            document.body.style.overflow = 'auto';
        }, 300); 
    });
    
});

// document.addEventListener('DOMContentLoaded', () => {
//     const stars = document.querySelectorAll('.stars-grade svg');
//     const ratingInput = document.getElementById('ratingInput'); // Скрытое поле для рейтинга

//     stars.forEach((star, index) => {
//         star.addEventListener('click', () => {
//             // Сбрасываем заполнение у всех звёзд
//             stars.forEach((s, i) => {
//                 if (i <= index) {
//                     s.classList.add('filled'); // Заполняем звёзды до текущей
//                 } else {
//                     s.classList.remove('filled'); // Убираем заполнение у остальных
//                 }
//             });

//             // Устанавливаем значение рейтинга в скрытое поле
//             ratingInput.value = index + 1;
//         });
//     });
// })

document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.stars-grade svg');
    const nameInput = document.getElementById('nameInput');
    const reviewInput = document.getElementById('review');
    const imageInput = document.getElementById('file');
    const submitButton = document.getElementById('submit');
    const reviewsContainer = document.querySelector('.reviews');
    const form = document.getElementById('reviewForm');
    const hintReviews = document.querySelector('.hintReviews');
    const modal = document.getElementById('modal');
    const starsError = document.getElementById('starsError');
    const nameError = document.getElementById('nameError');
    const reviewError = document.getElementById('reviewError');
    const averageRatingElement = document.querySelector('.rating-content h3');
    const starsContainer = document.querySelector('.rating-content .stars');
    
    let selectedStars = 0;

let allRatings = JSON.parse(localStorage.getItem('reviews')) || [];



function updateAverageRating(newRating) {
    const ratingBlock = document.getElementById('ratingBlock');
    const starsContainer = document.getElementById('starsContainer');
    const averageRatingElement = document.querySelector('.rating-content h3');
    const reviewCountSpan = document.getElementById('reviewCountSpan');

    // Извлекаем текущие данные
    let currentAverage = parseFloat(ratingBlock.getAttribute('data-rating'));
    let currentReviews = parseInt(ratingBlock.getAttribute('data-reviews'));

    // Пересчитываем общую сумму звезд
    const totalStars = (currentAverage * currentReviews) + newRating;
    const updatedAverage = totalStars / (currentReviews + 1); // Пересчитываем среднюю оценку

    // Обновляем данные в DOM
    ratingBlock.setAttribute('data-rating', updatedAverage.toFixed(1));
    ratingBlock.setAttribute('data-reviews', currentReviews + 1);

    reviewCountSpan.textContent = currentReviews + 1;
    averageRatingElement.textContent = updatedAverage.toFixed(1);

    // Округляем среднюю оценку
    const fullStars = Math.floor(updatedAverage);
    const emptyStars = 5 - fullStars;

    const stars = document.querySelectorAll('#starsContainer svg');
    stars.forEach((star, index) => {
        if (index < fullStars) {
            star.style.fill = '#FFCC00'; // Жёлтый для оценённых
        } else {
            star.style.fill = '#D3D3D3'; // Серый для неоценённых
        }
    });
}




    // Инициализация Masonry
    function initializeMasonry() {
        const grid = document.querySelector('.reviews');
        if (!grid) return;

        if (grid.masonry && typeof grid.masonry.destroy === 'function') {
            grid.masonry.destroy();
        }

        let gutter;
        if (window.innerWidth < 650) {
            gutter = 16;
        } else if (window.innerWidth < 1430) {
            gutter = 30;
        } else {
            gutter = 33;
        }

        grid.masonry = new Masonry(grid, {
            itemSelector: '.review',
            columnWidth: '.review',
            gutter: gutter,
            percentPosition: true,
        });
    }

    // Инициализируем Masonry при загрузке страницы
    initializeMasonry();

    // Слушаем изменения размера окна
    window.addEventListener('resize', initializeMasonry);

    // Пересчитываем Masonry после добавления нового отзыва
    function reloadMasonry() {
        const grid = document.querySelector('.reviews');
        if (grid && grid.masonry) {
            grid.masonry.reloadItems();
            grid.masonry.layout();
        }
    }

    let selectedStarsForReview;
    // Обработка выбора звёзд
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            selectedStars = index + 1;
            selectedStarsForReview = selectedStars;
            stars.forEach((s, i) => {
                if (i < selectedStars) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
            starsError.textContent = '';
        });
    });

    // Убираем текст ошибки при вводе текста
    function handleInputValidation(input, errorElement) {
        input.addEventListener('input', () => {
            if (input.value.trim() !== '') {
                errorElement.textContent = '';
                input.classList.remove('error');
            }
        });
    }

    // Добавляем обработчики ввода для полей
    handleInputValidation(nameInput, nameError);
    handleInputValidation(reviewInput, reviewError);

    // Функция для создания HTML-структуры отзыва
    function createReviewHTML(name, starsCount, reviewText, imagePaths) {
        const review = document.createElement('div');
        review.classList.add('review');

        const starsSVG = Array(starsCount).fill(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFCC00">
                <path d="M19.467,23.316,12,17.828,4.533,23.316,7.4,14.453-.063,9H9.151L12,.122,14.849,9h9.213L16.6,14.453Z" />
            </svg>
        `).join('');

        review.innerHTML = `
            <div class="name-review">
                <h4>${name}</h4>
                <div class="stars-review">
                    ${starsSVG}
                </div>
            </div>
            <div class="text-review">
                <p>${reviewText}</p>
            </div>
        `;

        if (imagePaths.length > 0) {
            const imagesContainer = document.createElement('div');
            imagesContainer.classList.add('imgs');
            imagePaths.forEach(path => {
                const imgWrapper = document.createElement('div');
                imgWrapper.classList.add('img-review');
                imgWrapper.innerHTML = `<img src="${path}" alt="Отзыв изображение">`;
                imagesContainer.appendChild(imgWrapper);
            });
            review.appendChild(imagesContainer);
        }

        return review;
    }

    // Валидация при отправке формы
    submitButton.addEventListener('click', (event) => {
        event.preventDefault();

        let isValid = true;

        if (selectedStars === 0) {
            starsError.textContent = 'Проставьте оценку';
            isValid = false;
        } else {
            starsError.textContent = '';
        }

        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Заполните имя';
            nameInput.classList.add('error');
            isValid = false;
        } else {
            nameError.textContent = '';
            nameInput.classList.remove('error');
        }

        if (reviewInput.value.trim() === '') {
            reviewError.textContent = 'Заполните отзыв';
            reviewInput.classList.add('error');
            isValid = false;
        } else {
            reviewError.textContent = '';
            reviewInput.classList.remove('error');
        }

        if (isValid) {
            const name = nameInput.value.trim();
            const reviewText = reviewInput.value.trim();
            const imageFiles = imageInput.files;
            const imagePaths = [];

            if (imageFiles.length > 0) {
                for (let i = 0; i < imageFiles.length; i++) {
                    const file = imageFiles[i];
                    const url = URL.createObjectURL(file);
                    imagePaths.push(url);
                }
            }

            const reviewHTML = createReviewHTML(name, selectedStars, reviewText, imagePaths);
            reviewsContainer.appendChild(reviewHTML);

            // Добавляем оценку в массив
            allRatings.push(selectedStars);
            localStorage.setItem('reviews', JSON.stringify(allRatings));

            reloadMasonry();

            form.reset();
            selectedStars = 0;
            stars.forEach((s) => s.classList.remove('filled'));

            modal.classList.remove('show');
            modal.classList.add('hide');

            setTimeout(() => {
                modal.style.opacity = '0';
                modal.style.pointerEvents = 'none';
                modal.classList.remove('hide');
                document.body.style.overflow = 'auto';
            }, 300);

            hintReviews.style.display = 'flex';

            setTimeout(() => {
                hintReviews.style.display = 'none';
                form.style.display = 'block';
            }, 4000);

            // Обновляем среднюю оценку
            updateAverageRating(selectedStarsForReview);
        }
    });

   

});
