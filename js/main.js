import { Course } from './Course.js'
import { createPlanning } from "./dom_api.js";
import { appendTo } from "./dom_api.js";

class Planning {

    #cours = []
    #nomPlanning = ""
    #jours = []

    constructor(cours) {

    }
}

let p = new Course("JS", "Aly", 102, "L2 GLRS A",10, 13)
let p1 = new Course("C", "Wane", 103, "IAGE B",10, 12)

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

        if (!checkSelectInput(module, teacher, room) || !checkSelectInput(startTime, endTime)) {
            errorPara.innerText = 'Veuillez selectionner tous les options'
            errorPara.style.display = 'block'
        } else {
            errorPara.style.display = 'none'
            appendTo(day, startTime, endTime, createPlanning(module, teacher, room))
            savePlanning(day, startTime, endTime, module, teacher, room)
            closeModal()
        }
    })
}

function clearSelectInput() {
    selectInput.forEach((select) => select.innerHTML = '')
}

function checkSelectInput(...data) {
    for (const select of selectInput) {
        for (let i = 0; i < data.length; i++) {
            if (data[i] == select.options[0].value) {
                return false
            }
        }
    }
    return true
}

function closeModal() {
    modalContainer.classList.remove('active')
}
cancelButton.addEventListener('click', closeModal)

function savePlanning(day, startTime, endTime, module, teacher, room) {
    const planning = {
        'day': day,
        'start': startTime,
        'end': endTime,
        'module': module,
        'teacher': teacher,
        'room': room
    }
    localStorage.setItem(Date.now(), JSON.stringify(planning))
}

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
