import React from "react";
import {Book} from "./App";
import {faEye} from '@fortawesome/free-regular-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faDownload} from "@fortawesome/free-solid-svg-icons";
import './PresentList.scss';

interface PresentListProps {
    books: Book[];
    present: (book: Book) => void;
    close: () => void;
    download: () => void;
}

class PresentList extends React.Component<PresentListProps, any> {

    present(book: Book) {
        this.props.present(book);
    }

    private renderBook(book: Book) : JSX.Element {
        return <div key={book.id} className={"row"}><span>{book.author}</span><div className={"spacer"}/><div className={"iconControl"} onClick={() => this.present(book)}><FontAwesomeIcon icon={faEye}/></div></div>
    }

    render() {
        const books = this.props.books.map(b => this.renderBook(b));
        return <div className={"PresentList"}>
            <div className={"row"}>
                <span className={"title"}>Gallery</span>
                <div className={"spacer"}/>
                <div className={"iconControl danger"} onClick={() => this.props.close()}>
                    <FontAwesomeIcon icon={faTimes}/>
                </div>
            </div>
            <div className={"books"}>
                {books}
                <div className={"row"}><div className={"spacer"}/><div className={"iconControl info"} onClick={() => this.props.download()}><FontAwesomeIcon icon={faDownload}/></div></div>
            </div>
        </div>;
    }
}

export default PresentList;