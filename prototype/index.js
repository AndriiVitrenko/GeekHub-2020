const abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const Csv = function() {

}

Csv.prototype.parse = function parse(string, separator = null) {
    const allowedSeparator = [',', ';', '\t', /\t/];
    let result;

    if (separator !== null && !allowedSeparator.includes(separator)) {
        return Error('unexpected separator');
    } else if (separator !== null && allowedSeparator.includes(separator)) {
        result = string.split('\n').map(elem => elem.split(separator));
    } else if (!separator) {
        const comaAmount = [];
        const semicolonAmount = [];
        const tabAmount = [];
        let isComa;
        let isSemicolon;
        let isTab;
        const array = string.split('\n');
        array.forEach(function (str) {
            comaAmount.push((str.match(/,/g) || 0).length);
            semicolonAmount.push((str.match(/;/g) || 0).length);
            tabAmount.push((str.match(/\t/g) || 0).length);
        });

        for (let i = 0; i < comaAmount.length - 1; i = i + 1) {
            isComa = !!(comaAmount[i] === comaAmount[i + 1] && comaAmount[i]);
        }

        for (let i = 0; i < semicolonAmount.length - 1; i = i + 1) {
            isSemicolon = !!(semicolonAmount[i] === semicolonAmount[i + 1] && semicolonAmount[i]);
        }

        for (let i = 0; i < tabAmount.length - 1; i = i + 1) {
            isTab = !!(tabAmount[i] === tabAmount[i + 1] && tabAmount[i]);
        }

        if (isComa) {
            result = array.map(elem => elem.split(','));
        } else if (isSemicolon) {
            result = array.map(elem => elem.split(';'));
        } else if (isTab) {
            result = array.map(elem => elem.split(/\t/));
        }
    }

    return result
}

Csv.prototype.generate = function generate(array, separator = ',') {
    let result = array.map(elem => elem.join(separator));
    result = result.join('\n');
    return result
}

const CsvArray = function() {

}

CsvArray.prototype = [];
CsvArray.prototype.parse = function parse(string, separator = null) {
    const allowedSeparator = [',', ';', '\t', /\t/];

    if (separator !== null && !allowedSeparator.includes(separator)) {
        return Error('unexpected separator')
    } else if (separator !== null && allowedSeparator.includes(separator)) {
       string.split('\n').forEach(elem => this.push(elem.split(separator)))
    } else if (!separator) {
        const comaAmount = [];
        const semicolonAmount = [];
        const tabAmount = [];
        let isComa;
        let isSemicolon;
        let isTab;
        const array = string.split('\n');
        array.forEach(function (str) {
            comaAmount.push((str.match(/,/g) || 0).length);
            semicolonAmount.push((str.match(/;/g) || 0).length);
            tabAmount.push((str.match(/\t/g) || 0).length);
        })

        for (let i = 0; i < comaAmount.length - 1; i = i + 1) {
            isComa = !!(comaAmount[i] === comaAmount[i + 1] && comaAmount[i]);
        }

        for (let i = 0; i < semicolonAmount.length - 1; i = i + 1) {
            isSemicolon = !!(semicolonAmount[i] === semicolonAmount[i + 1] && semicolonAmount[i]);
        }

        for (let i = 0; i < tabAmount.length - 1; i = i + 1) {
            isTab = !!(tabAmount[i] === tabAmount[i + 1] && tabAmount[i]);
        }

        if (isComa) {
            array.forEach(elem => this.push(elem.split(',')));
        } else if (isSemicolon) {
            array.forEach(elem => this.push(elem.split(';')));
        } else if (isTab) {
            array.forEach(elem => this.push(elem.split(/\t/)));
        }
    }
}

CsvArray.prototype.generate = function generate(separator = ',') {
    let result = this.map(elem => elem.join(separator));
    result = result.join('\n');
    return result;
}

CsvArray.prototype.getCell = function getCell(str) {
    const rowNumber = abc.indexOf(str.slice(0, 1).toLowerCase());
    const cellNumber = +str.slice(1);
    return this[rowNumber][cellNumber - 1];

}