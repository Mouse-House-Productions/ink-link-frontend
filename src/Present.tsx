import React from "react";
import {Book, BookEntry} from "./App";
import './Present.scss';
import {faArrowRight, faArrowLeft, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface PresentProps {
   book?: Book;
   close: (() => void);
   updateProgress: (p : number) => void;
   progress: number;
}

class Present extends React.Component<PresentProps> {

   renderBookEntry(entry : BookEntry) : JSX.Element {
      switch (entry.type) {
         case "description":
            return (<div key={entry.contents+entry.author} className={"presentCaption"}>{entry.author + ": \"" + entry.contents + "\""}</div>);
         case "depiction":
            return (<div className={"presentImage"}><img key={entry.contents} src={entry.contents} alt={"Depiction"}/><h5>by {entry.author}</h5></div>)
      }
   }

   next() {
      if (this.props.book) {
         this.props.updateProgress(Math.min(this.props.book.pages.length, this.props.progress + 1));
      }
   }

   prev() {
      this.props.updateProgress(Math.max(0, this.props.progress - 1));
   }

   public render() {
      if (this.props.book) {
         const titleText = this.props.book.author + "'s Book";
         let progress = Math.min(Math.max(this.props.progress, 0), this.props.book.pages.length);
         const es = this.props.book.pages.slice(Math.max(progress - 2, 0), progress).map(this.renderBookEntry)
         return (<div className={"Present"}>
            <div className={"row"}>
               <span className={"title rainbow"}>{titleText}</span>
               <div className={"spacer"}/>
               <div className={"iconControl danger"} onClick={() => this.props.close()}>
                  <FontAwesomeIcon icon={faTimes}/>
               </div>
            </div>
            <div className={"book"}>
               {es}
            </div>
            <div className={"controlBar centered"}>
               <div className={"iconControl"} onClick={() => this.prev()}>
                  <FontAwesomeIcon icon={faArrowLeft}/>
               </div>
               <div className={"iconControl"} onClick={() => this.next()}>
                  <FontAwesomeIcon icon={faArrowRight}/>
               </div>
            </div>
         </div>)
      } else {
         this.props.close();
         return <div/>
      }
   }
}

export default Present;