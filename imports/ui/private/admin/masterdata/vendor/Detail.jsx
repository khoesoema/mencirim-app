import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Input from 'rsuite/Input';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';

import { BusinessTypesCollections } from '../../../../../db/BusinessTypes';
import { CitiesCollections } from '../../../../../db/Cities';
import { CountriesCollections } from '../../../../../db/Countries';
import { StatesCollections } from '../../../../../db/States';
import { VendorsCollections } from '../../../../../db/Vendors';
import { Topbar } from '../../../template/Topbar';

export function EditSupplier() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [vendorData, vendorDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('vendors.getByID', { _id });
			isLoading = !subs.ready();

			data = VendorsCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [previousName, setPreviousName] = useState('');

	const [name, setName] = useState('');
	const [code, setCode] = useState('');

	const [businessTypeID, setBusinessTypeID] = useState('');
	const [relasi, setRelasi] = useState('');
	const [terms, setTerms] = useState(0);

	const [phoneNumber, setPhoneNumber] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');

	const [address, setAddress] = useState('');
	const [countryCode, setCountryCode] = useState('');
	const [stateCode, setStateCode] = useState('');
	const [cityName, setCityName] = useState('');
	const [postalCode, setPostalCode] = useState('');

	const [NPWPNumber, setNPWPNumber] = useState('');
	const [NPWPName, setNPWPName] = useState('');
	const [NPWPAddress, setNPWPAddress] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');

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
					code: businessTypeID,
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
			selectedID: countryCode,
			searchText: searchCountriesText,
		});

		let data = CountriesCollections.find({
			$or: [
				{
					name: countryCode,
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
			selectedID: stateCode,
			searchText: searchStatesText,
		});

		let data = StatesCollections.find({
			$or: [
				{
					name: stateCode,
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
	}, [searchStatesText, stateCode]);

	const [cities, citiesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('cities.search', {
			selectedID: cityName,
			searchText: searchCitiesText,
		});

		let data = CitiesCollections.find({
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
	}, [searchCitiesText, countryCode]);

	//run eachtime vendorData / vendorDataLoading changed
	useEffect(() => {
		if (vendorData && vendorDataLoading === false) {
			setPreviousName(vendorData.name);
			setName(vendorData.name);
			setCode(vendorData.code);
			setBusinessTypeID(vendorData.businessTypeID);
			setRelasi(vendorData.relasi);
			setTerms(vendorData.terms);
			setPhoneNumber(vendorData.phoneNumber);
			setMobileNumber(vendorData.mobileNumber);
			setAddress(vendorData.address);
			setCountryCode(vendorData.countryCode);
			setStateCode(vendorData.stateCode);
			setCityName(vendorData.cityName);
			setPostalCode(vendorData.postalCode);
			setNPWPNumber(vendorData.NPWPNumber);
			setNPWPName(vendorData.NPWPName);
			setNPWPAddress(vendorData.NPWPAddress);
		} else if (!vendorData && vendorDataLoading === false) {
			setName('');
			setCode('');
			setBusinessTypeID('');
			setRelasi('');
			setTerms(0);
			setPhoneNumber('');
			setMobileNumber('');
			setAddress('');
			setCountryCode('');
			setStateCode('');
			setCityName('');
			setPostalCode('');
			setNPWPNumber('');
			setNPWPName('');
			setNPWPAddress('');
			navigate('/Supplier');
		}
	}, [vendorData, vendorDataLoading]);

	const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
	};

	const edit = (e) => {
		setEditing(true);
		if (name && code && businessTypeID) {
			Meteor.call(
				'vendors.edit',
				{
					_id,
					name,
					code,
					businessTypeID,
					relasi,
					terms,
					phoneNumber,
					mobileNumber,
					address,
					cityName,
					stateCode,
					countryCode,
					postalCode,
					NPWPNumber,
					NPWPName,
					NPWPAddress,
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
				'Nama, Kode, Kontak Utama, Tipe Bisnis Wajib Diisi'
			);
		}
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'vendors.delete',
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
								onClick={(e) => navigate('/Supplier')}
							>
								Data Supplier
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Supplier - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Supplier - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => { edit(); }}
						disabled={editing || vendorDataLoading}
						layout="horizontal"
					>
						<Form.Group controlId="code">
							<Form.ControlLabel className="text-left">Kode Supplier</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Supplier"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="name">
							<Form.ControlLabel className="text-left">Nama Supplier</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Supplier"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="businessTypeID">
							<Form.ControlLabel className="text-left">Tipe Bisnis</Form.ControlLabel>
							<SelectPicker
								placeholder="Tipe Bisnis"
								required
								disabled={editing || vendorDataLoading}
								data={businessTypes.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s.code,
								}))}
								style={{ width: 300 }}
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
						<Form.Group controlId="relasi">
							<Form.ControlLabel className="text-left">Hubungan dengan</Form.ControlLabel>
							<Form.Control
								name="relasi"
								placeholder="Hubungan dengan"
								value={relasi}
								onChange={(e) => {
									setRelasi(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="Terms">
							<Form.ControlLabel className="text-left">Terms</Form.ControlLabel>
							<Form.Control
								name="terms"
								placeholder="Terms"
								className="text-right"
								value={terms}
								onChange={(e) => {
									setTerms(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>	
						<Form.Group controlId="phoneNumber">
							<Form.ControlLabel className="text-left">Nomor Telepon</Form.ControlLabel>
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
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="mobileNumber">
							<Form.ControlLabel className="text-left"> Nomor Handphone </Form.ControlLabel>
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
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="address">
							<Form.ControlLabel className="text-left">Alamat Supplier</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="address"
								placeholder="Alamat Supplier"
								style={{width: 500}}
								value={address}
								onChange={(e) => {
									setAddress(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="cityName">
							<Form.ControlLabel className="text-left">Kota</Form.ControlLabel>
							<SelectPicker
								placeholder="Kota"
								required
								disabled={editing || vendorDataLoading}
								data={cities.map((s) => ({
									label: s.name,
									value: s.name,
								}))}
								style={{ width: 300 }}
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
						<Form.Group controlId="stateCode">
							<Form.ControlLabel className="text-left">Provinsi</Form.ControlLabel>
							<SelectPicker
								placeholder="Provinsi"
								required
								disabled={editing || vendorDataLoading}
								data={states.map((s) => ({
									label: s.name,
									value: s.name,
								}))}
								style={{ width: 300 }}
								value={stateCode}
								onChange={(input) => {
									setStateCode(input);
								}}
								onClean={() => {
									setStateCode('');
								}}
								onSearch={(input) => {
									setSearchStatesText(input);
								}}
								renderMenu={renderStatesLoading}
							/>
						</Form.Group>
						<Form.Group controlId="countryCode">
							<Form.ControlLabel className="text-left">Negara</Form.ControlLabel>
							<SelectPicker
								placeholder="Negara"
								required
								disabled={editing || vendorDataLoading}
								data={countries.map((s) => ({
									label: s.name,
									value: s.name,
								}))}
								style={{ width: 300 }}
								value={countryCode}
								onChange={(input) => {
									setCountryCode(input);
								}}
								onClean={() => {
									setCountryCode('');
								}}
								onSearch={(input) => {
									setSearchCountriesText(input);
								}}
								renderMenu={renderCountriesLoading}
							/>
						</Form.Group>		
						<Form.Group controlId="postalCode">
							<Form.ControlLabel className="text-left">Kode Pos</Form.ControlLabel>
							<Form.Control
								name="postalCode"
								placeholder="Kode Pos"
								value={postalCode}
								onChange={(e) => {
									setPostalCode(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
							

						<Form.Group controlId="NPWPNumber">
							<Form.ControlLabel className="text-left">Nomor NPWP</Form.ControlLabel>
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
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>

						<Form.Group controlId="NPWPName">
							<Form.ControlLabel className="text-left">Nama NPWP</Form.ControlLabel>
							<Form.Control
								name="NPWPName"
								placeholder="Nama NPWP"
								value={NPWPName}
								onChange={(e) => {
									setNPWPName(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="NPWPAddress">
							<Form.ControlLabel className="text-left">Alamat NPWP</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="NPWPAddress"
								placeholder="Alamat NPWP"
								style={{ width: 500 }}
								value={NPWPAddress}
								onChange={(e) => {
									setNPWPAddress(e);
								}}
								disabled={editing || vendorDataLoading}
							/>
						</Form.Group>

						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || vendorDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Supplier');
									}}
									disabled={editing || vendorDataLoading}
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
											'Hapus data Supplier'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Supplier ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Supplier ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || vendorDataLoading}
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
