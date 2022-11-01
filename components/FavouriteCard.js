import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { parseCookies } from "nookies";
import { getRecipeById } from '../lib/api/card';
import Link from 'next/link';

export default function FavoriteCard({id, handleFav, isFavChanged}) {
  const maxLen = 250;
  const [recipe, setRecipe]=useState({})
  const [isLoaded,setIsLoaded] = useState(false);
  
  useEffect(()=>{
    getRecipeById(id).then(res=>{
          setIsLoaded(true)
          setRecipe(res.data);

        }).catch(err=>{
          console.log(err);
        })
  },[id, isFavChanged])
  return (
    <>
      {isLoaded ? <div>
        <a href="#" className="flex flex-col items-center bg-white rounded-lg border md:flex-row md:w-xl  dark:border-gray-700 dark:bg-gray-800 mb-5">
          <img className="object-cover w-full h-96 rounded-t-lg md:h-48 md:w-48 md:rounded-none md:rounded-l-lg" src={`${process.env.STRAPI_BACKEND_HOST}${recipe.attributes && recipe.attributes.post_img.data.attributes.url}`} alt="" />
          <div className=" flex flex-col justify-between px-4 leading-normal">
            <div className='mb-2 flex items-center justify-between'>
              <h5 className=" text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{recipe.attributes.title }</h5>
              <p className='dark:text-white text-md'>Created-at: <span >{recipe.attributes.posted_on}</span></p> 
            </div>
            
            <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">{ recipe.attributes.description.length > maxLen ?
                      (<>
                      {`${recipe.attributes.description.substring(0, maxLen) }...`}
                      </>) 
                      :
                      (<>{recipe.attributes.description}</>)
                  }
            </p>
            <div className=''>
              <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleFav(id)} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 cursor-pointer hover:fill-blue-500 fill-blue-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <div className="flex justify-between items-center">
              <p className='dark:text-white text-xl'>Recipe by: <b>{recipe.attributes.recipe_creator?.data.attributes.username}</b></p>
              <Link
                    href={`/recipes/[slug]`} as={`/recipes/${recipe.attributes.slug}`}
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
        </a>

      </div> : <></>}
    </>
  )
}





