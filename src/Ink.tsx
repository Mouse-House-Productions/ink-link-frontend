import React, {CSSProperties, MutableRefObject, useRef} from "react";
import "./Ink.css"
import CanvasDraw, {CanvasDrawProps} from "react-canvas-draw";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaintBrush, faPaperPlane, faUndo} from "@fortawesome/free-solid-svg-icons";
import {cssString, hsl, HSL} from "./HSL";
import Palette from "./Palette";
import Thickness from "./Thickness";

interface InkState {
    canvasProps : CanvasDrawProps;
    brushColor : HSL;
    undo?: (() => void) | null;
    paletteActive : boolean;
    thicknessActive : boolean;
    img?: string;
}

interface InkProps {
    prompt?: string | null,
    draw: ((img: string) => void)
}

const DEFAULT_BRUSH_RADIUS = 5;
const DEFAULT_LAZY_RADIUS = 1;
const DEFAULT_CANVAS_HEIGHT = "70vh";
const DEFAULT_CANVAS_WIDTH = "95vw";
const DEFAULT_BRUSH_COLOR = hsl(0, 0, 0);
const WHITE = "hsl(0, 0%, 100%)";

class Ink extends React.Component<InkProps, InkState> {

    constructor(props: InkProps) {
        super(props);
        this.state = {
            brushColor: DEFAULT_BRUSH_COLOR,
            canvasProps: {
                hideGrid: true,
                brushRadius: DEFAULT_BRUSH_RADIUS,
                lazyRadius: DEFAULT_LAZY_RADIUS,
                hideInterface: true,
                canvasHeight: DEFAULT_CANVAS_HEIGHT,
                canvasWidth: DEFAULT_CANVAS_WIDTH,
                style: {
                    border: "2px solid brown"
                }
            },
            paletteActive: false,
            thicknessActive: false
        }
    }

    setBrushColor(color : HSL) {
        this.setState({
            brushColor: color,
            paletteActive: false
        });
    }

    setBrushRadius(radius : number) {
        this.setState((state) => {
            return {
                canvasProps: {
                    ...state.canvasProps,
                    brushRadius: radius
                },
                thicknessActive: false
            }
        })
    }

    setImage(c : CanvasDraw) : void {
        this.setState({
            undo: () => c.undo(),
        });
    }

    undo() : void {
        if (this.state.undo) {
            this.state.undo();
        }
    }

    public render() {
        let brushHsl = this.state.brushColor;
        const canvasProps = {
            ...this.state.canvasProps,
            disabled: (this.state.canvasProps.disabled) || this.state.paletteActive || this.state.thicknessActive,
            brushColor: cssString(brushHsl),
            onChange: (c : CanvasDraw) => this.setImage(c)
        };

        const brushRadius = canvasProps.brushRadius || DEFAULT_BRUSH_RADIUS;

        const thicknessStyle : CSSProperties = {
            borderRadius: "50%",
            border: "none",
            background: "black",
            width: (2*brushRadius)+"px",
            height: (2*brushRadius)+"px",
        }

        const paletteStyle : CSSProperties = {
            backgroundColor: cssString(brushHsl)
        }
        const inverseLight = cssString(hsl(0, 0, (brushHsl.light <= 50) ? 100 : 0));

        let dialog : JSX.Element = (<div className={"hidden"}/>)
        let palette = (<Palette select={(c) => this.setBrushColor(c)} cancel={() => this.setState({paletteActive: false})}/>);
        let thickness = (<Thickness select={(c) => this.setBrushRadius(c)} cancel={() => this.setState({thicknessActive: false})}/>);
        if (this.state.paletteActive) {
            dialog = palette;
        } else if (this.state.thicknessActive) {
            dialog = thickness;
        }
        // @ts-ignore
        return (
            <div className={"fullScreen"}>
                {dialog}
                <div className={"Ink"}>
                    <div>{this.props.prompt ? this.props.prompt : ""}</div>
                    <CanvasDraw {...canvasProps}/>
                    <div className={"canvasControls"}>
                        <div className={"canvasControl"} style={paletteStyle} onClick={() => this.setState({paletteActive: true})}>
                            <FontAwesomeIcon size={"1x"} color={inverseLight} icon={faPaintBrush}/>
                        </div>
                        <div className={"canvasControl"} onClick={() => this.setState({thicknessActive: true})}>
                            <div style={thicknessStyle}/>
                        </div>
                        <div className={"canvasControl"} onClick={() => this.undo()}>
                            <FontAwesomeIcon icon={faUndo}/>
                        </div>
                        <div className={"canvasControl"}>
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default Ink