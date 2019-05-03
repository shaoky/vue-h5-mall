let val = []
let date = new Date()
let time = date.getTime()
let hours = date.getHours()
let minutes = date.getMinutes()
let seconds = date.getSeconds()
let startime = parseInt((time - (hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000)) / 1000)
val.push(startime, parseInt(date.getTime() / 1000))

export const getTheDay = () => {
    return val
}
