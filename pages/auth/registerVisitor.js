import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import GoogleIcon from '@mui/icons-material/Google';

import Header from "../../components/Header"

export default function registerVisitor() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter()

  const handleRegister = async (e)=>{
    e.preventDefault()
    if(email === "" || password === ""){
      toast('Please enter email and password.')
      return;
    }
    const RegisterData = {
      username: username,
      email: email,
      password: password
    }
    const registerRes = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/auth/local/register`, {
      method: "POST",
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(RegisterData)
    })

    const data = await registerRes.json();
    // console.log(data)
    if(data.error)toast(data.error.message)
    
    const uptData = {
      position: 'Visitor',
        role: {
            id: 4,
        }
    }
    const uptRes = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/users/${data.user.id}`, {  //upt the role of user after register
        method: "PUT",
        headers:{
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.jwt}`
        },
        body: JSON.stringify(uptData)
    })

    const res = await uptRes.json();
    if(data.user && res.role){
        toast('Your account has been created, please login.')
        setTimeout(()=>{
          router.push('/auth/login')
        },3000) 
    }
    if(data.error)toast(data.error.message)
  }
  return (
    <>
      <Header />
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src={`${process.env.STRAPI_BACKEND_HOST}/uploads/recipe_Logo_c4a49f7004.png?updated_at=2022-10-24T07:27:01.517Z`}
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign up as a Visitor
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
            <div>
                <label htmlFor="email-address" className="sr-only">
                  Username
                </label>
                <input
                  
                  name="username"
                  type="text"
                  onChange={e=>setUsername(e.target.value)}
                  value={username}
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  
                  name="email"
                  type="email" 
                  onChange={e=>setEmail(e.target.value)}
                  value={email}
                  autoComplete="email"
                  required
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
                  onChange={e=>setPassword(e.target.value)}
                  value={password}
                  autoComplete="current-password"
                  required
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

            <div>
              <button
                type="submit" onClick={(e)=>handleRegister(e)}
                className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                </span>
                Sign up
              </button>
            </div>
          </form>
          <a href={`${process.env.STRAPI_BACKEND_HOST}/api/connect/cognito`}>
              <button className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2">Connect to Cognito</button>
          </a>
          <a href={`${process.env.STRAPI_BACKEND_HOST}/api/connect/google`}>
              <button className="group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:ring-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2"><GoogleIcon fontSize="small" className="mr-2"/> Connect to Google</button>
          </a> 
        </div>
      </div>
      
      
    </>
  )
}
