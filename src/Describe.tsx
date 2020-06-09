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

    constructor(props : DescribeProps) {
        super(props);
        this.state = {
            description: ''
        }
    }

    describe() {
        const description = this.state.description;
        if (description && description.length > 0) {
            this.setState({
                description: ''
            }, () => this.props.describe(description));
        }
    }

    setDescription(evt : ChangeEvent<HTMLInputElement>) : void {
        const description = evt.target.value;
        this.setState({
            description
        });
    }

    handleKeyDown : KeyboardEventHandler = evt => {
        if (evt.key === "Enter") {
            this.describe();
        }
    }

    public render() {
        let content = this.props.img;
        const placeholder = content ? "Say what you see!" : "Write a prompt to get started!";
        const imgD = content ? [(<img className={"captionTarget"} src={content} alt={content ? "Sketch" : ""}/>)] : []
        return (
            <div className={"describe"}>
                <div className={"spacer"}/>
                {imgD}
                <div className={"captionInput"}>
                    <input className={"captionField"} type={"text"} placeholder={placeholder} onChange={e => this.setDescription(e)} onKeyDown={this.handleKeyDown}/>
                    <div className={"iconControl lg"} onClick={() => this.describe()}>
                        <FontAwesomeIcon icon={faPaperPlane}/>
                    </div>
                </div>
                <div className={"spacer"}/>
            </div>)
    }

}

export default Describe;