import React from 'react';
import './App.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import Ink from './Ink'
import Describe from './Describe';
import Present from './Present';
import Entry from "./Entry";
import Waiting from "./Waiting";
import Lobby, {Room} from "./Lobby";
import PresentList from "./PresentList";
import ConfirmationPopup from "./ConfirmationPopup";

interface IAppProps {
}

export interface BookEntry {
    type: "description" | "depiction";
    contents: string;
    author: string;
}

export interface Book {
    pages : BookEntry[];
    author: string;
    id: string;
}

interface IAppState {
    view: "init" | "waiting" | "lobby" | "describe" | "ink" | "present" | "gallery";
    description?: string;
    img?: string;
    book?: Book;
    books: Book[];
    lobby: Room;
    name: string;
    playerId?: string;
    roomId?: string;
    jobId?: string;
    galleryId?: string;
    progress: number;
    popup: "closed" | "opened" | "hidden";
}

const API_URL = process.env.REACT_APP_API_URL;

class App extends React.Component<IAppProps, IAppState> {


    constructor(props: Readonly<IAppProps>) {
        super(props);
        this.state = {
            view: "init",
            name: "",
            lobby: {
                name: "",
                players: []
            },
            books: [],
            book: {
                id: '',
                author: '',
                pages: []
            },
            progress: 0,
            popup: "hidden"
        }
        window.setInterval(() => this.refreshState(), 1000)
    }

    refreshState() {
        switch(this.state.view) {
            case "lobby":
                this.fetchLobby();
                break;
            case "waiting":
                this.waiting();
                break;
            case "present":
            case "gallery":
                this.gallery();
                break;
        }
    }

    private fetchLobby() {
        fetch(API_URL + 'room?id=' + this.state.roomId, {
            method: "GET",
        }).then(resp => resp.json().then(json => {
            this.setState(prevState => {
                const lobby = prevState.lobby;
                return {
                    lobby: {
                        ...lobby,
                        players: json.players
                    },
                    galleryId: json.galleryId,
                    view: (json.galleryId === '') ? "lobby" : "waiting"
                }
            })
        }));
    }

    private gallery() {
        if (this.state.books.length === 0) {
            fetch(API_URL + '/gallery/books?galleryId=' + this.state.galleryId, {
                method: "GET"
            }).then(resp => resp.json().then(json => {
                this.setState({
                    books: json.books
                }, () => this.gallery())
            }))
        } else {
            fetch(API_URL + '/gallery?galleryId=' + this.state.galleryId, {
                method: "GET"
            }).then(resp => resp.json().then(json => {
                this.setState(prevState => {
                    const book = prevState.books.find(b => b.id === json.active);
                    const progress = json.progress;
                    return {
                        book: book,
                        view: book ? "present" : "gallery",
                        progress
                    }
                })
            })).catch(reason => {
                console.log(reason);
            });
        }
    }

    private startGame() {
        fetch(API_URL + 'start', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({roomId: this.state.roomId})
        }).then(() => this.fetchLobby()).catch(reason => {
            console.log(reason);
        });
    }

    private waiting() {
        fetch(API_URL + 'waiting?id=' + this.state.playerId + '&roomId=' + this.state.roomId, {
            method: "GET"
        }).then(resp => resp.json().then(json => {
            if (json.job) {
                const job = json.job;
                if (job.type === "description") {
                    this.setState({
                        view: "describe",
                        img: job.contents,
                        jobId: job.jobId
                    })
                } else if (job.type === "depiction") {
                    this.setState({
                        view: "ink",
                        description: job.contents,
                        jobId: job.jobId
                    })
                } else {
                    this.setState({
                        view: "waiting"
                    })
                }
            } else if (json.complete) {
                this.setState({
                    books: [],
                }, () => this.gallery())
            } else {
                this.setState({
                    view: "waiting"
                })
            }
        })).catch(reason => {
            this.setState({
                view: "waiting"
            })
        })
    }

    completeJob(contents: string) : void {
        fetch(API_URL + 'job', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: this.state.jobId, contents: contents})
        }).then(() => this.waiting());
    }

    enterRoom(playerName: string, joinCode: string) : void {
        //TODO: Tidy up this mess of promises
        fetch(API_URL + 'player', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({playerName})
        }).then(resp => {
            resp.json().then(responseJson => {
                this.setState({
                    playerId: responseJson.id
                }, () => {
                    fetch(API_URL + 'join', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({joinCode, playerId: this.state.playerId})
                    }).then(resp => {
                        resp.json().then(responseJson => {
                            this.setState({
                                roomId: responseJson.id,
                                lobby: {
                                    name: responseJson.roomCode,
                                    players: responseJson.players,
                                },
                                view: "lobby"
                            })
                        })
                    }).catch(reason => {
                        console.log(reason);
                    });
                })
            }).catch(reason => {
                console.log(reason);
            })
        });
    }

    closePresent() {
        this.updateGallery(this.state.galleryId, '', 0);
    }

    closeGallery() {
        fetch(API_URL + 'complete', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({roomId: this.state.roomId})
        }).then(() => this.fetchLobby()).catch(reason => {
            console.log(reason);
        });
    }

    present(book : Book) {
        this.updateGallery(this.state.galleryId, book.id, 0);
    }

    private updateGallery(galleryId: string | undefined, active: string | undefined, progress: number | undefined) {
        fetch(API_URL + 'gallery', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({galleryId: galleryId, active: active, progress: progress})
        }).then(() => this.gallery()).catch(reason => {
            console.log(reason);
        });
    }

    cancel() {
        this.setState({
            popup: "closed"
        })
    }

    public render() {
        let view = this.view();
        return (<div className={"fullScreen"}>
            <ConfirmationPopup active={this.state.popup} cancel={() => this.cancel()} affirm={() => {}} question={"Do you want to return to your current game?"}/>
            {view}
        </div>);
    }

    private view() : JSX.Element {
        switch (this.state.view) {
            case "init":
                return <Entry submit={(name, roomCode) => this.enterRoom(name, roomCode)}/>
            case "waiting":
                return <Waiting/>
            case "lobby":
                return <Lobby room={this.state.lobby} submit={() => this.startGame()}/>
            case "present":
                return <Present book={this.state.book} close={() => this.closePresent()} progress={this.state.progress} updateProgress={p => this.updateGallery(this.state.galleryId, undefined, p)}/>
            case "ink":
                return <Ink prompt={this.state.description} draw={img => this.completeJob(img)}/>
            case "describe":
                return <Describe describe={d => this.completeJob(d)} img={this.state.img}/>
            case "gallery":
                return <PresentList books={this.state.books} present={book => this.present(book)} close={() => this.closeGallery()}/>
        }
    }
}

export default App;
