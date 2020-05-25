import React, {CSSProperties} from 'react';
import "./Palette.css";
import Slider from "./Slider";


const PALETTE = [
    "hsl(0, 0%, 100%)",
    "hsl(0, 0%, 50%)",
    "hsl(0, 0%, 0%)",
    "hsl(0, 75%, 70%)",
    "hsl(0, 75%, 50%)",
    "hsl(0, 100%, 30%)",
    "hsl(30, 100%, 80%)",
    "hsl(30, 100%, 60%)",
    "hsl(24, 100%, 50%)",
    "hsl(60, 90%, 80%)",
    "hsl(60, 100%, 75%)",
    "hsl(48, 100%, 50%)",
    "hsl(120, 100%, 95%)",
    "hsl(120, 60%, 50%)",
    "hsl(120, 100%, 20%)",
    "hsl(210, 100%, 85%)",
    "hsl(210, 100%, 60%)",
    "hsl(210, 100%, 20%)",
    "hsl(270, 100%, 80%)",
    "hsl(270, 100%, 60%)",
    "hsl(270, 100%, 35%)",
    "hsl(300, 100%, 80%)",
    "hsl(300, 95%, 55%)",
    "hsl(300, 100%, 40%)",
    "hsl(30, 50%, 75%)",
    "hsl(30, 50%, 40%)",
    "hsl(30, 50%, 25%)",
];

export interface IPaletteProps {
    select?: ((color: string) => void) | null;
    cancel?: (() => void) | null;
}

class Palette extends React.Component<IPaletteProps> {

    select(c:string) : void {
        if (this.props.select) {
            this.props.select(c);
        }
    }

    cancel() : void {
        if (this.props.cancel) {
            this.props.cancel();
        }
    }

    render() {
        let buttons = PALETTE.map(c => {
            const style : CSSProperties = {
                background: c
            }
            return (<div className="grid-button" style={style} onClick={() => this.select(c)}></div>)
        })
        return <Slider active={true} cancel={() => this.cancel()}>
            <div className="grid">{buttons}</div>
        </Slider>
    }
}

export default Palette;
