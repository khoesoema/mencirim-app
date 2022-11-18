import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import IconButton from 'rsuite/IconButton';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import Modal from 'rsuite/Modal';
import Divider from 'rsuite/Divider';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import PlusIcon from '@rsuite/icons/Plus';
import SearchIcon from '@rsuite/icons/Search';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import Box from '@mui/material/Box';
import { 	DataGrid, 
			GridToolbar, 
			gridPageCountSelector,
			gridPageSelector,
			useGridApiContext,
			useGridSelector, 
		} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import LinearProgress from '@mui/material/LinearProgress';

import ImageIcon from '@mui/icons-material/Image';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { ProductsCollections } from '../../../../../db/Products';
import { Topbar } from '../../../template/Topbar';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');



export function ProductLists(props) {
	let navigate = useNavigate();

	const [searchText, setSearchText] = useState('');

	const [pageSize, setPageSize] = useState(20);

	const [limit, setLimit] = useState(20);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('kodeBarang');
	const [order, setOrder] = useState(1);

	function SortedDescendingIcon() {
		return <ExpandMoreIcon className="icon" />;
	}
	  
	function SortedAscendingIcon() {
		return <ExpandLessIcon className="icon" />;
	}
	
	const [products, productsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('products.list2', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = ProductsCollections.find(
			{
				$or: [
					{
						kodeBarang: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						namaBarang: {
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

	const [productsCount, productsCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('products.countList', { searchText });

		let data = Counts.get('products.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(productsCount / 20));
	}, [productsCount]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent,	setDeleteConfirmationDialogContent] = useState('');
	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'products.delete',
				{
					_id: selectedDeleteID,
				},
				(err, res) => {
					if (err) {
						setSelectedID('');
						setSelectedDeleteID('');
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setSelectedID('');
							setSelectedDeleteID('');
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setSelectedID('');
							setSelectedDeleteID('');
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setSelectedID('');
						setSelectedDeleteID('');
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		}
	}, [selectedDeleteID]);

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

	const columns = [
		{ field: 'id', headerName: 'ID', width: 90},
		{
		  field: 'kodeBarang',
		  headerName: 'Kode Barang',
		  
		  minWidth: 100,
		},
		{
			field: "imageBase64",
			headerName: "Image",
			width: 100,
			renderCell: (params) => {
			  //console.log(params);
			  return (
				<>
				  { params.value 
				  	? <Avatar src={params.value} variant="rounded"/>
					: <Avatar sx={{ bgcolor: blue[400] }} variant="rounded"><ImageIcon /></Avatar>
				  }
				</>
			  );
			}
		},
		{
		  field: 'namaBarang',
		  headerName: 'Nama Barang',
		  
          minWidth: 400,
		},
		{
		  field: 'barcode',
		  headerName: 'Barcode',
		  
		  minWidth: 150,
		},
		{
		  field: 'categoryID',
		  headerName: 'Kategori',
		  width: 100,
		},
		{
			field: 'supplier',
			headerName: 'Supplier',
			width: 100,
		},
		{
			field: 'hargamodal',
			headerName: 'Harga Modal',
			
			minWidth: 100,
			align: 'right',
			valueFormatter: params => 
     			formatNum(params?.value),
		},
		{
			field: 'hargajual',
			headerName: 'Harga Jual',
			
			minWidth: 100,
			align: 'right',
			valueFormatter: params => 
     			formatNum(params?.value),
		},
		{
			field: 'profitjual',
			headerName: 'Profit',
			
			minWidth: 100,
			align: 'right',
			valueFormatter: params => 
     			(params?.value + ' %'),
		},
		{
			field: 'qty',
			headerName: 'Qty',
			
			minWidth: 100,
			align: 'right',
		},
		{
			field: 'satuanKecil',
			headerName: 'Satuan',
			
			minWidth: 100,
		},
		{
			field: 'modifiedBy',
			headerName: 'Diubah Oleh',
			
			minWidth: 100,
		},
		{
			field: 'modifiedAt',
			headerName: 'Diubah Tanggal',
			
			minWidth: 200,
			valueFormatter: params => 
			   moment(params?.value).format("YYYY-MM-DD hh:mm:ss"),
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
							navigate('/EditProduct/' + params.value);
						}}
					>
						<FaPencilAlt /> 
					</a>
					<Divider vertical />
					<a className ="fakeLink"
							onClick={(e) => {
								setSelectedID(params.value);
								setDeleteConfirmationDialogOpen(true);
								setDeleteConfirmationDialogTitle('Hapus data Product');
								setDeleteConfirmationDialogContent(
									'Anda akan menghapus data Product ' +
									'[' + params.getValue(params.id, "kodeBarang") + ']' 
									+  params.getValue(params.id, "namaBarang") +
									'. Semua data yang berhubungan dengan Product ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
								);
							}}
						>
						<FaTrashAlt />
					</a>
				  </>
				);
			  }
		  },
	];

	const [rows, setRows] = useState([]);

	useEffect(()=>{
		let baris = [];
		if(products && productsLoading === false) {
			products.map((item, index) => {
				baris[index]={
					id: (index + 1),
					...item
				};
			})
			setRows(baris);
		} else if(!products && productsLoading === false) {
			baris = [];
		}
	},[products, productsLoading]);

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	return (
		<>
			<Topbar />
			<div className="mainContainerRoot">
				{selectedID && (
					<Modal
						backdrop={true}
						keyboard={false}
						open={deleteConfirmationDialogOpen}
						onClose={(e) => {
							setDeleteConfirmationDialogOpen(false);
						}}
					>
						<Modal.Header>
							<Modal.Title>
								{deleteConfirmationDialogTitle}
							</Modal.Title>
						</Modal.Header>

						<Modal.Body>
							{deleteConfirmationDialogContent}
						</Modal.Body>
						<Modal.Footer>
							<Button
								onClick={(e) => {
									setSelectedDeleteID(selectedID);
								}}
								appearance="primary"
							>
								Hapus
							</Button>
							<Button
								onClick={(e) => {
									setSelectedDeleteID('');
									setSelectedID('');
									setDeleteConfirmationDialogOpen(false);
									setDeleteConfirmationDialogTitle('');
									setDeleteConfirmationDialogContent('');
								}}
								appearance="subtle"
							>
								Batal
							</Button>
						</Modal.Footer>
					</Modal>
				)}
				<Modal
					backdrop={true}
					keyboard={false}
					open={dialogOpen}
					onClose={(e) => {
						setDialogOpen(false);
					}}
				>
					<Modal.Header>
						<Modal.Title>{dialogTitle}</Modal.Title>
					</Modal.Header>

					<Modal.Body>{dialogContent}</Modal.Body>
				</Modal>{' '}
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
								Data Produk
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Data Produk</b>
					</h6>
					<hr />
					<Row>
						<Col>
							<IconButton 
								color="blue" appearance="primary"
								icon={<PlusIcon />} 
								onClick={(e) => {navigate('/AddProduct');}}
							>Add New</IconButton>
						</Col>
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
							sx={{
							  boxShadow: 2,
							  border: 2,
							  borderColor: 'primary.light',
							  '& .MuiDataGrid-cell:hover': {
								color: 'primary.main',
							  },
							}}
							loading={productsLoading}
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
								Toolbar: GridToolbar,
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
