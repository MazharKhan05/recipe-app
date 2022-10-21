import '../styles/globals.css'
import { useState } from "react";
// import AuthContext from "../contexts/AuthContext";
import ContextWrapper from '../components/contextWrapper';

function MyApp({ Component, pageProps }) {
  
  return (
    <ContextWrapper>
      <Component {...pageProps} />
  </ContextWrapper>
  
  )
}


export default MyApp
