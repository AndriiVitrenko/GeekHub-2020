import React, {PureComponent} from "react";
import ReactDom from 'react-dom';

export default class Phones extends PureComponent{
    constructor(props) {
        super(props);

        this.phones = props.phones;
    }

    render() {
        const phones = this.phones.map((elem, i) => {
            return (
                <div key={i} className="input-group mb-3">
                    <input type="text" className="form-control" defaultValue={elem.number} onChange={(e) => this.phoneChangeHandler(e, i)}/>
                    <select className="custom-select" defaultValue={elem.type || 'home'} onChange={(e) => this.selectHandler(e, i)}>
                        <option value="home">Домашній</option>
                        <option value="mobile">Мобільний</option>
                    </select>
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button" onClick={(e) => this.removeNode(e, i)}>Видалити</button>
                    </div>
                </div>
            )
        })

        return({phones})
    }
}