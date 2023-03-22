const currentPlanning = {
    nom : 'DevWeb',
    semaine : '13/03/2023 - 18/03/2023',
    effectif: 29,
    plannings : [
        [
            {module : 2, prof:2, salle: 4, debut: 8, duree :4}
        ] , 
        [] , 
        [] , 
        [] , 
        [
            {module : 6, prof:2, salle: 4, debut: 10, duree :2},
            {module : 6, prof:2, salle: 4, debut: 12, duree :2}
        ] , 
        [] 
    ]
};

const planningObject = {
    "module":1,
    "teacher": 1,
    "classe":2,
    "salle":3,
    "day":5,
    "heureDebut":8,
    "heureFin":11,
    "semaine": {
        "dateDebut":"12/03/2023",
        "dateFin":"17/03/2023"
    }
}


export function getSavedData(data) {
    const dataStringify = localStorage[data]
    if (dataStringify)
        return JSON.parse(dataStringify)
}

export function resetSavedData() {
    localStorage.setItem('classes', JSON.stringify([
            {
                id:1,
                nom:"DevWeb",
                plannings:[],
                effectif:30
            },
            {
                id:2,
                nom:"Gl",
                plannings:[],
                effectif:29
            },
            {
                id:3,
                nom:"Marketing",
                plannings:[],
                effectif:50
            },
            {
                id:4,
                nom:"Hackers",
                plannings:[],
                effectif:10
            }
        ])
    )

    localStorage.setItem('salles', JSON.stringify([
            {
                id: 1,
                nom: 101,
                plannings:[],
                effectif:30
            },
            {
                id:2,
                nom:102,
                plannings:[],
                effectif:29
            },
            {
                id:3,
                nom:103,
                plannings:[],
                effectif:50
            },
            {
                id:4,
                nom:104,
                plannings:[],
                effectif:10
            }
        ])
    )

    localStorage.setItem('modules', JSON.stringify([
            {
                id:1,
                nom:"Javascript",
                plannings:[]
            },
            {
                id:2,
                nom:"Python",
                plannings:[]
            },
            {
                id:3,
                nom:"Java",
                plannings:[]
            },
            {
                id:4,
                nom:"PHP",
                plannings:[]
            },
            {
                id:5,
                nom:"Merise",
                plannings:[]
            },
            {
                id:6,
                nom:"Arabe",
                plannings:[]
            }
        ])
    )

    localStorage.setItem('profs', JSON.stringify([
            {
                id:1,
                nom:"MBAYE",
                modules:[1,5,6],
                plannings:[]
            },
            {
                id:2,
                nom:"THIORO",
                modules:[6,2,3],
                plannings:[]
            },
            {
                id:3,
                nom:"Ibreu",
                modules:[4,5],
                plannings:[]
            },
            {
                id:4,
                nom:"MOUSSA",
                modules:[1,4,3],
                plannings:[]
            },
            {
                id:5,
                nom:"ADJA",
                modules:[1,3],
                plannings:[]
            }
        ])
    )

}

/*----------------------------------------------------------------------------------------------------------*/
