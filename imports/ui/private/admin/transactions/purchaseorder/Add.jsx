import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { Table } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

import DatePicker from 'rsuite/DatePicker';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import IconButton from 'rsuite/IconButton';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import TrashIcon from '@rsuite/icons/Trash';
import PlusIcon from '@rsuite/icons/Plus';
import Divider from 'rsuite/Divider';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import { OrderPembelianDetailCollections } from '../../../../../db/OrderPembelianDetail';
import { CurrenciesCollections } from '../../../../../db/Currencies';
import { VendorsCollections } from '../../../../../db/Vendors';

import DetailPurchase from './components/DetailPurchase';
import EditDetailPurchase from './components/EditDetailPurchase';

import '../../../../../ui/assets/css/addpurchase.css';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function AddPurchaseOrder() {

	let navigate = useNavigate();

	const [adding, setAdding] = useState(false);

	const [updateDetail, setUpdateDetail] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');
	const [selectedDeleteID, setSelectedDeleteID] = useState('');

	const [noFaktur, setNoFaktur] = useState('');
	const [noOrder, setNoOrder] = useState('');
	const [transactionDate, setTransactionDate] = useState(new Date());
	const [grandTotal, setGrandTotal] = useState(0);
	const [vendorID, setVendorID] = useState('');
	const [currencyID, setCurrencyID] = useState('IDR');

	const [itemNo, setItemNo] = useState(0);

	const [searchVendorText, setSearchVendorText] = useState('');
	const [searchCurrencyText, setSearchCurrencyText] = useState('');

	const [open, setOpen] = React.useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	
	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('itemNo');
	const [order, setOrder] = useState(1);

	const [pembelianDetailCount, pembelianDetailCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('orderpembeliandetail.countList', { noFaktur });

		let data = Counts.get('orderpembeliandetail.countList.' + noFaktur);
		return [data, !subs.ready()];
	}, [noFaktur]);

	const [pembelianDetail, pembelianDetailLoading] = useTracker(() => {
		let subs = Meteor.subscribe('orderpembeliandetail.list', {
			page,
			noFaktur,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = OrderPembelianDetailCollections.find(
			{
				noFaktur: noFaktur,
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [noFaktur, orderBy, order]);

	const [vendors, vendorsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('vendors.search', {
			searchText: searchVendorText,
			selectedID: vendorID,
		});

		let data = VendorsCollections.find({
			$or: [
				{
					_id: vendorID,
				},
				{
					code: {
						$regex: searchVendorText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchVendorText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		
		return [data, !subs.ready()];
	}, [searchVendorText, vendorID]);
	
	const [currencies, currenciesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('currencies.search', {
			searchText: searchCurrencyText,
			selectedID: currencyID,
		});

		let data = CurrenciesCollections.find({
			$or: [
				{
					code: currencyID,
				},
				{
					code: {
						$regex: searchCurrencyText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchCurrencyText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchCurrencyText, currencyID]);

	const renderCurrenciesLoading = (menu) => {
		if (currenciesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	useEffect(() => {
		setMaxPage(Math.ceil(pembelianDetailCount / 20));
		setItemNo(pembelianDetailCount + 1);

		if (selectedDeleteID) {
			Meteor.call(
				'orderpembeliandetail.delete',
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

		let grandttl = 0;
		if (pembelianDetail.length > 0 ) {
			pembelianDetail.map( (item) => {
				grandttl += item.hargaNetto;
				return grandttl;
			})
		}
		setGrandTotal(formatNum(grandttl));

	}, [pembelianDetail, pembelianDetailCount, selectedDeleteID]);

	const add = () => {
		setAdding(true);
		if (
			noFaktur &&
			transactionDate
		) {
			Meteor.call(
				'orderpembelian.add',
				{
					noFaktur,
					transactionDate,
					currencyID,
					vendorID,
					grandTotal,
				},
				(err, res) => {
					if (err) {
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setNoFaktur('');
							setTransactionDate(moment().toDate());
							setVendorID('');
							setCurrencyID('');
							setNoOrder('');
							setGrandTotal(0);
							setAdding(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setAdding(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		} else {
			setAdding(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent(
				'Vendor, Mata Uang,  Tanggal Transaksi, Produk Wajib Diisi'
			);
		}
	};

	const renderVendorsLoading = (menu) => {
		if (vendorsLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
	};
	
	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	const formatNum0 = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(0)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	return (
		<>
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
				</Modal>
				
				{updateDetail === false
				 	?	<DetailPurchase 
							open={open} 
							handleClose={() => handleClose()}
							itemNo={itemNo}
							noFaktur={noFaktur}
						/>
					:	<EditDetailPurchase 
							open={open} 
							handleClose={() => handleClose()}
							noFaktur={noFaktur}
							selectedID={selectedID}
						/>
				}	

				<div className="mainContent">
					<div className="breadcrumContainer">
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item
								onClick={(e) => navigate('/PurchaseOrder')}
							>
								Transaksi Order Pembelian
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Input Transaksi Order Pembelian
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Input Transaksi Order Pembelian</b>
					</h6>
					<hr />
					<Form
						onSubmit={() => {
							add();
						}}
						disabled={adding}
						layout="horizontal"
					>
						<Form.Group controlId="noNoOrder" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left"> 
								Nomor Order
							</Form.ControlLabel>
							<Form.Control
								name="noFaktur"
								placeholder="Nomor Order Pembelian"
								value={noFaktur}
								onChange={(e) => {
									setNoFaktur(e);
								}}
								disabled={adding}
							/>
							<Form.HelpText tooltip>Akan otomatis digenerate oleh sistem jika kosong</Form.HelpText>
						</Form.Group>
						<Form.Group controlId="transactionDate" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">
								Tanggal Transaksi
							</Form.ControlLabel>
							<Form.Control 
								name="tglupdate" 
								accepter={DatePicker} 
								value={transactionDate}
								onChange={(e) => {
									setTransactionDate(e);
								}}
								disabled={adding}
								/>
						</Form.Group>
						<Form.Group controlId="vendorID" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">Supplier</Form.ControlLabel>
							<SelectPicker
								placeholder="Supplier"
								required
								disabled={adding}
								style={{width: 300}}
								data={vendors.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								
								value={vendorID}
								onChange={(input) => {
									setVendorID(input);
								}}
								onClean={() => {
									setVendorID('');
								}}
								onSearch={(input) => {
									setSearchVendorText(input);
								}}
								renderMenu={renderVendorsLoading}
							/>
						</Form.Group>
						<Form.Group controlId="currencyID" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">Currency</Form.ControlLabel>
							<SelectPicker
								placeholder="Currency"
								disabled={adding}
								style={{width: 300}}
								data={currencies.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s.code,
								}))}
								value={currencyID}
								onChange={(input) => {
									setCurrencyID(input);
								}}
								onClean={() => {
									setCurrencyID('');
								}}
								onSearch={(input) => {
									setSearchCurrencyText(input);
								}}
								renderMenu={renderCurrenciesLoading}
							/>
						</Form.Group>
						<Form.Group controlId="selectedProducts">
							<Form.ControlLabel className="text-left" >Tambah Item </Form.ControlLabel>
							<IconButton 
								color="blue" appearance="primary"
								icon={<PlusIcon />} 
								onClick={(e) => {
									if(noFaktur===''){
										setDialogOpen(true);
										setDialogTitle('Kesalahan Sistem');
										setDialogContent('Nomor Order Pembelian belum diisi!');
									} else {
										setUpdateDetail(false);
										handleOpen(e);
									}
								}}
							>Add New</IconButton>
							
							<Table responsive striped bordered hover style={{ fontSize: "12px", marginBottom: 10, marginTop: 10}}>
								<thead>
									<tr>
										<th>#</th>
										<th>Kode Barang</th>
										<th>Nama</th>
										<th colSpan={2} className="text-center">Qty</th>
										<th>Harga Beli</th>
										<th colSpan={2} className="text-center">Diskon</th>
										<th colSpan={2} className="text-center">PPN</th>
										<th>Harga Modal</th>
										<th>Jumlah Harga</th>
										<th className="text-center">Action</th>
									</tr>
								</thead>
								<tbody>
									{pembelianDetailLoading ? (
										<tr>
											<td colSpan={13}>
												<center>
													<Loader
														size="sm"
														content="Loading Data..."
													/>
												</center>
											</td>
										</tr>
									) : (
										<>
											{pembelianDetail.length > 0 ? (
												<>
													{pembelianDetail.map((item, index) => (
														<tr key={index}>
															<td> { item.itemNo} </td>
															<td>{item.kodeBarang}</td>
															<td>{item.namaBarang}</td>
															<td className="text-right">{item.ktsKecil}</td>
															<td>{item.satuanKecil}</td>	
															<td className="text-right">{ formatNum(item.hargaBeliSatuan)}</td>
															<td className="text-right">{ formatNum( ((item.diskonHarga1 + item.diskonHarga2 + item.diskonHarga3 + item.diskonHarga4 + item.diskonHarga5) / item.ktsKecil)/item.hargaBeliSatuan * 100)} %</td>
															<td className="text-right">{ formatNum( (item.diskonHarga1 + item.diskonHarga2 + item.diskonHarga3 + item.diskonHarga4 + item.diskonHarga5) / item.ktsKecil) }</td>		
															<td className="text-right">{ formatNum0(item.ppnPersen) } %</td>
															<td className="text-right">{ formatNum(item.ppnHarga / item.ktsKecil)}</td>
															<td className="text-right">{ formatNum(item.hargaNetto / item.ktsKecil)}</td>
															<td className="text-right">{ formatNum(item.hargaNetto)}</td>
															<td style={{ textAlign: "center" }}>
																<a 	className ="fakeLink"
																	onClick={(e) => {
																		setSelectedID( item._id );
																		setUpdateDetail(true);
																		handleOpen(e);
																	}}
																	>
																	<FaPencilAlt /> 
																</a>
																<Divider vertical/>
																<a 	className ="fakeLink"
																	style={{color: "red"}}
																	onClick={(e) => {
																		setSelectedID( item._id );
																		setDeleteConfirmationDialogOpen( true);
																		setDeleteConfirmationDialogTitle( 'Hapus data Pembelian Detail');
																		setDeleteConfirmationDialogContent(
																			'Anda akan menghapus data Pembelian Detail ' +
																				'[' +
																				item.kodeBarang +
																				']' +
																				item.namaBarang +
																				'. Semua data yang berhubungan dengan Pembelian Detail ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
																		);
																	}}
																	>
																	<FaTrashAlt />
																</a>
															</td>
														</tr>
													))}
												</>
											) : (
												<tr>
													<td colSpan={13}>
														<center>Tidak ada data</center>
													</td>
												</tr>
											)}
										</>
									)}
								</tbody>
							</Table>
						</Form.Group>
						<Row style={{ marginBottom: 10}}>
							<Col sm={6}>
							</Col>
							<Col sm={6}>
							<Form.Group controlId="grandTotal" >
								<Form.ControlLabel>Grand Total</Form.ControlLabel>
								<Form.Control
									name="grandTotal"
									placeholder="Grand Total"
									readOnly
									className ="text-right"
									value={grandTotal}
									style={{color: "#1675e0" }}
								/>
							</Form.Group>
							<Form.Group>
								<ButtonToolbar>
									<Button
										type="submit"
										appearance="primary"
										loading={adding}
									>
										Simpan
									</Button>
									<Button
										appearance="default"
										onClick={(e) => {
											navigate('/PurchaseOrder');
										}}
										disabled={adding}
									>
										Batal
									</Button>
								</ButtonToolbar>
							</Form.Group>				
							</Col>
						</Row>
						
						
						
					</Form>
				</div>
			</div>
		</>
	);
}
