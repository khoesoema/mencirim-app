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
import Input from 'rsuite/Input';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { BusinessTypesCollections } from '../../../../../db/BusinessTypes';
import { CitiesCollections } from '../../../../../db/Cities';
import { CountriesCollections } from '../../../../../db/Countries';
import { StatesCollections } from '../../../../../db/States';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';

export function AddCompany(props) {
	let navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [businessTypeID, setBusinessTypeID] = useState('');
	const [primaryContactName, setPrimaryContactName] = useState('');
	const [address, setAddress] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [countryCode, setCountryCode] = useState('');
	const [stateCode, setStateCode] = useState('');
	const [cityName, setCityName] = useState('');
	const [postalCode, setPostalCode] = useState('');
	const [NPWPNumber, setNPWPNumber] = useState('');
	const [NPWPName, setNPWPName] = useState('');
	const [NPWPAddress, setNPWPAddress] = useState('');

	const [searchBusinessTypeText, setSearchBusinessTypeText] = useState('');
	const [searchCountriesText, setSearchCountriesText] = useState('');
	const [searchStatesText, setSearchStatesText] = useState('');
	const [searchCitiesText, setSearchCitiesText] = useState('');

	const [businessTypes, businessTypesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('businessTypes.search', {
			searchText: searchBusinessTypeText,
			selectedID: businessTypeID,
		});

		let data = BusinessTypesCollections.find({
			$or: [
				{
					_id: businessTypeID,
				},
				{
					code: {
						$regex: searchBusinessTypeText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchBusinessTypeText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchBusinessTypeText, businessTypeID]);

	const [countries, countriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('countries.search', {
			selectedCode: countryCode,
			searchText: searchCountriesText,
		});

		let data = CountriesCollections.find({
			$or: [
				{
					code: countryCode,
				},
				{
					code: {
						$regex: searchCountriesText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchCountriesText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchCountriesText, countryCode]);

	const [states, statesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('states.search', {
			countryCode,
			selectedCode: stateCode,
			searchText: searchStatesText,
		});

		let data = StatesCollections.find({
			countryCode,
			$or: [
				{
					code: stateCode,
				},
				{
					code: {
						$regex: searchStatesText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchStatesText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchStatesText, countryCode, stateCode]);

	const [cities, citiesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('cities.search', {
			countryCode,
			stateCode,
			selectedName: cityName,
			searchText: searchCitiesText,
		});

		let data = CitiesCollections.find({
			countryCode,
			stateCode,
			$or: [
				{
					name: cityName,
				},
				{
					name: {
						$regex: searchCitiesText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchCitiesText, countryCode, stateCode, cityName]);

	const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
	};
	const renderBusinessTypesLoading = (menu) => {
		if (businessTypesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};
	const renderCountriesLoading = (menu) => {
		if (countriesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};
	const renderStatesLoading = (menu) => {
		if (statesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};
	const renderCitiesLoading = (menu) => {
		if (citiesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const add = (e) => {
		setAdding(true);
		if (name && code && primaryContactName && businessTypeID) {
			Meteor.call(
				'companies.add',
				{
					name,
					code,
					businessTypeID,
					primaryContactName,
					address,
					phoneNumber,
					mobileNumber,
					countryCode,
					stateCode,
					cityName,
					postalCode,
					NPWPNumber,
					NPWPName,
					NPWPAddress,
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
							setPrimaryContactName('');
							setAddress('');
							setPhoneNumber('');
							setMobileNumber('');
							setBusinessTypeID('');
							setCountryCode('');
							setStateCode('');
							setCityName('');
							setPostalCode('');
							setNPWPNumber('');
							setNPWPName('');
							setNPWPAddress('');
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
				'Nama, Kode, Kontak Utama, Tipe Bisnis Wajib Diisi'
			);
		}
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
					currentmenu="companyMasterdata"
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
								onClick={(e) => navigate('/Companies')}
							>
								Data Perusahaan
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Data Perusahaan
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Perusahaan</b>
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
								Nama Perusahaan
							</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Perusahaan"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>
								Kode Perusahaan
							</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Perusahaan"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="businessTypeID">
							<Form.ControlLabel>Tipe Bisnis</Form.ControlLabel>
							<SelectPicker
								placeholder="Tipe Bisnis"
								required
								disabled={adding}
								data={businessTypes.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								value={businessTypeID}
								onChange={(input) => {
									setBusinessTypeID(input);
								}}
								onClean={() => {
									setBusinessTypeID('');
								}}
								onSearch={(input) => {
									setSearchBusinessTypeText(input);
								}}
								renderMenu={renderBusinessTypesLoading}
							/>
						</Form.Group>
						<Form.Group controlId="primaryContactName">
							<Form.ControlLabel>Kontak Utama</Form.ControlLabel>
							<Form.Control
								name="primaryContactName"
								required
								placeholder="Kontak Utama"
								value={primaryContactName}
								onChange={(e) => {
									setPrimaryContactName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="address">
							<Form.ControlLabel>
								Alamat Perusahaan
							</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="address"
								placeholder="Alamat Perusahaan"
								value={address}
								onChange={(e) => {
									setAddress(e);
								}}
								disabled={adding}
							/>
						</Form.Group>

						<Form.Group controlId="countryCode">
							<Form.ControlLabel>Negara</Form.ControlLabel>
							<SelectPicker
								placeholder="Negara"
								required
								disabled={adding}
								data={countries.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s.code,
								}))}
								style={{ width: '100%' }}
								value={countryCode}
								onChange={(input) => {
									setCountryCode(input);
									setStateCode('');
									setCityName('');
								}}
								onClean={() => {
									setCountryCode('');
									setStateCode('');
									setCityName('');
								}}
								onSearch={(input) => {
									setSearchCountriesText(input);
								}}
								renderMenu={renderCountriesLoading}
							/>
						</Form.Group>

						<Form.Group controlId="stateCode">
							<Form.ControlLabel>Provinsi</Form.ControlLabel>
							<SelectPicker
								placeholder="Provinsi"
								required
								disabled={adding}
								data={states.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s.code,
								}))}
								style={{ width: '100%' }}
								value={stateCode}
								onChange={(input) => {
									setStateCode(input);
									setCityName('');
								}}
								onClean={() => {
									setStateCode('');
									setCityName('');
								}}
								onSearch={(input) => {
									setSearchStatesText(input);
								}}
								renderMenu={renderStatesLoading}
							/>
						</Form.Group>

						<Form.Group controlId="cityName">
							<Form.ControlLabel>Kota</Form.ControlLabel>
							<SelectPicker
								placeholder="Kota"
								required
								disabled={adding}
								data={cities.map((s) => ({
									label: s.name,
									value: s.name,
								}))}
								style={{ width: '100%' }}
								value={cityName}
								onChange={(input) => {
									setCityName(input);
								}}
								onClean={() => {
									setCityName('');
								}}
								onSearch={(input) => {
									setSearchCitiesText(input);
								}}
								renderMenu={renderCitiesLoading}
							/>
						</Form.Group>

						<Form.Group controlId="mobileNumber">
							<Form.ControlLabel>
								Nomor Handphone
							</Form.ControlLabel>
							<Form.Control
								name="mobileNumber"
								placeholder="Nomor Handphone"
								value={mobileNumber}
								onChange={(e) => {
									let isValid = validateNumber(e);
									if (isValid) {
										setMobileNumber(e);
									}
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="postalCode">
							<Form.ControlLabel>Kode Pos</Form.ControlLabel>
							<Form.Control
								name="postalCode"
								placeholder="Kode Pos"
								value={postalCode}
								onChange={(e) => {
									setPostalCode(e);
								}}
								disabled={adding}
							/>
						</Form.Group>

						<Form.Group controlId="phoneNumber">
							<Form.ControlLabel>Nomor Telepon</Form.ControlLabel>
							<Form.Control
								name="phoneNumber"
								placeholder="Nomor Handphone"
								value={phoneNumber}
								onChange={(e) => {
									let isValid = setPhoneNumber(e);
									if (isValid) {
										setPhoneNumber(e);
									}
								}}
								disabled={adding}
							/>
						</Form.Group>

						<Form.Group controlId="NPWPNumber">
							<Form.ControlLabel>Nomor NPWP</Form.ControlLabel>
							<Form.Control
								name="NPWPNumber"
								placeholder="Nomor NPWP"
								value={NPWPNumber}
								onChange={(e) => {
									let isValid = setNPWPNumber(e);
									if (isValid) {
										setNPWPNumber(e);
									}
								}}
								disabled={adding}
							/>
						</Form.Group>

						<Form.Group controlId="NPWPName">
							<Form.ControlLabel>Nama NPWP</Form.ControlLabel>
							<Form.Control
								name="NPWPName"
								placeholder="Nama NPWP"
								value={NPWPName}
								onChange={(e) => {
									setNPWPName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="NPWPAddress">
							<Form.ControlLabel>Alamat NPWP</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="NPWPAddress"
								placeholder="Alamat NPWP"
								value={NPWPAddress}
								onChange={(e) => {
									setNPWPAddress(e);
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
										navigate('/Companies');
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
