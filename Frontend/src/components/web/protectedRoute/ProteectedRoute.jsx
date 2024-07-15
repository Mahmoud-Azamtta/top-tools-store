import React from 'react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({children}) {

    if(localStorage.getItem("userToken") == null){
        return <Navigate to='/auth/login' /> // هاي  النافيجيت الكبوننت تستخدم في الرتيرن ستيتمنت
    }
    
  return children;
}
