import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Message from 'rsuite/Message';
import { useToaster } from 'rsuite';
import Input from 'rsuite/Input';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import PlusIcon from '@rsuite/icons/Plus';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Divider from 'rsuite/Divider';

import { PenjualanReturCollections } from '../../../../../db/PenjualanRetur';
import { PenjualanReturDetailCollections } from '../../../../../db/PenjualanReturDetail';
import { CurrenciesCollections } from '../../../../../db/Currencies';
import { CustomersCollections } from '../../../../../db/Customers';
import { Topbar } from '../../../template/Topbar';

import DetailPurchase from './components/DetailPurchase';
import EditDetailPurchase from './components/EditDetailPurchase';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function EditSalesReturInvoice() {
	let { _id } = useParams();
	let navigate = useNavigate();

	const [penjualanData, penjualanDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('penjualanretur.getByID', { _id });
			isLoading = !subs.ready();

			data = PenjualanReturCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);
	
	const [editing, setEditing] = useState(false);
	const [updateDetail, setUpdateDetail] = useState(false);

	const toaster = useToaster();
	const [placement, setPlacement] = useState('topCenter');

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');
	const [selectedDeleteID, setSelectedDeleteID] = useState('');

	const [noFaktur, setNoFaktur] = useState('');
	const [tglFaktur, setTglFaktur] = useState(new Date());
	const [grandTotal, setGrandTotal] = useState(0);
	const [customerID, setCustomerID] = useState('');
	const [currencyID, setCurrencyID] = useState('');
	const [keterangan, setKeterangan] = useState('');

	const [searchCustomerText, setSearchCustomerID] = useState('');
	const [searchCurrencyText, setSearchCurrencyText] = useState('');

	const [itemNo, setItemNo] = useState(0);

	const [open, setOpen] = React.useState(false);
	
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	
	const [page, setPage] = useState(1);
	const [orderBy, setOrderBy] = useState('itemNo');
	const [order, setOrder] = useState(1);
	
	const [penjualanDetailCount, penjualanDetailCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('penjualanreturdetail.countList', { noFaktur });

		let data = Counts.get('penjualanreturdetail.countList.' + noFaktur);
		return [data, !subs.ready()];
	}, [noFaktur]);

	const [penjualanDetail, penjualanDetailLoading] = useTracker(() => {
		let subs = Meteor.subscribe('penjualanreturdetail.list', {
			page,
			noFaktur,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = PenjualanReturDetailCollections.find(
			{
				noFaktur: noFaktur,
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [noFaktur, orderBy, order]);

	const [customers, customersLoading] = useTracker(() => {
		let subs = Meteor.subscribe('customers.search', {
			searchText: searchCustomerText,
			selectedID: customerID,
		});

		let data = CustomersCollections.find({
			$or: [
				{
					_id: customerID,
				},
				{
					code: {
						$regex: searchCustomerText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchCustomerText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		
		return [data, !subs.ready()];
	}, [searchCustomerText, customerID]);
	
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

	
	useEffect(()=>{
		if (penjualanData && penjualanDataLoading === false ){
			setNoFaktur(penjualanData.noFaktur);
			setTglFaktur(moment(penjualanData.tglFaktur).toDate());
			setCustomerID(penjualanData.customerID);
			setCurrencyID(penjualanData.currencyID);
			setKeterangan(penjualanData.keterangan);
		}else if (!penjualanData && penjualanDataLoading === false ) {
			setNoFaktur('');
			setTglFaktur(new Date());
			setCustomerID('');
			setCurrencyID('');
			setKeterangan('');
		};
	},[penjualanData, penjualanDataLoading])

	useEffect(() => {
		setItemNo(penjualanDetailCount + 1);

		let grandttl = 0;
		if (penjualanDetail.length > 0 ) {
			penjualanDetail.map( (item) => {
				grandttl += item.hargaNetto;
				return grandttl;
			})
		}
		setGrandTotal(formatNum(grandttl));

	}, 
	[ 	penjualanDetail, 
		penjualanDetailCount, 	
	]);

	const edit = () => {
		setEditing(true);
		if (
			noFaktur &&
			tglFaktur
		) {
			Meteor.call(
				'penjualanretur.edit',
				{
					_id,
					noFaktur,
					tglFaktur,
					currencyID,
					customerID,
					grandTotal,
					keterangan,
				},
				(err, res) => {
					if (err) {
						setEditing(false);
						setDialogOpen(true);
						let type = 'error';
						let title = err.error;
						let desc = err.reason;
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						
						if (resultCode === 200) {
							setNoFaktur('');
							setTglFaktur(moment().toDate());
							setCustomerID('');
							setCurrencyID('');
							setKeterangan('');
							setGrandTotal(0);
							setEditing(false);
							//setDialogOpen(true);
							let type = 'success';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						} else {
							setEditing(false);
							setDialogOpen(true);
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						}
					} else {
						setEditing(false);
						setDialogOpen(true);
						//setDialogTitle('Kesalahan Sistem');
						//setDialogContent(
						//	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						//);
						let type = 'error';
						let title = 'Kesalahan Sistem';
						let desc = 'Terjadi kesalahan pada sistem, silahkan hubungi customer service';
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
						  	</Message>
							,{placement})
					}
				}
			);
		} else {
			setEditing(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent(
				'Vendor, Mata Uang,  Tanggal Transaksi, Produk Wajib Diisi'
			);
		}
	};

	useEffect(()=> {
		if (selectedDeleteID) {
			Meteor.call(
				'penjualanreturdetail.delete',
				{
					_id: selectedDeleteID,
				},
				(err, res) => {
					if (err) {
						setSelectedID('');
						setSelectedDeleteID('');
						let type = 'error';
						let title = err.error;
						let desc = err.reason;
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
						  	</Message>
							,{placement})
						//setDialogOpen(true);
						//setDialogTitle(err.error);
						//setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setSelectedID('');
							setSelectedDeleteID('');

							let type = 'success';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
							  	</Message>
								,{placement})

							//setDialogOpen(true);
							//setDialogTitle(resultTitle);
							//setDialogContent(resultMessage);
						} else {
							setSelectedID('');
							setSelectedDeleteID('');
							let type = 'warning';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
							  	</Message>
								,{placement})
							//setDialogOpen(true);
							//setDialogTitle(resultTitle);
							//setDialogContent(resultMessage);
						}
					} else {
						setSelectedID('');
						setSelectedDeleteID('');
						let type = 'error';
						let title = 'Kesalahan Sistem';
						let desc = 'Terjadi kesalahan pada sistem, silahkan hubungi customer service';
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
						  	</Message>
							,{placement})
						//setDialogOpen(true);
						//setDialogTitle('Kesalahan Sistem');
						//setDialogContent(
						//	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						//);
					}
				}
			);
		}
	},[selectedDeleteID])

	const renderCustomersLoading = (menu) => {
		if (customersLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

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
						style={{fontSize: 14}}
					>
						<Modal.Header>
							<Modal.Title className="text-center">
								<strong>{deleteConfirmationDialogTitle}</strong>
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<div>Anda akan menghapus data dengan rincian : </div>
							<div style={{color:"#1675e0"}}>{deleteConfirmationDialogContent}</div>
							<div>Semua data yang berhubungan dengan data {deleteConfirmationDialogTitle} juga akan dihapus.</div>
							<div>Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin? </div>
						</Modal.Body>
						<Modal.Footer>
							<Button
								onClick={(e) => {
									setSelectedDeleteID(selectedID);
								}}
								appearance="primary"
								color="red"
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
				
				{ updateDetail === false
				 	?	<DetailPurchase 
							open={open} 
							handleClose={() => handleClose()}
							itemNo={itemNo}
							noFaktur={noFaktur}
						/>
					:	<EditDetailPurchase 
							open={open} 
							handleClose={() => handleClose()}
							selectedID={selectedID}
							noFaktur={noFaktur}
						/>
				}	
				
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
								onClick={(e) => navigate('/SalesReturInvoices')}
							>
								Transaksi Penjualan Retur
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Transaksi Penjualan Retur
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Transaksi Penjualan Retur {noFaktur}</b>
					</h6>
					<hr />
					<Form
						onSubmit={() => {
							edit();
						}}
						disabled={editing}
						layout="horizontal"
					>
						<Form.Group controlId="noInvoice" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left"> 
								Nomor Faktur
							</Form.ControlLabel>
							<Form.Control
								readOnly
								name="noFaktur"
								placeholder="Nomor Invoice"
								style={{color: "#1675e0"}}
								value={noFaktur}
								onChange={(e) => {
									setNoFaktur(e);
								}}
								disabled={true}
							/>
							<Form.HelpText tooltip>Akan otomatis digenerate oleh sistem jika kosong</Form.HelpText>
						</Form.Group>
						<Form.Group controlId="tglFaktur" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">
								Tanggal Transaksi
							</Form.ControlLabel>
							<Form.Control 
								name="tglupdate" 
								accepter={DatePicker} 
								value={tglFaktur}
								onChange={(e) => {
									setTglFaktur(e);
								}}
								disabled={editing || penjualanDataLoading}
								/>
						</Form.Group>
						<Form.Group controlId="customerID" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">Customer</Form.ControlLabel>
							<SelectPicker
								placeholder="Customer"
								disabled={editing || penjualanDataLoading}
								style={{width: 300}}
								data={customers.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s.code,
								}))}
								
								value={customerID}
								onChange={(input) => {
									setCustomerID(input);
								}}
								onClean={() => {
									setCustomerID('');
								}}
								onSearch={(input) => {
									setSearchCustomerID(input);
								}}
								renderMenu={renderCustomersLoading}
							/>
						</Form.Group>
						<Form.Group controlId="currencyID" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">Currency</Form.ControlLabel>
							<SelectPicker
								placeholder="Currency"
								disabled={editing}
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
										setDialogContent('Nomor Faktur belum diisi!');
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
										<th>Harga Jual</th>
										<th colSpan={2} className="text-center">Diskon</th>
										<th colSpan={2} className="text-center">PPN</th>
										<th>Harga Jual Netto</th>
										<th>Jumlah Harga</th>
										<th className="text-center">Action</th>
									</tr>
								</thead>
								<tbody>
									{penjualanDetailLoading ? (
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
											{penjualanDetail.length > 0 ? (
												<>
													{penjualanDetail.map((item, index) => (
														<tr key={index}>
															<td> { item.itemNo} </td>
															<td>{item.kodeBarang}</td>
															<td>{item.namaBarang}</td>
															<td className="text-right">{item.ktsKecil}</td>
															<td>{item.satuanKecil}</td>	
															<td className="text-right">{ formatNum(item.hargaJual)}</td>
															<td className="text-right">{ formatNum( ((item.diskonHarga1 ) / item.ktsKecil)/item.hargaBeliSatuan * 100)} %</td>
															<td className="text-right">{ formatNum( (item.diskonHarga1) / item.ktsKecil) }</td>		
															<td className="text-right">{ formatNum0(item.ppnPersen) } %</td>
															<td className="text-right">{ formatNum(item.ppnHarga / item.ktsKecil)}</td>
															<td className="text-right">{ formatNum(item.hargaNetto / item.ktsKecil)}</td>
															<td className="text-right">{ formatNum(item.hargaNetto)}</td>
															<td style={{ textAlign: "center" }}>
																<a className ="fakeLink"
																	onClick={(e) => {
																		setSelectedID( item._id );
																		setUpdateDetail(true);
																		handleOpen(e);
																	}}
																	>
																	<FaPencilAlt /> 
																</a>
																<Divider vertical />
																<a className ="fakeLink"
																	style={{color:"red"}}
																	onClick={(e) => {
																		setSelectedID( item._id );
																		setDeleteConfirmationDialogOpen( true);
																		setDeleteConfirmationDialogTitle( 'Penjualan Retur Detail');
																		setDeleteConfirmationDialogContent(
																			'[' + item.kodeBarang + '] ' + item.namaBarang 
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
								<Form.Group controlId="keterangan" >
									<Form.ControlLabel className="text-left">Keterangan</Form.ControlLabel>
									<Input
										as="textarea"
										rows={3}
										name="keterangan"
										placeholder="Keterangan"
										style={{width: 500}}
										value={keterangan}
										onChange={(e) => {
											setKeterangan(e);
										}}
										loading={editing || penjualanDataLoading}
									/>
								</Form.Group>
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
										loading={editing || penjualanDataLoading}
									>
										Simpan
									</Button>
									<Button
										appearance="default"
										onClick={(e) => {
											navigate('/SalesReturInvoices');
										}}
										disabled={editing || penjualanDataLoading}
									>
										Batal
									</Button>
									<Button
										//className="float-end"
										color="red"
										appearance="primary"
										onClick={(e) => {
											setSelectedID(_id);
											setDeleteConfirmationDialogOpen(true);
											setDeleteConfirmationDialogTitle('Penjualan Retur');
											setDeleteConfirmationDialogContent(
												'[' + moment(tglFaktur).format('YYYY-MM-DD') + '] ' + noFaktur 	
											);
										}}
										disabled={editing || penjualanDataLoading}
									>
										Hapus
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
