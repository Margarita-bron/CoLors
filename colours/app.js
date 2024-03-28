const cols = document.querySelectorAll('.column');

document.addEventListener('keydown', (event) => {   // переключать старницу нажатием на пробел
    // console.log(event.code)    узнать название клавиши
    event.preventDefault(); /**отменить дефолтное поведение, замочек будет осатваться с тем классом, с которым был до нажатия на пробел*/
    if (event.code.toLowerCase() === 'space') {
        setRandomColors();
    }
})

document.addEventListener('click', (event) =>{ /**обрабатываем все клики */
    const type = event.target.dataset.type;  /*dataset - здесь хранится объект всех дата-атрибутов  event.target - элемент по которому сделан клик*/
    if (type === 'lock'){
        /* */ 
    const node = event.target.tagName.toLowerCase() === 'i'    /*.tagName дает тэг в верхнем регистре */
        ? event.target 
        : event.target.children[0];   /**.children массив всех детей элемента*/

    node.classList.toggle('fa-lock-open');
    node.classList.toggle('fa-lock');
    } 
    else if(type === 'copy'){
        copyToClickboard(event.target.textContent);2
    }
})

function generateRandomColor(){
    const hexCodes = '0123456789ABCDEF';
    let color  = '';
    for (let i = 0; i < 6; i++){
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
    }
    /*Math.floor - позволит округлить, чтобы получить целое число */
    return `#${color}`
}

function copyToClickboard(text){
    return navigator.clipboard.writeText(text);
}

function setRandomColors(isInitial){
    const colors = isInitial ? getColorsFromHash() : [];    
/**при первоначальной загрузке страницы isInitial = true и берем цвета из хэша, а когда нажимаем space undefined и пустой массив сам генерирует цвета*/

    cols.forEach((column,index) => {
        const isLocked = column.querySelector('i').classList.contains('fa-lock'); /**ищем в колонке тэг i  */
        const text = column.querySelector('h2');
        const lock = column.querySelector('button');

        if (isLocked) {
            colors.push(text.textContent);
            return;
        }

        const color = isInitial ? 
        colors[index] ? 
        colors[index] : chroma.random()
        : chroma.random();

        if(!isInitial) colors.push(color);
        /**if(getColorsFromHash() === []) colors.push(color);*/

        text.textContent = color;
        column.style.background = color;

        setTextColor(text, color);
        setTextColor(lock, color);
    })

    updateColorsHash(colors);
}

function setTextColor(text, color) {
    const luminance = chroma(color).luminance(); 
    text.style.color = luminance > 0.5 ? 'black' : 'white';
}

function updateColorsHash (colors = []){   /**colors = []   передавать массив цветов, которые сохранить посредством хэша */
    document.location.hash = colors.toString().replace(/,#/gi, "-");
    /** = colors.map((column) => return column.toString().substring(1)).join('-')*/
}

function getColorsFromHash(){
    if(document.location.hash.length > 1){
        return document.location.hash.substring(1).split('-').map(color => '#' + color );
    }
    return [] /**вернем пустой массив, если хэша нет */
    /**document.location.hash   this is string*/
    /**document.location.hash.substring(1).split('-')   получили номера цветов и добавляем потом # */
}

setRandomColors(true);