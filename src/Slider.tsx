import React, {CSSProperties} from 'react';
import './Slider.css'

export interface SliderProps {
    active?: boolean;
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
        let className = "slider-container slide-in";
        if (this.props.speed != null) {
            className += " " + this.props.speed;
        }
        return (
            <div className={className}>
                {this.props.children}
                <div className={"cancel"} onClick={() => this.cancel()}/>
            </div>)
    }
}

export default Slider;
