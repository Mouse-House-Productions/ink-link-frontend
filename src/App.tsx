import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ink from './Ink'
import Describe from './Describe';
import Present from './Present';
import Entry from "./Entry";
import Waiting from "./Waiting";
import {v4 as uuid} from 'uuid';
import Lobby, {Player} from "./Lobby";

interface IAppProps {
}

export interface BookEntry {
    type: "description" | "depiction";
    contents: string;
    author: string;
}

interface IAppState {
    view: "init" | "waiting" | "lobby" | "describe" | "ink" | "present";
    description?: string;
    img?: string;
    book : BookEntry[];
    roomCode: string;
    name: string;
}

const ROUND_LENGTH = 7;

class App extends React.Component<IAppProps, IAppState> {


    constructor(props: Readonly<IAppProps>) {
        super(props);
        const book : BookEntry[] = [
            {
                type: "description",
                contents: "Volcano",
                author: "Sarah"
            },
            {
                type: "depiction",
                contents: "https://wallpapercave.com/wp/wp4088982.jpg",
                author: "Jamie"
            },
            {
                type: "description",
                contents: "Red Carpet",
                author: "Elliot"
            }
        ];
        this.state = {
            book,
            // img: "https://images04.military.com/sites/default/files/2019-04/ufo-2400.jpg",
            // view: "describe",
            description: book[book.length - 1].contents,
            img: book[book.length - 1].contents,
            view: "ink",
            // view: book[book.length - 1].type === "description" ? "ink" : "describe",
            roomCode: "Lint Hype 69",
            name: "",
        }
    }

    describe(description: string) : void {
        this.setState((state) => {
            const book = [...state.book]
            book.push({
                type: "description",
                contents: description,
                author: this.state.name
            });
            return {
                view: book.length < ROUND_LENGTH ? "ink" : "present",
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
                contents: img,
                author: this.state.name
            });
            return {
                view: book.length < ROUND_LENGTH ? "describe" : "present",
                img,
                book
            }
        });
    }

    enterRoom(name: string, roomCode: string) : void {
        this.setState( {
            view: "lobby",
            roomCode,
            name
        });
    }

    closePresent() {
        this.setState({
            book: [],
            view: "lobby",
            img: "",
            description: ""
        });
    }

    public render() {
        let view = this.view();
        return (<div className={"fullScreen"}>
            {view}
        </div>);
    }

    private view() {
        if (this.state.view === "init") {
            return <Entry submit={(name, roomCode) => this.enterRoom(name, roomCode)}/>
        }

        if (this.state.view === "waiting") {
            return <Waiting/>
        }

        if (this.state.view === "lobby") {
            const players: Player[] = [
                {
                    name: this.state.name,
                    uuid: uuid()
                },
                {
                    name: "Jamie",
                    uuid: uuid()
                },
                {
                    name: "Shaunagh",
                    uuid: uuid()
                },
                {
                    name: "Alex",
                    uuid: uuid()
                }
            ];
            return <Lobby name={this.state.roomCode} players={players}
                          submit={() => this.setState({view: "describe"})}/>
        }

        if (this.state.view === "present") {
            return <Present book={this.state.book} close={() => this.closePresent()}/>
        }

        if (this.state.view === "ink") {
            return <Ink prompt={this.state.description} draw={img => this.draw(img)}/>
        }
        return (
            <Describe describe={d => this.describe(d)} img={this.state.img}/>
        )
    }
}

export default App;
