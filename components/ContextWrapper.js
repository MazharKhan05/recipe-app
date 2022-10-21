import AuthContext from "../contexts/AuthContext";
import { useState } from "react";

function ContextWrapper({children}){
    let [catRecipes, setCatRecipes] = useState([])
    let [isRecipeCat, setIsRecipeCat]= useState(false)
    let [catVal, setCatVal] = useState("");
    let [isAuth, setIsAuth] = useState(false)
    
    return (
        <AuthContext.Provider value={{catRecipes, isRecipeCat,catVal, isAuth, setCatRecipes,setCatVal,setIsRecipeCat, setIsAuth}}>
            {children}
        </AuthContext.Provider>
    )
}
export default ContextWrapper;