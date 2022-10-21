import Link from "next/link";
import { useRouter } from "next/router";
import { parseCookies } from "nookies";
import { useState, useEffect, useContext } from "react";
import Dropdown from "../../components/Dropdown";
import PostCard from "../../components/PostCard";
import { getAllCategories, getLoggedInUserInfo, logout } from "../../lib/api/card";
import AuthContext from '../../contexts/AuthContext';

export default function Post({ posts }) {
  const [searchTxt, setSearchTxt] = useState("");
  const [resPosts, setResPosts] = useState([]);
  const [searchPosts, setSearchPosts] = useState([]);
  const [isSearchTxt, setIsSearchTxt] = useState(false);
  
  const [allCategories, setAllCategories] = useState([])
  const [newCatRecipes, setNewCatRecipes] = useState([])
  const cookies = parseCookies();
  const [token, setToken] = useState("");
  const route = useRouter();
  const {catRecipes, catVal,isRecipeCat, setIsRecipeCat} = useContext(AuthContext)

  const restructureBody = (rec)=>{
    let newBody= {
      id: rec.id,
      attributes: {
          title: rec.title,
          description: rec.description,
          noLikes: rec.noLikes,
          noDislikes: rec.noDislikes,
          slug: rec.slug,
          posted_on: rec.posted_on,
          post_img: {
              data: {
                  id: 1,
                  attributes: {
                      url: rec.post_img.url,
                  }
              }
          },
          creator: {
              data: {
                  id: 1,
                  attributes: {
                      username: rec.creator.username,
                  }
              }
          },
          
      }
    }
    
    setNewCatRecipes([...newCatRecipes, newBody]);
  }

  useEffect(() => {
      setToken(cookies.jwt);
      const allCat = getAllCategories();
      allCat.then(res=>{
        setAllCategories(res.data);
      }).catch(err=>{
        console.log(err);
      })
      getLoggedInUserInfo(token).then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log('unable to get user info', err)
      })
  }, []);
  
  useEffect(() => {
    if (resPosts.length === 0 && posts && posts.length > 0) {
      setResPosts(posts);
    }
    if(isSearchTxt){
      if (searchTxt === "") {
        setResPosts(posts);
        setSearchTxt("");
        setIsSearchTxt(false);
      }
    }
    if(isRecipeCat){
      
      catRecipes.map((rec)=>{
        restructureBody(rec)
      })
      
    }else{
      setNewCatRecipes([]);
    }
    
  }, [searchTxt, isRecipeCat]);
  console.log(isRecipeCat, '  ', catRecipes)
  const searchRecipe = (searchTxt) => {
    setIsSearchTxt(true);
    let searchArr = [];
    resPosts.map((res) => {
      let postT = res.attributes.title.split(" ");
      for (const it of postT) {
        if (it.toLowerCase().includes(searchTxt)) {
          searchArr.push(res);
          break;
        }
      }
    });
    if (searchArr.length == 0) {
      resPosts.map((res) => {
        let postC = res.attributes.creator.data.attributes.name.split(" ");
        for (const it of postC) {
          if (it.toLowerCase().includes(searchTxt)) {
            searchArr.push(res);
            break;
          }
        }
      });
    }
    setSearchPosts(searchArr);
  };
  const inputHandler = (e) => {
    let text = e.target.value.toLowerCase();
    setSearchTxt(text);
  };
  const handleLogout = () => {
    if (logout()) route.reload("/recipes");
  };
  console.log(catRecipes)
  return (
    <>
      <div className="flex items-center p-4 border-b-2 border-gray-100 ">
        <div className=" flex flex-1 items-center justify-between  ">
          <div className="flex">
            <a className="mr-3" href="#">
              <span className="sr-only">Your Company</span>
              <img
                className="h-8 w-auto sm:h-10"
                src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=500"
                alt=""
              />
            </a>
            <div
              className=" navbar-collapse collapse grow "
              id="navbarSupportedContentY"
            >
              <ul className="navbar-nav mr-auto flex ">
                <li className="nav-item">
                  <a
                    className="nav-link block pr-3 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600 transition duration-150 ease-in-out"
                    href="#!"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className={`nav-link block pr-3 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600 transition duration-150 ease-in-out ${
                      route.pathname == "/recipes"
                        ? "bg-blue-600 text-white"
                        : ""
                    }`}
                    href="#!"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Recipes
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link block pr-3 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600  transition duration-150 ease-in-out"
                    href="/favourites"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Favourites
                  </a>
                </li>
                <li className="nav-item mb-2 lg:mb-0">
                  <a
                    className="nav-link block pr-2 lg:px-2 py-2 sm:font-xs font-lg text-gray-600 rounded-md hover:text-white hover:bg-blue-600  transition duration-150 ease-in-out"
                    href="#!"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {token ? (
            <div className=" flex items-center justify-end w-50 mr-3">
              <a
                href="#"
                onClick={() => handleLogout()}
                className="whitespace-nowrap px-4 py-2 text-base font-medium text-gray-500 hover:text-white bg-blue-500 text-white rounded-md border border-gray-300 hover:bg-blue-600"
              >
                LogOut
              </a>
            </div>
          ) : (
            <div className="flex items-center justify-evenly w-50 mr-3">
              <a
                href="/auth/login"
                className="whitespace-nowrap md:px-4 md:py-2 px-2 py-2 text-sm md:text-md  font-medium text-gray-500 hover:text-white hover:bg-blue-600 hover:text-white rounded-md border border-gray-300"
              >
                Sign in
              </a>
              <a
                href="/auth/register"
                className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-500 px-2 py-2 md:px-4 md:py-2 text-sm md:text-md md:font-medium text-white shadow-sm hover:bg-blue-600"
              >
                Sign up
              </a>
            </div>
          )}
        </div>
        
        <Dropdown allCategories={allCategories}/>
        <div className="ml-4 flex-0.5 hidden md:flex justify-end items-center ">
          <input
            type="text"
            id="price"
            variant="outlined"
            onChange={inputHandler}
            className="h-8 pl-7 pr-12 sm:text-sm rounded-md outline-gray-300 outline outline-offset-2 outline-2"
            placeholder="Search recipes here..."
          />
          <button
            onClick={() => searchRecipe(searchTxt)}
            class="ml-3 h-full px-4 py-2 text-sm text-blue-500 font-semibold rounded-full border border-gray-300 hover:text-white hover:bg-blue-600 hover:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Search
          </button>
        </div>
      </div>
      {isRecipeCat ? (
          <div className="p-4 mx-4 mt-3 shadow-lg rounded-lg bg-gray-100 text-gray-700">
            <h2 className="font-semibold text-3xl mb-2">{catRecipes[0].category.name} recipes</h2>
            <p>
            {catRecipes[0].category.description}
            </p>
          </div>
        ) : (<></>)}
      <div className=" md:flex flex-wrap md:justify-between md:items-center space-y-4 mt-4 px-4 overflow-hidden">
        {(!isSearchTxt && !isRecipeCat)
          ? resPosts && resPosts.map((resPost) => <PostCard p={resPost} />)
          : (isSearchTxt && !isRecipeCat) ? searchPosts.map((searchPost) => <PostCard p={searchPost} />) : newCatRecipes.map(recipe=> <PostCard p={recipe} />)}
      </div>
    </>
  );
}

export const getServerSideProps = async (ctx) => {

  const res = await fetch(`${process.env.STRAPI_API_URL}/api/posts?populate=*`);  
  const data = await res.json();

  return {
    props: {
      posts: data.data,
    },
  };
};
