import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import Store from '../context/context';
import Select from 'react-select'
import { cities } from '../utils/db'
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";


const Crud = () => {
    const { user, setUser } = useContext(Store);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control
    } = useForm()

    const {
        register: updateRegister,
        handleSubmit: handleSubmitUpdate,
        watch,
        reset: updateReset,
        formState: { errors: updateErrors },
        setValue,
        control:updateControl
    } = useForm()

    const [Data, setData] = useState(null)
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => {
        setShow(false)
        reset()
    }

    const [updateShow, setUpdateShow] = useState(false)
    const [defaultData, setDefaultData] = useState(null)

    const handleUpdateClose = () => {
        setDefaultData(null)
        setUpdateShow(false);
        updateReset()
    }
    useEffect(() => {
        setValue("email", defaultData?.email);
        setValue("name", defaultData?.name);
        setValue("city",defaultData?.city)


    }, [defaultData, setValue])
    const handleUpdateShow = (updateData) => {

        setDefaultData(updateData);
        setUpdateShow(true);
    }

    //getAllAgents API
    async function list() {
        try {
            const agentsData = await axios.get(`${process.env.REACT_APP_API_URL}loginsystem/api/getagentsdata`, { withCredentials: true })
            setData(agentsData?.data)
        }
        catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        list()
    }, [])

    const onSubmit = async (data) => {
        try {
            const cA = await axios?.post(`${process.env.REACT_APP_API_URL}loginsystem/api/agentc`, data, { withCredentials: true })
            console.log(cA)
            toast.success(cA?.data?.message)
            console.log(data)
            list()
            reset()
            setShow(false)
        }
        catch (err) {
            toast.error(err?.response?.data?.message)
        }
    }

    //Delete login
    const handleConfirm = (id) => {
        if (window.confirm("are u really wanna delete it")) {
            handleDelete(id)
        }
        else {
        }
    }
    async function handleDelete(id) {
        try {
            const deleteUser = await axios.delete(`${process.env.REACT_APP_API_URL}loginsystem/api/deltedata/${id}`, { withCredentials: true })
            toast.success(deleteUser?.data?.message)
            list()
        }
        catch (err) {
            console.log(err)
        }
    }



    const onSubmitUpdate = async (data) => {
        try {
            console.log(defaultData)
            if (defaultData?._id === JSON.parse(localStorage.getItem("loggedUser"))._id) {
                const update = await axios.put(`${process.env.REACT_APP_API_URL}loginsystem/api/update/${defaultData?._id}`, data, { withCredentials: true })
                console.log(update)
                setUser(update?.data?.data)
                toast.success("profile updated")
                list()
                setUpdateShow(false);
                setDefaultData(null)
                updateReset()
            } else {
                const update = await axios.put(`${process.env.REACT_APP_API_URL}loginsystem/api/update/${defaultData?._id}`, data, { withCredentials: true })
                console.log(update)
                console.log(data)
                toast.success(update?.data?.message)
                list()
                setUpdateShow(false);
                setDefaultData(null)
                updateReset()

            }

        }
        catch (err) {
            toast.error(err.response.data.error)
        }
    }

    useEffect(() => {

    }, [user])



    return (
        <div className="card">
            <div className="card-header border-0">
                <h3 className="card-title" style={{ fontWeight: "bold" }}>Users List</h3>
                <div className="card-tools">
                    <Link to={""} className="btn btn-tool btn-sm">
                        <button type="button" class="btn btn-block btn-primary btn-sm" variant="primary" onClick={handleShow} >Add Agents</button>
                    </Link>
                    <Modal show={show} onHide={handleClose}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Modal.Header>
                                <Modal.Title>Add Agents</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="form-group">
                                    <label>Designation</label>
                                    <select className="form-control" {...register("designation", { required: true })}>
                                        <option value="agent">agent</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Name<span style={{ color: "red" }}>*</span></label>
                                    <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Name" {...register("name", {
                                        required: {
                                            value: true,
                                            message: "name field is required"
                                        }
                                    })} />
                                    {errors.name && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{errors.name.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">Email address<span style={{ color: "red" }}>*</span></label>
                                    <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" {...register("email", {
                                        required: {
                                            value: true,
                                            message: "email filed is required"
                                        }
                                        , pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
                                            message: "Invalid email address",
                                        }
                                    })} />
                                    {errors.email && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{errors.email.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">City<span style={{ color: "red" }}>*</span></label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        rules={{ required: "City is required" }}
                                        render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
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
                                     {errors.city && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{errors.city.message}</span>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Password<span style={{ color: "red" }}>*</span></label>
                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" {...register("password", {
                                        required: {
                                            value: true,
                                            message: "password field is required"
                                        }
                                    })} />
                                    {errors.password && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{errors.password.message}</span>}
                                </div>
                                {/* /.card-body */}
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <button type="submit" className="btn btn-primary">Add</button>
                            </Modal.Footer>
                        </form>
                    </Modal>
                </div>
            </div>
            <div className="card-body table-responsive p-0">
                <table className="table table-striped table-valign-middle">
                    <thead>
                        <tr>
                            <th>Designation</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>city</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Data?.map((agentsDetails, index) => {
                                return (
                                    <tr key={index}>
                                        <td>
                                            {agentsDetails?.designation}
                                        </td>
                                        <td>{agentsDetails?.name}{JSON.parse(localStorage.getItem('loggedUser'))?._id === agentsDetails?._id ? <span style={{ color: "red" }}>*</span> : ""}</td>
                                        <td>
                                            <small className="text-success ">
                                                {agentsDetails?.email}
                                            </small>

                                        </td>
                                        <td>
                                        {agentsDetails?.city?.map((i,index)=>{
                                            return agentsDetails?.city?.length-1===index?<span key={index}>{i}.</span>:<span>{i},</span>
                                        })}
                                            
                                        </td>
                                        <td>
                                            <Link className="text-muted">
                                            <FaRegEdit onClick={() => handleUpdateShow(agentsDetails)}/>
                                                {/* <ion-icon name="create-outline" ></ion-icon> */}
                                            </Link>{
                                                JSON.parse(localStorage.getItem('loggedUser'))?._id === agentsDetails?._id ? "" : <Link className="text-muted">
                                                    {/* <ion-icon name="trash-outline" ></ion-icon> */}
                                                    <RiDeleteBin5Line onClick={() => handleConfirm(agentsDetails?._id)}/>
                                                </Link>
                                            }

                                        </td>

                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
                <Modal show={updateShow} onHide={handleUpdateClose}>
                    <form onSubmit={handleSubmitUpdate(onSubmitUpdate)}>
                        <Modal.Header>
                            <Modal.Title>Update Agents</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Name</label>
                                <input type="text" className="form-control" id="exampleInputEmail1" placeholder="Enter Name" value={watch("name") || ""} {...updateRegister("name", {
                                    required: {
                                        value: true,
                                        message: "name field is required"
                                    }
                                })} />
                                {updateErrors.name && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{updateErrors.name.message}</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" value={watch("email") || ""}  {...updateRegister("email", {
                                    required: {
                                        value: true,
                                        message: "email filed is required"
                                    }
                                    , pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.com$/,
                                        message: "Invalid email address",
                                    }
                                })} />
                                {updateErrors.email && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{updateErrors.email.message}</span>}
                            </div>
                            <div className="form-group">
                                    <label htmlFor="exampleInputEmail1">City</label>
                                    <Controller
                                        name="city"
                                        control={updateControl}
                                        rules={{ required: "City is required" }}
                                        render={({ field: { onChange, value, ...rest }, fieldState: { error } }) => (
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
                                     {updateErrors.city && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{updateErrors.city.message}</span>}
                                </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="New Password"  {...updateRegister("password", {
                                    required: {
                                        value: false,
                                        message: "password field is required"
                                    }
                                })} />
                                {updateErrors.password && <span style={{ display: "flex", color: "red", fontSize: "14px" }}>{updateErrors.password.message}</span>}
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleUpdateClose}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit'>
                                Update
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal>
            </div>
            <Toaster />
        </div>
    )
}

export default Crud