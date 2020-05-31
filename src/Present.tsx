import React from "react";
import {BookEntry} from "./App";
import './Present.scss';
import {faArrowRight, faArrowLeft, faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface PresentProps {
   book: BookEntry[];
   close: (() => void);
}

interface PresentState {
   progress: number;
}

class Present extends React.Component<PresentProps, PresentState> {

   constructor(props : PresentProps) {
      super(props);
      this.state = {
         progress: 0
      }
   }

   renderBookEntry(entry : BookEntry) : JSX.Element {
      switch (entry.type) {
         case "description":
            return (<div key={entry.contents+entry.author} className={"presentCaption"}>{entry.author + ": \"" + entry.contents + "\""}</div>);
         case "depiction":
            return (<div className={"presentImage"}><img key={entry.contents} src={entry.contents} alt={"Depiction"}/><h5>by {entry.author}</h5></div>)
      }
   }

   next() {
      this.setState((state) => {
         return {
            progress: Math.min(this.props.book.length, state.progress + 1)
         }
      })
   }

   prev() {
      this.setState((state) => {
         return {
            progress: Math.max(0, state.progress - 1)
         }
      })
   }

   public render() {
      const titleText = this.props.book[0].author + "'s Book";
      const es = this.props.book.slice(Math.max(this.state.progress - 2, 0), this.state.progress).map(this.renderBookEntry)
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
   }
}

export default Present;