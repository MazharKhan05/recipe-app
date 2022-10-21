import React, { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { parseCookies,setCookie } from 'nookies';
import { updateUser } from '../../lib/api/card';



const loginRedirect = () => {
  const [text, setText] = useState('Loading...');
  const router = useRouter();
  const {providerRedirect} = router.query;
  const {jwt} = parseCookies()

  useEffect(() => {
    // Successfully logged with the provider
    // Now logging with strapi by using the access_token (given by the provider) in props.location.search
    
    if(router.query.access_token){
      fetch(`${process.env.STRAPI_API_URL}/api/auth/${providerRedirect === "googleRedirect" ? 'google' : 'cognito'}/callback?access_token=${router.query.access_token}&id_token=${router.query.id_token}&raw[access_token]=${router.query["raw[access_token]"]}
      &raw[expires_in]=${router.query["raw[expires_in]"]}&raw[id_token]=${router.query["raw[id_token]"]}&raw[refresh_token]=${router.query["raw[refresh_token]"]}&raw[token_type]=${router.query["raw[token_type]"]}&refresh_token=${router.query.refresh_token}`)
      .then(res => {
        console.log(res)
        if (res.status !== 200) {
          throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
        }
        return res;
      })
      .then(res => res.json())
      .then(res => {
        
        // Successfully logged with Strapi
        // Now saving the jwt to use it for future authenticated requests to Strapi
        setCookie(null, 'jwt', res.jwt,{
          maxAge: 30 * 24 * 60 * 60,
          path: '/'
        })
        const data = updateUser(res.user.id, res.user.email,res.user.provider, res.jwt)
        data.then(res=>{
          setCookie(null, 'username', res.username,{
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
          })
          setCookie(null, 'userId', res.id,{
            maxAge: 30 * 24 * 60 * 60,
            path: '/'
          })
        }).catch(err=>{
          console.log(err)
        })
        setText('You have been successfully logged in. You will be redirected in a few seconds...');
        setTimeout(() => router.push('/recipes'), 5000); // Redirect to homepage after 3 sec
      })
      .catch(err => {
        console.log(err);
        setText('An error occurred, please see the developer console.')
      });
    }
    
    
  }, [router.query]);


  return <p>{text}</p>
};

export default loginRedirect;

