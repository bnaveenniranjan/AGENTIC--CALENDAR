'use client'
import {ReactNode} from "react";

type Props ={
    sessionToken : string;
    connections : ReactNode;
    footer : ReactNode;
}

function ChatPanel ({sessionToken,connections,footer}:Props){
    return <div>
        {connections}
        {footer}
        
         </div>;
}

export default ChatPanel ;