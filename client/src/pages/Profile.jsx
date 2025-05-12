import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { useForm,Controller } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { MdOutlineSupportAgent } from "react-icons/md";
import Store from '../context/context';
import Select from 'react-select'
import { cities } from '../utils/db';
const Profile = () => {
  const { user, setUser } = useContext(Store);
  const { register, handleSubmit, formState: { errors }, reset ,control,setValue} = useForm();


  const [udata, setUdata] = useState(user);




  const onSubmit = async (data) => {
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}loginsystem/api/updatespecificagent`,
        data,
        { withCredentials: true }
      );

      toast.success(res?.data?.message);

      setUser(res?.data?.data); 
      console.log("updated user",user)
      reset();
    } catch (error) {
      toast.error("Profile update failed!");
      console.error(error);
    }
  };

  useEffect(() => {
    setUdata(user);
    if (user) {
      localStorage.setItem("loggedUser", JSON.stringify(user)); 
    }
  }, [user]);

  useEffect(() => {
    if (udata?.city) {
        setValue("city", udata.city); 
    }
}, [udata, setValue]);

  return (
    <div className='row'>
      <div className='col' style={{ float: "left" }}>
        <div className="content">
          <div className="container-fluid">
            <div className="row">
              {/* Left Column: Agent Details */}
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-header border-0">
                    <h3 className="card-title">Agent Details</h3>
                  </div>
                  <div className="card-body" style={{ display: "flex" }}>
                    <MdOutlineSupportAgent size={'80px'} style={{ marginRight: "30%" }} />
                    <div>
                      <h1 style={{ fontSize: "20px" }}>Designation: Agent</h1>
                      <h1 style={{ fontSize: "20px" }}>Name: {udata?.name || "N/A"}</h1>
                      <h1 style={{ fontSize: "20px" }}>Email: {udata?.email || "N/A"}</h1>
                      <h1 style={{ fontSize: "20px" }}>City: {udata?.city?.map((i,index)=>{
                        return <>{udata.city.length-1===index?<span>{i}.</span>:<span>{i},</span>}</>
                      })}</h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Update Profile */}
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-header border-0">
                    <h3 className="card-title">Update Profile</h3>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="form-group">
                        <label style={{ marginRight: "20%" }}>Name</label>
                        <input
                        className="form-control"
                          type="text"
                          placeholder="Name"
                          defaultValue={udata?.name || ""}
                          {...register("name", { required: "Name field is required" })}
                        />
                        {errors.name && <span style={{ color: "red", fontSize: "14px" }}>{errors.name.message}</span>}
                      </div>

                      <div className="form-group">
                        <label style={{ marginRight: "10%" }}>Email Address</label>
                        <input className="form-control"
                          type="text"
                          placeholder="Email"
                          defaultValue={udata?.email || ""}
                          {...register("email", {
                            required: "Email field is required",
                            pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
                              message: "Invalid email address",
                            }
                          })}
                        />
                        {errors.email && <span style={{ color: "red", fontSize: "14px" }}>{errors.email.message}</span>}
                      </div>
                      <div className="form-group">
                                    <label htmlFor="exampleInputEmail1" style={{display:"flex"}}>City</label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        rules={{ required: "City is required" }}
                                        defaultValue={udata?.city || ""}
                                        render={({ field: { onChange, value, ...rest } }) => (
                                            <>
                                              <Select 
                                                {...rest} 
                                                options={cities} 
                                                isMulti 
                                                value={cities.filter(city => value?.includes(city.value))} 
                                                onChange={(selectedOptions) => onChange(selectedOptions?.map(option => option?.value))} 
                                              />
                                            </>
                                          )}
                                        />
                                     {errors.city && <span style={{ display: "flex", color: "red", fontSize: "12px" }}>{errors.city.message}</span>}
                                </div>
                      <div className="form-group">
                        <label style={{ marginRight: "15%" }}>Password</label>
                        <input className="form-control" type="password" placeholder="Password" {...register("password")} />
                      </div>

                      <button type="submit">Update</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Toaster />
      </div>
    </div>
  );
};

export default Profile;
