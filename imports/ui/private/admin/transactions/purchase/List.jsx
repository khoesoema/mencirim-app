import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useEffect, useState } from 'react';
import { Pagination, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import Dropdown from 'rsuite/Dropdown';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import IconButton from 'rsuite/IconButton';
import Divider from 'rsuite/Divider';

import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import PlusIcon from '@rsuite/icons/Plus';
import SearchIcon from '@rsuite/icons/Search';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import DoingRoundIcon from '@rsuite/icons/DoingRound';
import WarningRoundIcon from '@rsuite/icons/WarningRound';
import CheckRoundIcon from '@rsuite/icons/CheckRound';

import { PembelianCollections } from '../../../../../db/Pembelian';
import { VendorsCollections } from '../../../../../db/Vendors';
import { Topbar } from '../../../template/Topbar';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function PurchaseInvoicesLists() {
	let navigate = useNavigate();

	const [searchText, setSearchText] = useState('');

	const [limit, setLimit] = useState(20);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('noFaktur');
	const [order, setOrder] = useState(1);

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	const [invoices, invoicesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('pembelian.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = PembelianCollections.find(
			{
				noFaktur: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				sort: sortObject,
			}
		).fetch();

		let databaru = [];

		data.map((item, index) => {
			let dataSupplier = {};
			let codeSupp = item.vendorID;

			if (codeSupp) {
				let subs2 = Meteor.subscribe('vendors.getByCode', { code: codeSupp });
				if(subs2.ready()){
					dataSupplier = VendorsCollections.findOne({ code: codeSupp});
				}	
			}	

			databaru[index] = {
				...item,
				supplierName: dataSupplier.name,
			};

		});

		return [databaru, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const [invoicesCount, invoicesCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('pembelian.countList', {
			searchText,
		});

		let data = Counts.get('pembelian.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(invoicesCount / 20));
	}, [invoicesCount]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent,] = useState('');

	const [selectedDeleteID, setSelectedDeleteID] = useState('');

	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'pembelian.delete',
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
								Transaksi Pembelian
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Transaksi Pembelian</b>
					</h6>
					<hr />
					<Row>
						<Col>
							<IconButton 
								color="blue" appearance="primary"
								icon={<PlusIcon />} 
								onClick={(e) => {navigate('/AddPurchaseInvoice');}}
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
					<Table responsive striped bordered hover>
						<thead>
							<tr>
								<th>#</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'noFaktur') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('noFaktur');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Nomor Faktur
										{orderBy === 'noFaktur' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'tglFaktur') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('tglFaktur');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Tanggal Transaksi
										{orderBy === 'tglFaktur' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'vendorID') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('vendorID');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Supllier
										{orderBy === 'vendorID' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'grandTotal') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('grandTotal');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Grand Total
										{orderBy === 'grandTotal' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'status') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('status');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Status
										{orderBy === 'status' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th colSpan={2} className="text-center">Action</th>
							</tr>
						</thead>
						<tbody>
							{invoicesLoading ? (
								<tr>
									<td colSpan={13}>
										<center>
											<Loader
												size="sm"
												content="Memuat Data..."
											/>
										</center>
									</td>
								</tr>
							) : (
								<>
									{invoices.length > 0 ? (
										<>
											{invoices.map((item, index) => (
												<tr key={index}>
													<td>
														{(page - 1) * limit +
															(index + 1)}
													</td>
													<td> {item.noFaktur} </td>
													<td> {moment(item.tglFaktur).format('YYYY-MM-DD')} </td>
													<td> { '[' + item.vendorID + '] ' + item.supplierName}  </td>
													<td className="text-right">{ formatNum(item.grandTotal)} </td>
													<td className="text-center"> 	
														{item.status === 'Pending' &&
															<IconButton
																size="xs"
																color="orange" 
																appearance="primary"
																icon={<DoingRoundIcon/>}
																placement="right"
																onClick={() => {
																navigate('/ViewPurchaseInvoice/' + item._id);
																}}
															>{item.status}</IconButton>
														}
														{item.status === 'Rejected' &&
															<IconButton
																size="xs"
																color="red" 
																appearance="ghost"
																icon={<WarningRoundIcon/>}
																placement="right"
																onClick={() => {
																navigate('/ViewPurchaseInvoice/' + item._id);
																}}
															>{item.status}</IconButton>
														}
														{item.status === 'Approved' &&
															<IconButton
																size="xs"
																color="green" 
																appearance="ghost"
																icon={<CheckRoundIcon/>}
																placement="right"
																onClick={() => {
																navigate('/ViewPurchaseInvoice/' + item._id);
																}}
															>{item.status}</IconButton>
														}
													</td>
													{item.status === 'Pending'
														? 	<td style={{ textAlign: "center" }}>
																<a className ="fakeLink"
																	onClick={( e ) => {
																		navigate('/EditPurchaseInvoice/' + item._id);
																	}}
																>
																	<FaPencilAlt /> 
																</a>
																<Divider vertical />
																<a className ="fakeLink"
																	onClick={() => {
																		setSelectedID( item._id);
																		setDeleteConfirmationDialogOpen(true);
																		setDeleteConfirmationDialogTitle('Hapus data Pembelian');
																		setDeleteConfirmationDialogContent(
																			'Anda akan menghapus data Pembelian ' +
																				'[' +
																				moment(item.tglFaktur).format('YYYY-MM-DD') +
																				'] ' +
																				item.noFaktur +
																				'. Semua data yang berhubungan dengan Pembelian ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
																		);
																	}}
																	>
																	<FaTrashAlt />
																</a>
															</td>
														: <td></td>
													}
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
					<hr />

					<Pagination className="float-end">
						<Pagination.First
							onClick={(e) => {
								setPage(1);
							}}
						/>
						<Pagination.Prev
							onClick={(e) => {
								let nextPage = page - 1;
								if (nextPage <= 0) {
									setPage(1);
								} else {
									setPage(nextPage);
								}
							}}
						/>
						<Pagination.Item disabled>
							{page}/{maxPage}
						</Pagination.Item>
						<Pagination.Next
							onClick={(e) => {
								let nextPage = page + 1;
								if (nextPage > maxPage) {
									setPage(maxPage);
								} else {
									setPage(nextPage);
								}
							}}
						/>
						<Pagination.Last
							onClick={(e) => {
								setPage(maxPage);
							}}
						/>
					</Pagination>
				</div>
			</div>
		</>
	);
}
