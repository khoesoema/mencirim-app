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
import Input from 'rsuite/Input';
// import {Modal} from 'react-bootstrap';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { CitiesCollections } from '../../../../../db/Cities';
import { CountriesCollections } from '../../../../../db/Countries';
import { LocationsCollections } from '../../../../../db/Locations';
import { StatesCollections } from '../../../../../db/States';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';

export function EditLocation(props) {
	let navigate = useNavigate();
	let { _id } = useParams();
	const [locationData, locationDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('locations.getByID', { _id });
			isLoading = !subs.ready();

			data = LocationsCollections.findOne({ _id });
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
	const [primaryContactName, setPrimaryContactName] = useState('');
	const [address, setAddress] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [countryCode, setCountryCode] = useState('');
	const [stateCode, setStateCode] = useState('');
	const [cityName, setCityName] = useState('');
	const [postalCode, setPostalCode] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
		useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] =
		useState('');
	const [
		deleteConfirmationDialogContent,
		setDeleteConfirmationDialogContent,
	] = useState('');

	const [searchCountriesText, setSearchCountriesText] = useState('');
	const [searchStatesText, setSearchStatesText] = useState('');
	const [searchCitiesText, setSearchCitiesText] = useState('');

	//run eachtime locationData / locationDataLoading changed
	useEffect(() => {
		if (locationData && locationDataLoading === false) {
			setPreviousName(locationData.name);
			setName(locationData.name);
			setCode(locationData.code);
			setPrimaryContactName(locationData.primaryContactName);
			setAddress(locationData.address);
			setPhoneNumber(locationData.phoneNumber);
			setMobileNumber(locationData.mobileNumber);
			setPreviousName(locationData.name);
			setCityName(locationData.cityName);
			setStateCode(locationData.stateCode);
			setCountryCode(locationData.countryCode);
			setPostalCode(locationData.postalCode);
		} else if (!locationData && locationDataLoading === false) {
			setPreviousName('');
			setName('');
			setCode('');
			setPrimaryContactName('');
			setAddress('');
			setPhoneNumber('');
			setMobileNumber('');
			setPreviousName('');
			setCountryCode('');
			setStateCode('');
			setCityName('');
			setPostalCode('');
			navigate('/Locations');
		}
	}, [locationData, locationDataLoading]);

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

	const edit = (e) => {
		setEditing(true);
		if (name && code && primaryContactName) {
			Meteor.call(
				'locations.edit',
				{
					_id,
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
	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'locations.delete',
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
				</Modal>
				<Sidebar
					currentmenu="locationMasterdata"
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
								onClick={(e) => navigate('/Locations')}
							>
								Data Lokasi
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Lokasi - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Lokasi - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							edit();
						}}
						disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
							/>
						</Form.Group>

						<Form.Group controlId="countryID">
							<Form.ControlLabel>Negara</Form.ControlLabel>
							<SelectPicker
								placeholder="Negara"
								required
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
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
								disabled={editing || locationDataLoading}
							/>
						</Form.Group>

						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || locationDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Locations');
									}}
									disabled={editing || locationDataLoading}
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
											'Hapus data Lokasi'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Lokasi ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Lokasi ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || locationDataLoading}
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
