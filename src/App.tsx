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
import {reactLocalStorage} from 'reactjs-localstorage';

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
    savedPlayerId?: string;
    savedRoomId?: string;
    savedRoomName?: string;
    savedPicture?: string;
}

const API_URL = process.env.REACT_APP_API_URL;

const PLAYER_ID_LOCAL_KEY = 'playerId';
const ROOM_ID_LOCAL_KEY = 'roomId';
const ROOM_NAME_LOCAL_KEY = 'roomCode';
const PICTURE_BACKUP_KEY = 'pictureBackup';

class App extends React.Component<IAppProps, IAppState> {


    constructor(props: Readonly<IAppProps>) {
        super(props);
        const savedPlayerId = reactLocalStorage.get(PLAYER_ID_LOCAL_KEY);
        const savedRoomId = reactLocalStorage.get(ROOM_ID_LOCAL_KEY);
        const savedPicture = reactLocalStorage.get(PICTURE_BACKUP_KEY);
        const savedRoomName = reactLocalStorage.get(ROOM_NAME_LOCAL_KEY);
        this.state = {
            view: "init",
            name: "",
            lobby: {
                name: "",
                players: [],
                galleries: []
            },
            books: [],
            book: {
                id: '',
                author: '',
                pages: []
            },
            progress: 0,
            popup: "hidden",
            savedPlayerId,
            savedRoomId,
            savedPicture,
            savedRoomName
        }
        window.setInterval(() => this.refreshState(), 1000)
    }

    componentDidMount() {
        if (this.state.savedRoomId) {
            this.checkLobby();
        }
    }

    refreshState() {
        if (this.state.playerId) {
            fetch(API_URL + 'checkin', {
                method: "POST",
                headers: {
                    "X-InkLink-UserId": this.state.playerId
                }
            }).then(r => {});
        }
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
                        players: json.players,
                        galleries: json.galleries
                    },
                    galleryId: json.galleryId,
                    view: (json.galleryId === '') ? "lobby" : "waiting"
                }
            })
        }));
    }

    private checkLobby() {
        fetch(API_URL + 'room?id=' + this.state.savedRoomId, {
            method: "GET"
        }).then(resp => {
            if (resp.ok) {
                this.setState({
                    popup: "opened"
                })
            } else {
                this.setState({
                        savedPicture: undefined,
                        savedRoomName: undefined,
                        savedRoomId: undefined,
                        savedPlayerId: undefined
                    }, () => {
                        localStorage.removeItem(PICTURE_BACKUP_KEY);
                        localStorage.removeItem(PLAYER_ID_LOCAL_KEY);
                        localStorage.removeItem(ROOM_ID_LOCAL_KEY);
                        localStorage.removeItem(ROOM_NAME_LOCAL_KEY);
                    }
                )
            }
        })
    }

    private gallery() {
        if (this.state.books.length === 0) {
            fetch(API_URL + 'gallery/books?galleryId=' + this.state.galleryId, {
                method: "GET"
            }).then(resp => resp.json().then(json => {
                this.setState({
                    books: json.books
                }, () => this.gallery())
            }))
        } else {
            fetch(API_URL + 'gallery?galleryId=' + this.state.galleryId, {
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
        }).then(() => {
            this.setState({
                savedPicture: undefined
            }, () => {
                reactLocalStorage.remove(PICTURE_BACKUP_KEY);
                this.waiting()
            });
        });
    }

    leaveRoom() : void {
        const playerId = this.state.playerId;
        this.setState({
            view: "init",
            roomId: undefined,
            playerId: undefined,
            jobId: undefined,
            savedPicture: undefined,
            savedPlayerId: undefined,
            savedRoomId: undefined,
            savedRoomName: undefined
        }, () => fetch(API_URL + 'leave', {
            method: "POST",
            body: JSON.stringify({playerId})
        }))
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
                reactLocalStorage.set(PLAYER_ID_LOCAL_KEY, responseJson.id);
                reactLocalStorage.remove(PICTURE_BACKUP_KEY); //We're a new player so make sure we throw away any backed up drawings
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
                            reactLocalStorage.set(ROOM_ID_LOCAL_KEY, responseJson.id);
                            reactLocalStorage.set(ROOM_NAME_LOCAL_KEY, responseJson.roomCode);
                            this.setState({
                                roomId: responseJson.id,
                                lobby: {
                                    name: responseJson.roomCode,
                                    players: responseJson.players,
                                    galleries: []
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

    declineRejoin() {
        this.setState({
            popup: "closed"
        })
    }

    acceptRejoin() {
        this.setState(prevState => {
            return {
                view: "lobby",
                popup: "closed",
                roomId: prevState.savedRoomId,
                playerId: prevState.savedPlayerId,
                lobby: {
                    name: prevState.savedRoomName ? prevState.savedRoomName : '',
                    galleries: [],
                    players: []
                },
                savedPlayerId: undefined,
                savedRoomId: undefined,
                savedRoomName: undefined,
                savedPicture: undefined,
            }
        });
    }

    saveDrawing(img: string) {
        reactLocalStorage.set(PICTURE_BACKUP_KEY, img);
    }

    downloadGallery(galleryId?: string) {
        const id = (galleryId) ? galleryId : this.state.galleryId;
        if (id) {
            fetch(API_URL + 'gallery/download?galleryId=' + id, {
                method: "GET",
                headers: {
                    'Accept': 'text/html; charset=UTF-8'
                }
            }).then(resp => resp.blob().then(b => {
                const date = new Date();
                const anchor = document.createElement('a');
                anchor.href = URL.createObjectURL(b);
                anchor.download = 'inklink-' + date.getDate().toString().padStart(2, '0') + date.getMonth().toString().padStart(2, '0') + date.getFullYear() + '-' + date.getHours().toString().padStart(2, '0') + date.getMinutes().toString().padStart(2, '0') + '.html';
                anchor.click();
            }));
        }
    }

    public render() {
        let view = this.view();
        return (<div className={"fullScreen"}>
            <ConfirmationPopup active={this.state.popup} cancel={() => this.declineRejoin()} affirm={() => this.acceptRejoin()} question={"Do you want to return to your current game?"}/>
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
                return <Lobby room={this.state.lobby} submit={() => this.startGame()} download={id => this.downloadGallery(id)} leave={() => this.leaveRoom()}/>
            case "present":
                return <Present book={this.state.book} close={() => this.closePresent()} progress={this.state.progress} updateProgress={p => this.updateGallery(this.state.galleryId, undefined, p)}/>
            case "ink":
                return <Ink key={"ink" + this.state.jobId} prompt={this.state.description} draw={img => this.completeJob(img)} save={img => this.saveDrawing(img)} saved={this.state.savedPicture}/>
            case "describe":
                return <Describe key={"describe" + this.state.jobId} describe={d => this.completeJob(d)} img={this.state.img}/>
            case "gallery":
                return <PresentList books={this.state.books} present={book => this.present(book)} close={() => this.closeGallery()} download={() => this.downloadGallery()}/>
        }
    }
}

export default App;
