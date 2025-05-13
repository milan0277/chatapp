import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { State } from 'country-state-city';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';

const Df = () => {
    const states = State.getStatesOfCountry("IN");
    const stateOptions = states.map((s) => ({ label: s.name, value: s.name }));

    const [sections, setSections] = useState([
        {
            id: 1,
            name: "",
            age: "",
            fields: [{ state: "", address: "" }]
        },
    ]);

    const [errors, setErrors] = useState({});

    const addSection = () => {
        setSections([
            ...sections,
            {
                id: sections.length + 1,
                name: "",
                age: "",
                fields: [{ state: "", address: "" }]
            }
        ]);
    };

    const removeSection = (sectionIndex) => {
        const updatedSections = sections.filter((_, i) => i !== sectionIndex);
        setSections(updatedSections);
    };

    const addField = (sectionIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].fields.push({ state: "", address: "" });
        setSections(updatedSections);
    };

    const removeField = (sectionIndex, fieldIndex) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].fields = updatedSections[sectionIndex].fields.filter((_, i) => i !== fieldIndex);
        setSections(updatedSections);
    };

    const handleNameChange = (sectionIndex, value) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].name = value;
        setSections(updatedSections);
    };

    const handleAgeChange = (sectionIndex, value) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].age = value;
        setSections(updatedSections);
    };

    const handleFieldChange = (sectionIndex, fieldIndex, fieldName, value) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].fields[fieldIndex][fieldName] = value;
        setSections(updatedSections);
    };

    const handleSubmit = async () => {
        let isValid = true;
        const newErrors = {};
        document.querySelectorAll(".fgf").forEach(el => {
            el.style.marginBottom = '1.5rem';
        });
        document.querySelectorAll(".rmve").forEach(el => {
            el.style.marginBottom = '1.5rem';
        });

        sections.forEach((section, sIndex) => {
            if (!section.name.trim()) {
                isValid = false;
                newErrors[`name-${sIndex}`] = "Name is required.";
            }
            if (!section.age || isNaN(section.age) || parseInt(section.age) <= 0) {
                isValid = false;
                newErrors[`age-${sIndex}`] = "Valid age is required.";
            }

            section.fields.forEach((field, fIndex) => {
                if (!field.state) {
                    isValid = false;
                    newErrors[`state-${sIndex}-${fIndex}`] = "State is required.";
                }
                if (!field.address.trim()) {
                    isValid = false;
                    newErrors[`address-${sIndex}-${fIndex}`] = "Address is required.";
                }
            });
        });

        setErrors(newErrors);

        if (isValid) {
            try {
                const res = await axios.post(`http://localhost:5000/loginsystem/api/paraadd`, sections, { withCredentials: true });

                if (res.status === 201) {
                    toast.success(res?.data?.message);
                }

                setSections([
                    {
                        id: 1,
                        name: "",
                        age: "",
                        fields: [{ state: "", address: "" }]
                    },
                ]);
                setErrors({});
            } catch (err) {
                console.log(err);
                toast.error(err?.message);
            }
        }
    };

    return (
        <div className="container col-12">
            <div className="card">
                <div className="card-header bg-info text-white">
                    <h3 className="card-title">New Sheet</h3>
                </div>
                <div className="card-body">
                    {sections.map((section, sectionIndex) => (
                        <React.Fragment key={section.id}>
                            <Card className="mb-3">
                                <Card.Body>
                                    <div className="row g-3 align-items-end">
                                        <div className="col-md-4">
                                            <label className="form-label">Name</label>

                                            <input
                                                type='text'
                                                className={`form-control ${errors[`name-${sectionIndex}`] ? 'is-invalid' : ''}`}
                                                value={section.name}
                                                placeholder='Enter Name'
                                                onChange={(e) => handleNameChange(sectionIndex, e.target.value)}
                                            />
                                            {errors[`name-${sectionIndex}`] && (
                                                <span className="invalid-feedback">{errors[`name-${sectionIndex}`]}</span>
                                            )}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Age</label>
                                            <input
                                                type='number'
                                                className={`form-control ${errors[`age-${sectionIndex}`] ? 'is-invalid' : ''}`}
                                                value={section.age}
                                                placeholder='Enter Age'
                                                onChange={(e) => handleAgeChange(sectionIndex, e.target.value)}
                                            />
                                            {errors[`age-${sectionIndex}`] && (
                                                <span className="invalid-feedback">{errors[`age-${sectionIndex}`]}</span>
                                            )}
                                        </div>
                                        <div className="col-md-4  fgf">
                                            <button
                                                onClick={() => addField(sectionIndex)}
                                                className="btn btn-success w-100"
                                                style={{ marginTop: '0rem' }}
                                            >
                                                Add Field
                                            </button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {section.fields.map((field, fieldIndex) => (
                                <Card key={`field-${fieldIndex}`} className="mb-2">
                                    <Card.Body>
                                        <div className="row g-3 align-items-end">
                                            <div className="col-md-4">
                                                <label className="form-label">State</label>
                                                <Select
                                                    options={stateOptions}
                                                    value={
                                                        field.state
                                                            ? { label: field.state, value: field.state }
                                                            : null
                                                    }
                                                    onChange={(selected) =>
                                                        handleFieldChange(sectionIndex, fieldIndex, "state", selected?.value || "")
                                                    }
                                                    className={errors[`state-${sectionIndex}-${fieldIndex}`] ? 'is-invalid' : ''}
                                                    placeholder="Select State"
                                                />
                                                {errors[`state-${sectionIndex}-${fieldIndex}`] && (
                                                    <div className="text-danger small mt-1">
                                                        {errors[`state-${sectionIndex}-${fieldIndex}`]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label">Address</label>
                                                <input
                                                    type='text'
                                                    className={`form-control ${errors[`address-${sectionIndex}-${fieldIndex}`] ? 'is-invalid' : ''}`}
                                                    value={field.address}
                                                    placeholder='Enter Address'
                                                    onChange={(e) => handleFieldChange(sectionIndex, fieldIndex, "address", e.target.value)}
                                                />
                                                {errors[`address-${sectionIndex}-${fieldIndex}`] && (
                                                    <div className="invalid-feedback">{errors[`address-${sectionIndex}-${fieldIndex}`]}</div>
                                                )}
                                            </div>
                                            <div className="col-md-4 rmve">
                                                {section.fields.length > 1 && (
                                                    <button
                                                        onClick={() => removeField(sectionIndex, fieldIndex)}
                                                        className="btn btn-danger w-100">
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))}

                            {sections.length > 1 && (
                                <button
                                    onClick={() => removeSection(sectionIndex)}
                                    className="btn btn-danger mb-4">
                                    Remove Section
                                </button>
                            )}
                        </React.Fragment>
                    ))}

                    <div className="d-flex gap-2 mt-4">
                        <button
                            onClick={addSection}
                            className="btn btn-info text-white mr-2">
                            Add Section
                        </button>
                        <button
                            className="btn btn-success text-white"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default Df;
