import { profs, classes, modules, salles,  } from './main.js';

export function getTeacherNameById(id) {
    return profs.find(prof => prof.id == id)
}

export function getModuleNameById(id) {
    return modules.find(module => module.id == id)
}

export function getLevelNameById(id) {
    return classes.find(classe => classe.id == id)
}

export function getClassroomById(id) {
    return salles.find(salle => salle.id == id)
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

export function getSavedData(data) {
    const dataStringify = localStorage[data]
    return JSON.parse(dataStringify)
}

export function getTeacherPlannings(id) {
    const prof = getTeacherNameById(id)
    return prof.plannings
}