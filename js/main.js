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

appendTo(6, 10, 15, createPlanning('JavaScript', 'Aly', 104))