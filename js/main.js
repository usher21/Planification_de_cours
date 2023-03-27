import { Course } from './Course.js'
import { createPlanning, appendTo, createOption, createElement } from "./dom_api.js";
import { getDataById, getPlanningsOf, getCurrentPlannings, getTeachersByModuleId } from "./utils.js";
import { showTeacherPlanning, showModulePlanning, showClassroomPlanning, showLevelPlanning } from "./utils.js";
import { getSavedData, resetSavedData } from "./data.js";

export const profs = getSavedData("profs");
export const modules = getSavedData("modules");
export const classes = getSavedData("classes");
export const salles = getSavedData("salles");

console.log(profs);
console.log(modules);
console.log(classes);
console.log(salles);

const btnSwitch = document.querySelector('.switch-display-mode')
const planningInfo = document.querySelectorAll('.planning-info')
const planningChoice = document.querySelector('#planning-choice')
const planningName = document.querySelector('.planning-name')

/*----------------------------------------------------------------------------------------------------------*/
const modalContainer = document.querySelector('.modal-container')
const openModal = document.querySelectorAll('.open-modal')
const addBtn = document.querySelector('.add-planning')
const cancelButton = document.querySelector('.cancel')
const selectInput = modalContainer.querySelectorAll('select')
const errorPara = document.querySelector('.error')

const searchInput = document.querySelector('#search')
const searchResultContainer = document.querySelector('.search-results')
const sideElements = document.querySelector('.planning-infos')
const sideSelectContainer = document.querySelector('.selected-planning-container')
const emptyResult = document.querySelector('.empty-result')

addPlanning()

function addPlanning() {
    addBtn.addEventListener('click', () => {

        const { day, module, teacher, room, startTime, endTime } = getSelectedValues()

        const moduleObject = getDataById(module, modules)
        const teacherObject = getDataById(teacher, profs)
        const roomObject = getDataById(room, salles)

        const newCourse = new Course(moduleObject?.nom, teacherObject?.nom, roomObject?.nom, '', startTime, endTime, day)

        const teacherPlanning = getPlanningsOf(teacher, profs)

        if (!checkSelectInput()) {
            showErrorMessage('Veuillez selectionner tous les options')
        } else {
            errorPara.style.display = 'none'

            const currentPlanning = getCurrentPlannings(planningChoice.value)

            if (getDataById(planningChoice.value, classes).effectif > roomObject.effectif) {
                showErrorMessage('Cette salle ne peut contenir un effectif de classe')
                return
            }

            for (const planning of currentPlanning.plannings) {
                if (planning.day == day && newCourse.isIntersect(planning.heureDebut, planning.heureFin)) {
                    showErrorMessage('Cette heure est ocuppée en ce moment')
                    return
                }
            }

            for (const planning of teacherPlanning) {
                if (planning.day == day && newCourse.isIntersect(planning.heureDebut, planning.heureFin)) {
                    showErrorMessage(`Le professeur ${getDataById(teacher, profs).nom} a cours en ce moment avec la classe ${getDataById(planning.level, classes).nom}`)
                    return
                }
            }

            appendTo(day, startTime, endTime, createPlanning(teacherObject.nom, moduleObject.nom, roomObject.nom));
            savePlanning(+day, +startTime, +endTime, +module, +room, +planningChoice.value, +teacher);
            errorPara.style.display = 'none';
            closeModal();
        }
    })
}

function showErrorMessage(errorMessage) {
    errorPara.innerText = errorMessage
    errorPara.style.display = 'block'
}

function getSelectedValues() {
    return {
        day: +modalContainer.querySelector('.day').innerText,
        module: selectInput[0].value,
        teacher: selectInput[1].value,
        room: Number(selectInput[2].value),
        startTime: Number(selectInput[3].value.split(' ')[0]),
        endTime: Number(selectInput[4].value.split(' ')[0])
    }
}

function savePlanning(day, startTime, endTime, module, room, level, teacher, semaine = {}) {
    const planning = {
        module,
        teacher,
        room,
        level,
        day,
        heureDebut: startTime,
        heureFin: endTime
    }
    savePlanningTo(planning, teacher, profs)
    savePlanningTo(planning, module, modules)
    savePlanningTo(planning, level, classes)
    savePlanningTo(planning, room, salles)
    savePlanningToLocalStorage('profs', profs)
    savePlanningToLocalStorage('classes', classes)
    savePlanningToLocalStorage('salles', salles)
    savePlanningToLocalStorage('modules', modules)
}

function savePlanningTo(planning, id, tabEntity) {
    for (const p of tabEntity) {
        if (p.id == id) {
            p.plannings.push(planning)
        }
    }
}

function savePlanningToLocalStorage(entity, value) {
    localStorage.setItem(entity, JSON.stringify(value))
}

function clearSelectInput() {
    selectInput.forEach((select) => select.innerHTML = '')
}

function checkSelectInput() {
    for (const select of selectInput)
        if (select.selectedIndex == 0)
            return false
    return true
}

function closeModal() {
    errorPara.style.display = 'none'
    modalContainer.classList.remove('active')
}

function fillHours(selectInput, startTime, endTime) {
    selectInput.innerHTML = `<option>Choisir une heure</option>`
    for (let i = startTime; i <= endTime; i++) {
        selectInput.innerHTML += `<option>${i} H</option>`
    }
}

function fillInputSelect(select, data, label = 'Selectionner') {
    select.innerHTML = ''
    select.appendChild(createOption('0', label))
    for (const d of data) {
        select.appendChild(createOption(d.id, d.nom))
    }
}

function clearPlanning() {
    for (let i = 1; i <= 6; i++) {
        let element = document.querySelector(`#d_${i}`)
        let child = element.firstElementChild
        element.innerHTML = ''
        element.appendChild(child)
    }
}

/*----------------------------------------------------------------------------------------------------------*/

function showResults(searchValue, dataArray, searchResultContainer, category) {
    for (const dataObject of dataArray) {
        if (dataObject.nom.toString().toLowerCase().includes(searchValue)) {
            const resultItem = createElement('li', {class: `result-item ${category}`, id: `${dataObject.id}`}, dataObject.nom)
            searchResultContainer.appendChild(resultItem)
            handleSearchEvent(resultItem)
        }
    }
}

function handleSearchEvent(searchItem) {
    searchItem.addEventListener('click', () => {

        clearPlanning()

        if (searchItem.classList.contains('prof')) {
            showTeacherPlanning(searchItem.id)
        } else if (searchItem.classList.contains('classe')) {
            showLevelPlanning(searchItem.id)
        } else if (searchItem.classList.contains('salle')) {
            showClassroomPlanning(searchItem.id)
        } else if (searchItem.classList.contains('module')) {
            showModulePlanning(searchItem.id)
        }

        searchResultContainer.innerHTML = ''
        sideElements.style.display = 'grid'
        sideSelectContainer.style.display = 'block'
        planningName.innerText = 'Planning: ' + searchItem.innerText
    })
}

/*----------------------------------------------------------------------------------------------------------*/

btnSwitch.addEventListener('click', () => btnSwitch.classList.toggle('active'))

cancelButton.addEventListener('click', closeModal)

planningInfo.forEach(planning => {
    planning.addEventListener('click', (e) => {
        Array.from(planningInfo).map(element => element.classList.remove('active'))
        e.currentTarget.classList.add('active')

        const label = planning.querySelector('.planning-info-name').innerText

        openModal.forEach(plusBtn => plusBtn.classList.add('disabled'))

        if (planning.id == "teacher")
            fillInputSelect(planningChoice, profs, label)
        else if (planning.id == "module")
            fillInputSelect(planningChoice, modules, label)
        else if (planning.id == "room")
            fillInputSelect(planningChoice, salles, label)
        else if (planning.id == "level") {
            fillInputSelect(planningChoice, classes, label)
        }
    })
})

for (const plusBtn of openModal) {
    plusBtn.onclick = (e) => {
        if (!plusBtn.classList.contains('disabled')) {
            modalContainer.querySelector('.day').innerText = e.currentTarget.parentElement.classList.item(0)[3]
            modalContainer.classList.add('active')
            clearSelectInput()
            fillInputSelect(selectInput[0], modules, 'Choisir un module')
            fillInputSelect(selectInput[2], salles, 'Choisir une salle')
            fillHours(selectInput[3], 8, 16)
        }
    }
}

selectInput[0].addEventListener('change', () => {
    const id = selectInput[0].value
    const teachers = getTeachersByModuleId(id)
    fillInputSelect(selectInput[1], teachers, 'Choisir un professeur')
})

selectInput[3].addEventListener('change', () => {
    const hour = +selectInput[3].options[selectInput[3].selectedIndex].label.split(' ')[0]
    fillHours(selectInput[4], hour + 1, 17)
})

planningChoice.addEventListener('change', () => {
    const activeCategory = Array.from(planningInfo).find(planning => planning.classList.contains('active'))

    if (activeCategory.id == "level" && planningChoice.selectedIndex != 0)
        openModal.forEach(plusBtn => plusBtn.classList.remove('disabled'))

    clearPlanning()

    planningName.textContent = 'Planning: '

    if (activeCategory.id == "teacher") {
        showTeacherPlanning(planningChoice.value)
        planningName.textContent += getDataById(planningChoice.value, profs).nom
    } else if (activeCategory.id == "level") {
        showLevelPlanning(planningChoice.value)
        planningName.textContent += getDataById(planningChoice.value, classes).nom
    } else if (activeCategory.id == "room") {
        showClassroomPlanning(planningChoice.value)
        planningName.textContent += getDataById(planningChoice.value, salles).nom
    } else if (activeCategory.id == "module") {
        showModulePlanning(planningChoice.value)
        planningName.textContent += getDataById(planningChoice.value, modules).nom
    }
})

searchInput.addEventListener('input', () => {
    
    const searchValue = searchInput.value.trim().toLowerCase()

    emptyResult.style.display = 'none'
    sideElements.style.display = 'none'
    sideSelectContainer.style.display = 'none'
    searchResultContainer.innerHTML = ''

    if (searchValue == '') {
        sideElements.style.display = 'grid'
        sideSelectContainer.style.display = 'block'
        return
    }

    showResults(searchValue, profs, searchResultContainer, "prof")
    showResults(searchValue, classes, searchResultContainer, "classe")
    showResults(searchValue, salles, searchResultContainer, "salle")
    showResults(searchValue, modules, searchResultContainer, "module")
    
    if (searchResultContainer.childElementCount == 0)
        emptyResult.style.display = 'block'
})
