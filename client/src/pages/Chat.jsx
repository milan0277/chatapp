import React, { useState, useEffect, useMemo, useContext } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { IoIosSend } from "react-icons/io";
import { GoFileMedia } from "react-icons/go";
import toast, { Toaster } from 'react-hot-toast'
import { useRef } from 'react';
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";
// import { TiTick } from "react-icons/ti";
import { TiDeleteOutline } from "react-icons/ti";
// import Spinner from 'react-bootstrap/Spinner';
// import Store from '../context/context';
const Chat = () => {

    //socket-io-client
    const socket = useMemo(() => io(`${process.env.REACT_APP_API_URL}`), [])

    const [m, setM] = useState("")
    const [image, setImage] = useState("")
    const [receiverId, setReceiverId] = useState("")
    const [messages, setMessages] = useState([])
    const [data, setData] = useState(null)
    const [name, setName] = useState("")
    const [filePop, setFilePop] = useState(false)
    const [recording, setRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const audioRef = useRef(null);
    const [show, setShow] = useState(false)
    // const [typingShow, setTypingshow] = useState(true)


    const userId = JSON.parse(localStorage.getItem("loggedUser"))?._id
    const userName = JSON.parse(localStorage.getItem("loggedUser"))?.name


    //getAllAgents API
    async function list() {
        try {
            const agentsData = await axios.get(`${process.env.REACT_APP_API_URL}loginsystem/message/api/getChatUserData`, { withCredentials: true })
            setData(agentsData?.data)
        }
        catch (err) {
            console.log(err)
        }
    }


    //set name and receiverId
    const handleSet = (item) => {
        setName(item?.name)
        setReceiverId(item?._id)
    }


    //receive message api
    async function message() {
        try {
            if (receiverId !== "") {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}loginsystem/message/api/receivemessage/${receiverId}`, { withCredentials: true })
                // console.log(res.data)
                setMessages(res?.data)
            }
        }
        catch (err) {
            console.log(err)
        }
    }


    //receive socket messages
    const receivemessage = () => {
        // console.log("socket receive message working")
        return socket.on("data", ({ m, image, audio, senderId }) => {
            // console.log(m, audio)
            if (receiverId === senderId) {
                //   console.log({ message: m, audioname: audio, imagename: image , isRead:true})  
                setMessages((prevMess => [...prevMess, { message: m, audioname: audio, imagename: image, isRead: true }]))
            }
        })
    }


    useEffect(() => {
        list()
    }, [])


    useEffect(() => {
        message()
        receivemessage()

        //socket connection 
        socket.on("connect", () => {
            console.log('connected')
        })

        //register
        socket.emit("register", userId)

        // socket.off("data")   
        socket.on("disconnect", () => {
            console.log('disconnected')
        })

        //cleanup function
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("data");
            socket.off("register");
            socket.off("dMessage")
        }

    }, [receiverId])

    useEffect(() => {
        socket.on("dMessage", (mId) => {
            console.log("mId", mId)
            return setMessages(messages?.filter((element) => {
                return element?._id !== mId
            }))
        })

        //cleanup function
        return () => {
            socket.off("dMessage")
        }
    }, [messages])


    //send message API
    const sendMessage = async (e) => {
        e.preventDefault()
        try {

            const formDta = new FormData()
            formDta.append("message", m)
            if (image != null) {
                formDta.append("image", image)
            }

            if (audioBlob != null) {
                formDta.append("audio", audioBlob, "recording.wav")
            }

            const res = await axios.post(`${process.env.REACT_APP_API_URL}loginsystem/message/api/sendmessage/${receiverId}`, formDta, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true })
            // console.log(res)
            if (res.status === 200) {
                socket.emit("message", { m: res.data.convo.message, image: res.data.convo.imagename, audio: res.data.convo.audioname, receiverId, senderId: userId })
                setMessages((rev) => [...rev, res.data.convo])

            }
            else if (res.data.error) {
                toast.error(res.data.error)
            }





            formDta.delete("image")
            formDta.delete("message")
            setM("")
            setImage(null)
            setAudioBlob(null)
            setFilePop(false)

            setShow(false)
        }
        catch (err) {
            console.log(err)
            toast.error(err?.response?.data?.error)
            setImage('')
        }

    }


    const startRecording = async () => {
        setShow(true)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("stream at startRecording",stream)
            mediaRecorder.current = new MediaRecorder(stream);
            console.log("mediaRecorder at startRecording",mediaRecorder)
            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            console.log("audioBlob before inserting blob",audioBlob)
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
                console.log("audioBLob :",audioBlob)
                setAudioBlob(audioBlob);

                // Create an audio preview
                const audioURL = URL.createObjectURL(audioBlob);
                console.log("audioURL :",audioURL)
                audioRef.current.src = audioURL;
            };
            mediaRecorder.current.start();
            setRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast.error("NotFoundError: Requested device not found")
            setShow(false)

        }
    };

    // Stop Recording
    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setRecording(false);
            setAudioBlob(null)
            alert("recording stopped")
        }
    };


    const deleteMessage = async (mId) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_API_URL}loginsystem/message/api/messagedelete/${mId}`, { withCredentials: true })
            console.log(res)

            const Messages = messages?.filter((element) => {
                return element?._id !== mId
            })
            setMessages(Messages)
            socket.emit("deletemessage", { mId, receiverId })
        }
        catch (err) {
            console.log(err)
        }

    }


    const cap = name ? name.toUpperCase().split("")[0] : ""
    return (
        <div className='chatCard'>

            <div className='c1'>
                <div className='header'>
                    {/* <img src={Clogo} alt='' /> */}
                    <span>CHAT APP</span>
                </div>

                <div className='c1-users' >
                    {
                        data?.map((item, index) => {
                            return <div className='uc' key={index} onClick={() => handleSet(item)}><div className='uc1'>{item?.name?.toUpperCase()?.split("")[0]}</div><div> <b>{item?.name}</b></div> </div>
                        })   
                    }
                </div>
            </div>

            <div className='c2'>
                <div className='c2-header'>
                    {name ?
                        <>
                            <div style={{
                                height: "70%", width: "50px", backgroundColor: "white", borderRadius: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bolder", color: "black"
                            }}>
                                {cap}
                            </div>
                            <span>
                                {name.toUpperCase()}
                            </span>
                        </>
                        :
                        ""
                    }
                </div>
                <div className='c2-message' >
                    {
                        messages.length === 0 ?
                            <div style={{
                                display: "flex", justifyContent: "center", position: "absolute", top: "50%", left: "45%", fontWeight: "bolder"
                            }}>
                                Welcome! {userName.toUpperCase()} Let's start chatting
                            </div>
                            : messages?.map((mess, index) => {
                                console.log(messages)
                                return mess?.senderId === userId ? (
                                    <>
                                        <div key={mess._id} style={{ display: "flex", justifyContent: "right", margin: "1px 3px 1px 1px" }}>


                                            {mess?.message ? mess?.message : ""}{mess?.imagename && (
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}loginsystem/message/api/showimage/${mess.imagename}`}
                                                    alt="loading"
                                                    style={{ width: "50px" }}
                                                />
                                            )}{mess?.audioname ?
                                                <audio src={`${process.env.REACT_APP_API_URL}loginsystem/message/api/getaudio/${mess?.audioname}`} controls /> : ""}<TiDeleteOutline onClick={() => deleteMessage(mess?._id)} />

                                        </div> 
                                    </>
                                ) :
                                    (
                                        <>
                                            <div key={mess._id} style={{ display: "flex", justifyContent: "left", margin: "1px 3px 1px 1px" }}>{mess?.message ? mess?.message : ""}{mess?.imagename && (

                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}loginsystem/message/api/showimage/${mess.imagename}`}
                                                    alt="loading"
                                                    style={{ width: "50px" }}
                                                />
                                            )}{mess?.audioname ? <audio src={`${process.env.REACT_APP_API_URL}loginsystem/message/api/getaudio/${mess?.audioname}`} controls /> : ""}  <TiDeleteOutline onClick={() => deleteMessage(mess?._id)} />
                                            </div>
                                        </>
                                    )

                            })
                    }
                    {/* {
                        typingShow?
                        <Spinner animation="border" role="status" style={{marginLeft:"50%"}}>
                        <span className="visually-hidden">typing..</span>
                      </Spinner>
                      :
                      ""
                    } */}
                </div>
                {
                    receiverId ? <div className='c2-send'>
                        <input type='text' placeholder='Enter message ...' value={m} onChange={(e) => setM(e.target.value)} />

                        {filePop ? <input type='file' className='hidden' style={{ height: "80%", width: "20%" }} onChange={(e) => setImage(e.target.files[0])} /> : ""}


                        {show ? <audio ref={audioRef} controls className="mb-1 mt-1 " style={{ height: "70%" }}></audio> : ""}

                        <div className="flex gap-4 justify-center">
                            {!recording ? (
                                <CiMicrophoneOn color='#343a40' size={'45px'} onClick={startRecording} />
                            ) : (
                                <CiMicrophoneOff color='#343a40' size={'45px'} onClick={stopRecording} />
                            )}
                        </div>

                        <button><GoFileMedia size={'25px'} onClick={() => setFilePop(!filePop)} /></button>
                        <button onClick={(e) => sendMessage(e)}><IoIosSend size={'30px'} /></button>
                    </div> : ""
                }
            </div>
            <Toaster />
        </div>
    )
}

export default Chat