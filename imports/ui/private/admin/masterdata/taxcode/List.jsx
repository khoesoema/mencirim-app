import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
// import { TaxCodesCollections } from '../../../../db/TaxCode';
import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useEffect, useState } from 'react';
import { Pagination, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import Dropdown from 'rsuite/Dropdown';
import IconButton from 'rsuite/IconButton';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { AccountsCollections } from '../../../../../db/Accounts';
import { TaxCodesCollections } from '../../../../../db/TaxCodes';

import { Topbar } from '../../../template/Topbar';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function TaxCodeLists(props) {
	let navigate = useNavigate();

	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [searchText, setSearchText] = useState('');
	const [purchaseAccountID, setPurchaseAccountID] = useState('');
	const [sellAccountID, setSellAccountID] = useState('');

	const [limit, setLimit] = useState(10);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('name');
	const [order, setOrder] = useState(1);

	const [taxCodes, taxCodesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('taxCodes.list', {
			page,
			searchText,
			purchaseAccountID,
			sellAccountID,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let findObject = {
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
		};

		if (purchaseAccountID) {
			findObject['purchaseAccountID'] = purchaseAccountID;
		}
		if (sellAccountID) {
			findObject['sellAccountID'] = sellAccountID;
		}

		let data = TaxCodesCollections.find(findObject, {
			sort: sortObject,
		}).fetch();
		return [data, !subs.ready()];
	}, [page, searchText, orderBy, order, purchaseAccountID, sellAccountID]);

	const [taxCodesCount, taxCodesCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('taxCodes.countList', { searchText });

		let data = Counts.get('taxCodes.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(taxCodesCount / 20));
	}, [taxCodesCount]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
		useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] =
		useState('');
	const [
		deleteConfirmationDialogContent,
		setDeleteConfirmationDialogContent,
	] = useState('');
	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'taxCodes.delete',
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

	const [searchPurchaseAccountText, setSearchPurchaseAccountText] =
		useState('');
	const [purchaseAccounts, purchaseAccountsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('accounts.search', {
			selectedID: purchaseAccountID,
			searchText: searchPurchaseAccountText,
		});

		let data = AccountsCollections.find({
			$or: [
				{
					_id: purchaseAccountID,
				},
				{
					code: {
						$regex: searchPurchaseAccountText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchPurchaseAccountText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchPurchaseAccountText, purchaseAccountID]);

	const renderPurchaseAccountsLoading = (menu) => {
		if (purchaseAccountsLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const [searchSellAccountText, setSearchSellAccountText] = useState('');
	const [sellAccounts, sellAccountsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('accounts.search', {
			searchText: searchSellAccountText,
		});

		let data = AccountsCollections.find({
			$or: [
				{
					_id: sellAccountID,
				},
				{
					code: {
						$regex: searchSellAccountText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchSellAccountText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchSellAccountText, sellAccountID]);

	const renderSellAccountsLoading = (menu) => {
		if (sellAccountsLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
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
								Data Kode Pajak
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Data Kode Pajak</b>
					</h6>
					<hr />
					<InputGroup>
						<Dropdown title="Menu">
							<Dropdown.Item
								onClick={(e) => {
									navigate('/AddTaxCode');
								}}
							>
								Tambah Data
							</Dropdown.Item>
						</Dropdown>
						<SelectPicker
							placeholder="Nomor Perkiraan Pajak Beli"
							required
							data={purchaseAccounts.map((s) => ({
								label: '[' + s.code + '] ' + s.name,
								value: s._id,
							}))}
							style={{ width: '100%' }}
							value={purchaseAccountID}
							onChange={(input) => {
								setPurchaseAccountID(input);
							}}
							onClean={() => {
								setPurchaseAccountID('');
							}}
							onSearch={(input) => {
								setSearchPurchaseAccountText(input);
							}}
							renderMenu={renderPurchaseAccountsLoading}
						/>
						<SelectPicker
							placeholder="Nomor Perkiraan Pajak Jual"
							required
							data={sellAccounts.map((s) => ({
								label: '[' + s.code + '] ' + s.name,
								value: s._id,
							}))}
							style={{ width: '100%' }}
							value={sellAccountID}
							onChange={(input) => {
								setSellAccountID(input);
							}}
							onClean={() => {
								setSellAccountID('');
							}}
							onSearch={(input) => {
								setSearchSellAccountText(input);
							}}
							renderMenu={renderSellAccountsLoading}
						/>
						<Input
							type="text"
							placeholder="Cari Data"
							value={searchText}
							onChange={(e) => {
								setSearchText(e);
							}}
						/>
					</InputGroup>
					<hr />
					<Table responsive striped bordered hover>
						<thead>
							<tr>
								<th>#</th>

								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'code') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('code');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Kode
										{orderBy === 'code' && (
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
											if (orderBy === 'name') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('name');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Nama
										{orderBy === 'name' && (
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
								<th>Nilai Pajak</th>
								<th>Nomor Perkiraan Pajak Beli</th>
								<th>Nomor Perkiraan Pajak Jual</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'modifiedBy') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('modifiedBy');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Diubah Oleh
										{orderBy === 'modifiedBy' && (
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
											if (orderBy === 'modifiedAt') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('modifiedAt');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Diubah Tanggal
										{orderBy === 'modifiedAt' && (
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
											if (orderBy === 'createdBy') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('createdBy');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Dibuat Oleh
										{orderBy === 'createdBy' && (
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
											if (orderBy === 'createdAt') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('createdAt');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Dibuat Tanggal
										{orderBy === 'createdAt' && (
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

								<th>Menu</th>
							</tr>
						</thead>
						<tbody>
							{taxCodesLoading ? (
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
									{taxCodes.length > 0 ? (
										<>
											{taxCodes.map((item, index) => (
												<tr key={index}>
													<td>
														{(page - 1) * limit +
															(index + 1)}
													</td>
													<td>{item.code}</td>
													<td>{item.name}</td>
													<td>
														{item.taxAmount
															.toString()
															.replace('.', ',')
															.replace(
																/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
																'$1.'
															)}
													</td>
													<td>
														[
														{
															item.purchaseAccountCode
														}
														]{' '}
														{
															item.purchaseAccountName
														}
													</td>
													<td>
														[{item.sellAccountCode}]{' '}
														{item.sellAccountName}
													</td>
													<td>{item.modifiedBy}</td>
													<td>
														{moment(
															item.modifiedAt
														).format(
															'YYYY-MM-DD HH:mm:ss'
														)}
													</td>
													<td>{item.createdBy}</td>
													<td>
														{moment(
															item.createdAt
														).format(
															'YYYY-MM-DD HH:mm:ss'
														)}
													</td>
													<td>
														<Dropdown title="Menu">
															<Dropdown.Item
																onClick={(
																	e
																) => {
																	navigate(
																		'/EditTaxCode/' +
																			item._id
																	);
																}}
															>
																Ubah/Lihat
															</Dropdown.Item>
															<Dropdown.Item
																onClick={(
																	e
																) => {
																	setSelectedID(
																		item._id
																	);
																	setDeleteConfirmationDialogOpen(
																		true
																	);
																	setDeleteConfirmationDialogTitle(
																		'Hapus data Kode Pajak'
																	);
																	setDeleteConfirmationDialogContent(
																		'Anda akan menghapus data Kode Pajak ' +
																			'[' +
																			item.taxCode +
																			']' +
																			item.taxCodeName +
																			'. Semua data yang berhubungan dengan Kode Pajak ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
																	);
																}}
															>
																Hapus
															</Dropdown.Item>
														</Dropdown>
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
