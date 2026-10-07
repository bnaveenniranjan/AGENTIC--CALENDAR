

export type ConnectionStatus = "connected" |"disconnected" | "pending"


export type Connection ={ 
    label : string;
    status : ConnectionStatus;
}