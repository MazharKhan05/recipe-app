import Header from "../../components/Header"
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { parseCookies } from "nookies";
import FavoriteCard from "../../components/FavouriteCard";
import { getPrevFav, handleFavourite } from "../../lib/api/card";

export default function Favourite() {
  let [prevFavs, setPrevFavs]=useState([])
  let [isFavChanged, setIsFavChanged] = useState(false)
  let [cookie, setCookie] = useState({})
  let [isloaded, setIsloaded]=useState(false)
  const cookies = parseCookies()
  const router = useRouter()
  
  useEffect(()=>{
        const {jwt} = cookies;
        setCookie(cookies); //set cookie to state var, in order to use it in future
        if(cookie)setIsloaded(true);    //check if cookie is ready to be presented
        if(jwt){
          const result = getPrevFav(jwt);
          result.then(res=>{
            if(res.favourites.length > 0){
              setPrevFavs(res.favourites);
            }
          }).catch(err=>{
            console.log(err);
          })
        }  
  },[])

  const handleFav = async (id)=>{
    const {jwt, userId, username} = cookies;
    const uptBody={
      username: "",
      favourites:  []
    }
    if(!jwt)return;   //need to be looked upon
    const targetFav = prevFavs.findIndex((fav)=> (parseInt(fav.id) === parseInt(id))) //recipe to remove
    const remFav = prevFavs.splice(targetFav, 1);
    uptBody.username = username
    uptBody.favourites = prevFavs
    const response = handleFavourite(userId, uptBody, jwt)  //make req to add recipe to favourites
    response.then(res=>{
      setIsFavChanged(true)
    }).catch(err=>{
      console.log(err);
    })
}
  if(!cookie.jwt){
    return (
      <>
      <Header />
      <div className="h-screen mx-2 flex justify-center items-center">
        <div className="p-6 shadow-lg h-max rounded-lg bg-gray-100 text-gray-700">
          <h2 className="font-semibold text-3xl mb-4">Please login to see your favourite recipes</h2>
            <a href='/auth/login'>
                <button className="mb-3 group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Go to login</button>
            </a>
        </div>
      </div>
      </>
    )
  }  
  return (
    <>
      <Header />
      {isloaded ? <><div className="px-5 mt-3">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Your Favourites.
        </h2>
      </div>
      <div className="md:flex md:flex-col flex-wrap md:justify-center md:items-center mt-8 px-4 overflow-hidden">
        {prevFavs.length > 0 ? prevFavs.map(fav=>
          (<FavoriteCard id={fav.id} handleFav={handleFav} isFavChanged={isFavChanged} />)
        ) : <><h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
        No favourite recipes found.
      </h2></>}
      </div></> : <div className="px-4 h-96 flex flex-col justify-center items-center">
          <h4 className="text-xl font-bold leading-7 text-gray-900 sm:truncate md:text-3xl sm:tracking-tight mb-3">Please Sign-In to access favourites.</h4>
          <a href="/auth/login" className="whitespace-nowrap px-4 py-2 text-base font-medium text-gray-500 hover:text-white hover:bg-blue-600 hover:text-white rounded-md border border-gray-300">
              Sign in
          </a>
        </div>}
      
    </>
  )
}
