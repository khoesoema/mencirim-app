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
import {
	DataGrid,
	GridToolbar,
	gridPageCountSelector,
	gridPageSelector,
	useGridApiContext,
	useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';

import { KassaCollections } from '../../../db/Kassa';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

function CustomPagination() {
	const apiRef = useGridApiContext();
	const page = useGridSelector(apiRef, gridPageSelector);
	const pageCount = useGridSelector(apiRef, gridPageCountSelector);

	return (
		<Pagination
			color="primary"
			count={pageCount}
			page={page + 1}
			onChange={(event, value) => apiRef.current.setPage(value - 1)}
			showFirstButton
			showLastButton
		/>
	);
};

function SortedDescendingIcon() {
	return <ExpandMoreIcon className="icon" />;
}

function SortedAscendingIcon() {
	return <ExpandLessIcon className="icon" />;
}

export function CashierOnBoarding() {
	let navigate = useNavigate();

	const [pageSize, setPageSize] = useState(10);

	const [searchText, setSearchText] = useState('');

	const [limit, setLimit] = useState(20);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('code');
	const [order, setOrder] = useState(1);

	const [kassa, kassaLoading] = useTracker(() => {
		let subs = Meteor.subscribe('kassa.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = KassaCollections.find(
			{
				$or: [
					{
						code: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						name: {
							$regex: searchText,
							$options: 'i',
						},
					},
				],
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const [kassaCount, kassaCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('kassa.countList', { searchText });

		let data = Counts.get('kassa.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(kassaCount / 20));
	}, [kassaCount]);

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90 },
		{
			field: 'code',
			headerName: 'Code',
			width: 200,
		},
		{
			field: 'name',
			headerName: 'Name',
			width: 200,
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
						<Button
							onClick={(e) => {
								navigate('/Cashier/' + params.value);
							}}
							endIcon={<LaunchIcon />}
							variant="contained"
						>
							Open
						</Button>
					</>
				);
			}
		},
	];

	const [rows, setRows] = useState([]);

	useEffect(() => {
		let baris = [];
		if (kassa && kassaLoading === false) {
			kassa.map((item, index) => {
				baris[index] = {
					id: (index + 1),
					...item
				};
			})
			setRows(baris);
		} else if (!kassa && kassaLoading === false) {
			baris = [];
		}
	}, [kassa, kassaLoading]);

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
								Cashier
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Cashier</b>
					</h6>
					<hr />
					<Row>
						<Col>
						</Col>
						<Col>
							<InputGroup inside>
								<Input
									type="text"
									placeholder="Cari Data"
									style={{ width: 300 }}
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
					<Box sx={{ height: 500, width: '100%' }}>
						<DataGrid
							loading={kassaLoading}
							columns={columns}
							rows={rows}

							initialState={{
								pagination: {
									pageSize: 20,
								},
							}}

							pageSize={pageSize}
							pagination
							rowsPerPageOptions={[20]}
							components={{
								LoadingOverlay: LinearProgress,
								Pagination: CustomPagination,
								ColumnSortedDescendingIcon: SortedDescendingIcon,
								ColumnSortedAscendingIcon: SortedAscendingIcon,
							}}
						/>
					</Box>
				</div>
			</div>
		</>
	);
}
