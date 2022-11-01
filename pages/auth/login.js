import Header from "../../components/Header"
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import GoogleIcon from '@mui/icons-material/Google';
import LoginIcon from '@mui/icons-material/Login';
import 'react-toastify/dist/ReactToastify.css';
import {setCookie, parseCookies} from 'nookies'



export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const router = useRouter()
  const cookies = parseCookies();
  
  useEffect(()=>{
  const {username} = cookies;
  if(username !== "")setUser(username)
  },[user])

  const handleLogin = async (e)=>{
   
    e.preventDefault()
    if(email === "" || password === ""){
      toast('Please enter email and password.')
      return;
    }
    const loginData = {
      identifier: email,
      password: password
    }
    const loginRes = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/auth/local`, {
      method: "POST",
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    })

    const data = await loginRes.json();
    // console.log(data)
    if(data.error)toast(data.error.message)
    if(data.user){
      setCookie(null, 'jwt', data.jwt,{
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      setCookie(null, 'username', data.user.username,{
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      setCookie(null, 'userId', data.user.id,{
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
      })
      // setLoggedInUsr(data.user.username)
      // setIsAuth(true)
      router.push('/recipes')
    }
  }
  if(cookies.jwt){  //if jwt token exists than just redirect to /recipes
    router.push('/recipes')
  }
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="h-screen w-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={`${process.env.STRAPI_BACKEND_HOST}/uploads/recipe_Logo_c4a49f7004.png?updated_at=2022-10-24T07:27:01.517Z`}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required onChange={e=>setEmail(e.target.value)} value={email}
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required onChange={e=>setPassword(e.target.value)} value={password}
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox" 
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div>
            </div>
            <div className={`${user ? 'hidden' : 'd-block'}`}>
              <button
                type="submit" onClick={(e)=>handleLogin(e)}
                className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600   focus:ring-blue-600 focus:ring-2 focus:outline-none focus:ring-offset-2"
              >
               <LoginIcon fontSize="small" className="mr-2"/>
                Sign in
              </button>
            </div>
          </form>
          <a className={`${!user ? 'inline' : 'hidden'}`} href={`${process.env.STRAPI_BACKEND_HOST}/api/connect/cognito`}>
              <button className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2">Connect to Cognito</button>
          </a>
          <a className={`${!user ? 'inline' : 'hidden'}`} href={`${process.env.STRAPI_BACKEND_HOST}/api/connect/google`}>
              <button className="group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2"><GoogleIcon fontSize="small" className="mr-2"/> Connect to Google</button>
          </a>  
        </div>
      </div>
    </>
  )
}
