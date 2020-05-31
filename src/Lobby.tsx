import React from 'react';
import './Lobby.css';
import {faArrowRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface Player {
    name: string,
    uuid: string
}

interface LobbyState {
}

interface LobbyProps {
    name: string;
    players: Player[];
    submit: (() => void);
}

class Lobby extends React.Component<LobbyProps, LobbyState> {

    renderPlayer(player: Player) : JSX.Element {
        return <div key={player.uuid}><h4>{player.name}</h4></div>;
    }

    public render() {
        const players = this.props.players.map(this.renderPlayer);
        return (<div className={"Lobby"}>
            <div className={"row center"}><div className={"title rainbow"}>Lobby {this.props.name}</div></div>
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