
/**
 * Permet de créer un élément HTML et de le remplir avec ses attributs et son contenu texte
 * @param {String} tagName Nom de l'élément
 * @param {Object} attributes Les attributs de l'élément
 * @param {String} content Le contenu texte de l'élément
 * @returns {HTMLElement}
 */

export function createElement(tagName, attributes = {}, content = '') {
    const element = document.createElement(tagName)
    for (const [attributeName, attributeValue] of Object.entries(attributes)) {
        element.setAttribute(attributeName, attributeValue)
    }
    element.textContent = content
    return element
}

/*-------------------------------------------------------------------------------------------------------*/

/**
 * Créer un composant planning pour un cour
 * @param {String} moduleName Le nom du module
 * @param {String} teacher Le nom du professeur qui dirige le cour
 * @param {String} room La salle oû le cours doit avoir lieu
 * @returns {HTMLDivElement}
 */

export function createPlanning(moduleName, teacher, room, id) {
    const colors = ["#2ecc71", "#f39c12", "#e74c3c", "#3498db", "#f1c40f", "#8e44ad", "#16a085", "#95a5a6"]

    const planning = createElement('div', {class: 'planning', id: id})
    planning.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]

    const firstElement = createElement('span', {}, moduleName)
    const secondElement = createElement('span', {}, teacher)
    const lastElement = createElement('span', {}, room)
    const btnDelete = createElement('i', {class: 'fa-solid fa-xmark close'})

    planning.append(firstElement, secondElement, lastElement, btnDelete)

    return planning
}

/*-------------------------------------------------------------------------------------------------------*/

/**
 * Le jour oû le cours doit avoir lieu
 * @param {Number} day 
 * @param {Number} startTime 
 * @param {Number} endTime 
 * @param {HTMLElement} element 
 */

export function appendTo(day, startTime, endTime, element) {
    const parent = document.querySelector(`#d_${day}`)
    element.style.gridColumn = `${startTime - 6} / span ${endTime - startTime}`
    parent.append(element)
}

/*-------------------------------------------------------------------------------------------------------*/



/*-------------------------------------------------------------------------------------------------------*/