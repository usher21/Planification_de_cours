export class Course {
    
    #moduleName = ""
    #teacher = ""
    #room = 0
    #level = ""
    #startTime = 0
    #endTime = 0
    #day = 0

    constructor(moduleName, teacher, room, level,startTime, endTime, day) {
        this.#moduleName = moduleName
        this.#teacher = teacher
        this.#room = room
        this.#level = level
        this.#startTime = startTime
        this.#endTime = endTime
        this.#day = day
    }

    get moduleName() {
        return this.#moduleName
    }

    get teacher() {
        return this.#teacher
    }

    get room() {
        return this.#room
    }

    get day() {
        return this.#day
    }

    get startTime() {
        return this.#startTime
    }

    get endTime() {
        return this.#endTime
    }

    get level() {
        return this.#level
    }

    isIncludes(hour) {
        return hour >= this.#startTime && hour <= this.#endTime
    }

    isIntersect(startTime, endTime) {
        return this.isIncludes(startTime) || this.isIncludes(endTime)
    }
}
