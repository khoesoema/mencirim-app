import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Breadcrumb from 'rsuite/Breadcrumb';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SearchIcon from '@rsuite/icons/Search';

import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import LaunchIcon from '@mui/icons-material/Launch';

import { ErrorLogsCollections } from '../../../../../db/Logs';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function ListErrorLog() {
	let navigate = useNavigate();

	const [searchText, setSearchText] = useState('');

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('loggedAt');
	const [order, setOrder] = useState(-1);

	const [pageSize, setPageSize] = useState(10);

	const [errorLog, errorLogLoading] = useTracker(() => {
		let subs = Meteor.subscribe('errorlog.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = ErrorLogsCollections.find(
			{
				module: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90},
		{
		  field: 'loggedAt',
		  headerName: 'Tanggal',
		  width: 200,
		  valueFormatter: params => 
     		moment(params?.value).format("YYYY-MM-DD hh:mm:ss"),
		},
		{
		  field: 'errorCode',
		  headerName: 'Error Code',
		  width: 200,
		},
		{
		  field: 'module',
		  headerName: 'Module',
		  width: 300,
		},
		{
		  field: 'description',
		  headerName: 'Description',
		  sortable: false,
		  width: 400,
		},
		{
			field: '_id',
			headerName: 'Action',
			sortable: false,
			width: 100,
			align: 'center',
			filterable: false,
			renderCell: (params) => {
				//console.log(params.value);
				return (
				  <>
					<a className ="fakeLink"
						onClick={( e ) => {
							navigate('/ViewErrorLog/' + params.value);
						}}
					>
						<LaunchIcon /> 
					</a>
				  </>
				);
			  }
		  },
	];

	const [rows, setRows] = useState([]);

	useEffect(()=>{
		let baris = [];
		if(errorLog && errorLogLoading === false) {
			errorLog.map((item, index) => {
				baris[index]={
					id: (index + 1),
					...item
				};
			})
			setRows(baris);
		} else if(!errorLog && errorLogLoading === false) {
			baris = [];
		}
	},[errorLog, errorLogLoading]);

	return (
		<>
			<div className="mainContainerRoot">
				<div className="mainContent">
					<div className="breadcrumContainer">
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Error Log
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Error Log</b>
					</h6>
					<hr />
					<Row>
						<Col></Col>
						<Col>
						<InputGroup inside>
							<Input
								type="text"
								placeholder="Cari Data"
								style={{width:300}}
								value={searchText}
								onChange={(e) => {
									setSearchText(e);
								}}
							/>
							<InputGroup.Addon>
        						<SearchIcon />
      						</InputGroup.Addon>
						</InputGroup>
						</Col>
					</Row>
					<hr />
					<Box sx={{ height: 500, width: '100%'}}>
    				  	<DataGrid
							components={{ Toolbar: GridToolbar }}
							
							loading={errorLogLoading}
							columns={columns}
    				  	  	rows={rows}
							
							pageSize={pageSize}
							onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
							rowsPerPageOptions={[10,20,50]}
							pagination
    				  	/>
    				</Box>
				</div>
			</div>
		</>
	);
}
