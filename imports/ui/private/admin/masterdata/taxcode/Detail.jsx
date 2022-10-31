import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { AccountsCollections } from '../../../../../db/Accounts';
import { TaxCodesCollections } from '../../../../../db/TaxCodes';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';

export function EditTaxCode(props) {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [taxCodeData, taxCodeDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('taxCodes.getByID', { _id });
			isLoading = !subs.ready();

			data = TaxCodesCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [previousName, setPreviousName] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [amount, setAmount] = useState(0.0);
	const [purchaseAccountID, setPurchaseAccountID] = useState('');
	const [sellAccountID, setSellAccountID] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
		useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] =
		useState('');
	const [
		deleteConfirmationDialogContent,
		setDeleteConfirmationDialogContent,
	] = useState('');

	//run eachtime taxCodeData / taxCodeDataLoading changed
	useEffect(() => {
		if (taxCodeData && taxCodeDataLoading === false) {
			setPreviousName(taxCodeData.name);
			setName(taxCodeData.name);
			setCode(taxCodeData.code);
			setAmount(taxCodeData.amount);
			setPurchaseAccountID(taxCodeData.purchaseAccountID);
			setSellAccountID(taxCodeData.sellAccountID);
		} else if (!taxCodeData && taxCodeDataLoading === false) {
			setPreviousName('');
			setName('');
			setCode('');
			setAmount('');
			setPurchaseAccountID('');
			setSellAccountID('');
			navigate('/TaxCodes');
		}
	}, [taxCodeData, taxCodeDataLoading]);

	const edit = (e) => {
		setEditing(true);
		if (name && code && purchaseAccountID && sellAccountID) {
			Meteor.call(
				'taxCodes.edit',
				{
					_id,
					name,
					code,
					amount: Number(amount),
					purchaseAccountID,
					sellAccountID,
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
				'Nama, Kode, Nomor Perkiraan Pajak Beli dan Pajak Jual Wajib diisi'
			);
		}
	};

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
			searchText: searchPurchaseAccountText,
			selectedID: purchaseAccountID,
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
	}, [searchPurchaseAccountText,purchaseAccountID]);

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
			selectedID: sellAccountID,
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
	}, [searchSellAccountText,sellAccountID]);

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
				</Modal>
				<Sidebar
					currentmenu="taxCodeMasterdata"
					openDrawer={openDrawer}
					closeDrawer={(e) => {
						setOpenDrawer(false);
					}}
				/>
				<div className="mainContent">
					<IconButton
						icon={<MenuIcon />}
						onClick={(e) => {
							setOpenDrawer(true);
						}}
					>
						Menu
					</IconButton>
					<div className="breadcrumContainer">
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item
								onClick={(e) => navigate('/TaxCodes')}
							>
								Data Kode Pajak
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Kode Pajak - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Kode Pajak - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							edit();
						}}
						disabled={editing || taxCodeDataLoading}
					>
						<Form.Group controlId="name">
							<Form.ControlLabel>
								Nama Kode Pajak
							</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Kode Pajak"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || taxCodeDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>Kode Pajak</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Pajak"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || taxCodeDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="amount">
							<Form.ControlLabel>Pajak(%)</Form.ControlLabel>
							<Form.Control
								name="amount"
								required
								placeholder="Pajak(%)"
								value={amount
									.toString()
									.replace('.', ',')
									.replace(
										/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
										'$1.'
									)}
								onChange={(input) => {
									let regex = /^-?[0-9.]*,?[0-9.]*$/;
									if (
										input === '' ||
										input === '0' ||
										regex.test(input)
									) {
										let pureValue = input;

										if (pureValue.toString().length > 1) {
											pureValue = pureValue.replace(
												/^(-?)0+(?!,)/,
												'$1'
											);
										}
										pureValue = pureValue
											.split('.')
											.join('')
											.replace(',', '.');

										setAmount(pureValue);
									}
								}}
								disabled={editing || taxCodeDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="purchaseAccountID">
							<Form.ControlLabel>
								Nomor Perkiraan Pajak Beli
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Nomor Perkiraan Pajak Beli"
								required
								disabled={editing || taxCodeDataLoading}
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
						</Form.Group>
						<Form.Group controlId="purchaseAccountID">
							<Form.ControlLabel>
								Nomor Perkiraan Pajak Jual
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Nomor Perkiraan Pajak Jual"
								required
								disabled={editing || taxCodeDataLoading}
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
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || taxCodeDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/TaxCodes');
									}}
									disabled={editing || taxCodeDataLoading}
								>
									Batal
								</Button>
								<Button
									className="float-end"
									color="red"
									appearance="primary"
									onClick={(e) => {
										setSelectedID(_id);
										setDeleteConfirmationDialogOpen(true);
										setDeleteConfirmationDialogTitle(
											'Hapus data Kode Pajak'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Kode Pajak ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Kode Pajak ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || taxCodeDataLoading}
								>
									Hapus
								</Button>
							</ButtonToolbar>
						</Form.Group>
					</Form>
				</div>
			</div>
		</>
	);
}
