import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { AccountsCollections } from '../../../../../db/Accounts';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';

export function AddTaxCode(props) {
	let navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [amount, setAmount] = useState(0.0);
	const [purchaseAccountID, setPurchaseAccountID] = useState('');
	const [sellAccountID, setSellAccountID] = useState('');

	const add = (e) => {
		setAdding(true);
		if (name && code && purchaseAccountID && sellAccountID) {
			Meteor.call(
				'taxCodes.add',
				{
					name,
					code,
					amount: Number(amount),
					purchaseAccountID,
					sellAccountID,
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
							setName('');
							setCode('');
							setAmount(0.0);
							setPurchaseAccountID('');
							setSellAccountID('');
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
				'Nama, Kode, Nomor Perkiraan Pajak Beli dan Pajak Jual Wajib diisi'
			);
		}
	};

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
								Tambah Data Kode Pajak
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Kode Pajak</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="purchaseAccountID">
							<Form.ControlLabel>
								Nomor Perkiraan Pajak Beli
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Nomor Perkiraan Pajak Beli"
								required
								disabled={adding}
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
								disabled={adding}
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
									loading={adding}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/TaxCodes');
									}}
									disabled={adding}
								>
									Batal
								</Button>
							</ButtonToolbar>
						</Form.Group>
					</Form>
				</div>
			</div>
		</>
	);
}
