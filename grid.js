function generateGrid(rows, columns) {
    const rootDiv = document.createElement("div")
    rootDiv.id = "game-board"


    for (let i = 1; i <= rows; i++) {
        console.log(i)

        const rowDiv = document.createElement("div")
        rowDiv.id = "row-" + i
        rowDiv.classList.add("row")
        rowDiv.classList.add("board-row")

        for (let j = 1; j <= columns; j++) {
            console.log(j)

            const colDiv = document.createElement("div")
            colDiv.id = "col-" + j
            colDiv.classList.add("board-item")
            colDiv.textContent = ""

            rowDiv.appendChild(colDiv)
        }


        rootDiv.appendChild(rowDiv)
    }

    console.log(rootDiv);
    const container = document.getElementById("board-container")
    container.appendChild(rootDiv)
}

document.addEventListener('DOMContentLoaded', function() {
    generateGrid(6, 7)
}, false);