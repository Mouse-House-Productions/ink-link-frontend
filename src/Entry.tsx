import React, {ChangeEvent} from "react";
import './Entry.scss';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface EntryFormState {
    name: string;
    roomCode: string;
}

interface EntryFormProps {
    submit: ((name: string, roomCode: string) => void);
}

class Entry extends React.Component<EntryFormProps, EntryFormState> {

    constructor(props : EntryFormProps) {
        super(props);
        this.state = {
            name: '',
            roomCode: ''
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
    public render() {
        return (
            <div className={"Entry"}>
                <div className={"row center"}><div className={"title rainbow large"}>Ink Link</div></div>
                <input className={"entryInput"} type={"text"} defaultValue={this.state.name} placeholder={"Name"} onChange={e => this.setName(e)}/>
                <input className={"entryInput"} type={"text"} defaultValue={this.state.roomCode} placeholder={"Room Code"} onChange={e => this.setRoomCode(e)}/>
                <div className={"row row-reverse"}><div onClick={() => this.submit()} className={"iconControl success"}><FontAwesomeIcon icon={faArrowRight}/></div></div>
                <div className={"spacer"}/>
                <div className={"logo"}/>
            </div>)
    }
}

export default Entry;