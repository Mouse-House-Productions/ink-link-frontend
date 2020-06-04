import React from 'react';
import Popup from './Popup';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faCheck} from "@fortawesome/free-solid-svg-icons";

export interface ConfirmationPopupProps {
    active: "closed" | "opened" | "hidden";
    cancel: (() => void);
    affirm: (() => void);
    question: string;
}

export default class ConfirmationPopup extends React.Component<ConfirmationPopupProps> {

    render() {
        return (<Popup active={this.props.active}>
            <div className={"dialog"}>
                <span className={"question"}> {this.props.question}</span>
                <div className={"controlBar centered"}>
                    <div className={"iconControl x-lg danger"} onClick={() => this.props.cancel()}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                    <div className={"iconControl x-lg success"} onClick={() => this.props.affirm()}>
                        <FontAwesomeIcon icon={faCheck}/>
                    </div>
                </div>
            </div>
        </Popup>)
    }
}
