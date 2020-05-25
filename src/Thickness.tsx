import React, {CSSProperties} from 'react';
import Slider from "./Slider";
import "./Thickness.css"

export interface ThicknessProps {
    select?: ((radius: number) => void) | null;
    cancel?: (() => void) | null;
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
                width: c*2+"px",
                height: c*2+"px",
                borderRadius: "50%",
                background: "black",
                border: "none",
                display: "block",
                position: "relative",
                top: "calc(50% - "+c+"px)",
                left: "calc(50% - "+c+"px)",
            }
            return (<div className={"grid-button"} onClick={() => this.select(c)}><div style={style}/></div>)
        })
        return <Slider active={true} cancel={() => this.cancel()} speed={"fast"}>
            <div className="column">
                {buttons}
            </div>
        </Slider>
    }

}

export default Thickness;