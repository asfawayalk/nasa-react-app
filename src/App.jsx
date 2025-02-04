import { useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import SideBar from "./components/SideBar"
import React from "react"
import { useEffect } from "react"

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  function handleToggleModal() {
    setShowModal(!showModal)
  }
  
  useEffect(()=>{
    async function fetchAPIData(){
      const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
      const url = "https://api.nasa.gov/planetary/apod" + `?api_key=${NASA_KEY}`
      const today = (new Date()).toDateString()
      const localkey = `NASA-${today}`
      if (localStorage.getItem(localkey)){
        const apiData = JSON.parse(localStorage.getItem(localkey))
        setData(apiData)
        console.log("fetched from cache today", localkey)
        return
      }
      localStorage.clear()
      try {
        const res = await fetch(url)
        const apiData = await res.json()
        setData(apiData)
        localStorage.setItem(localkey, JSON.stringify(apiData))
        console.log("fetched from api today")
      } catch (err) {
        console.log(err.message)
      }
      

    }
    fetchAPIData()
  }, [])

  return (
    <>
    {data ? (<Main data={data}/>):(
      <div className="loadingState">
        <i className="fa-solid fa-gear"></i>
      </div>
    )}
    {showModal && (<SideBar data={data} handleToggleModal={handleToggleModal}></SideBar>)}
    {data &&(<Footer data={data} handleToggleModal={handleToggleModal}  />)}
    </>
  )
}

export default App
