import React from 'react';
import './Lobby.css';
import {faArrowRight, faDownload, faTimes} from "@fortawesome/free-solid-svg-icons";
import {faImages} from "@fortawesome/free-regular-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InfoPopup from "./InfoPopup";

export interface Player {
    name: string,
    id: string
}

interface LobbyState {
    prevGamesPopup: "opened" | "closed" | "hidden";
}

export interface Room{
    name: string;
    players: Player[];
    galleries: string[];
}

export interface LobbyProps {
    room: Room;
    submit: (() => void);
    download: (galleryId: string) => void;
    leave: () => void;
}

class Lobby extends React.Component<LobbyProps, LobbyState> {

    constructor(props : LobbyProps) {
        super(props);
        this.state = {
            prevGamesPopup: 'hidden'
        }
    }

    renderPlayer(player: Player) : JSX.Element {
        return <div key={player.id}><h4>{player.name}</h4></div>;
    }

    closePrevGamesPopup() {
        this.setState({
            prevGamesPopup: 'closed'
        })
    }

    openPrevGamesPopup() {
        this.setState({
            prevGamesPopup: 'opened'
        })
    }

    public render() {
        const rounds : JSX.Element[] = [];
        for (let i = 0; i < this.props.room.galleries.length; i++) {
            rounds.push(
                <div key={'round_button_'+i} className={"row wide"}>
                    <h4>Round {i + 1}</h4>
                    <div className={"spacer"}/>
                    <div className={"iconControl info"} onClick={() => this.props.download(this.props.room.galleries[i])}><FontAwesomeIcon icon={faDownload}/></div>
                </div>
            );
        }

        const buttons : JSX.Element[] = [];

        if (this.props.room.galleries.length > 0) {

            buttons.push(<div key={'show_prev_games'} className={"iconControl info lg"} onClick={() => this.openPrevGamesPopup()}>
                <FontAwesomeIcon icon={faImages}/>
            </div>)
        }
        buttons.push(<div key={'start_game'} className={"iconControl success lg"} onClick={() => this.props.submit()}>
            <FontAwesomeIcon icon={faArrowRight}/>
        </div>)

        const players = this.props.room.players.map(this.renderPlayer);
        return (<div className={"Lobby"}>
            <InfoPopup active={this.state.prevGamesPopup} close={() => this.closePrevGamesPopup()}>
                <div className={"row wide"}>
                    <h1>Previous Games</h1>
                    <div className={"spacer"}/>
                    <div className={"iconControl danger lg"} onClick={() => this.closePrevGamesPopup()}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </div>
                </div>
                {rounds}
            </InfoPopup>
            <div className={"row"}><div className={"title rainbow"}>Lobby {this.props.room.name}</div><div className={"spacer"}/><div className={"iconControl danger"} onClick={() => this.props.leave()}><FontAwesomeIcon icon={faTimes}/></div></div>
            <div className={"list"}>
                {players}
            </div>
            <div className={"controlBar"}>
                {buttons}
            </div>
        </div>)
    }
}

export default Lobby;