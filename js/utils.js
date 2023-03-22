import { profs, classes, modules, salles,  } from './main.js';
import { appendTo, createPlanning } from "./dom_api.js";

export function getDataById(id, dataArray) {
    return dataArray.find(dataObject => dataObject.id == id)
}

export function getPlanningsOf(id, dataArray) {
    const dataObject = getDataById(id, dataArray)
    return dataObject?.plannings
}

export function getTeachersByModuleId(id) {
    const tempTeachers = []
    for (const prof of profs) {
        if (prof.modules.includes(+id)) {
            tempTeachers.push(prof)
        }
    }
    return tempTeachers
}

export function getCurrentPlannings(id) {
    return {
        nom : getDataById(id, classes).nom,
        semaine: {
            dateDebut: "12/03/2023",
            dateFin: "17/03/2023"
        },
        effectif: getDataById(id, classes).effectif,
        plannings : getPlanningsOf(id, classes)
    };
}

export function showModulePlanning(planningName) {
    const element = getDataById(planningName, modules)
    for (const planning of element.plannings) {
        const prof = getDataById(planning.teacher, profs)
        const room = getDataById(planning.room, salles)
        appendTo(planning.day, planning.heureDebut, planning.heureFin, createPlanning(element.nom, prof.nom, room.nom))
    }
}

export function showClassroomPlanning(planningName) {
    const element = getDataById(planningName, salles)
    for (const planning of element.plannings) {
        const prof = getDataById(planning.teacher, profs)
        const module = getDataById(planning.module, modules)
        const classe = getDataById(planningName, classes)
        appendTo(planning.day, planning.heureDebut, planning.heureFin, createPlanning(prof.nom, module.nom, classe.nom))
    }
}

export function showLevelPlanning(planningName) {
    const element = getDataById(planningName, classes)
    for (const planning of element.plannings) {
        const prof = getDataById(planning.teacher, profs)
        const module = getDataById(planning.module, modules)
        const room = getDataById(planning.room, salles)
        appendTo(planning.day, planning.heureDebut, planning.heureFin, createPlanning(prof.nom, module.nom, room.nom))
    }
}

export function showTeacherPlanning(planningName) {
    const element = getDataById(planningName, profs)
    for (const planning of element.plannings) {
        const level = getDataById(planning.level, classes)
        const module = getDataById(planning.module, modules)
        const room = getDataById(planning.room, salles)
        appendTo(planning.day, planning.heureDebut, planning.heureFin, createPlanning(level.nom, module.nom, room.nom))
    }
}