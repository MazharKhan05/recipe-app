import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useContext, useState } from 'react';
import { getRecipesByCategory } from '../lib/api/card';
import AuthContext from '../contexts/AuthContext';


export default function Dropdown({allCategories, isModalDropDown}){
    const {catRecipes,displayModal ,setCatRecipes, setIsRecipeCat,setCatId, setCatVal, catVal, isRecipeCat} = useContext(AuthContext)
    
    const handleRecCat = (e,index,value)=>{
      e.preventDefault();
      // console.log(e.target.value)
      setCatVal(e.target.value)
      
      if(displayModal){
        setCatId(e.target.value)
        return;
      }
      
      if(catVal !== "" && catVal !== "All"){
        getRecipesByCategory(catVal).then(res=>{
          console.log(res)
          if(catVal !== e.target.value && catRecipes.length > 0){
            setCatRecipes([]);
            setIsRecipeCat(false)
          }
          setTimeout(() => {
            setCatRecipes(res)
            setIsRecipeCat(true)
          }, "1000")
          
        }).catch(err=>{
          console.log(err)     
        })
      }else{
        setCatRecipes([]);
        setIsRecipeCat(false);
      }  
    }
    
    return (
        <Box className='rounded-md'  sx={{ width: 'fit-content' }}> 
          <FormControl className='rounded-md' size='small' fullWidth>
            <InputLabel className='pt-1 text-sm font-bold'  id="demo-simple-select-label">Category</InputLabel>
            <Select onChange={handleRecCat} className='rounded-md h-full md:text-sm text-xs'
              labelId="demo-simple-select-label" 
              id="demo-simple-select" 
              disabled={allCategories.length == 0 ? true : false}
              value={catVal}
              label="Recipe"
            >
              <MenuItem value="All">All</MenuItem>
              {allCategories.length > 0 && allCategories.map(cat=>(
                <MenuItem value={`${isModalDropDown ? cat.id : cat.attributes.name}`}>{cat.attributes.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
    );
}