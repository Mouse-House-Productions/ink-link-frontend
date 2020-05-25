import React, {CSSProperties} from 'react';
import './Slider.css'

export interface SliderProps {
    active?: boolean;
    cancel?: (() => void) | null;
}

class Slider extends React.Component<SliderProps> {

    cancel() {
        if (this.props.cancel) {
            this.props.cancel();
        }
    }
    render() {
        let cancelStyle : CSSProperties = {
            position: "absolute",
            width: "100vw",
            height: "100vh",
            top: 0,
            left: 0,
            zIndex: -1
        };

        return (
            <div className={"slider-container slide-in"}>
                {this.props.children}
                <div style={cancelStyle} onClick={() => this.cancel()}/>
            </div>)
    }
}

export default Slider;
