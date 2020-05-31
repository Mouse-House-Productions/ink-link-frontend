import React from "react";
import './Waiting.css';

class Waiting extends React.Component<any, any> {
    public render() {
        return (<div className={"fullScreen"}>
            <div className={"waitingHeader"}>
                <h2>Await Instructions</h2>
            </div>
        </div>)
    }
}

export default Waiting;