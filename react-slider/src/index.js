import React from 'react';
import ReactDom from 'react-dom';
import Slider from './Slider';
import DoubleSlider from './DoubleSlider';

ReactDom.render(
    <Slider
        min={100}
        max={2000}
        value={1500}
    />,
    document.querySelector('#slider')
);

ReactDom.render(
    <DoubleSlider
        min={100}
        max={2000}
        startValue={900}
        endValue={1800}
    />,
    document.querySelector('#double-slider')
);