import React, {CSSProperties} from 'react';
import Slider from "./Slider";
import "./Thickness.css"

export interface ThicknessProps {
    select?: ((radius: number) => void) | null;
    cancel?: (() => void) | null;
    active: "closed" | "opened" | "hidden";
}

const RADII = [
    1, 5, 10
]

class Thickness extends React.Component<ThicknessProps> {

    select(radius: number) : void{
        if (this.props.select) {
            this.props.select(radius);
        }
    }

    cancel() : void {
        if (this.props.cancel) {
            this.props.cancel();
        }
    }


    render() {
        let buttons = RADII.map(c => {
            const style : CSSProperties = {
                display: "block",
                position: "relative",
                top: "calc(50% - "+c+"px)",
                left: "calc(50% - "+c+"px)",
            }
            return (<div key={"brushThicknessButton-"+c} className={"grid-button"} onClick={() => this.select(c)}><div className={"brushThickness-"+c} style={style}/></div>)
        })
        return <Slider active={this.props.active} cancel={() => this.cancel()} speed={"fast"}>
            <div className="column">
                {buttons}
            </div>
        </Slider>
    }

}

export default Thickness;