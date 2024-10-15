import React from "react";
import axios from "axios";
import config from "../../config";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Logout() {

    const handleLogout = async () => {

        try{

        const response = await axios.post(`${config.API_URL}/logout`,{
            withCredentials: true,
        });

        if(!response){ 
            return res.status(404).send('something went wrong');
        }

    }
    catch(error){
        console.error('something went wrong', error);
    }

}

return(
    <button onClick={handleLogout} className="btn btn-danger">
    Logout
</button>
)
}