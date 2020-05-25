import React, {ChangeEvent, KeyboardEventHandler} from "react"
import "./Describe.css"
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface DescribeProps {
    describe: ((description: string) => void);
    img?: string;
}

interface DescribeState {
    description: string
}

class Describe extends React.Component<DescribeProps, DescribeState> {

    describe() {
        const description = this.state.description;
        if (description && description.length > 0) {
            this.props.describe(description);
        }
    }

    setDescription(evt : ChangeEvent<HTMLInputElement>) : void {
        const description = evt.target.value;
        this.setState({
            description
        });
    }

    handleKeyDown : KeyboardEventHandler = evt => {
        if (evt.key === "enter") {
            this.describe();
        }
    }

    public render() {
        //TODO: If props.img is null/undefined we should change the placeholder text
        const placeholder = (this.props.img) ? "Say what you see!" : "Write a prompt to get us started!";
        return (<div className={"fullScreen"}>
            <div className={"describe"}>
                <img className={"captionTarget"} src={this.props.img} alt={this.props.img ? "Sketch" : ""}/>
                <div className={"captionInput"}>
                    <input type={"text"} placeholder={placeholder} onChange={e => this.setDescription(e)} onKeyDown={this.handleKeyDown}/>
                    <div className={"captionControl"} onClick={() => this.describe()}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </div>
                </div>
            </div>
        </div>)
    }

}

export default Describe;