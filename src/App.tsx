import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ink from './Ink'
import Describe from "./Describe";

interface IAppProps {
}

interface IAppState {
    view: "describe" | "ink";
    description?: string;
    img?: string;
}

class App extends React.Component<IAppProps, IAppState> {


    constructor(props: Readonly<IAppProps>) {
        super(props);
        this.state = {
            view: "describe"
        }
    }

    describe(description: string) : void {
        this.setState({
            view: "ink",
            description
        })
    }

    draw(img: string) : void {
        this.setState({
            view: "describe",
            img
        })
    }

    public render() {
        if (this.state.view === "ink") {
            return <Ink prompt={this.state.description} draw={img => this.draw(img)}/>
        }
        return (
            // <Ink prompt={"this is your prompt"}/>
            <Describe describe={d => this.describe(d)} img={this.state.img}/>
        )
}

}

export default App;
