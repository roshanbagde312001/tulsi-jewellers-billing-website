import { Route, Routes } from "react-router-dom";
import './App.css';
import Bill from "./component/Bill";
import { Layout } from './component/Layout';
import { GetBills } from "./component/SavedBills";
function App() {
  return (
    
   <Layout>
    <Routes>
      <Route path="/generateBill" element={<Bill/>}></Route>
      <Route path="/Bills" element={<GetBills/>}></Route>
    </Routes>
   </Layout>
  );
}

export default App;
