import Link  from 'next/link';
import { marked } from 'marked';
import {  Markup } from 'interweave';
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from '@mui/icons-material/Twitter';
import RedditIcon from '@mui/icons-material/Reddit';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import { useEffect, useState } from 'react';
import Header from '../../components/Header'
import { useRouter } from 'next/router';
import { handleIncDec } from '../../lib/api/card';
import CommentBox from '../../components/CommentBox';


export default function Postpage({post}) {
  let [richIng, setRichIng]=useState("");
  let [richMeth, setRichMeth]=useState("");
  let [isLike, setIsLike]= useState(false);
  let [isDislike, setIsDislike]= useState(false);
  let [likes, setLikes]=useState(0);
  let [dislikes, setDislikes]=useState(0);
  const router = useRouter();
  
  useEffect(()=>{
    const getRichText=(richText)=>{
      if(richText == "")return;
      const parsedTxt = marked.parse(richText);
      let styledRichTxt = parsedTxt.replaceAll('<ul>', "<ul style='padding-left: 15px; list-style-type: circle;'>")
      styledRichTxt = styledRichTxt.replaceAll('<h4>', "<h4 style='font-weight:bold;'>")

      // console.log(styledRichTxt)
      return styledRichTxt;
    }
    setRichIng(getRichText(post.attributes.ingredients));
    setRichMeth(getRichText(post.attributes.method));
  },[])

  const recipePublishedAt = new Date(post.attributes.publishedAt)
  console.log(recipePublishedAt.getFullYear(),'-',recipePublishedAt.getMonth(),'-',recipePublishedAt.getDate())
  const handleLikes=(id, noLikes)=>{
    const uptBody={
      title: post.attributes.title,
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
      title: post.attributes.title,
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
  const handleRecipeSharing=(e)=>{
    e.preventDefault();
    navigator.share({
      title: post.attributes.title,
      url: `${process.env.STRAPI_FRONTEND_HOST}/recipes/${post.attributes.slug}`,
    })
    .then(() => console.log("Successful share"))
    .catch((error) => console.log("Error sharing", error));
  }
  return (
    <div className="">
      <Header />
      <div className="container md:px-0 px-3  mx-auto mb-8 space-y-6 py-3">
        <Link
          href='/recipes'
          
        >
          <div className="cursor-pointer inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg
            className=" mr-2 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              d="M15.41 16.09L10.83 11.5L15.41 6.91L14 5.5L8 11.5L14 17.5L15.41 16.09Z"
              clip-rule="evenodd"
            ></path>
          </svg>
          BACK
          </div>
        </Link>
        
        <div className="w-full flex justify-between items-center gap-4 mb-10 h-20" >
            <div className='w-1/2 flex items-center justify-start'>
              <h1 className="w-fit md:text-3xl font-semibold text-xl mr-1">{post.attributes.title}</h1>
              <div className='p-2 w-fit flex items-center justify-evenly shadow-lg rounded-lg bg-gray-100'>
                <div className='w-fit  flex justify-evenly items-center mr-2'>
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleLikes(post.id, post.attributes.noLikes)} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`md:w-7 h-7 w-6 h-6 cursor-pointer hover:fill-blue-500 ${isLike ? "fill-blue-500" : ""}`}>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                    <span className='ml-1 md:text-sm text-xs'>{isLike ? likes : post.attributes.noLikes}</span>
                </div>
                <div className='w-fit flex justify-between items-center  '>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={()=>handleDislikes(post.id, post.attributes.noDislikes)} fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`md:w-7 h-7 w-6 h-6 cursor-pointer hover:fill-blue-500 ${isDislike ? "fill-blue-500" : ""}`}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                  </svg>
                  <span className='ml-1 md:text-sm text-xs'>{isDislike ? dislikes : post.attributes.noDislikes}</span>
                </div>
              </div>
            </div>
            <div className='flex flex-col justify-evenly h-full'>
              <p className='text-black md:text-lg text-sm'>Created-at: <span >{post.attributes.posted_on}</span></p>  
              <p className='text-black md:text-xl text-md'>Recipe by: <b>{post.attributes.recipe_creator?.data.attributes.username}</b></p>
            </div> 
        </div>
        <figure className="relative overflow-hidden shadow-md mb-10">
          <img
            src={`${process.env.STRAPI_BACKEND_HOST}${post.attributes.post_img.data.attributes.url}`}
            alt={post.attributes.title}
            className="object-top h-full w-full object-cover shadow-lg rounded-t-lg lg:rounded-lg"
          />
        </figure>
        <p>{post.attributes.description}</p>
        <div className=''>
          <p className=' text-center text-2xl font-semi-bold underline underline-offset-2 text-sky-600 p-0.5' >Recipe</p>
          <div className='mt-4 leading-8' >
            <p className='text-2xl font-light'>Ingredients</p>
            <hr className='mt-2 mb-2' />
            <div ><Markup content={richIng}/> </div>
                       
          </div>
          <div className='mt-5' >
            <p className='text-2xl font-light'>Method</p>
            <hr className='mt-2 mb-2' />
            <Markup content={richMeth} className='leading-7' />
          </div>

        </div>
        <div className='w-fit shadow-lg rounded-lg bg-gray-100 p-4'>
          <h4 className='text-lg'>Share recipe on social-media</h4> 
          <a href={`https://www.linkedin.com/sharing/share-offsite/?url=https://feed-103-121-240-104.in.ngrok.io/recipes/${post.attributes.slug}`} target="_blank"><LinkedInIcon className='cursor-pointer hover:shadow-md' style={{color: '#0a66c2',marginRight: '7px'}} fontSize={'large'} /></a>
          <a href={`https://www.facebook.com/sharer.php?u=https://feed-103-121-240-104.in.ngrok.io/recipes/${post.attributes.slug}`} target="_blank"><FacebookIcon className='cursor-pointer hover:shadow-md' style={{color: '#3b5898',marginRight: '7px'}} fontSize={'large'} /></a>
          <a href={`https://twitter.com/intent/tweet?url=https://feed-103-121-240-104.in.ngrok.io/recipes/${post.attributes.slug}&text=${post.attributes.title}`} target="_blank"><TwitterIcon className='cursor-pointer hover:shadow-md' style={{color: '#00aced',marginRight: '7px'}} fontSize={'large'} /></a>
          <a href={`https://www.reddit.com/submit?url=https://feed-103-121-240-104.in.ngrok.io/recipes/${post.attributes.slug}&title=${post.attributes.title}`} target="_blank"><RedditIcon  className='cursor-pointer hover:shadow-md' style={{color: '#FF4301',marginRight: '7px'}} fontSize={'large'} /></a>
          <a href={`mailto:?subject=${post.attributes.title}&body=https://feed-103-121-240-104.in.ngrok.io/recipes/${post.attributes.slug}`} target="_blank"><MailOutlineIcon className='cursor-pointer hover:shadow-md' style={{color: '#00aced'}}/></a>
        </div>
        <CommentBox postId={post.id} />
      </div>
    </div>
  )
}


export const getServerSideProps = async (context) => {
  const {slug} = context.query
  const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/posts?populate[recipe_creator][data][attributes][4]&populate[post_img][data][attributes][14]&filters[slug][$eq]=${slug}`)
  const post = await res.json()

      return {
        props: {post: post.data[0]},
      }

}

