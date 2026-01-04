import { createContext, useContext, useMemo, useState } from "react";
import { drawerList } from "../../Constants/drawerconstants";

const DrawerContext = createContext(undefined); 
export const DrawerContextProvider = ({children})=>{
    const [open,setIsOpened] = useState(false)
    const toggleIsOpened = () => setIsOpened(prev => !prev);

    const value = useMemo(()=>({
        open,
        toggleIsOpened,
        menu:drawerList
    })
, [open])
return(
    <DrawerContext.Provider value={value}>
        {children}
    </DrawerContext.Provider>
)
}
export const useDrawerContext=()=>{
    const constext = useContext(DrawerContext);
    if(constext === undefined){
        throw new Error(
            "use dreaer context"
        );
    }
    return constext;
}