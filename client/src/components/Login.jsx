import React, { useContext} from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import Store from '../context/context';


const Login = () => {
    const {user,setUser}=useContext(Store)
    const {setSideState}=useContext(Store)

    //navigation
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()


    async function onSubmit(data){
        try{
            const login=await axios.post(`${process.env.REACT_APP_API_URL}loginsystem/api/login`,data,{ withCredentials:true })
            console.log(login)
            toast.success(login?.data?.message)
            setUser(login.data.existUser)
            
            if(login?.data?.existUser?.designation==="admin"){
                setSideState("/admin")
            navigate('/admin') 
            }else{
                setSideState('/agent')
            navigate('/agent')
            }
        }
        catch(err){
            toast.error(err?.response?.data?.message)
        }
    }


    return (
        <center className="hold-transition login-page">
            <div className="login-box">
                <div className="login-logo">
                  
                    <img src='https://cogentems.in/erpm/Style/images/Cogent-Logo_new-white.svg' className='w-30' alt='cogent logo' />
                </div>
                
                <div className="card">
                    <div className="card-body login-card-body">
                        <p className="login-box-msg">Sign in to start your session</p>
                        <form onSubmit={handleSubmit(onSubmit)}  method="post">
                            <div className="input-group mb-3">
                                <input type="email" className="form-control" placeholder="Email"  {...register("email", {
                                    required: {
                                        value: true,
                                        message: "email filed is required"
                                    }
                                    , pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
                                        message: "Invalid email address",
                                    }
                                })}/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-envelope" />
                                        
                                    </div>
                                </div>
                            </div>
                            {errors.email && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{errors.email.message}</span>}
                          
                            <div className="input-group mb-3">
                                <input type="password" className="form-control" placeholder="Password" {...register("password", {
                                    required: {
                                        value: true,
                                        message: "password field is required"
                                    }
                                })}/>
                                <div className="input-group-append">
                                    <div className="input-group-text">
                                        <span className="fas fa-lock" />
                                    </div>
                                </div>
                            </div>
                            {errors.password && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{errors.password.message}</span>}
                            <div className="row ">
                                 <div className="col-8">
                                    <div className="icheck-primary">
                                    </div> 
                                </div>
                                {/* /.col */}
                                <div className="col-4">
                                    <button type="submit" className="btn btn-primary btn-block">Sign In</button>
                                </div>
                            </div>
                        </form>
                    
                      
                    
                        
                    </div>
                 
                </div>
            </div>

            <Toaster/>
        </center>
    )
}

export default Login