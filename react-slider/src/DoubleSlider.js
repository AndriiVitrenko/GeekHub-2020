import React from 'react';
import styled from 'styled-components';

export default class DoubleSlider extends React.PureComponent {
    state = {
        min: this.props.min,
        max: this.props.max,
        startValue: this.props.startValue,
        startLeft: this.props.startValue / (this.props.max - this.props.min) * 100,
        endValue: this.props.endValue,
        endLeft: this.props.endValue / (this.props.max - this.props.min) * 100
    }

    barRef = React.createRef()

    firstStart = 0;
    firstX = 0;

    lastX = 0;
    lastStart = 0;

    //inputs onChange functions----------

    onStartChange = (e) => {
        const range = this.state.max - this.state.min;
        let value = +e.target.value
        let left

        if (value <= this.state.min) {
            left = 0
        }
        else if (value >= this.state.endValue) {
            left = this.state.endLeft - 10 / range * 100
        }
        else {
            left = (value - this.state.min) / range * 100
        }

        this.setState({
            startValue: value,
            startLeft: left,
        })

        this.firstStart = 0;
    }

    onEndChange = (e) => {
        const range = this.state.max - this.state.min;
        let value = +e.target.value
        let left

        if (value >= this.state.max) {
            left = 100
        }
        else if (value <= this.state.startValue) {
            left = this.state.startLeft + 10 / range * 100
        }
        else {
            left = (value - this.state.min) / range * 100
        }

        this.setState({
            endValue: value,
            endLeft: left,
        })

        this.lastStart = 0
    }

    //---------drag'n'drop functions-----------

    //--------------first handler functions-------------

    onFirstDragStart = (e) => {
        this.firstStart = this.firstStart || e.clientX - 18;
        this.firstX = e.clientX - 18;

        this.barRect = this.barRef.current.getBoundingClientRect()

        this.onFirstDrag(e)

        document.addEventListener('mousemove', this.onFirstDrag)
        document.addEventListener('mouseup', this.onFirstDragEnd)
    }

    onFirstDrag = (e) => {
        const width = this.barRect.width;

        const range = this.state.max - this.state.min

        let x = this.firstStart + e.clientX - this.firstX - 18

        if (x < 0) {
            x = 0
        }
        else if (x >= this.state.endLeft * width / 100 - 10) {
            x = this.state.endLeft * width / 100 - 10
        }

        let value = x / width * range + this.state.min
        let left = x / width * 100

        this.setState({
            startValue: value,
            startLeft: left,
        })
    }

    onFirstDragEnd = (e) => {
        this.onFirstDrag(e)
        this.firstStart = e.clientX - 18

        document.removeEventListener('mousemove', this.onFirstDrag)
        document.removeEventListener('mouseup', this.onFirstDragEnd)
    }

    //-------------last handler functions---------------

    onLastDragStart = (e) => {
        this.lastStart = this.lastStart || e.clientX - 18;
        this.lastX = e.clientX - 18;

        this.barRect = this.barRef.current.getBoundingClientRect()

        this.onLastDrag(e)

        document.addEventListener('mousemove', this.onLastDrag)
        document.addEventListener('mouseup', this.onLastDragEnd)
    }

    onLastDrag = (e) => {
        const width = this.barRect.width;
        const range = this.state.max - this.state.min

        let x = this.lastStart + e.clientX - this.lastX - 18

        if (x > width) {
            x = width
        }
        else if (x < this.state.startLeft * width / 100 + 10) {
            x = this.state.startLeft * width / 100 + 10
        }

        let value = x / width * range + this.state.min
        let left = x / width * 100

        this.setState({
            endValue: value,
            endLeft: left,
        })
    }

    onLastDragEnd = (e) => {
        this.onLastDrag(e)
        this.lastStart = e.clientX - 18

        document.removeEventListener('mousemove', this.onLastDrag)
        document.removeEventListener('mouseup', this.onLastDragEnd)
    }

    render() {
        const {startLeft, startValue, endLeft, endValue} = this.state;

        return (
            <Root>
                <input value={Math.round(startValue)} onChange={this.onStartChange}/>
                <input value={Math.round(endValue)} onChange={this.onEndChange}/>

                <Bar ref={this.barRef}>
                    <Before width={startLeft}/>
                    <Handler
                        left = {startLeft}
                        onMouseDown = {this.onFirstDragStart}
                    />

                    <Handler
                        left={endLeft}
                        onMouseDown={this.onLastDragStart}
                    />
                    <After width={100 - endLeft}/>
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
	height: 2px;
    background: linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(249,255,15,1) 50%, rgba(0,255,0,1) 100%);
    margin-top: 10px;
`;

const Handler = styled.div.attrs(props => ({
    style: {
        left: props.left + '%',
    },
}))`
    position: absolute;
	height: 10px;
	width: 10px;
	border-radius: 5px;
    background-color: red;
	top: -4px;
    z-index: 1000;
`;

const Before = styled.div.attrs((props) => ({
    style: {
        width: props.width + '%'
    }
}))`
    background: gray;
    position: absolute;
    height: 100%;
    left: 0;
`

const After = styled.div.attrs((props) => ({
    style: {
        width: props.width + '%'
    }
}))`
    background: gray;
    position: absolute;
    height: 100%;
    right: 0;
    /*transform: scaleX(-1);*/
    transform-origin: left;
`

//endregion