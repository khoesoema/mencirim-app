import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Table } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Modal from 'rsuite/Modal';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import { PembelianCollections } from '../../../../../db/Pembelian';
import { PembelianDetailCollections } from '../../../../../db/PembelianDetail';
import { VendorsCollections } from '../../../../../db/Vendors';
import { BusinessTypesCollections } from '../../../../../db/BusinessTypes';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function ViewPurchaseInvoice() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [editing, setEditing] = useState(false);

	const [pembelianData, pembelianDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('pembelian.getByID', { _id });
			isLoading = !subs.ready();

			data = PembelianCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);
	
	useEffect(()=>{
		if (pembelianData && pembelianDataLoading === false ){
			setNoFaktur(pembelianData.noFaktur);
			setTransactionDate(moment(pembelianData.tglFaktur).toDate());
			setVendorID(pembelianData.vendorID);
			setCurrencyID(pembelianData.currencyID);
			setNoOrder(pembelianData.noOrder);
			setGrandTotal(pembelianData.grandTotal);
			setStatus(pembelianData.status);
		}else if (!pembelianData && pembelianDataLoading === false ) {
			setNoFaktur('');
			setTransactionDate(new Date());
			setVendorID('');
			setCurrencyID('');
			setNoOrder('');
			setGrandTotal(0);
			setStatus('');
		};
	},[pembelianData, pembelianDataLoading])

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');
	const [selectedDeleteID, setSelectedDeleteID] = useState('');

	const [noFaktur, setNoFaktur] = useState('');
	const [transactionDate, setTransactionDate] = useState(new Date());
	const [tglJatuhTempo, setTglJatuhTempo] = useState(new Date());
	const [noOrder, setNoOrder] = useState('');
	const [grandTotal, setGrandTotal] = useState(0);
	const [vendorID, setVendorID] = useState('');
	const [currencyID, setCurrencyID] = useState('');
	const [status, setStatus] = useState('');

	const [page, setPage] = useState(1);
	const [orderBy, setOrderBy] = useState('itemNo');
	const [order, setOrder] = useState(1);	

	const [pembelianDetail, pembelianDetailLoading] = useTracker(() => {
		let subs = Meteor.subscribe('pembeliandetail.list', {
			page,
			noFaktur,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = PembelianDetailCollections.find(
			{
				noFaktur: noFaktur,
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [noFaktur, orderBy, order]);

	const [supplierData, supplierDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (vendorID) {
			let subs = Meteor.subscribe('vendors.getByID', { _id: vendorID });
			isLoading = !subs.ready();

			data = VendorsCollections.findOne({ _id: vendorID});
		}
		return [data, isLoading];
	}, [vendorID]);
	
	const [businessTypeID, setBusinessTypeID ] = useState();

	useEffect(()=>{
		if(supplierData){
			setBusinessTypeID(supplierData.businessTypeID);
		} else {
			setBusinessTypeID('');
		}
	},[supplierData]);

	const [businessType, businessTypeLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (businessTypeID) {
			let subs = Meteor.subscribe('businessType.getByCode', { code: businessTypeID });
			isLoading = !subs.ready();

			data = BusinessTypesCollections.findOne({ code: businessTypeID});
		}
		return [data, isLoading];
	}, [businessTypeID]);
	
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

	const editStatReject = () => {
		setEditing(true);
		if (
			noFaktur
		) {
			Meteor.call(
				'pembelian.edit.reject',
				{
					_id,
					noFaktur
				},
				(err, res) => {
					if (err) {
						setEditing(false);
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
							setEditing(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setEditing(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setEditing(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		} else {
			setEditing(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent(
				'Supplier, Mata Uang,  Tanggal Transaksi, Produk Wajib Diisi'
			);
		}
	};

	const editStatApprove = () => {
		setEditing(true);
		if (
			noFaktur
		) {
			Meteor.call(
				'pembelian.edit.approve',
				{
					_id,
					noFaktur
				},
				(err, res) => {
					if (err) {
						setEditing(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setEditing(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setEditing(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setEditing(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		} else {
			setEditing(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent(
				'Supplier, Mata Uang,  Tanggal Transaksi, Produk Wajib Diisi'
			);
		}
	};

	return (
		<>
			<div className="mainContainerRoot">
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
								onClick={(e) => navigate('/PurchaseInvoices')}
							>
								Data Transaksi Pembelian
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Lihat Data Transaksi Pembelian -{' '}
								{noFaktur}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>
							Lihat Data Transaksi Pembelian -{' '}
							{noFaktur}
						</b>
					</h6>
					<hr />
					<div className="container">
						<div className="card">
							<div className="card-header">
								Invoice{' '}
								<strong>
									{noFaktur}
								</strong>
								<span className="float-right">
									{' '}
									<strong>Status:</strong>{' '}
									{status}
								</span>
							</div>
							<div className="card-body">
								<Row>
									<Col xs={8}>
										{  supplierData && (
											<div>
												<h6>Dari:</h6>
												<div>
													<strong>
														{supplierData.name}
													</strong>
												</div>
												<div style={{ fontSize: "14px"}}>
													{supplierData.address}
												</div>
												<Row style={{ fontSize: "14px"}}>
													<Col xs={3}>
														<div>No. Telepon :</div>
													</Col>
													<Col>
														<div>{supplierData.phoneNumber}</div>
													</Col>
												</Row>
												<Row style={{ fontSize: "14px"}}>
													<Col xs={3}>
														<div>No. Handphone :</div>
													</Col>
													<Col>
														<div>{supplierData.mobileNumber}</div>
													</Col>
												</Row>
												<Row style={{ fontSize: "14px"}}>
													<Col xs={3}>
														<div>Tipe Bisnis :</div>
													</Col>
													<Col>
														<div>
															{supplierData.businessTypeID}
															{' - '} 
															{ businessType && businessType.name}
														</div>
													</Col>
												</Row>
											</div>
										)}
									</Col>
									<Col xs={4} style={{ fontSize: "14px"}} >
										<br />
										<div>
											Tanggal Faktur : 
											<b className="pull-right float-right">
												{ moment(transactionDate).format('DD-MMM-YYYY')}
											</b>
										</div>
										<div>
											Tanggal Jatuh Tempo : 
											<b className="pull-right float-right">
												{ moment(tglJatuhTempo).format('DD-MMM-YYYY')}
											</b>
										</div>
									</Col>
								</Row>

								<Table responsive hover style={{ fontSize: "12px", marginBottom: 10, marginTop: 10}}>
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
										</tr>
									</thead>
									<tbody>
										{
											pembelianDetail && (
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
														</tr>
													))}
												</>
											)}
									</tbody>
								</Table>
								<div className="row">
									<div className="col-lg-4 col-sm-5"></div>

									<div className="col-lg-4 col-sm-5 ml-auto">
										<table className="table table-clear">
											<tbody style={{fontSize: 14}}>
												<tr>
													<td className="left">
														<strong>
															Grand Total
														</strong>
													</td>
													<td className="right text-right" >
														<strong>
															{ formatNum(grandTotal)}
														</strong>
														{' ' + currencyID}
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
						{ status === 'Pending' &&
							<ButtonToolbar>
								<Button
									color="green"
									appearance="primary"
									disabled={editing | pembelianDataLoading}
									onClick={() => {
										editStatApprove();
									}}
								>
									Approve
								</Button>
								<Button
									color="red"
									appearance="primary"
									onClick={() => {
										editStatReject();
									}}
									disabled={editing | pembelianDataLoading}
								>
									Reject
								</Button>
							</ButtonToolbar>
						}
					</div>
				</div>
			</div>
		</>
	);
}
