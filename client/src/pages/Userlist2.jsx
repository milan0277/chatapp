import React, { useEffect, useState } from "react";
import { MdSystemUpdateAlt } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { RxCross1 } from "react-icons/rx";
import Card from "react-bootstrap/Card";
import { State } from 'country-state-city';
import toast, { Toaster } from 'react-hot-toast'
import { MdOutlineBrowserNotSupported } from "react-icons/md";


const Userlist2 = () => {
    const [getdata, setData] = useState(null);
    const [show, setShow] = useState(false);
    const [getUpdate, setGetUpdate] = useState(null);
    const [getUpdateId, setGetUpdateId] = useState(null);

    const states = State.getStatesOfCountry("IN");

    const handleClose = () => setShow(false);

    const handleShow = (id, user) => {
        const userArray = Array.isArray(user) ? user : [user];

        const processedUser = userArray.map(u => ({
            ...u,
            records: u.records || [{
                name: '',
                age: '',
                fields: [{
                    state: '',
                    address: ''
                }]
            }]
        }));

        setGetUpdate({ records: processedUser });
        setGetUpdateId(id);
        setShow(true);
    };

    const getUserListData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/loginsystem/api/readpara",
                { withCredentials: true }
            );
            console.log(response?.data);
            setData(response?.data?.length > 0 ? response?.data : null);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        getUserListData();
    }, []);

    const handleRecordChange = (recordIndex, key, value) => {
        setGetUpdate((prev) => {
            const updatedRecords = [...prev.records];
            updatedRecords[recordIndex] = {
                ...updatedRecords[recordIndex],
                [key]: value
            };
            return { ...prev, records: updatedRecords };
        });
    };

    const handleFieldChange = (recordIndex, fieldIndex, key, value) => {
        setGetUpdate((prev) => {
            const updatedRecords = [...prev.records];
            const updatedFields = [...updatedRecords[recordIndex].fields];
            updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                [key]: value
            };
            updatedRecords[recordIndex] = {
                ...updatedRecords[recordIndex],
                fields: updatedFields
            };
            return { ...prev, records: updatedRecords };
        });
    };

    const handleUpdate = async () => {
        try {
            // console.log(getUpdate)
            const res = await axios.put(
                `http://localhost:5000/loginsystem/api/updatepara/${getUpdateId}`,
                getUpdate,
                { withCredentials: true }
            );
            if (res.status === 200) {
                toast.success(res?.data?.message)
            }
            getUserListData();
            handleClose();
        } catch (err) {
            console.error(err);
            toast.error(err?.message)
        }
    };

    const handleDelete = async (id) => {
        const a = window.confirm()
        if (a) {
            try {
                await axios.delete(
                    `http://localhost:5000/loginsystem/api/deletepara/${id}`,
                    { withCredentials: true }
                );
                getUserListData();
            } catch (err) {
                console.error("Error deleting user:", err);
            }
        }

    };

    return (
        <>
            {
                getdata ? <div className="card">
                    <div className="card-header border-0">
                        <h3 className="card-title" style={{ fontWeight: "bolder" }}>Sheets Data</h3>
                    </div>
                    <div className="card-body table-responsive p-0">
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>State</th>
                                    <th>Address</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getdata?.map((dataItem) => {
                                    const names = dataItem.records?.map((record) => record.name).join(", ");
                                    const ages = dataItem.records?.map((record) => record.age).join(", ");
                                    const states = dataItem.records
                                        ?.flatMap((record) => record.fields?.map((field) => field.state))
                                        .join(", ");
                                    const addresses = dataItem.records
                                        ?.flatMap((record) => record.fields?.map((field) => field.address))
                                        .join(", ");

                                    return (
                                        <tr key={dataItem._id}>
                                            <td>{names}</td>
                                            <td>{ages}</td>
                                            <td>{states}</td>
                                            <td>{addresses}</td>
                                            <td>
                                                <MdSystemUpdateAlt
                                                    size={"20px"}
                                                    onClick={() => handleShow(dataItem._id, dataItem.records)}
                                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                                />
                                                <RiDeleteBinLine
                                                    size={"20px"}
                                                    onClick={() => handleDelete(dataItem._id)}
                                                    style={{ cursor: 'pointer' }}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                                }
                            </tbody>
                        </Table>
                    </div>



                    {getUpdate && (
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header>
                                <Modal.Title>Update User</Modal.Title>
                                <RxCross1 onClick={handleClose} style={{ cursor: "pointer" }} />
                            </Modal.Header>

                            <Modal.Body>
                                {/* Debug information */}
                                {/* <div style={{color: 'red', marginBottom: '10px'}}>
                            {JSON.stringify(getUpdate, null, 2)}
                        </div> */}

                                <form>
                                    {/* Loop through multiple records */}
                                    {getUpdate?.records?.map((record, recordIndex) => (
                                        <Card key={recordIndex} style={{ marginBottom: "10px" }}>
                                            <Card.Body>
                                                <div style={{ display: "flex", gap: "10%", alignItems: "center" }}>
                                                    <div style={{ flex: 1 }}>
                                                        <label>Name</label>
                                                        <input
                                                            type="text"
                                                            style={{ width: "100%" }}
                                                            value={record.name || ""}
                                                            onChange={(e) => handleRecordChange(recordIndex, "name", e.target.value)}
                                                        />
                                                    </div>

                                                    <div style={{ flex: 1 }}>
                                                        <label>Age</label>
                                                        <input
                                                            type="number"
                                                            style={{ width: "100%" }}
                                                            value={record.age || ""}
                                                            onChange={(e) => handleRecordChange(recordIndex, "age", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    ))}

                                    {/* Loop through fields inside each record */}
                                    {getUpdate?.records?.map((record, recordIndex) =>
                                        record.fields?.map((field, fieldIndex) => (
                                            <Card key={`${recordIndex}-${fieldIndex}`} style={{ marginBottom: "10px" }}>
                                                <Card.Body>
                                                    <div style={{ display: "flex", gap: "10%", alignItems: "center" }}>
                                                        <div style={{ flex: 1 }}>
                                                            <label>State</label>
                                                            <select
                                                                style={{ width: "100%" }}
                                                                value={field.state || ""}
                                                                onChange={(e) =>
                                                                    handleFieldChange(recordIndex, fieldIndex, "state", e.target.value)
                                                                }
                                                            >
                                                                <option value="">Select State</option>
                                                                {states?.map((arrElement, index) => (
                                                                    <option key={index} value={arrElement?.name}>
                                                                        {arrElement?.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div style={{ flex: 1 }}>
                                                            <label>Address</label>
                                                            <input
                                                                type="text"
                                                                style={{ width: "100%" }}
                                                                value={field.address || ""}
                                                                onChange={(e) =>
                                                                    handleFieldChange(recordIndex, fieldIndex, "address", e.target.value)
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        ))
                                    )}
                                </form>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleUpdate}>
                                    Update
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    )}
                    <Toaster />
                </div> : <div className="card">
                    <div className="card-header border-0">
                        <div className="d-flex justify-content-between">
                        </div>
                    </div>
                    <div className="card-body d-flex">
                       <p className="mt-5 fs-1 NSDA" >No Sheet Data Available</p>
                    </div>
                </div>

            }

        </>

    );
};

export default Userlist2;