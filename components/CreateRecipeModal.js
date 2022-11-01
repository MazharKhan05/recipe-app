import dynamic from "next/dynamic";
import { convertToRaw,convertFromRaw, EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { mdToDraftjs, draftjsToMd } from 'draftjs-md-converter';
import { useContext, useEffect, useState } from "react";
import AuthContext from '../contexts/AuthContext'
import Dropdown from "./Dropdown";
import { createRecipe, getAllCategories, getLoggedInUserInfo } from "../lib/api/card";
import { parseCookies } from "nookies";

const Editor = dynamic(()=> import("react-draft-wysiwyg").then(module=>module.Editor),{
    ssr:false,
})

export default function CreateRecipeModal(){
  const [allCategories, setAllCategories] = useState([])
  const [recTitle, setRecTitle] = useState("")
  const [recDesc, setRecDesc] = useState("")
  const [recImage, setRecImage] = useState(null);
  const [recCat, setRecCat] = useState("");
  const [userRole, setUserRole] = useState("")

  const [editorState1,setEditorState1] = useState(EditorState.createEmpty())
  const [editorState2,setEditorState2] = useState(EditorState.createEmpty())
  const {displayModal,catId, setDisplayModal} = useContext(AuthContext)
  const cookies = parseCookies();
  
  useEffect(() => {
    const allCat = getAllCategories();
    allCat.then(res=>{
      setAllCategories(res.data);
    }).catch(err=>{
      console.log(err);
    })
    if(cookies.jwt){
      const result = getLoggedInUserInfo(cookies.jwt);
      result.then(res=>{
        if(res.position  === "Creator"){  
          setUserRole(res.position)
        }
      }).catch(err=>{
        console.log(err);
      })
    }
  }, []);
  const onEditorStateChange1 = (editorState1)=>{
      setEditorState1(editorState1)
  }
  
  const onEditorStateChange2 = (editorState2)=>{
      setEditorState2(editorState2)
      const content = convertToRaw(editorState2.getCurrentContent())
      // console.log(content)
  }
  const handleRecipeCreation = (e)=>{
    e.preventDefault();
    // if(catVal === "" || catVal === "All")return;
    // if(userRole !== "Creator")return;   //only allow creator to post a new recipe
    const jwt = cookies.jwt;
    const ingreMarkdown = draftjsToMd(convertToRaw(editorState1.getCurrentContent()))
    const methodMarkdown = draftjsToMd(convertToRaw(editorState2.getCurrentContent()))
    
    const recSlug = recTitle.toLowerCase().replace(' ', '-')
    
    let recipeBody = {
      title: recTitle,
      description: recDesc,
      ingredients: ingreMarkdown,
      method: methodMarkdown,
      slug: recSlug,
      post_img: null,
      recipe_creator: parseInt(cookies.userId),
      category: parseInt(catId)
    }
    
    createRecipe(jwt,recipeBody, recImage).then(res=>{
      console.log('recipe posted', res)
    }).catch(err=>{
      console.log('something gone wrong ', err)
    })
  }
    return (
    <div className="modal fade fixed top-40 md:left-40 left-15 md:w-2/3 w-3/4 h-3/4 outline-none overflow-x-hidden overfow-y-auto"
      id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog relative w-auto pointer-events-none">
        <div
          class="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
          <div
            class="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
            <h5 class="text-xl font-medium leading-normal text-gray-800" id="exampleModalLabel">Enter recipe details.</h5>
            <button type="button"
              className="btn-close box-content w-4 h-4 p-1 text-black border-black rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
              data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body relative p-4 overflow-auto">
            <form className="w-full max-w-lg">
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                    Title
                  </label>
                  <input onChange={(e)=>setRecTitle(e.target.value)} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
                </div>
                <div class="w-full md:w-1/2 px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
                    Description
                  </label>
                  <input onChange={(e)=>setRecDesc(e.target.value)} class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
                </div>
              </div>
              
              <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3">
                  <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                    Ingredients
                  </label>
                  <div className="bg-gray-200">
                    <Editor editorState={editorState1} onEditorStateChange={onEditorStateChange1} editorClassName="text-gray-700 border border-gray-200 rounded px-2"/>
                  </div>
                  <label class="mt-3 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
                    Method
                  </label>
                  <div className="bg-gray-200">
                    <Editor editorState={editorState2} onEditorStateChange={onEditorStateChange2} editorClassName="text-gray-700 border border-gray-200 rounded px-2"/>
                  </div>
                </div>
              </div>
              <div class="flex flex-wrap -mx-3 mb-2">
                <div class="flex justify-center px-3">
                  <div class="mb-3 w-50">
                    <label for="formFileSm" class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Upload Image</label>
                    <input class="form-control block w-full px-2 py-1 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out
                    m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" id="formFileSm" type="file" onChange={(e) => {console.log(e.target.files), setRecImage(e.target.files[0])}} />
                  </div>
                </div>
                <div class="w-full md:w-1/3 px-2 flex items-center">
                  <Dropdown allCategories={allCategories} isModalDropDown={true}/>
                </div>
              </div>
            </form>
          </div>
          <div
            class="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
            <button type="button" class="px-6
              py-2.5
              bg-purple-600
              text-white
              font-medium
              text-xs
              leading-tight
              uppercase
              rounded
              shadow-md
              hover:bg-purple-700 hover:shadow-lg
              focus:bg-purple-700 focus:shadow-lg focus:outline-none focus:ring-0
              active:bg-purple-800 active:shadow-lg
              transition
              duration-150
              ease-in-out" onClick={()=>setDisplayModal(false)} data-bs-dismiss="modal">Close</button>
            <button onClick={(e)=>handleRecipeCreation(e)} type="button" class="px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg
            focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out
            ml-1">Save changes</button>
          </div>
        </div>
      </div>
    </div>
);
}