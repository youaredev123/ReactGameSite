
import socketIOClient from "socket.io-client";


export default socketIOClient(process.env.REACT_APP_SOCKET_URL);

