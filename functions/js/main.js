document.querySelectorAll('input[name], #formula, #condition').forEach(function(input) {
    input.addEventListener('keyup', function() {
        let a1 = +document.querySelector('[name="a1"]').value;
        let a2 = +document.querySelector('[name="a2"]').value;
        let b1 = +document.querySelector('[name="b1"]').value;
        let b2 = +document.querySelector('[name="b2"]').value;
        let formula = document.querySelector('#formula');
        let result = document.querySelector('#result');
        let condition = document.querySelector('#condition');

        try {
            let calc = new Function('a1, b1, a2, b2', 'return ' + formula.value + ';')
            result.value = calc(a1, b1, a2, b2)
        }
        catch (err) {
            console.error(err)
        }

        try {
            let paint = new Function('a1, b1, a2, b2', 'if (' + condition.value + ') {result.style.background = "#B6D7A8"} else {result.style.background = "white";}')

            paint(a1, b1, a2, b2)
        }
        catch (err) {
            console.error(err)
        }
    })
})