let Count = 50
let Level = 0

while (Count > 0) {
    Count--
    Level++
    console.log(Math.floor(Math.pow(Level, 1.05) * 40))
}