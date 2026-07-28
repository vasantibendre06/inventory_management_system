import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import LoginPage from './pages/Login/LoginPage';
import ActivationPage from './pages/ActivationPage/ActivationPage';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Home from './pages/Home/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css'


function App() {
  return(
    <div>
      <ToastContainer/>
      <Routes>
        <Route
            path="/"
            element={
                <ProtectedRoute>
                    <Home />
                </ProtectedRoute>
            }
        />
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/activate-account" element={<ActivationPage />}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Routes>
    </div>
  )
}

export default App
