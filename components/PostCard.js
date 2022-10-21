import { useContext, useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { ToastContainer, toast } from 'react-toastify';
import  Link  from 'next/link';
import { getPrevFav, handleFavourite, handleIncDec } from '../lib/api/card';
import { useRouter } from 'next/router';


export default function PostCard({p}) {  
  console.log(p)  
    const maxLen = 350;
    const titleLen = 20;
    const router = useRouter();
    let [isLike, setIsLike]= useState(false);
    let [isDislike, setIsDislike]= useState(false);
    let [likes, setLikes]=useState(0);
    let [dislikes, setDislikes]=useState(0);
    let [prevFavs, setPrevFavs]=useState([])
    let [isFav, setIsFav]=useState(false);
    const cookies = parseCookies();
    useEffect(()=>{ //get all prevFav for loggedIn user
        let ans=[]
        const {jwt} = cookies;
        if(jwt){
          const result = getPrevFav(jwt);
          result.then(res=>{
            if(res.favourites.length > 0){
              res.favourites.forEach(fav => {
                const currId = parseInt(fav.id);
                ans.push(currId)
              });
              setPrevFavs(ans);
              
              if(ans.length > 0){
                const exisFav = ans.find(fav=> fav === parseInt(p.id))
                if(exisFav !== undefined)setIsFav(true);
              }
            }
          }).catch(err=>{
            console.log(err);
          })
        }
        
      
    },[])
    const handleLikes=(id, noLikes)=>{

      const uptBody={
        title: p.attributes.title,
        noLikes: (parseInt(noLikes)) + 1
      }
      const results = handleIncDec(id, uptBody);
      results.then(res=>{
        setIsLike(true);
        setLikes(res.data.attributes.noLikes)
      }).catch(err=>{
        console.log(err)
      })
    }
    const handleDislikes=(id, noDislikes)=>{  
      
      const uptBody={
        title: p.attributes.title,
        noDislikes: (parseInt(noDislikes)) + 1
      }
      const results = handleIncDec(id, uptBody);
      results.then(res=>{
        setIsDislike(true);
        setDislikes(res.data.attributes.noDislikes)
      }).catch(err=>{
        console.log(err)
      })
    }
    const handleFav = async ()=>{
        const {jwt, userId, username} = cookies;
        const uptBody={
          username: "",
          favourites:  []
        }
        if(!jwt){
          return;
        }   
        const exisFav = prevFavs.find(fav=> fav === parseInt(p.id))
        if(exisFav === undefined){  //mark fav for first Time
          prevFavs.push(parseInt(p.id)) //push new fav into existing favLists
          // console.log('new newFavs', prevFavs)
          uptBody.username = username
          uptBody.favourites = prevFavs
          const response = handleFavourite(userId, uptBody, jwt)  //make req to add recipe to favourites
          response.then(res=>{
            setIsFav(true)
          }).catch(err=>{
            console.log(err);
          })
        }else{
          const targetFav = prevFavs.findIndex((fav)=> (fav === parseInt(p.id))) //recipe to remove
          const remFav = prevFavs.splice(targetFav, 1);
          uptBody.username = username
          uptBody.favourites = prevFavs
          const response = handleFavourite(userId, uptBody, jwt)  //make req to add recipe to favourites
          response.then(res=>{
            setIsFav(false)
          }).catch(err=>{
            console.log(err);
          })

        }
    }
    return (
      <>
        <div
              key={p.id}
              className=" max-w-md bg-white rounded-lg  dark:bg-gray-800 dark:border-gray-700 gap-2 test"
            >
              
              <img className="h-80 rounded-md" style={{ width: '100%', objectFit: "cover"}} src={`http://localhost:1337${p.attributes.post_img.data.attributes.url}`} alt={p.attributes.title} />
              <div className='p-3'>
                <div className=' flex justify-between '>
                  <Link className='w-fit'  href={`/recipes/[slug]`} as={`/recipes/${p.attributes.slug}`}>
                    <h1 className="cursor-pointer mb-2 text-2xl ml-3 font-bold tracking-tight text-gray-900 dark:text-white">
                      {p.attributes.title.length > titleLen ?
                        (<>
                        {`${p.attributes.title.substring(0, titleLen)}...`}
                        </>) 
                        :
                        (<>{p.attributes.title}</>) 
                      }
                    </h1>
                  </Link>
                  <div className='flex justify-between items-center w-40 text-blue-500 pb-1 '>
                    <div className=''>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleFav()} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-5 h-5 cursor-pointer hover:fill-blue-500 ${isFav ? "fill-blue-500" : ""}`}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>

                    </div>
                    <div className='w-full  flex items-center justify-evenly'>
                      <div className='w-fit  flex justify-between items-center '>
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleLikes(p.id, p.attributes.noLikes)} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-6 h-6 cursor-pointer hover:fill-blue-500 ${isLike ? "fill-blue-500" : ""}`}>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                        </svg>
                        <span className='ml-1 text-xs'>{isLike ? likes : p.attributes.noLikes}</span>
                      </div>
                      <div className='w-fit flex justify-between items-center  '>
                        <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleDislikes(p.id, p.attributes.noDislikes)} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`w-6 h-6 cursor-pointer hover:fill-blue-500 ${isDislike ? "fill-blue-500" : ""}`}>
                          <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                        </svg>
                        <span className='ml-1 text-xs'>{isDislike ? dislikes : p.attributes.noDislikes}</span>
                      </div>
                    </div>
                    
                  </div>
                </div>
                <h3 className="mb-3 font-normal ml-3 text-gray-700 dark:text-gray-400">
                  
                  {p.attributes.description.length > maxLen ?
                      (<>
                      {`${p.attributes.description.substring(0, maxLen)}...`}
                      </>) 
                      :
                      (<>{p.attributes.description}</>)
                  }
                </h3>
                <div className="flex justify-between items-center">
                  <div className="flex justify-between items-center gap-2">
                    <p className='text-white'>Recipe-Creator: <b>{p.attributes.creator.data.attributes.username}</b></p>
                  </div>
                  <Link
                    href={`/recipes/[slug]`} as={`/recipes/${p.attributes.slug}`}
                  >
                    <div className='cursor-pointer inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
                      Read more
                      <svg
                        className="ml-2 -mr-1 w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        >
                        </path>
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
      </>
    );
  }