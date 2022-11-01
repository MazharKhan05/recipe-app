import { destroyCookie } from "nookies";


export const getLoggedInUserInfo = async (jwt)=>{   // route to authorize user loggedIn everytime when needed
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/users/me?populate=*`,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
    })
    const data = await res.json();
    return data; 
}

export const createRecipe = async (jwt, uptBody, imgFile)=>{ //TODO:: work on user authorization part here
    // if(role != 'Creator')return;    //if user is not a creator then he cannot post a recipe

    const formData = new FormData()
    formData.append('files', imgFile)
    const imgRes = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/upload/`, {
        method:'POST',
        headers:{
            'Authorization': `Bearer ${jwt}`,
        },
        body: formData
    })
    const imgData = await imgRes.json()
    uptBody.post_img = parseInt(imgData[0].id)
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/posts`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            "data": uptBody
        })
    })
    const data = await res.json();
    return data; 
}

export const handleIncDec = async (id, uptBody)=>{  //Login user
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/posts/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "data": uptBody,
        })
    })
    const data = await res.json();
    return data; 
}

export const getPrevFav= async(jwt)=>{  //prerequisite for below req
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/users/me?populate=*`,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
    })

    const data = await res.json()
    return data;
}
export const handleFavourite = async (id, uptBody, jwt)=>{
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/users/${id}`,{
        method:'PUT',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify(uptBody)
    })
    const data = await res.json();
    return data;
}

export const updateUser=async (id, username, provider,position, jwt)=>{  //update provider user info
    // const ind = email.indexOf('@')
    // const name = email.substring(0, ind);
    let roleId;
    if(position === "Creator")roleId = 5
    else roleId =4
    const uptBody = {
      provider: provider,
      username: username,
      position,
      role: {
        id: roleId,
      }
    }
    console.log(uptBody)
    if(id !== null){
        const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/users/${id}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify(uptBody)
        })
        const data = await res.json();
        return data;
    }
}
export const getRecipeById =async (id)=>{
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/posts/${id}?populate=*`)
    const data = await res.json();
    return data; 
}
export const logout = ()=>{
    destroyCookie(null, 'jwt');
    destroyCookie(null, 'username')
    destroyCookie(null, 'userId')
    return true;
}

//get all categories 

export const getAllCategories =async ()=>{
    const recipeCat = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/categories?populate=*`)
    const data = await recipeCat.json();
    return data;
}

export const getRecipesByCategory = async (category)=>{
    const recipeCat = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/posts/getPostsByCat/${category}`)
    const data = await recipeCat.json();
    return data;
}


export const createComment = async (jwt, uptBody)=>{ //TODO:: work on user authorization part here
    if(!jwt)return;
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/comments`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
        body: JSON.stringify({
            "data": uptBody
        })
    })
    const data = await res.json();
    return data; 
}

export const getCommentsByRecipe = async (jwt, id)=>{
    if(!jwt)return;
    const res = await fetch(`${process.env.STRAPI_BACKEND_HOST}/api/comments?filters[post][id]=${id}&populate=*`,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        }
    })
    const data = await res.json();
    return data; 
}