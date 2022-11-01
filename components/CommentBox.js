import { useEffect, useState } from 'react';
import { parseCookies } from 'nookies';
import { createComment, getCommentsByRecipe } from '../lib/api/card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function CommentBox({postId}){
    const [commDesc, setCommDesc] = useState("");
    const [comments, setComments] = useState([])
    const [reload, setReload] = useState(false)
    const [token, setToken] = useState("")
    const cookies = parseCookies()

    useEffect(()=>{
        const jwt = cookies.jwt
        setToken(jwt);
        if(jwt && jwt !== ""){
            getCommentsByRecipe(jwt, postId).then(res=>{
                setComments(res.data)
            }).catch(err=>{
                console.log(err)
            })
        }
    },[reload])
    const handleComment = (e)=>{
        e.preventDefault()
        const jwt = cookies.jwt;
        const commBody ={
            description: commDesc,
            user: cookies.userId,
            post: postId
        }
        setCommDesc("");
        createComment(jwt, commBody).then(res=>{
            toast('Comment posted successfully.')
            setReload(true)
        }).catch(err=>{
            toast('Failed to post the comment, please try again.')
            console.log(err)
        })
    }
return (
    <div className=" rounded-lg">
        <ToastContainer />
        <div>
            <h2 className="px-2 pt-3 pb-1 font-light text-gray-800 text-2xl">Comments</h2>
        </div>
        <hr className='mt-2' />
        {token === "" || token === undefined ? <div className='h-40 bg-gray-100 rounded-lg flex justify-center items-center'>
                            <h2 className="text-2xl font-semibold leading-7 text-gray-800">
                                Please Login to post your comment.
                            </h2>
                        </div> 
                    : 
        <div>
            <form className=" w-full px-2 pt-2 pb-1">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <h2 className="px-4 pt-3 pb-2 text-gray-800 text-xl">Add a new comment</h2>
                    <div className="w-full md:w-full px-3 mb-2 mt-2">
                        <textarea value={commDesc} onChange={(e)=>setCommDesc(e.target.value)} className="bg-gray-100 rounded border border-gray-400 leading-normal w-full h-20 py-2 px-3 font-medium placeholder-gray-700 focus:outline-none focus:bg-white" name="body" placeholder='Type Your Comment' required></textarea>
                    </div>
                    <div className="w-full md:w-full flex items-start md:w-full px-2">
                        <div className="flex items-start w-1/2 text-gray-700 px-2 mr-auto">
                        <svg fill="none" className="w-4 h-4 text-gray-600 mr-1" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <p className="text-xs pt-px">Please share with us your experience by following our recipe.</p>
                        </div>
                        <div >
                        <input type='submit' onClick={(e)=>handleComment(e)} className="text-blue-500 font-semibold rounded-md border border-gray-300 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 py-1 px-4 border rounded-md" value='Post Comment' />
                        </div>
                    </div>
                </div>
            </form>

                {comments.length > 0 ? comments.map(comm=>(
                    <div className="bg-gray-100 rounded-lg w-full mb-3">
                        <div className=" rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                            <div className="mb-4">
                                <p className="text-gray-700 text-base">{comm.attributes.description}</p>
                            </div>
                            <div className="flex flex-col items-end justify-center">
                                <p className="mb-1 text-sm font-semibold text-blue-500 leading-none">{comm.attributes.user.data.attributes.username}</p>
                                <p className="text-xs text-gray-400">{new Date(comm.attributes.publishedAt).toDateString()}</p>
                            </div>
                        </div>
                    </div>
                )) : <div className='h-40 bg-gray-100 rounded-lg flex justify-center items-center'>
                        <h2 className="text-2xl font-semibold leading-7 text-gray-800">
                            No comments on recipe found.
                        </h2>
                    </div>}
        </div>}  
    </div>
);
}