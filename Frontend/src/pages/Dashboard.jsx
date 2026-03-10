import { useContext } from "react"
import { AuthContext } from "../context/authContext"
export default function Dashboard(){
    const {user}=useContext(AuthContext);
    return(
        <h1>Welcome {user.name}</h1>
    )
}