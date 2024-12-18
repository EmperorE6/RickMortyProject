import React from 'react';
import './App.css';
import { useState } from 'react';
import { useQuery , gql } from '@apollo/client';
import nextArrow from "./next.png";
import prevArrow from "./prev.png";

function App() {
  //Here i have states to manage changing 
const [page,setPage]=useState(1);
const [status,setStatus]= useState("");
const [species,setSpecies]=useState("");
const [NameSort,setNameSort]=useState([]);
const [originSort,setOirginSort]=useState([]);
const [allCharacters,setAllCharacters]=useState([]);
const [language,setLanguage]=useState("english");

// working with GraphQl you must send a query so you can get data from.Into the query i add page,status or species constant that value is added into select box and as i change page or status or species
//it changes the query page or status or species itself and thats how i go through APis pages or i filter the data by status or species.
const getCharacters = gql`
query {
  characters(page : ${page}, filter:{status:"${status}",species:"${species}"}) {
    results {
      id
      name
      species
      status
      gender
      origin {
        id
        name
      }
      image
    }
      info{
      next
      prev
      }
  }
}
`;
//here i handle the query with useQuery hook
const {error,loading,data}=useQuery(getCharacters);

if(loading) return <p>Data is loading....</p>

if(error) return <p>Error,couldnt retrieve data.</p>
const CharactersArray=data.characters.results;//i store here data from the api

//this is function to handle the first page button,when i click on first page button i set page to 1 in this function(name and origin sorting array are emptied)
function handleFirstPage(){
  setAllCharacters((prev)=>[...prev,...CharactersArray]);//This is used to update the characters into new array everytime i go through pages so it doesnt overwrites them or lose them.
setNameSort([])
setOirginSort([]);
  setPage(1);
}
//this is function to handle the last page button, when i click on last page button i set page to 42 in this function(name and origin sorting array are emptied)
function handleLastPage(){
  setAllCharacters((prev)=>[...prev,...CharactersArray]);
setNameSort([])
setOirginSort([]);
  setPage(42);
}
//now i have two other function next and previus page handle where by clickin a button i hop on next or previous page with condition to not exceed over 42 page because its last or not go below first page
function handleNextPage() {
setAllCharacters((prev)=>[...prev,...CharactersArray]);
setNameSort([])
setOirginSort([]);
if(page<42){
  setPage(page + 1)
}
}

function handlePreviusPage() {
setAllCharacters((prev)=>[...prev,...CharactersArray]);
setNameSort([])
setOirginSort([]);
  if(page>1){
    setPage(page - 1)
  }
  }

//here i  have two functions to handle the sorting by Name or by Origin i use spread operator on original array of my characters and built in sort method with two arguments which are compared by
//localeCompare built in function that returns negative or positive whether a or b comes first 
function handleSortByName(){
  const sortNames=[...CharactersArray].sort((a,b)=>{
    return a.name.localeCompare(b.name);
  });
  setNameSort(sortNames);
  setOirginSort([]);
}
function handleSortByOrigin(){
  const sortOrigin=[...CharactersArray].sort((a,b)=>{
    return a.origin.name.localeCompare(b.origin.name);
  });
  setOirginSort(sortOrigin);
  setNameSort([]);
}
//so here i check if NameSort array is bigger than 0, if it is that means it exists and showCharacters take nameSort array map the characters sorted by Name,also check if originSort array exists then
//map characters by their origin sorted and if not both it maps original not sorted array of characters(CharactersArray)
const showCharacters = NameSort.length > 0 ? NameSort : originSort.length>0 ? originSort : CharactersArray;
//Im handling the language the status and species change here onChange on select box by setting the Status the chosen target value(ex.Alive,Dead etc) and emptying name and origin sorted arrays
function handleStatus(e){
  setStatus(e.target.value);
  setNameSort([]);
  setOirginSort([]);
}
//Here im doing same thing as in previous function just with species
function handleSpecies(e){
  setSpecies(e.target.value);
  setNameSort([]);
  setOirginSort([]);
}

function handleLanguageChange(){
  if(language == "english"){
    setLanguage("espanol")
  }else{
    setLanguage("english")
  }
}
//I added two divs with classes English and Espanol and ternary operator whether to display english or none ,same goes with Espanol div, there is button ChangeLanguage when clicked it sets language espanol if its current english and vice versa.
  return (
    <div className="App">
 <div className='English' style={{display: language == "english" ? "block": "none"}}>
 <div className='header'>
 <h1>Rick and Morty Characters</h1>
 <div className='FiltersBox'>
<div className='sortingButtons'>
<button onClick={handleSortByName}>SortByName</button>
<button onClick={handleSortByOrigin}>SortByOrigin</button>
</div>
<div className='status'>
<label>Status:</label> <select onChange={handleStatus} value={status}>
   <option value="">All</option>
<option value="Alive">Alive</option>
<option value="Dead">Dead</option>
<option value="unknown">Unknown</option>
 </select>
 </div>
<div className='species'>
<label>Species:</label><select onChange={handleSpecies} value={species}>
<option value="">All</option>
<option value="Human">Human</option>
<option value="Alien">Alien</option>
 </select>
</div>
</div>
 </div>


<div className='chInfoBox'>
  {showCharacters.map((singleCharacter)=>(
   <div className='content'>
     <p><span>Name: </span>{singleCharacter.name}</p>
     <p><span>Status: </span>{singleCharacter.status}</p>
     <p><span>Species: </span>{singleCharacter.species}</p>
     <p><span>Gender: </span>{singleCharacter.gender}</p>
     <p><span>Origin: </span>{singleCharacter.origin.name}</p>
     <div className='characterDetails'>
       <img src={singleCharacter.image}></img>
       </div>
   </div>
  ))}

 
</div>
 <div className='pagination'>
   <button onClick={handleFirstPage}>First page</button>
   <img src={prevArrow} onClick={handlePreviusPage} alt='prev'></img>
   <img src={nextArrow} onClick={handleNextPage} alt='next'></img>
 <button onClick={handleLastPage}>Last page</button>
 </div>
 <div className='pageNumber'>
 <p id='pageNum'>{page}</p>
 </div>
 <footer>
   <p id='changeLanguage' onClick={handleLanguageChange}>Change Language</p>
 </footer>
 </div>
 


<div className='Espanol' style={{display: language == "espanol" ? "block": "none"}}>
        <div className='header'>
        <h1>Personajes de Rick y Morty</h1>
        <div className='FiltersBox'>
    <div className='sortingButtons'>
    <button onClick={handleSortByName}>OrdenarPorNombre</button>
    <button onClick={handleSortByOrigin}>OrdenarPorOrigen</button>
    </div>
  <div className='status'>
       <label>Estado:</label> <select onChange={(e)=>setStatus(e.target.value)} value={status}>
          <option value="">Todos</option>
  <option value="Alive">Vivo/Viva</option>
  <option value="Dead">Muerto/Muerta</option>
  <option value="unknown">Desconocido/Desconocida</option>
        </select>
        </div>
  <div className='species'>
      <label>Especies:</label><select onChange={(e)=>setSpecies(e.target.value)} value={species}>
  <option value="">Todos</option>
  <option value="Human">Humano/Humana</option>
  <option value="Alien">Extranjero/Extranjera</option>
        </select>
  </div>
  </div>
        </div>
  
       
  <div className='chInfoBox'>
         {showCharacters.map((singleCharacter)=>(
          <div className='content'>
            <p><span>Nombre: </span>{singleCharacter.name}</p>
            <p><span>Estado: </span>{singleCharacter.status}</p>
            <p><span>Especies: </span>{singleCharacter.species}</p>
            <p><span>Género: </span>{singleCharacter.gender}</p>
            <p><span>Origen: </span>{singleCharacter.origin.name}</p>
            <div className='characterDetails'>
              <img src={singleCharacter.image}></img>
              </div>
          </div>
         ))}
  
        
  </div>
        <div className='pagination'>
        <button onClick={handleFirstPage}>Primera página</button>
        <img src={prevArrow} onClick={handlePreviusPage} alt='prev'></img>
        <img src={nextArrow} onClick={handleNextPage} alt='next'></img>
        <button onClick={handleLastPage}>Última página</button>
        </div>
        <div className='pageNumber'>
        <p id='pageNum'>{page}</p>
        </div>
        <footer>
          <p id='changeLanguage' onClick={handleLanguageChange}>Cambiar idioma</p>
        </footer>
        </div>
     
     
    </div>
  );
}

export default App;
