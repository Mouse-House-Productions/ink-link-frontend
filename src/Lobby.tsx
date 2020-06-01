import React from 'react';
import './Lobby.css';
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface Player {
    name: string,
    id: string
}

interface LobbyState {
}

export interface Room{
    name: string;
    players: Player[];
}

export interface LobbyProps {
    room: Room;
    submit: (() => void);
}

class Lobby extends React.Component<LobbyProps, LobbyState> {

    renderPlayer(player: Player) : JSX.Element {
        return <div key={player.id}><h4>{player.name}</h4></div>;
    }

    public render() {
        const players = this.props.room.players.map(this.renderPlayer);
        return (<div className={"Lobby"}>
            <div className={"row center"}><div className={"title rainbow"}>Lobby {this.props.room.name}</div></div>
            <div className={"list"}>
                {players}
            </div>
            <div className={"controlBar"}>
                <div className={"iconControl success"} onClick={() => this.props.submit()}>
                    <FontAwesomeIcon icon={faArrowRight}/>
                </div>
            </div>
        </div>)
    }
}

export default Lobby;