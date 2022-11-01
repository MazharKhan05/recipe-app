import AuthContext from "../contexts/AuthContext";
import { useState } from "react";

function ContextWrapper({children}){
    let [catRecipes, setCatRecipes] = useState([])
    let [isRecipeCat, setIsRecipeCat]= useState(false)
    let [catVal, setCatVal] = useState("");
    let [displayModal, setDisplayModal] = useState(false);
    let [catId, setCatId] = useState(0);
    let [userRole, setUserRole] = useState("");
    // let [isAuth, setIsAuth] = useState(false)
    
    
    return (
        <AuthContext.Provider value={{catRecipes, isRecipeCat,catVal,displayModal,catId, userRole, setCatId,setDisplayModal, setCatRecipes,setCatVal, setUserRole,setIsRecipeCat}}>
            {children}
        </AuthContext.Provider>
    )
}
export default ContextWrapper;