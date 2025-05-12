import React, { useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import axios from 'axios'
import { useState } from 'react';
const columns = [
    // { field: '_id', headerName: 'id', width: 90 },
    { field: 'index', headerName: 'Index', width: 90 },
    {
      field: 'customerid',
      headerName: 'Customer Id',
      width: 150,
      editable: true,
    },
    {
      field: 'firstname',
      headerName: 'First Name',
      width: 150,
      editable: true,
    },
    {
      field: 'lastname',
      headerName: 'Last Name',
      editable: true,
    },
    {
      field: 'company',
      headerName: 'Company',
      width: 150,
      editable: true,
    },
    {
      field: 'city',
      headerName: 'City',
      width: 150,
      editable: true,
    },
    {
      field: 'country',
      headerName: 'Country',
      width: 150,
      editable: true,
    },
    {
      field: 'phone1',
      headerName: 'Phone 1',
      width: 150,
      editable: true,
    },
    {
      field: 'phone2',
      headerName: 'Phone 2',
      width: 150,
      editable: true,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 150,
      editable: true,
    },
    {
      field: 'subscriptiondate',
      headerName: 'Subscription Date',
      width: 150,
      editable: true,
    },
    {
      field: 'website',
      headerName: 'Website',
      width: 150,
      editable: true,
    },
  ];



  

  
const AgentFileTable = () => {
  const[fileData,setFileData]=useState(null)

 async function getFileData(){
      try{
        const FileData=await axios.get(`http://localhost:3000/loginsystem/api/readfile`,{ withCredentials: true })
        // console.log(FileData.data)
        setFileData(FileData.data)
      }
      catch(err){
        console.log(err)
      }
  }
  useEffect(()=>{
    getFileData()
  },[])

  return (
    <Box sx={{ height: 400, width: '100%' }}>
    <DataGrid
      rows={fileData}
      getRowId={(fileData) => fileData?._id}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      pageSizeOptions={[5]}
      checkboxSelection
      disableRowSelectionOnClick
    />
  </Box>
  )
}

export default AgentFileTable