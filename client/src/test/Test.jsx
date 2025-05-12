import React from 'react'

const Test = () => {
    const handleClick=()=>{
        navigator.mediaDevices.enumerateDevices().then((r)=>{
            console.log(r)
        }).catch((err)=>{
            console.log(err)
        })


       navigator.mediaDevices.getUserMedia({audio:true}).then((r)=>{
            console.log(r)
        }).catch((err)=>{
            console.log(err)
        })
    }

  return (
    <div>Test
        <button onClick={handleClick}>dddd</button>
    </div>
  )
}

export default Test