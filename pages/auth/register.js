import { useRouter } from "next/router";
import { useContext, useState } from "react";
import Header from "../../components/Header"
import AuthContext from '../../contexts/AuthContext'
import registerCreator from "./registerCreator";
import registerVisitor from "./registerVisitor";


export default function Register() {
  const {userRole, setUserRole} = useContext(AuthContext)
  const router = useRouter()
  console.log(userRole)
  return (
    <>
      <Header />
      {userRole != "" ? userRole === "Creator" ? <registerCreator /> : <registerVisitor />
       : 
      <div className="h-screen mx-2 flex justify-center items-center">
        <div className="p-6 shadow-lg h-max rounded-lg bg-gray-100 text-gray-700">
          <h2 className="font-semibold text-3xl mb-4">Please register using a user role.</h2>
            <a href='/auth/registerCreator'>
                <button onClick={()=> setUserRole("Creator")} className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Register as Recipe creator</button>
            </a>
            <a href='/auth/registerVisitor'>
                <button onClick={()=> setUserRole("Visitor")} className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Register as visitor</button>
            </a>
        </div>
      </div>}
      
    </>
  )
}
