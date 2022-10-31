import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import moment from 'moment-timezone';
import 'moment/locale/id';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Input from 'rsuite/Input';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import DatePicker from 'rsuite/DatePicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { CustomersCollections  } from '../../../../../db/Customers';
import { CitiesCollections } from '../../../../../db/Cities';
import { CountriesCollections } from '../../../../../db/Countries';
import { StatesCollections } from '../../../../../db/States';

import { Topbar } from '../../../template/Topbar';

export function EditCustomer() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [customerData, customerDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('customers.getByID', { _id });
			isLoading = !subs.ready();

			data = CustomersCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [editing, setEditing] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [previousName, setPreviousName] = useState('');

	const [code, setCode] = useState('');
	const [name, setName] = useState('');
	const [birthDate, setBirthDate] = useState(new Date);
	const [birthPlace, setBirthPlace] = useState('')
	const [gender, setGender] = useState(0);
	
	const [phoneNumber, setPhoneNumber] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');

	const [address, setAddress] = useState('');
	const [kelurahan, setKelurahan] = useState('');
	const [kecamatan, setKecamatan] = useState('');

	const [countryCode, setCountryCode] = useState('');
	const [stateCode, setStateCode] = useState('');
	const [cityName, setCityName] = useState('');
	const [postalCode, setPostalCode] = useState('');

	const [identityNumber, setIdentityNumber] = useState('');
	const [NPWPNumber, setNPWPNumber] = useState('');
	const [validDate, setValidDate] = useState(new Date);
	const [current, setCurrent] = useState(0);

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent,setDeleteConfirmationDialogContent] = useState('');

	const [searchCountriesText, setSearchCountriesText] = useState('');
	const [searchStatesText, setSearchStatesText] = useState('');
	const [searchCitiesText, setSearchCitiesText] = useState('');

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

	useEffect(() => {
		if (customerData && customerDataLoading === false) {
			setPreviousName(customerData.name);
			
			setCode(customerData.code);
			setName(customerData.name);

			setBirthDate(moment(customerData.birthDate).toDate());
			setBirthPlace(customerData.birthPlace);
			setGender(customerData.gender);

			setPhoneNumber(customerData.phoneNumber);
			setMobileNumber(customerData.mobileNumber);

			setAddress(customerData.address);
			
			setKelurahan(customerData.kelurahan);
			setKecamatan(customerData.kecamatan);
			setCountryCode(customerData.countryCode);
			setStateCode(customerData.stateCode);
			setCityName(customerData.cityName);
			setPostalCode(customerData.postalCode);

			setIdentityNumber(customerData.identityNumber);
			setNPWPNumber(customerData.NPWPNumber);

			setValidDate(moment(customerData.validDate).toDate());
			setCurrent(customerData.current);
		} else if (!customerData && customerDataLoading === false) {
			setCode('');
			setName('');
			setBirthDate(new Date);
			setBirthPlace('');
			setGender(0);
			setPhoneNumber('');
			setMobileNumber('');
			setAddress('');
			setKelurahan('');
			setKecamatan('');
			setCityName('');
			setStateCode('');
			setCountryCode('');
			setPostalCode('');
			setIdentityNumber('');
			setNPWPNumber('');
			setValidDate(new Date);
			setCurrent(0);
			navigate('/Customers');
		}
	}, [customerData, customerDataLoading]);

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
		Meteor.call(
			'customers.edit',
			{
				_id,
				code,
				name,
				birthDate,
				birthPlace,
				gender,
				phoneNumber,
				mobileNumber,
				address,
				kelurahan,
				kecamatan,
				cityName,
				stateCode,
				countryCode,
				postalCode,
				identityNumber,
				NPWPNumber,
				validDate,
				current,
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
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'customers.delete',
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

	const dataGender = ['Laki - laki','Perempuan'].map(
		(item, index) => ({ label: item, value: ( index + 1 ) })
	);
	
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
								onClick={(e) => navigate('/Customers')}
							>
								Data Customer
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Customer - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Customer - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => { edit(); }}
						disabled={editing || customerDataLoading}
						layout="horizontal"
					>
						<Form.Group controlId="code" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Kode Customer</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Customer"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="name" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Nama Customer</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Customer"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="identityNumber" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">No. KTP</Form.ControlLabel>
							<Form.Control
								name="identityNumber"
								placeholder="Nomor KTP"
								value={identityNumber}
								onChange={(e) => {
									let isValid = setIdentityNumber(e);
									if (isValid) {
										setIdentityNumber(e);
									}
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="NPWPNumber" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">No. NPWP</Form.ControlLabel>
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
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="birthPlace" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Tempat Lahir</Form.ControlLabel>
							<Form.Control
								name="birthPlace"
								placeholder="Tempat Lahir"
								value={birthPlace}
								onChange={(e) => {
									setBirthPlace(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="birthDate" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">
								Tanggal Lahir
							</Form.ControlLabel>
							<Form.Control 
								name="birthDate" 
								accepter={DatePicker} 
								value={birthDate}
								onChange={(e) => {
									setBirthDate(e);
								}}
								disabled={editing || customerDataLoading}
								/>
						</Form.Group>
						<Form.Group controlId="gender" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Jenis Kelamin</Form.ControlLabel>
							<Form.Control
								name="gender"
								accepter={SelectPicker}
								searchable={false} 
								style={{ width: 224 }}
								data={dataGender}
								value={gender}
								onChange={(e) => {
									setGender(e);
								}}
								onClean={() => {
									setGender(0);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="phoneNumber" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Nomor Telepon</Form.ControlLabel>
							<Form.Control
								name="phoneNumber"
								placeholder="Nomor Telepon"
								value={phoneNumber}
								onChange={(e) => {
									setPhoneNumber(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="mobileNumber" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left"> Nomor Handphone </Form.ControlLabel>
							<Form.Control
								name="mobileNumber"
								placeholder="Nomor Handphone"
								value={mobileNumber}
								onChange={(e) => {
									setMobileNumber(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="address" style={{ marginBottom: 5}}>
							<Form.ControlLabel className="text-left">Alamat Customer</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="address"
								placeholder="Alamat Customer"
								style={{width: 500}}
								value={address}
								onChange={(e) => {
									setAddress(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="kelurahan" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Kelurahan</Form.ControlLabel>
							<Form.Control
								name="kelurahan"
								placeholder="Kelurahan"
								value={kelurahan}
								onChange={(e) => {
									setKelurahan(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="kecamatan" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Kecamatan</Form.ControlLabel>
							<Form.Control
								name="kecamatan"
								placeholder="Kecamatan"
								value={kecamatan}
								onChange={(e) => {
									setKecamatan(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="cityName" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Kota</Form.ControlLabel>
							<SelectPicker
								placeholder="Kota"
								required
								disabled={editing || customerDataLoading}
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
						<Form.Group controlId="stateCode" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Provinsi</Form.ControlLabel>
							<SelectPicker
								placeholder="Provinsi"
								required
								disabled={editing || customerDataLoading}
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
						<Form.Group controlId="countryCode" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Negara</Form.ControlLabel>
							<SelectPicker
								placeholder="Negara"
								disabled={editing || customerDataLoading}
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
						<Form.Group controlId="postalCode" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Kode Pos</Form.ControlLabel>
							<Form.Control
								name="postalCode"
								placeholder="Kode Pos"
								value={postalCode}
								onChange={(e) => {
									setPostalCode(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="validDate" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">
								Tanggal Berlaku
							</Form.ControlLabel>
							<Form.Control 
								name="validDate" 
								accepter={DatePicker} 
								value={validDate}
								onChange={(e) => {
									setValidDate(e);
								}}
								disabled={editing || customerDataLoading}
								/>
						</Form.Group>
						<Form.Group controlId="current" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Poin</Form.ControlLabel>
							<Form.Control
								name="current"
								placeholder="Jumlah Poin"
								className="text-right"
								value={current}
								onChange={(e) => {
									setCurrent(e);
								}}
								disabled={editing || customerDataLoading}
							/>
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || customerDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Customers');
									}}
									disabled={editing || customerDataLoading}
								>
									Batal
								</Button>
								<Button
									color="red"
									appearance="primary"
									onClick={(e) => {
										setSelectedID(_id);
										setDeleteConfirmationDialogOpen(true);
										setDeleteConfirmationDialogTitle(
											'Hapus data Customer'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Customer ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Customer ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || customerDataLoading}
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
