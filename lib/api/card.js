import { destroyCookie } from "nookies";


export const getLoggedInUserInfo = async (jwt)=>{
    const res = await fetch(`${process.env.STRAPI_API_URL}/api/users/me?populate=*`,{
        method:'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt}`,
        },
    })
    const data = await res.json();
    return data; 
}

export const handleIncDec = async (id, uptBody)=>{  //Login user
    const res = await fetch(`${process.env.STRAPI_API_URL}/api/posts/${id}`,{
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
    const res = await fetch(`${process.env.STRAPI_API_URL}/api/users/me?populate=*`,{
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
    const res = await fetch(`${process.env.STRAPI_API_URL}/api/users/${id}`,{
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

export const updateUser=async (id, email, provider, jwt)=>{  //update provider user info
    const ind = email.indexOf('@')
    const name = email.substring(0, ind);
    const uptBody = {
      provider: provider,
      username: name
    }
    if(id !== null){
        const res = await fetch(`${process.env.STRAPI_API_URL}/api/users/${id}`,{
        method:'PUT',
          headers:{
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
          },
          body: JSON.stringify(uptBody)
      })
        const data = await res.json();
        console.log(data)
        return data;
      
    }
  }
export const getRecipeById =async (id)=>{
    const res = await fetch(`${process.env.STRAPI_API_URL}/api/posts/${id}?populate=*`)
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
    const recipeCat = await fetch(`${process.env.STRAPI_API_URL}/api/categories?populate=*`)
    const data = await recipeCat.json();
    return data;
}

export const getRecipesByCategory = async (category)=>{
    const recipeCat = await fetch(`${process.env.STRAPI_API_URL}/api/posts/getPostsByCat/${category}`)
    const data = await recipeCat.json();
    return data;
}