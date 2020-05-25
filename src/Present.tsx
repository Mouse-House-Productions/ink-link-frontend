import React from "react";
import {BookEntry} from "./App";
import './Present.css';
import {faArrowRight, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

interface PresentProps {
   book: BookEntry[];
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
      if (entry.type === "description") {
         return (<div>{entry.contents}</div>);
      } else if (entry.type === "depiction") {
         return (<div><img key={entry.contents} className={"presentImage"} src={entry.contents} alt={"Depiction"}/></div>)
      } else {
         throw new Error("Unable to render book entry");
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
      const es = this.props.book.slice(0, this.state.progress).map(this.renderBookEntry);
      return (<div className={"fullScreen present"}>
         <div className={"book"}>
            {es}
         </div>
         <div className={"presentControls"}>
            <div className={"presentControl"} onClick={() => this.prev()}>
               <FontAwesomeIcon icon={faArrowLeft}/>
            </div>
            <div className={"presentControl"} onClick={() => this.next()}>
               <FontAwesomeIcon icon={faArrowRight}/>
            </div>
         </div>
      </div>)
   }
}

export default Present;