const abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

$('input').on('paste',

    function (e) {
        e.preventDefault();

        let text = e.originalEvent.clipboardData.getData('text/plain');
        let input = e.currentTarget;
        let text_array = text.split(/\n/).map(elem => elem.split(';'));
        let cellIndex = input.parentElement.cellIndex;
        let rowIndex = input.parentElement.parentElement.rowIndex;
        let rowsAmount = $('tbody tr').length;
        let colsAmount = $('tbody tr:nth-child(1) td').length;
        let addRows = text_array.length - (rowsAmount + 1 - rowIndex);
        let addCols = text_array[0].length - (colsAmount + 1 - cellIndex);
        let needCols = colsAmount + addCols;

        //create rows

        for (let i = 0; i < addRows; i++) {
            let rowNumber = rowsAmount + 1;
            rowsAmount++

            $('tbody').append(`<tr><th>${rowNumber}</th><td><input type="text"></td><td><input type="text"></td></tr>`)
        }

        //create columns with inputs

        for (let j = 1; j <= rowsAmount; j++) {
            let currentColsAmount = $(`tbody tr:nth-child(${j}) td`).length;

            for (let k = currentColsAmount; k < needCols; k++) {
                $(`tbody tr:nth-child(${j})`).append('<td><input type="text" value=""></td>')
            }
        }

        colsAmount = $('tbody tr:nth-child(1) td').length;

        //name input

        let inputAmount = $('tbody tr td input').length;

        for (let i = 0; i < inputAmount; i++) {
            let currentInput = $('input')[i];
            let currentCellIndex = currentInput.parentElement.cellIndex;
            let currentRowIndex = currentInput.parentElement.parentElement.rowIndex;
            let currentName = abc[currentCellIndex - 1] + currentRowIndex;
            currentInput.setAttribute('name', currentName);
        }

        //name cols

        let thAmount = $('thead th').length;
        for (let i = thAmount; i <= needCols; i++) {
            $('thead tr').append(`<th>${abc[i - 1].toUpperCase()}</th>`);
        }

        //set input value

        for (let i = rowIndex; i <= rowsAmount; i++) {
            for (let j = cellIndex; j <= colsAmount; j++) {
                let inputName = abc[j - 1] + i;
                let value = text_array[i - rowIndex][j - cellIndex];

                $(`input[name=${inputName}]`)[0].value = value;
            }
        }
    }
)



let currentColumn;

$('thead th').on('contextmenu', function (e) {
    e.preventDefault();

    currentColumn = e.currentTarget;
    let currentIndex = currentColumn.cellIndex;

    if (currentIndex !== 0) {
        let menu = $('#column-menu');

        menu.addClass('d-block');

        menu.css({
            left: e.clientX,
            top: e.clientY
        });
    }
});

$(window).on('click', function(e) {
    let target = e.target.tagName;
    let menu = $('#column-menu');

    if (target !== 'TH') {
        menu.removeClass('d-block')
        currentColumn = null;
    }
})

$('#column-menu [data-action]').on('click', function (e) {
    e.preventDefault();

    let action = e.currentTarget.getAttribute('data-action');

    switch (action) {
        case 'add-left': addLeftCol()

            break;

        case 'add-right': addRightCol()

            break;

        case 'remove': removeCol()

            break;
    }

    $('#column-menu').removeClass('d-block');
});

function addLeftCol() {
    let currentColIndex = currentColumn.cellIndex;
    let rowsAmount = $('tbody tr').length;

    for (let i = 0; i < rowsAmount; i++) {
        let td = document.createElement('td');
        let input = document.createElement('input');
        input.value = '';
        td.appendChild(input);
        let tr = document.querySelector(`tbody tr:nth-child(${i + 1})`);
        tr.insertBefore(td, tr.children[currentColIndex])

    }

    //name input

    let inputAmount = $('tbody tr td input').length;

    for (let i = 0; i < inputAmount; i++) {
        let currentInput = $('input')[i];
        let currentCellIndex = currentInput.parentElement.cellIndex;
        let currentRowIndex = currentInput.parentElement.parentElement.rowIndex;
        let currentName = abc[currentCellIndex - 1] + currentRowIndex;
        currentInput.setAttribute('name', currentName);
    }

    //name cols
    let colsAmount = $('tbody tr:nth-child(1) td').length;
    let thAmount = $('thead th').length;
    for (let i = thAmount; i <= colsAmount; i++) {
        $('thead tr').append(`<th>${abc[i - 1].toUpperCase()}</th>`);
    }

    currentColumn = null
}

function addRightCol() {
    let currentColIndex = currentColumn.cellIndex;
    let rowsAmount = $('tbody tr').length;

    for (let i = 0; i < rowsAmount; i++) {
        let td = document.createElement('td');
        let input = document.createElement('input');
        input.value = '';
        td.appendChild(input);
        let tr = document.querySelector(`tbody tr:nth-child(${i + 1})`);
        tr.insertBefore(td, tr.children[currentColIndex + 1])

    }

    //name input

    let inputAmount = $('tbody tr td input').length;

    for (let i = 0; i < inputAmount; i++) {
        let currentInput = $('input')[i];
        let currentCellIndex = currentInput.parentElement.cellIndex;
        let currentRowIndex = currentInput.parentElement.parentElement.rowIndex;
        let currentName = abc[currentCellIndex - 1] + currentRowIndex;
        currentInput.setAttribute('name', currentName);
    }

    //name cols
    let colsAmount = $('tbody tr:nth-child(1) td').length;
    let thAmount = $('thead th').length;
    for (let i = thAmount; i <= colsAmount; i++) {
        $('thead tr').append(`<th>${abc[i - 1].toUpperCase()}</th>`);
    }

    currentColumn = null
}

function removeCol() {
    let currentColIndex = currentColumn.cellIndex;
    let rowsAmount = $('table tr').length;

    for (let i = 0; i < rowsAmount; i++) {
        let currentRow = $('table tr')[i];
        let currentCell = currentRow.children[currentColIndex];

        currentRow.removeChild(currentCell)
    }

    //name input

    let inputAmount = $('tbody tr td input').length;

    for (let i = 0; i < inputAmount; i++) {
        let currentInput = $('input')[i];
        let currentCellIndex = currentInput.parentElement.cellIndex;
        let currentRowIndex = currentInput.parentElement.parentElement.rowIndex;
        let currentName = abc[currentCellIndex - 1] + currentRowIndex;
        currentInput.setAttribute('name', currentName);
    }

    //name cols

    let thAmount = $('thead th').length;
    for (let i = 2; i <= thAmount; i++) {
        $(`thead tr th:nth-child(${i})`)[0].innerHTML = abc[i - 2].toUpperCase();
    }
}