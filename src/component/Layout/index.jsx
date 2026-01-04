import MiniDrawer from "../Drawer"
import { DrawerContextProvider } from "../drawerContext"

export const Layout = ({children})=>{

    return (
        <DrawerContextProvider>
        <MiniDrawer>{children}</MiniDrawer>
        </DrawerContextProvider>
    )
}