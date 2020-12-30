import React from 'react';
import styled from 'styled-components';

export default class Slider extends React.PureComponent {
    state = {
        ...this.props,
        left: (this.props.value - this.props.min) / (this.props.max - this.props.min) * 100,
    }

    barRef = React.createRef();

    startX = 0;
    firstX = 0;

    //--------input onChangeFunction-----------

    onChangeValue = (e) => {
        const range = this.state.max - this.state.min;
        let value = +e.target.value
        let left

        if (value < this.state.min) {
            left = 0
        }
        else if (value > this.state.max) {
            left = 100
        }
        else {
            left = (value - this.state.min) / range * 100
        }

        this.setState({
            value,
            left
        })

        this.startX = 0;
    }

    //---------drag'n'drop functions------------

    onDragStart = (e) => {
        this.firstX = e.clientX - 18
        this.startX = this.startX || e.clientX - 18
        this.barRect = this.barRef.current.getBoundingClientRect()

        this.onDrag(e)

        document.addEventListener('mousemove', this.onDrag)
        document.addEventListener('mouseup', this.onDragEnd)
    }

    onDrag = (e) => {
        let x = this.startX + e.clientX - this.firstX - 18
        const width = this.barRect.width
        const range = this.state.max - this.state.min;

        if (x < 0 ) {
            x = 0
        }
        else if (x > width) {
            x = width
        }

        let value = x / width * range + this.state.min
        let left = x / width * 100

        this.setState({
            left,
            value,
        })
    }

    onDragEnd = (e) => {
        this.onDrag(e)
        this.startX = this.state.left * this.barRect.width / 100

        document.removeEventListener('mousemove', this.onDrag)
        document.removeEventListener('mouseup', this.onDragEnd)
    }

    render() {

        return (
            <Root>
                <input value={Math.round(this.state.value)} onChange={this.onChangeValue}/>

                <Bar ref={this.barRef}>
                    <Handler
                        left={this.state.left}
                        onMouseDown = {this.onDragStart}
                    />
                </Bar>
            </Root>
        );
    }
}


//region ====================== Styles ========================================

const Root = styled.div`
    padding: 10px;
`;

const Bar = styled.div`
    position: relative;
	height: 3px;
    background: linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(249,255,15,1) 50%, rgba(0,255,0,1) 100%);
	margin-top: 10px;
`;

const Handler = styled.div.attrs(props => ({
    style: {
        left: props.left + '%'
    }
}))`
    position: absolute;
	height: 10px;
	width: 10px;
	border-radius: 5px;
	background-color: red;
	top: -4px;
    z-index: 1000;
`;

//endregion