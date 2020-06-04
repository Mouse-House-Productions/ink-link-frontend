import React from 'react';
import './Slider.scss'

export interface SliderProps {
    active: "closed" | "opened" | "hidden";
    cancel?: (() => void) | null;
    speed?: "slow" | "med" | "fast" | null;
}

class Slider extends React.Component<SliderProps> {

    cancel() {
        if (this.props.cancel) {
            this.props.cancel();
        }
    }

    render() {
        let className = "slider-container";
        if (this.props.active === "closed") {
            className += " slide-out";
        } if (this.props.active === "opened") {
            className += " slide-in";
        }
        if (this.props.speed != null) {
            className += " " + this.props.speed;
        }
        return (
            <div className={className}>
                {this.props.children}
                <div className={"cancel" + ((this.props.active === "opened") ? "" : " hidden")} onClick={() => this.cancel()}/>
            </div>)
    }
}

export default Slider;
