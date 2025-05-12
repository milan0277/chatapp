import React from 'react'
import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import indianStates from '../db/states';
import countries from '../db/countries';
const Rough = () => {
    const [sections, setSections] = useState([
        { id: 1, fields: [{ value: "" }] },
    ]);

    const states = indianStates;
    const country = countries;

   
    const addSection = () => {
        setSections([...sections, { id: sections.length + 1, fields: [{ value: "" }] }]);
    };

 
    const removeSection = (sectionIndex) => {
        const updatedSections = sections.filter((_, i) => i !== sectionIndex);
        setSections(updatedSections);
    };

    
    const addField = (sectionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].fields.push({ value: "" });
        setSections(updatedSections);
    };


    const removeField = (sectionIndex, fieldIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].fields = updatedSections[sectionIndex].fields.filter((_, i) => i !== fieldIndex);
        setSections(updatedSections);
    };

   
    const handleInputChange = (sectionIndex, fieldIndex, event) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].fields[fieldIndex].value = event.target.value;
        setSections(updatedSections);
    };
    return (

        <div>
            <div className="card card-info">
                <div className="card-header">
                    <h3 className="card-title">New Sheets</h3>
                </div>

                <div className="card-body">
              
                    {/* inside card 1 */}
                    {sections.map((section, sectionIndex) => (
                        <>
                              <Card>
                        <Card.Body>
                            <div>
                                <div style={{ display: "flex", gap: "10%" }}>
                                    <div>
                                        <label>Name</label>
                                        <input type='text' style={{ width: "100%" }} />
                                    </div>
                                    <div>
                                        <label>Age</label>
                                        <input type='number' style={{ width: "100%" }} />
                                    </div>
                                    <button
                                onClick={() => addField(sectionIndex)}
                                className=" text-black px-3 py-1 rounded mt-2"
                                style={{ color: "white",backgroundColor:"rgb(23,162,184)",border:"rgb(23,162,184)" }}>
                                Add Field
                            </button>
                                </div>

                            </div>
                        </Card.Body>
                    </Card>


                            {section.fields.map((field, fieldIndex) => (
                                <Card>
                                    <Card.Body>
                                        <div style={{ display: "flex", gap: "10%" }}>


                                            <div>
                                                <label>Country</label>
                                                <select style={{ width: "100%" }}>
                                                    <option defaultValue={""}>Select Country</option>
                                                    {
                                                        country?.map((arrElement, index) => {
                                                            return <option key={index} >{arrElement}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>

                                            <div>
                                                <label>State</label>
                                                <select style={{ width: "100%" }}>
                                                    <option defaultValue={""}>Select State</option>
                                                    {
                                                        states?.map((arrElement, index) => {
                                                            return <option key={index}>{arrElement}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div>
                                                <label>Address</label>
                                                <input type='address' style={{ width: "100%" }} />
                                            </div>
                                        
                                            <button
                                                onClick={() => removeField(sectionIndex, fieldIndex)}
                                                disabled={section.fields.length === 1}
                                                className="bg-red text-black px-2 py-1 rounded mb-2"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}

                            {/* Add Field Button inside a section */}
                           

                            {/* Remove Section Button */}
                            {sections.length > 1 && (
                                <button
                                    onClick={() => removeSection(sectionIndex)}
                                    className="bg-gray-600 text-white px-2 py-2 rounded ml-2 mb-4"
                                    style={{ backgroundColor:"red",border:"red" }}
                                >
                                    Remove Section
                                </button>
                            )}
                        </>
                    ))}

                    {/* Add New Section Button */}
                    <button
                        onClick={addSection}
                        className="bg-green-500 text-black px-4 py-2 rounded mt-4 mr-3 ml-2"
                        style={{ color: "white",backgroundColor:"rgb(23,162,184)",border:"rgb(23,162,184)" }}
                    >
                        Add Section
                    </button>
                    <button className="bg-green-500 text-black px-4 py-2 rounded mt-4"
                    style={{ color: "white",backgroundColor:"rgb(23,162,184)",border:"rgb(23,162,184)" }}
                    > Submit </button>

                </div>
                {/* /.card-body */}
            </div>

        </div>

    )
}

export default Rough