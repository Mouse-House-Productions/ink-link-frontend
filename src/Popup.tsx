import React from 'react';
import './Popup.scss'

export interface PopupProps {
    active: "closed" | "opened" | "hidden";
    cancel?: (() => void) | null;
}

export default class Popup extends React.Component<PopupProps> {

    cancel() {
        if (this.props.cancel) {
            this.props.cancel();
        }
    }

    render() {
        let popupClass = "popup";
        let containerClass = "popup-container";

        switch (this.props.active) {
            case "closed":
                popupClass += " popped-down";
                containerClass += " popped-down";
                break;
            case "opened":
                popupClass += " popped-up";
                break;
            case "hidden":
                containerClass += " hidden";
                break;
        }

        return (
                <div className={containerClass}>
                    <div className={popupClass}>
                        {this.props.children}
                    </div>
                    <div className={"backdrop " + ((this.props.active === "opened") ? '' : 'hidden')} onClick={() => this.cancel()}/>
                </div>

        );
    }
}
