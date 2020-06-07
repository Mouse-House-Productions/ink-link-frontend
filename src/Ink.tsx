import React, {CSSProperties} from "react";
import "./Ink.scss"
import CanvasDraw, {CanvasDrawProps} from "react-canvas-draw";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPaintBrush, faPaperPlane, faUndo} from "@fortawesome/free-solid-svg-icons";
import {cssString, hsl, HSL} from "./HSL";
import Palette from "./Palette";
import Thickness from "./Thickness";
import KeyboardEventHandler from 'react-keyboard-event-handler';

interface InkState {
    canvasProps : CanvasDrawProps;
    brushColor : HSL;
    undo?: (() => void) | null;
    paletteActive: "closed" | "opened" | "hidden";
    thicknessActive: "closed" | "opened" | "hidden";
    img?: string;
    undoEnabled?: boolean;
}

interface InkProps {
    prompt?: string | null;
    saved?: string;
    draw: ((img: string) => void);
    save: ((img: string) => void);
}


const DEFAULT_BRUSH_RADIUS = 5;
const DEFAULT_LAZY_RADIUS = 1;
const DEFAULT_CANVAS_HEIGHT = "70vh";
const DEFAULT_CANVAS_WIDTH = "95vw";
const DEFAULT_BRUSH_COLOR = hsl(0, 0, 0);

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
                    border: "2px solid #0d3b66"
                }
            },
            paletteActive: "hidden",
            thicknessActive: "hidden"
        }
    }

    setBrushColor(color : HSL) {
        this.setState({
            brushColor: color,
            paletteActive: "closed"
        });
    }

    setBrushRadius(radius : number) {
        this.setState((state) => {
            return {
                canvasProps: {
                    ...state.canvasProps,
                    brushRadius: radius
                },
                thicknessActive: "closed"
            }
        })
    }

    setImage(c : CanvasDraw) : void {
        this.setState({
            undo: () => c.undo(),
        }, () => this.props.save(c.getSaveData()));
    }

    undo() : void {
        if (this.state.undo) {
            this.state.undo();
        }
    }

    draw() : void {
        let img = "";
        try {
            //Annoyingly there's not a good way to get ahold of the picture using the interface.
            //There are 4 canvases for a CanvasDraw and the 1th one has our drawing in it.
            //When a PR is resolved on the upstream lib we can replace this with a nicer call.
            const srcCanvas = document.querySelectorAll("canvas")[1];
            const trgCanvas = document.createElement("canvas");
            trgCanvas.width = srcCanvas.width;
            trgCanvas.height = srcCanvas.height;
            let context = trgCanvas.getContext('2d');
            if (context !== null) {
                context.fillStyle = "#FFFFFF";
                context.fillRect(0, 0, trgCanvas.width, trgCanvas.height);
                context.drawImage(srcCanvas, 0, 0);
                img = trgCanvas.toDataURL("image/webp", 1);
            }
        } catch (ex) {
            //ignored
        }
        if (img.length > 0) {
            this.props.draw(img);
        }
    }

    public render() {
        let brushHsl = this.state.brushColor;
        const canvasProps : CanvasDrawProps = {
            ...this.state.canvasProps,
            disabled: (this.state.canvasProps.disabled) || (this.state.paletteActive === "opened") || (this.state.thicknessActive === "opened"),
            brushColor: cssString(brushHsl),
            onChange: (c : CanvasDraw) => this.setImage(c),
            saveData: this.props.saved,
            immediateLoading: !!this.props.saved
        };

        const brushRadius = canvasProps.brushRadius || DEFAULT_BRUSH_RADIUS;

        const paletteStyle : CSSProperties = {
            backgroundColor: cssString(brushHsl)
        }
        const brushClass = brushHsl.light <= 50 ? "light" : "dark";
        // @ts-ignore
        return (
            <div>
                <Palette active={this.state.paletteActive} select={(c) => this.setBrushColor(c)} cancel={() => this.setState({paletteActive: "closed"})}/>
                <Thickness active={this.state.thicknessActive} select={(c) => this.setBrushRadius(c)} cancel={() => this.setState({thicknessActive: "closed"})}/>
                <div className={"Ink"}>
                    <div className={"title"}>{this.props.prompt ? this.props.prompt : ""}</div>
                    <CanvasDraw {...canvasProps}/>
                    <div className={"controlBar centered"}>
                        <div className={"iconControl x-lg"} style={paletteStyle} onClick={() => this.setState({paletteActive: "opened"})}>
                            <FontAwesomeIcon className={brushClass} icon={faPaintBrush}/>
                        </div>
                        <div className={"iconControl x-lg"} onClick={() => this.setState({thicknessActive: "opened"})}>
                            <div className={"brushThickness-"+brushRadius}/>
                        </div>
                        <div className={"iconControl x-lg"} onClick={() => this.undo()}>
                            <FontAwesomeIcon icon={faUndo}/>
                        </div>
                        <div className={"iconControl x-lg"} onClick={() => this.draw()}>
                            <FontAwesomeIcon icon={faPaperPlane}/>
                        </div>
                    </div>
                </div>
                <KeyboardEventHandler handleKeys={['ctrl+z']} onKeyEvent={() => this.undo()}/>
            </div>
        )
    }

}

export default Ink