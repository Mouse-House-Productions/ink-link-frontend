import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ink from './Ink'
import Describe from './Describe';
import Present from './Present';

interface IAppProps {
}

export interface BookEntry {
    type: "description" | "depiction";
    contents: string;
}

interface IAppState {
    view: "describe" | "ink";
    description?: string;
    img?: string;
    book : BookEntry[];
}

class App extends React.Component<IAppProps, IAppState> {


    constructor(props: Readonly<IAppProps>) {
        super(props);
        this.state = {
            book: [],
            view: "describe"
        }
    }

    describe(description: string) : void {
        this.setState((state) => {
            const book = [...state.book]
            book.push({
                type: "description",
                contents: description
            });
            return {
                view: "ink",
                description,
                book
            }
        });
    }

    draw(img: string) : void {
        this.setState((state) => {
            const book = [...state.book]
            book.push({
                type: "depiction",
                contents: img
            });
            return {
                view: "describe",
                img,
                book
            }
        });
    }

    public render() {
        if (this.state.book.length > 3) {
           return <Present book={this.state.book}/>
        }

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
