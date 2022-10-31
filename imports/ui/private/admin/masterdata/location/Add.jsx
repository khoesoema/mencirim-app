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

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';

import { CitiesCollections } from '../../../../../db/Cities';
import { CountriesCollections } from '../../../../../db/Countries';
import { StatesCollections } from '../../../../../db/States';

import { Topbar } from '../../../template/Topbar';

export function AddLocation(props) {
	let navigate = useNavigate();

	const [adding, setAdding] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [primaryContactName, setPrimaryContactName] = useState('');
	const [address, setAddress] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [countryCode, setCountryCode] = useState('');
	const [stateCode, setStateCode] = useState('');
	const [cityName, setCityName] = useState('');
	const [postalCode, setPostalCode] = useState('');

	const [searchCountriesText, setSearchCountriesText] = useState('');
	const [searchStatesText, setSearchStatesText] = useState('');
	const [searchCitiesText, setSearchCitiesText] = useState('');

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

	const add = (e) => {
		setAdding(true);
		if (name && code && primaryContactName) {
			Meteor.call(
				'locations.add',
				{
					name,
					code,
					primaryContactName,
					address,
					phoneNumber,
					mobileNumber,
					countryCode,
					stateCode,
					cityName,
					postalCode,
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
							setCountryCode('');
							setStateCode('');
							setCityName('');
							setPostalCode('');
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
			setDialogContent('Nama, Kode, Kontak Utama Wajib Diisi');
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
								onClick={(e) => navigate('/Locations')}
							>
								Data Lokasi
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Data Lokasi
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Lokasi</b>
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
							<Form.ControlLabel>Nama Lokasi</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Lokasi"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>Kode Lokasi</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Lokasi"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={adding}
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
							<Form.ControlLabel>Alamat Lokasi</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="address"
								placeholder="Alamat Lokasi"
								value={address}
								onChange={(e) => {
									setAddress(e);
								}}
								disabled={adding}
							/>
						</Form.Group>

						<Form.Group controlId="countryID">
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

						<Form.Group controlId="stateID">
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

						<Form.Group controlId="cityID">
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
										navigate('/Locations');
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
