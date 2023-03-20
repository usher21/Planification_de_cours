import { Course } from './Course.js'
import { createPlanning } from "./dom_api.js";
import { appendTo } from "./dom_api.js";

const planningInfos = [
    ["Enseignants" ,"Aly", "Baila", "Ndoye", "Mbaye", "Djibi", "Seckouba"],
    ["Salles", "101", "102", "103", "104", "201", "incube"],
    ["Classes", "L2 GLRS A", "L2 GLRS B", "L2 ETSE", "L1 A", "IAGE B", "L2 CDSD"],
    ["Modules", "ALGO", "PHP", "PYTHON", "LC", "JAVASCRIPT", "JAVA"]
]

const btnSwitch = document.querySelector('.switch-display-mode')
const planningInfo = document.querySelectorAll('.planning-info')
const planningChoice = document.querySelector('#planning-choice')

btnSwitch.addEventListener('click', () => btnSwitch.classList.toggle('active'))

/*----------------------------------------------------------------------------------------------------------*/
const modalContainer = document.querySelector('.modal-container')
const openModal = document.querySelectorAll('.open-modal')
const addBtn = document.querySelector('.add-planning')
const cancelButton = document.querySelector('.cancel')
const selectInput = modalContainer.querySelectorAll('select')
const errorPara = document.querySelector('.error')

for (const plusBtn of openModal) {
    plusBtn.onclick = (e) => {
        modalContainer.querySelector('.day').innerText = e.currentTarget.parentElement.classList.item(0)[3]
        modalContainer.classList.add('active')
        clearSelectInput()
        fillInfos(selectInput[0], 'Choisir un module', planningInfos[3])
        fillInfos(selectInput[1], 'Choisir un enseignant', planningInfos[0])
        fillInfos(selectInput[2], 'Choisir une salle', planningInfos[1])
        fillHours(selectInput[3], 8, 16)
        fillHours(selectInput[4], 9, 17)
    }
}

addPlanning()

function addPlanning() {
    addBtn.addEventListener('click', () => {
        const day = modalContainer.querySelector('.day').innerText
        const module = selectInput[0].value
        const teacher = selectInput[1].value
        const room = selectInput[2].value
        const startTime = selectInput[3].value.split(' ')[0]
        const endTime = selectInput[4].value.split(' ')[0]

        const newCourse = new Course(module, teacher, room, '', startTime, endTime, day)

        if (!checkSelectInput()) {
            errorPara.innerText = 'Veuillez selectionner tous les options'
            errorPara.style.display = 'block'
        } else {
            errorPara.style.display = 'none'
            let sameDay = Object.values(localStorage).map((element) => JSON.parse(element)).filter((element) => element.day == day)
            if (sameDay.length != 0) {
                let sameRoom = sameDay.filter((element) => element.room == room)
                if (sameRoom.length != 0) {
                    let intersectHour = sameRoom.filter((element) => newCourse.isIntersect(element.start, element.end))
                    if (intersectHour.length != 0) {
                        errorPara.innerText = 'Cette classe ne peut contenir 1 effectif de cette salle'
                        errorPara.style.display = 'block'
                        return
                    }
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
cancelButton.addEventListener('click', closeModal)

function fillHours(selectInput, startTime, endTime) {
    selectInput.innerHTML = `<option>Choisir une heure</option>`
    for (let i = startTime; i <= endTime; i++) {
        selectInput.innerHTML += `<option>${i} H</option>`
    }
}

function fillInfos(selectInput, title, planning) {
    for (let i = 0; i < planning.length; i++) {
        if (i === 0)
        selectInput.innerHTML += `<option>${title}</option>`
        else
            selectInput.innerHTML += `<option>${planning[i]}</option>`
    }
}

/*----------------------------------------------------------------------------------------------------------*/

planningInfo.forEach((planning, index) => {
    planning.addEventListener('click', (e) => {
        Array.from(planningInfo).map(element => element.classList.remove('active'))
        e.currentTarget.classList.add('active')
        fillPlanningChoice(index)
    })
})

function fillPlanningChoice(index) {
    planningChoice.innerHTML = ''
    for (const element of planningInfos[index]) {
        planningChoice.innerHTML += `<option>${element}</option>`
    }
}

/*----------------------------------------------------------------------------------------------------------*/
