import { Course } from './Course.js'
import { createPlanning, appendTo, createOption } from "./dom_api.js";
import { getModuleNameById, getClassroomById, getLevelNameById, getTeachersByModuleId, getSavedData, getTeacherNameById, getTeacherPlannings } from "./utils.js";

export const profs = getSavedData("profs");
export const modules = getSavedData("modules");
export const classes = getSavedData("classes");
export const salles = getSavedData("salles");

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
        //console.log(moduleObject, teacherObject, roomObject);
        const newCourse = new Course(module, teacher, room, '', startTime, endTime, day)
        const teacherPlanning = getTeacherPlannings(teacher)
        if (teacherPlanning) {
            if (newCourse.isIntersect(teacherPlanning.heureDebut, teacherPlanning.heureFin)) {
                
            }
        }

        return


        if (!checkSelectInput()) {
            errorPara.innerText = 'Veuillez selectionner tous les options'
            errorPara.style.display = 'block'
        } else {
            errorPara.style.display = 'none'
            let sameDay = Object.values(localStorage).map((element) => JSON.parse(element)).filter((element) => Number(element.day) == day)
            if (sameDay.length != 0) {
                let intersectHour = sameDay.filter((element) => newCourse.isIntersect(Number(element.start), Number(element.end)))
                if (intersectHour.length != 0) {
                    errorPara.innerText = 'Cette salle est ocuppée en ce moment'
                    errorPara.style.display = 'block'
                    return
                }
            }
            let id = Date.now()
            appendTo(day, startTime, endTime, createPlanning(teacher, module, room, id))
            newCourse.saveCourse(id)
            errorPara.style.display = 'none'
            closeModal()
        }
    })
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

function showPlanning(planningName, entity) {
    for (const [key, value] of Object.entries(localStorage)) {
        let dataObject = JSON.parse(value)
        if (dataObject[entity] == planningName) {
            appendTo(dataObject.day, dataObject.start, dataObject.end, createPlanning(dataObject.teacher, dataObject.module, dataObject.room, key))
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
    if (activePlanningInfo.id == "teacher") {
        showPlanning(planningChoice.value, "teacher")
    } else if (activePlanningInfo.id == "level") {
        showPlanning(planningChoice.value, "level")
    } else if (activePlanningInfo.id == "room") {
        showPlanning(planningChoice.value, "room")
    } else if (activePlanningInfo.id == "module") {
        showPlanning(planningChoice.value, "module")
    }
})