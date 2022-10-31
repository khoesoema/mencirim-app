import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Checkbox from 'rsuite/Checkbox';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Input from 'rsuite/Input';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import DatePicker from 'rsuite/DatePicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';

import { BusinessTypesCollections } from '../../../../../db/BusinessTypes';
import { CitiesCollections } from '../../../../../db/Cities';
import { CountriesCollections } from '../../../../../db/Countries';
import { StatesCollections } from '../../../../../db/States';

import { Topbar } from '../../../template/Topbar';

export function AddCustomer(props) {
	let navigate = useNavigate();

	const [adding, setAdding] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [code, setCode] = useState('');
	const [name, setName] = useState('');
	const [birthDate, setBirthDate] = useState(new Date);
	const [birthPlace, setBirthPlace] = useState('')
	const [gender, setGender] = useState('');
	
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

	const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
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
		if ( name && code ) {
			Meteor.call(
				'customers.add',
				{	
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
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setCode('');
							setName('');
							setBirthDate(new Date);
							setBirthPlace('');
							setGender('');
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
				'Nama & Kode Wajib Diisi'
			);
			return;
		}

		
	};

	const dataGender = ['Laki - laki','Perempuan'].map(
		(item, index) => ({ label: item, value: ( index + 1 ) })
	);

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
								Tambah Data Customer
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Customer</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => { add(); }}
						disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
									setGender('');
								}}
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="cityName" style={{ marginBottom: 0}}>
							<Form.ControlLabel className="text-left">Kota</Form.ControlLabel>
							<SelectPicker
								placeholder="Kota"
								required
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
										navigate('/Customers');
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
