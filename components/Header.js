import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useState,useEffect } from "react";
import { logout } from "../lib/api/card";


export default function Header(){
  const route = useRouter()
  const [token, setToken] = useState("")

  
  useEffect(()=>{
    const cookies = parseCookies()
    if(cookies && cookies.jwt)setToken(cookies.jwt);
  },[])

  const handleSignout=()=>{
    if(logout())route.push('/recipes')
  }
    return (<>
      <div className=" mx-auto max-w-8xl px-4 sm:px-6">
        <div className=" flex items-center justify-between border-b-2 border-gray-100 py-4  md:space-x-2">
          <div className=" flex justify-start flex-1 ">
            <a className="mr-3" href="#">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto sm:h-10"
                src={`${process.env.STRAPI_BACKEND_HOST}/uploads/recipe_Logo_c4a49f7004.png?updated_at=2022-10-24T07:27:01.517Z`}
                alt="Logo"
              />
            </a>
            <div className=" navbar-collapse collapse grow " id="navbarSupportedContentY">
              <ul className="navbar-nav flex mr-auto">
                <li className="nav-item ">
                  <a className={`nav-link block pr-3 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600 transition duration-150 ease-in-out ${route.pathname == '/' ? 'bg-blue-600' : ''}`} href="/" data-mdb-ripple="true" data-mdb-ripple-color="light">Home</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link block pr-3 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600 transition duration-150 ease-in-out ${route.pathname == '/' ? 'bg-blue-600 text-white' : ''}`} href="/" data-mdb-ripple="true" data-mdb-ripple-color="light">Recipes</a>
                </li>
                <li className="nav-item">
                  <a className={`nav-link block pr-3 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600  transition duration-150 ease-in-out ${route.pathname == '/favourites' ? 'bg-blue-600 text-white' : ''}`}  href="/favourites" data-mdb-ripple="true" data-mdb-ripple-color="light">Favourites</a>
                </li>
                <li className="nav-item mb-2 lg:mb-0">
                  <a className="nav-link block pr-2 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600  transition duration-150 ease-in-out" href="#!" data-mdb-ripple="true" data-mdb-ripple-color="light">About</a>
                </li>
              </ul>
            </div>
          </div>
          
          {token ? (<div className=" flex items-center justify-end w-60">
            <a href="#" onClick={()=>handleSignout()} className="whitespace-nowrap px-4 py-2 text-base font-medium text-white bg-blue-500  rounded-md border border-gray-300 hover:bg-blue-600">
              LogOut
            </a>
          </div>) : (<div className=" flex items-center justify-evenly w-60">
            <a href="/auth/login" className="whitespace-nowrap px-4 py-2 text-base font-medium text-gray-500 hover:text-white hover:bg-blue-600 hover:text-white rounded-md border border-gray-300">
              Sign in
            </a>
            <a
              href="/auth/register"
              className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600"
            >
              Sign up
            </a>
          </div>)}
          
        </div>
      </div>
    </>
    )
}