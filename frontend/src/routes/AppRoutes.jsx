import { Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import AddTransaction from "../pages/AddTransaction";
import Transactions from "../pages/Transactions";

const AppRoutes = () => {

  return (

      <Routes>

        {/* without navbar */}
        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />



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



      </Routes>

  );

};

export default AppRoutes;