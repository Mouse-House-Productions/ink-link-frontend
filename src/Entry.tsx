import React, {ChangeEvent, KeyboardEvent} from "react";
import './Entry.scss';
import {faArrowLeft, faArrowRight, faQuestion, faInfo, faTimes} from '@fortawesome/free-solid-svg-icons';
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InfoPopup from "./InfoPopup";

interface EntryFormState {
    name: string;
    roomCode: string;
    infoPopup: "opened" | "closed" | "hidden";
    howToPopup: "opened" | "closed" | "hidden";
}

interface EntryFormProps {
    submit: ((name: string, roomCode: string) => void);
}

class Entry extends React.Component<EntryFormProps, EntryFormState> {

    constructor(props : EntryFormProps) {
        super(props);
        this.state = {
            name: '',
            roomCode: '',
            infoPopup: "hidden",
            howToPopup: "hidden"
        };
    }

    setName(evt : ChangeEvent<HTMLInputElement>) : void {
        const name = evt.target.value;
        this.setState({
            name
        });
    }

    setRoomCode(evt : ChangeEvent<HTMLInputElement>) : void {
        const roomCode = evt.target.value;
        this.setState({
            roomCode
        });
    }

    submit() {
        if (this.state.name.length > 0 && this.state.roomCode.length > 0) {
            this.props.submit(this.state.name, this.state.roomCode);
        }
    }

    handleKeyPress(e : KeyboardEvent) {
        if (e.key === "Enter") {
            this.submit();
        }
    }

    openInfoPopup() {
        this.setState({
            infoPopup: "opened"
        });
    }

    closeInfoPopup() {
        this.setState({
            infoPopup: "closed"
        })
    }

    openHowToPopup() {
        this.setState({
            howToPopup: "opened"
        });
    }

    closeHowToPopup() {
        this.setState({
            howToPopup: "closed"
        })
    }


    public render() {
        return (
            <div className={"Entry"}>
                <InfoPopup active={this.state.howToPopup} close={() => this.closeHowToPopup()}>
                    <div className={"row wide"}>
                        <h1>How to play</h1>
                        <div className={"spacer"}/>
                        <div className={"iconControl danger lg"} onClick={() => this.closeHowToPopup()}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </div>
                    </div>
                    <span>Ink Link is a collaborative game of depiction and description. Players take turns to describe or draw the last player's submission. Will your original idea make it to the end of the chain?</span>
                    <h4>Getting Started:</h4>
                    <span>Pick a name for yourself and agree on a room code with your friends.</span>
                    <span>Once all players are on the lobby screen, anyone can hit <div className={"iconControl success inline"}><FontAwesomeIcon icon={faArrowRight}/></div> to start the game.</span>
                    <h4>Playing:</h4>
                    <span>Each player will be asked for an initial prompt. You can pick anything you like. Remember people have to draw it, so decide how much you like your friends!</span>
                    <span>Each chain will alternate between drawing and describing and be seen once by every player.</span>
                    <h4>Gallery:</h4>
                    <span>Once all chains are complete you will be able to view the submissions in the gallery.</span>
                    <span>Nominate one player to push the buttons. The gallery will show up on everyone's devices at the same time.</span>
                    <span>Press <div className={"iconControl inline"}><FontAwesomeIcon icon={faEye}/></div> to open the chain, use <div className={"iconControl inline"}><FontAwesomeIcon icon={faArrowLeft}/></div> and <div className={"iconControl inline"}><FontAwesomeIcon icon={faArrowRight}/></div> to step through the submissions.</span>
                </InfoPopup>
                <div className={"row center"}><div className={"title rainbow large"}>Ink Link</div></div>
                <input className={"entryInput"} type={"text"} defaultValue={this.state.name} placeholder={"Name"} onChange={e => this.setName(e)} onKeyDown={e => this.handleKeyPress(e)}/>
                <input className={"entryInput"} type={"text"} defaultValue={this.state.roomCode} placeholder={"Room Code"} onChange={e => this.setRoomCode(e)} onKeyDown={e => this.handleKeyPress(e)}/>
                <div className={"controlBar"}>
                    <div onClick={() => this.openInfoPopup()} className={"iconControl info x-lg"}><FontAwesomeIcon icon={faInfo}/></div>
                    <div onClick={() => this.openHowToPopup()} className={"iconControl info x-lg"}><FontAwesomeIcon icon={faQuestion}/></div>
                    <div className={"spacer"}/>
                    <div onClick={() => this.submit()} className={"iconControl success x-lg"}><FontAwesomeIcon icon={faArrowRight}/></div>
                </div>
                <div className={"spacer"}/>
                <div className={"logo"}/>
            </div>)
    }
}

export default Entry;