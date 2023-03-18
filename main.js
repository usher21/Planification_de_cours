class Planning {

    #cours = []
    #nomPlanning = ""
    #jours = []

    constructor(cours) {

    }
}

class Cour {
    #nomModule = ""
    #enseignant = ""
    #salle = 0
    #heureDebut = 0
    #heureFin = 0
    #jour = 0

    constructor(nomModule, enseignant, salle, heureDebut, heureFin, jour) {
        this.#nomModule = nomModule
        this.#enseignant = enseignant
        this.#salle = salle
        this.#heureDebut = heureDebut
        this.#heureFin = heureFin
        this.#jour = jour
    }

    get nomModule() {
        return this.#nomModule
    }

    get enseignant() {
        return this.#enseignant
    }

    get salle() {
        return this.#salle
    }

    get jour() {
        return this.#jour
    }

    get heureDebut() {
        return this.#heureDebut
    }

    get heureFin() {
        return this.#heureFin
    }

    isIncludes(heure) {
        return heure >= this.#heureDebut && heure <= this.#heureFin
    }

    isIntersect(heureDebut, heureFin) {
        return this.isIncludes(heureDebut) || this.isIncludes(heureFin)
    }
}

let p = new Cour("JS", "Aly", 102, 10, 13)
let p1 = new Cour("C", "Wane", 103, 10, 12)

console.log(p.isIntersect(p1.heureDebut, p1.heureFin));

const classes = ["L2 GLRS A", "L2 GLRS B", "L2 ETSE", "L1 A", "IAGE B", "L2 CDSD"]
const enseignants = ["Aly", "Baila", "Ndoye", "Mbaye", "Djibi", "Seckouba"]
const salles = ["101", "102", "103", "104", "201", "incube"]
const modules = ["ALGO", "PHP", "PYTHON", "LC", "JAVASCRIPT", "JAVA"]

const btnSwitch = document.querySelector('.switch-display-mode')

btnSwitch.addEventListener('click', () => btnSwitch.classList.toggle('active'))

const planningInfo = document.querySelectorAll('.planning-info')

planningInfo.forEach((planning) => {
    planning.addEventListener('click', (e) => {
        Array.from(planningInfo).map(p => p.classList.remove('active'))
        e.currentTarget.classList.add('active')
    })
})