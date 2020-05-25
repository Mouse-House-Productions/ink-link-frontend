import React, {CSSProperties, MouseEventHandler} from 'react';
import './App.css';
import CanvasDraw, {CanvasDrawProps} from 'react-canvas-draw';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Palette from "./Palette";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircle} from "@fortawesome/free-solid-svg-icons";
import {faPaintBrush} from "@fortawesome/free-solid-svg-icons";
import Thickness from "./Thickness";

interface IAppProps {
}

interface IAppState {
    canvasProps : CanvasDrawProps
    paletteActive : boolean
    thicknessActive : boolean
}


const DEFAULT_BRUSH_RADIUS = 5;
const MIN_BRUSH_RADIUS = 1;
const MAX_BRUSH_RADIUS = 10;
const LAZY_RADIUS_STEP = 1;
const DEFAULT_LAZY_RADIUS = 1;
const MIN_LAZY_RADIUS = 1;
const MAX_LAZY_RADIUS = 100;
const CANVAS_HEIGHT_STEP = 50;
const DEFAULT_CANVAS_HEIGHT = 400;
const MIN_CANVAS_HEIGHT = 400;
const MAX_CANVAS_HEIGHT = 1000;
const DEFAULT_CANVAS_WIDTH = 350;
const MIN_CANVAS_WIDTH = 400;
const MAX_CANVAS_WIDTH = 1000;
const CANVAS_WIDTH_STEP = 50;
const DEFAULT_BRUSH_COLOR = "hsl(0, 0%, 0%)";
const WHITE = "hsl(0, 0%, 100%)";


class App extends React.Component<IAppProps, IAppState> {

    constructor(props: IAppProps) {
        super(props);
        this.state = {
            canvasProps: {
                hideGrid: true,
                brushRadius: DEFAULT_BRUSH_RADIUS,
                brushColor: DEFAULT_BRUSH_COLOR,
                lazyRadius: DEFAULT_LAZY_RADIUS,
                hideInterface: true,
                canvasHeight: DEFAULT_CANVAS_HEIGHT,
                canvasWidth: DEFAULT_CANVAS_WIDTH,
                style: {
                    border: "1px solid black"
                },
            },
            paletteActive: false,
            thicknessActive: false
        }
    }

    decreaseBrush : MouseEventHandler = () => {
        this.setState((state) => {
            const brushRadius = Math.max(MIN_BRUSH_RADIUS, (state.canvasProps.brushRadius || DEFAULT_BRUSH_RADIUS) - 1);
            return {
                canvasProps: {
                    ...state.canvasProps,
                    brushRadius
                }
            }
        });
    }

    increaseBrush : MouseEventHandler = () => {
        this.setState((state) => {
            const brushRadius = Math.min(MAX_BRUSH_RADIUS, (state.canvasProps.brushRadius || DEFAULT_BRUSH_RADIUS) + 1);
            return {
                canvasProps: {
                    ...state.canvasProps,
                    brushRadius
                }
            }
        })
    };

    increaseLazyRadius : MouseEventHandler = () => {
        this.setState((state) => {
            const lazyRadius = Math.min(MAX_LAZY_RADIUS, (state.canvasProps.lazyRadius || DEFAULT_LAZY_RADIUS) + LAZY_RADIUS_STEP);
            return {
                canvasProps : {
                    ...state.canvasProps,
                    lazyRadius
                }
            }
        })
    }

    decreaseLazyRadius : MouseEventHandler = () => {
        this.setState((state) => {
            const lazyRadius = Math.max(MIN_LAZY_RADIUS, Math.min(MIN_LAZY_RADIUS, (state.canvasProps.lazyRadius || DEFAULT_LAZY_RADIUS) - LAZY_RADIUS_STEP));
            return {
                canvasProps : {
                    ...state.canvasProps,
                    lazyRadius
                }
            }
        })
    }

    decreaseCanvasHeight : MouseEventHandler = () => {
        this.setState((state) => {
            let canvasHeight = DEFAULT_CANVAS_HEIGHT;
            if (typeof state.canvasProps.canvasHeight === "number") {
                canvasHeight = Math.max(MIN_CANVAS_HEIGHT, (state.canvasProps.canvasHeight || DEFAULT_CANVAS_HEIGHT) - CANVAS_HEIGHT_STEP);
            }
            return {
                canvasProps : {
                    ...state.canvasProps,
                    canvasHeight
                }
            }
        });
    }

    increaseCanvasHeight : MouseEventHandler = () => {
        this.setState((state) => {
            let canvasHeight = DEFAULT_CANVAS_HEIGHT;
            if (typeof state.canvasProps.canvasHeight === "number") {
                canvasHeight = Math.min(MAX_CANVAS_HEIGHT, (state.canvasProps.canvasHeight || DEFAULT_CANVAS_HEIGHT) + CANVAS_HEIGHT_STEP);
            }
            return {
                canvasProps : {
                    ...state.canvasProps,
                    canvasHeight
                }
            }
        });
    }

    decreaseCanvasWidth : MouseEventHandler = () => {
        this.setState((state) => {
            let canvasWidth = DEFAULT_CANVAS_WIDTH;
            if (typeof state.canvasProps.canvasWidth === "number") {
                canvasWidth = Math.max(MIN_CANVAS_WIDTH, (state.canvasProps.canvasWidth || DEFAULT_CANVAS_WIDTH) - CANVAS_WIDTH_STEP);
            }
            return {
                canvasProps : {
                    ...state.canvasProps,
                    canvasWidth
                }
            }
        });
    }

    increaseCanvasWidth : MouseEventHandler = () => {
        this.setState((state) => {
            let canvasWidth = DEFAULT_CANVAS_WIDTH;
            if (typeof state.canvasProps.canvasWidth === "number") {
                canvasWidth = Math.min(MAX_CANVAS_WIDTH, (state.canvasProps.canvasWidth || DEFAULT_CANVAS_WIDTH) + CANVAS_WIDTH_STEP);
            }
            return {
                canvasProps : {
                    ...state.canvasProps,
                    canvasWidth
                }
            }
        });
    }

    setBrushColor(color : string) {
        this.setState((state) => {
            return {
                canvasProps: {
                    ...state.canvasProps,
                    brushColor: color
                },
                paletteActive: false
            }
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

public render() {
    const canvasProps = {
        ...this.state.canvasProps,
        disabled: (this.state.canvasProps.disabled) || this.state.paletteActive || this.state.thicknessActive
    };

    const brushRadius = canvasProps.brushRadius || DEFAULT_BRUSH_RADIUS;

    const thicknessStyle : CSSProperties = {
        borderRadius: "50%",
        border: "none",
        background: "black",
        width: (2*brushRadius)+"px",
        height: (2*brushRadius)+"px",
    }

    let dialog : JSX.Element = (<div className={"hidden"}/>)
    let palette = (<Palette select={(c) => this.setBrushColor(c)} cancel={() => this.setState({paletteActive: false})}/>);
    let thickness = (<Thickness select={(c) => this.setBrushRadius(c)} cancel={() => this.setState({thicknessActive: false})}/>);
    if (this.state.paletteActive) {
        dialog = palette;
    } else if (this.state.thicknessActive) {
        dialog = thickness;
    }


    return (
        <div className="App">
            <CanvasDraw {...canvasProps}/>
            {dialog}
            <div className={"canvas-control"}>
                <FontAwesomeIcon size={"2x"} color={canvasProps.brushColor} icon={faPaintBrush} onClick={() => this.setState({paletteActive: true})}/>
            </div>
            <div className={"canvas-control"} onClick={() => this.setState({thicknessActive: true})}>
                <div style={thicknessStyle}/>
            </div>
        </div>
    )
}

}

export default App;
