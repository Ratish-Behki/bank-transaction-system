import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddTransaction from "../pages/AddTransaction";
import Transactions from "../pages/Transactions";
import Settings from "../pages/Settings";
import SystemUserLogin from "../pages/SystemUserLogin"
import SystemTransfer from "../pages/SystemTransfer"
import RequestMoney from "../pages/RequestMoney";
import RequestList from "../pages/RequestList";

const AppRoutes = () => {

  return (


      <Routes>

        {/* without navbar */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/settings" element={

        <Layout>

        <Settings/>

        </Layout>

        }/>

        {/* with navbar + sidebar */}
        <Route path="/dashboard" element={

          <Layout>

            <Dashboard />

          </Layout>

        } />



        <Route path="/add-transaction" element={

          <Layout>

            <AddTransaction />

          </Layout>

        } />



        <Route path="/transactions" element={

          <Layout>

            <Transactions />

          </Layout>

        } />

        <Route path="/system-user" element={<SystemUserLogin />} />
        <Route path="/system-transfer" element={<SystemTransfer />} />

        <Route path="/request-money" element={
          <Layout>
          <RequestMoney/>
          </Layout>
          }/>
        <Route path="/request-list" element={
          <Layout>
          <RequestList/>
          </Layout>
          }/>

      </Routes>

  );

};

export default AppRoutes;