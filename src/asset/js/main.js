/* Основной слайдер */
new Swiper('.js-hero-slider', {
    loop: true,
    wrapperClass: 'wrapper',
    slideClass: 'slide',

    pagination: {
        el: '.pagination',
        clickable: true,
        bulletClass: 'bullet hero-slider__bullet',
        bulletActiveClass: 'bullet-active hero-slider__bullet-active'
    }
});

/* Выпадающий список */
var selectors = document.querySelectorAll('.js-select');
selectors.forEach(function (select) {
    if (select.nodeName !== 'SELECT') {
        return;
    }

    let optionList = select.querySelectorAll('option');
    if (optionList.length < 0) {
        return;
    }

    let selectValue = select.value;
    let selectLabel = getOptionLabelByValue(optionList, selectValue);

    let newSelectorWrapper = document.createElement('div');
    newSelectorWrapper.classList.add('selector');
    newSelectorWrapper.style.position = 'relative';
    newSelectorWrapper.style.zIndex = '1';
    select.after(newSelectorWrapper);

    let newSelector = document.createElement('div');
    newSelector.classList.add('inner');
    newSelector.classList.add('selector__inner');
    newSelector.tabIndex = 0;
    newSelector.innerHTML = '<span>' + selectLabel + '</span>';
    newSelectorWrapper.append(newSelector);

    let arrow = '<div class="selector__arrow-wrapper">' +
        '<img class="selector__image" src="/asset/image/selector-arrow.png" alt="selector-arrow"></div>';
    newSelector.innerHTML += arrow;

    let newOptionListWrapper = document.createElement('div');
    newOptionListWrapper.classList.add('selector__option-list-wrapper');
    newSelectorWrapper.append(newOptionListWrapper);

    let newOptionList = document.createElement('ul');
    newOptionList.classList.add('selector__option-list');
    newOptionListWrapper.append(newOptionList);

    optionList.forEach(function (option) {
        let newOption = document.createElement('li');
        newOption.classList.add('selector__option');
        newOption.innerHTML = option.innerHTML;
        newOption.tabIndex = 0;
        newOption.dataset.value = option.value;
        newOptionList.append(newOption);

        newOption.addEventListener('click', function (event) {
            let currentElement = event.target;

            let newSelectorWrapper = currentElement.closest('.selector');

            let select = newSelectorWrapper.previousElementSibling;
            select.value = currentElement.dataset.value;

            let newSelector = newSelectorWrapper.querySelector('.inner').querySelector('span');
            newSelector.innerText = currentElement.innerText;
        });
    });

    newSelector.addEventListener('click', function (event) {
        event.target.closest('.selector').classList.toggle('active');
    });
});


/* Закрыть селектор если клинули вне его */
document.addEventListener('click', function (event) {
    document.querySelectorAll('.selector').forEach(function (selector) {
        if (selector == event.target || selector.contains(event.target)) {
            return;
        }

        selector.classList.remove('active');
    })
});

function getOptionLabelByValue(nodeList, value) {
    var result = '';

    nodeList.forEach(function (option) {
        if (option.value === value) {
            result = option.innerText;
        }
    });

    return result;
}