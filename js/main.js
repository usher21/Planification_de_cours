import { Course } from './Course.js'
import { createPlanning, appendTo, createOption } from "./dom_api.js";
import { getModuleNameById, getClassroomById, getLevelNameById, getTeachersByModuleId, getSavedData, getTeacherNameById, getTeacherPlannings } from "./utils.js";

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

/*----------------------------------------------------------------------------------------------------------*/
const modalContainer = document.querySelector('.modal-container')
const openModal = document.querySelectorAll('.open-modal')
const addBtn = document.querySelector('.add-planning')
const cancelButton = document.querySelector('.cancel')
const selectInput = modalContainer.querySelectorAll('select')
const errorPara = document.querySelector('.error')

addPlanning()

function addPlanning() {
    addBtn.addEventListener('click', () => {
        const day = Number(modalContainer.querySelector('.day').innerText)
        const module = selectInput[0].value
        const teacher = selectInput[1].value
        const room = Number(selectInput[2].value)
        const startTime = Number(selectInput[3].value.split(' ')[0])
        const endTime = Number(selectInput[4].value.split(' ')[0])

        const moduleObject = getModuleNameById(module)
        const teacherObject = getTeacherNameById(teacher)
        const roomObject = getClassroomById(room)

        const newCourse = new Course(module, teacher, room, '', startTime, endTime, day)
        const teacherPlanning = getTeacherPlannings(teacher)
        let p = teacherPlanning.filter(planning => planning.day == day)
        let sameHour = p?.find(planning => newCourse.isIntersect(planning.heureDebut, planning.heureFin))
        
        if (!checkSelectInput()) {
            errorPara.innerText = 'Veuillez selectionner tous les options'
            errorPara.style.display = 'block'
        } else {
            errorPara.style.display = 'none'
            if (sameHour) {
                errorPara.innerText = 'Cette salle est ocuppée en ce moment'
                errorPara.style.display = 'block'
                return
            }
            appendTo(day, startTime, endTime, createPlanning(teacherObject.nom, moduleObject.nom, roomObject.nom));
            savePlanning(+day, +startTime, +endTime, +module, +room, 2, +teacher);
            errorPara.style.display = 'none';
            closeModal();
        }
    })
}

function savePlanning(day, startTime, endTime, module, room, level, teacher,semaine = {}) {
    const planning = {
        module,
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
            console.log(p);
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

/*----------------------------------------------------------------------------------------------------------*/

function showPlanning(planningName, tabEntity) {
    const element = getModuleNameById(planningName)
    console.log(element);
    for (const planning of element.plannings) {
        const profs = getTeachersByModuleId(planning.module)
        for (const prof of profs) {
            for (const p of prof.plannings) {
                if (p.module == element.id) {
                    appendTo(planning.day, planning.heureDebut, planning.heureFin, createPlanning(element.nom, prof.nom, getClassroomById(p.room).nom))
                }
            }
        }
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

btnSwitch.addEventListener('click', () => btnSwitch.classList.toggle('active'))

cancelButton.addEventListener('click', closeModal)

planningInfo.forEach(planning => {
    planning.addEventListener('click', (e) => {
        Array.from(planningInfo).map(element => element.classList.remove('active'))
        e.currentTarget.classList.add('active')

        const label = planning.querySelector('.planning-info-name').innerText

        if (planning.id == "teacher")
            fillInputSelect(planningChoice, profs, label)
        else if (planning.id == "module")
            fillInputSelect(planningChoice, modules, label)
        else if (planning.id == "room")
            fillInputSelect(planningChoice, salles, label)
        else if (planning.id == "level")
            fillInputSelect(planningChoice, classes, label)
    })
})

for (const plusBtn of openModal) {
    plusBtn.onclick = (e) => {
        modalContainer.querySelector('.day').innerText = e.currentTarget.parentElement.classList.item(0)[3]
        modalContainer.classList.add('active')
        clearSelectInput()
        fillInputSelect(selectInput[0], modules, 'Choisir un module')
        fillInputSelect(selectInput[2], salles, 'Choisir une salle')
        fillHours(selectInput[3], 8, 16)
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
    if (planningChoice.selectedIndex == 0)
        return

    const activePlanningInfo = Array.from(planningInfo).filter(element => element.classList.contains('active'))[0]
    clearPlanning()
    console.log(planningChoice.value);
    if (activePlanningInfo.id == "teacher") {
        showPlanning(planningChoice.value, profs)
    } else if (activePlanningInfo.id == "level") {
        showPlanning(planningChoice.value, classes)
    } else if (activePlanningInfo.id == "room") {
        showPlanning(planningChoice.value, salles)
    } else if (activePlanningInfo.id == "module") {
        showPlanning(planningChoice.value, modules)
    }
})