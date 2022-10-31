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
import Checkbox from 'rsuite/Checkbox';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import {
	balanceSheetSubType,
	incomeStatementSubType,
} from '../../../../etc/const';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';
import { AccountsCollections } from '/imports/db/Accounts';
import { CurrenciesCollections } from '/imports/db/Currencies';

export function AddAccount(props) {
	let navigate = useNavigate();
	let { selectedParentID } = useParams();

	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [balanceType, setBalanceType] = useState(1);
	const [accountType, setAccountType] = useState(1);
	const [accountSubType, setAccountSubType] = useState();
	const [isGeneral, setIsGeneral] = useState(0);
	const [currencyID, setCurrencyID] = useState('');
	const [parentID, setParentID] = useState('');
	const [initialBalance, setInitialBalance] = useState(0.0);

	useEffect(() => {
		if (selectedParentID) {
			setParentID(selectedParentID);
		}
	}, [selectedParentID]);

	const [searchCurrencyText, setSearchCurrencyText] = useState('');
	const [searchAccountText, setSearchAccountText] = useState('');

	const [currencies, currenciesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('currencies.search', {
			searchText: searchCurrencyText,
			selectedID: businessTypeID,
		});

		let data = CurrenciesCollections.find({
			$or: [
				{
					_id: businessTypeID,
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

	const [accounts, accountsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('accounts.search', {
			selectedID: parentID,
			searchText: searchAccountText,
		});

		let data = AccountsCollections.find({
			$or: [
				{
					_id: parentID,
				},
				{
					code: {
						$regex: searchAccountText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchAccountText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchAccountText, parentID]);

	const add = (e) => {
		setAdding(true);
		if (
			name &&
			code &&
			(balanceType === 0 || balanceType === 1) &&
			(accountType === 0 || accountType === 1) &&
			currencyID
		) {
			if (isGeneral === 0 && !accountSubType) {
				setAdding(false);
				setDialogOpen(true);
				setDialogTitle('Kesalahan Validasi');
				setDialogContent('Kelompok Perkiraan Wajib Diisi');
			}
			Meteor.call(
				'accounts.add',
				{
					name,
					code,
					balanceType,
					accountType,
					accountSubType,
					isGeneral,
					currencyID,
					parentID,
					initialBalance,
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
							setBalanceType(1);
							setAccountType(1);
							setAccountSubType();
							setIsGeneral(0);
							setCurrencyID('');
							setParentID('');
							if (selectedParentID) {
								setParentID(selectedParentID);
							}
							setInitialBalance(0);
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
				'Nama dan Nomor Perkiraan serta Saldo Normal, Jenis Perkiraan dan Mata Uang Wajib Diisi'
			);
		}
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
	const renderAccountsLoading = (menu) => {
		if (accountsLoading) {
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
					currentmenu="accountMasterdata"
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
							<Breadcrumb.Item
								href="/"
								onClick={(e) => {
									e.preventDefault();
									navigate('/');
								}}
							>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item
								href="/Accounts"
								onClick={(e) => {
									e.preventDefault();
									navigate('/Accounts');
								}}
							>
								Data Nomor Perkiraan GL
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Data Nomor Perkiraan GL
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Nomor Perkiraan GL</b>
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
								Nama Perkiraan GL
							</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Perkiraan GL"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>
								Nomor Perkiraan GL
							</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Nomor Perkiraan GL"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="balanceType">
							<Form.ControlLabel>Saldo Normal</Form.ControlLabel>
							<SelectPicker
								placeholder="Saldo Normal"
								required
								cleanable={false}
								disabled={adding}
								data={[
									{
										label: 'Debet',
										value: 1,
									},
									{
										label: 'Kredit',
										value: 0,
									},
								]}
								style={{ width: '100%' }}
								value={balanceType}
								onChange={(input) => {
									setBalanceType(input);
								}}
								onClean={() => {
									setBalanceType('');
								}}
							/>
						</Form.Group>

						<Form.Group>
							<Checkbox
								checked={isGeneral === 1 ? true : false}
								onChange={(e) => {
									if (isGeneral === 1) {
										setIsGeneral(0);
									} else {
										setIsGeneral(1);
									}
								}}
							>
								Perkiraan General
							</Checkbox>
							{/* <Checkbox> Perkiraan Bank</Checkbox> */}
						</Form.Group>
						<Form.Group controlId="accountType">
							<Form.ControlLabel>
								Jenis Perkiraan
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Jenis Perkiraan"
								required
								cleanable={false}
								disabled={adding}
								data={[
									{
										label: 'Neraca',
										value: 1,
									},
									{
										label: 'Laba / Rugi',
										value: 0,
									},
								]}
								style={{ width: '100%' }}
								value={accountType}
								onChange={(input) => {
									setAccountType(input);
								}}
								onClean={() => {
									setAccountType('');
								}}
							/>
						</Form.Group>

						<Form.Group controlId="accountSubType">
							<Form.ControlLabel>
								Kelompok Perkiraan
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Kelompok Perkiraan"
								disabled={adding}
								data={
									isGeneral === 0
										? accountType === 1
											? balanceSheetSubType
											: accountType === 0 &&
											  incomeStatementSubType
										: []
								}
								style={{ width: '100%' }}
								value={accountSubType}
								onChange={(input) => {
									setAccountSubType(input);
								}}
								onClean={() => {
									setAccountSubType();
								}}
							/>
						</Form.Group>

						<Form.Group controlId="currencyID">
							<Form.ControlLabel>Mata Uang</Form.ControlLabel>
							<SelectPicker
								placeholder="Mata Uang"
								required
								disabled={adding}
								data={currencies.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
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

						<Form.Group controlId="parentID">
							<Form.ControlLabel>
								Grup dengan Perkiraan GL
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Grup dengan Perkiraan GL"
								disabled={
									adding || (selectedParentID ? true : false)
								}
								data={accounts.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								value={parentID}
								onChange={(input) => {
									setParentID(input);
								}}
								onClean={() => {
									setParentID('');
								}}
								onSearch={(input) => {
									setSearchAccountText(input);
								}}
								renderMenu={renderAccountsLoading}
							/>
						</Form.Group>
						<Form.Group controlId="initialBalance">
							<Form.ControlLabel>Saldo Awal</Form.ControlLabel>
							<Form.Control
								name="initialBalance"
								required
								placeholder="Saldo Awal"
								value={initialBalance
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
										input === '-' ||
										input === '0' ||
										regex.test(input)
									) {
										let pureValue = input;

										let firstChar = pureValue.substring(
											0,
											1
										);
										if (firstChar === '-') {
											if (
												pureValue.toString().length > 2
											) {
												pureValue = pureValue.replace(
													/^(-?)0+(?!,)/,
													'$1'
												);
											}
										} else {
											if (
												pureValue.toString().length > 1
											) {
												pureValue = pureValue.replace(
													/^(-?)0+(?!,)/,
													'$1'
												);
											}
										}
										pureValue = pureValue
											.split('.')
											.join('')
											.replace(',', '.');

										setInitialBalance(pureValue);
									}
								}}
								disabled={adding}
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
										navigate('/Accounts');
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
