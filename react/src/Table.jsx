import React from 'react';
const abc = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p']

export default function Table(props) {

	let {columns, rows, cell, data} = props;

	if (!data) {
		data = []
	}

	let th = []
	for (let i = 0; i < columns; i++) {
		th.push(<th key={abc[i]}>{abc[i].toUpperCase()}</th>)
	}

	let rowsArray = []
	for (let i = 0; i < rows; i++) {
		let columnsArray = []

		for (let j = 0; j <= columns; j++) {
			if (j === 0) {
				columnsArray.push(<th key={i*j}>{i + 1}</th>)
			}
			else {
				columnsArray.push(<td><input
					type="text"
					name={abc[j - 1] + (i + 1)}
					value={getInform(cell, data, `${abc[j - 1] + (i + 1)}`)}
				/></td>)
			}
		}

		rowsArray.push(columnsArray)
	}

	let table = <table>
		<thead>
		<tr>
			<th key={0}>&nbsp;</th>
			{th}
		</tr>
		</thead>

		<tbody>
		{rowsArray.map((elem) => {
			return (<tr>{elem}</tr>)
		})}
		</tbody>
	</table>

	return (<>{table}</>);
};

function getInform(cell = 'a1', data, inputCell) {
	const RowIndex = +cell.slice(1);
	const CellIndex = abc.indexOf(cell.slice(0, 1).toLowerCase());
	let inputRowIndex = +inputCell.slice(1);
	let inputCellIndex = abc.indexOf(inputCell.slice(0, 1).toLowerCase());

	let textRowIndex = inputRowIndex - RowIndex;
	let textCellIndex = inputCellIndex - CellIndex;

	if (data.length > 0) {
		if (textCellIndex >= 0 && textRowIndex >= 0) {
			return data[textRowIndex][textCellIndex]
		}
	}
}