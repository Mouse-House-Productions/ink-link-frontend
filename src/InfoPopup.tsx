import React from 'react';
import Popup from './Popup';

export interface InfoPopupProps {
    active: "opened" | "closed" | "hidden";
    close: () => void;
}

export default class InfoPopup extends React.Component<InfoPopupProps> {


    render() {
        return <Popup active={this.props.active} cancel={() => this.props.close()}>
            <div className={"dialog info"}>
                {this.props.children}
            </div>
        </Popup>
    }

}
