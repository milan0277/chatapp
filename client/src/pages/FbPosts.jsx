import React, { useContext, useEffect, useRef, useState } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { AiFillLike } from "react-icons/ai";
import { FaCommentDots } from "react-icons/fa";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Store from '../context/context'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { RxCrossCircled } from "react-icons/rx";
import toast, { Toaster } from 'react-hot-toast'


const FbPosts = () => {
  const { user } = useContext(Store)
  const [fbPosts, setFbPosts] = useState(null);
  const [showImage, setShowImage] = useState("");
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null)
  const [attachmentName, setAttachmentName] = useState("")
  const [postText, setPostText] = useState("")
  // const [loader, setLoader] = useState(false)
  const [postButtonDisable, setPostButtonDisable] = useState(false)
  const pageId = process.env.REACT_APP_PAGE_ID;
  const access_token = process.env.REACT_APP_ACCESS_TOKEN;
  // const fb_url = process.env.REACT_APP_FB_URL;
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleImageChange = (e) => {
    const file = e.target.files[0]
    console.log(file);

    if (file) {
      e.target.value = ""
      const imageUrl = URL.createObjectURL(file);
      setShowImage(imageUrl)
      setImage(file)
      setAttachmentName(file?.name)
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };


  const newPosts = async (id, ptext, authUser) => {
    try {
      const res = await axios.post(`http://localhost:5000/loginsystem/fb/api`, { id, ptext, authUser }, { withCredentials: "true" })
      // console.log("newPost fucntion res :", res)
      if (res?.status === 200) {
        // console.log("working")
        getAllPosts()
        toast.success(res?.data?.message)
        setPostButtonDisable(false)
      }
    }
    catch (err) {
      console.log("newPost fucntion error : ", err)
      toast.error("something wrong ")
    }
  }


  const handlePost = async () => {
    try {
      if (image) {
        const formData = new FormData()
        formData.append("image", image)
        if (postText.length > 0) {
          formData.append("postText", postText)
        }
        const authUser = JSON.stringify(user)
        formData.append("authUser", authUser)


        const uploadPostRes = await axios.post(`http://localhost:5000/loginsystem/fb/api/uploadsPosts`, formData, {
          withCredentials: "true",
          hearder: {
            "CONTENT-TYPE": "multipart/form-data"
          }
        })

        if (uploadPostRes?.status === 200) {
          toast.success(uploadPostRes?.data?.message)
          getAllPosts()
        }
        // console.log("uploadPostRes :",uploadPostRes)

        setPostText("")
        setImage(null)
        setShowImage(null)
      }
      else {
        if (user?.designation === "admin") {
          setPostButtonDisable(!postButtonDisable)
          console.log("text and admin:true")

          let data = JSON.stringify({
            "message": postText,
            "published": "true"
          });

          const PostTextRes = await axios.post(`${process.env.REACT_APP_FB_URL}/${pageId}/feed`, data, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${access_token}` // Include the token in the headers
            }
          })
          console.log("postTextRes :", PostTextRes)

          if (PostTextRes?.status === 200) {

            newPosts(PostTextRes?.data?.id, postText, user)

          }


        }
        else {
          console.log("currently only admins are allowed")
        }
        setPostText("")
        setImage(null)
        setShowImage(null)
      }

    }
    catch (err) {
      console.log(err)
    }
  }


  const getAllPosts = async () => {
    try {

      // const res = await axios.get(`${process.env.REACT_APP_FB_URL}/${process.env.REACT_APP_PAGE_ID}/feed?fields=message,comments{message,from,created_time,reply},full_picture,created_timecomments.limit(0).summary(true),likes.limit(0).summary(true)&access_token=${process.env.REACT_APP_ACCESS_TOKEN}`,)
      // const res = await axios.get(`https://graph.facebook.com/v22.0/654090954443972/feed?fields=message,comments{message,from,created_time,reply},full_picture,created_timecomments.limit(0).summary(true),likes.limit(0).summary(true)&access_token=EAAJysNOfufkBOxIEoneY9cNgZCfiZCMyQEdu9pjoSwHmbpZCmLgE5s0AAFuVAY600a7Y0Uv0ehnMoS063K8f8yf7tbQ0WYZABu6mwgzLMx4WZCi9OZAOUrE6uz377AzSMysVZAKd0HcCg6W11MVdlvexT0fiYzo3JslSZCW4Up6pyA4yr9lHzGw7ECCrhRLvtB1uw6kM2RqmXtX9hmxsRnv00ZBnL`)
      // console.log("res : ", res)
      // setFbPosts(res?.data?.data)
    }
    catch (err) {
      console.log("error in getAllPost function : ", err)
    }
  }


  useEffect(() => {
    // console.log("fb_url :", process.env.REACT_APP_FB_URL)
    // console.log("page Id :", process.env.REACT_APP_PAGE_ID)
    // console.log("access_token :", process.env.REACT_APP_ACCESS_TOKEN)
    getAllPosts()
  }, [])

  return (
    <Card className='c11'>

      {/* part 1 */}
      <Card.Title className='ct d-flex justify-content-between align-items-center mt-1'>
        <h3 className='ml-1'>FaceBook Posts</h3>
        <div className="d-flex gap-3 ">
          <button className="btn btn-primary mr-2" onClick={handleShow}>GetPendingPosts&Comments</button>
          <button className="btn btn-primary b2 mr-1" onClick={getAllPosts}>GetLatestPosts</button>
        </div>
      </Card.Title>


      {/* part 2 */}
      <div className='c2'>

        {
          fbPosts != null ?

            fbPosts.map((e, i) => {
              return (
                <div key={i}>
                  {
                    e?.message ? <span style={{ marginBottom: "2%", marginLeft: "2%" }}>{e?.message}</span> : ""
                  }
                  {
                    e?.full_picture ? <span><img src={`${e?.full_picture}`} alt='wait for post to appear' style={{ height: "10%", width: "10%", marginBottom: "0.5%", marginLeft: "2%" }} /></span> : ""
                  }

                  <AiFillLike />{e?.likes?.summary?.total_count}
                  {
                    e?.comments ? <>
                      {['right'].map((placement) => (
                        <OverlayTrigger
                          key={placement}
                          placement={placement}
                          overlay={
                            <Tooltip id={`tooltip-${placement}`}>
                              Comments
                              <>
                                {e?.comments?.data?.map((e2, i) => (
                                  <div key={i}>
                                    <strong>{e2?.from?.name}:</strong> {e2?.message}
                                  </div>
                                ))}
                              </>
                            </Tooltip>
                          }
                        >
                          <FaCommentDots />
                        </OverlayTrigger>
                      ))}
                    </> : ""
                  }



                </div>
              )
            })

            : <div className='cniu'>Currently not in use</div>
        }
        {/* <div className="spinner-wrapper"><div className="spinner"></div></div> */}
      </div>


      {/* part 3 */}
      <div style={{ display: "flex" }}>

        <textarea
          style={{ height: "60%", width: "50%", marginLeft: "1%", marginTop: "1%" }}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Write something "
        />
        <div className='s1'>
          {
            showImage ? <p className='atch'>{attachmentName}</p> : <span style={{ display: "flex", justifyContent: "center" }}>attachments..</span>
          }
        </div>

        <button
          onClick={triggerFileInput}
          className="btn  btn-outline-secondary"
          style={{ height: "50%", width: "15%", marginTop: "1.5%", marginLeft: "0.5%", fontWeight: "bolder" }}
        >
          Add Image
        </button>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={(e) => handleImageChange(e)}
          style={{ display: 'none' }}
        />

        {
          postButtonDisable ? "" : <label
            className="btn btn-sm btn-outline-primary"
            style={{
              height: "50%",
              width: "15%",
              marginTop: "1.5%",
              marginLeft: "0.5%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={handlePost}
          >
            Post
          </label>
        }

      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header >
          <Modal.Title>Pending Posts and Comments</Modal.Title>
          <RxCrossCircled onClick={handleClose} style={{ cursor: "pointer" }} />
        </Modal.Header>
        <Modal.Body>
          I will not close if you click outside me. Do not even try to press
          escape key.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary">Understood</Button>
        </Modal.Footer>
      </Modal>
      <Toaster />
    </Card>
  );
};

export default FbPosts;
