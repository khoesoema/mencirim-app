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
import { LocationsCollections } from '../../../../../db/Locations';
import { WarehousesCollections } from '../../../../../db/Warehouses';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';

export function EditWarehouse(props) {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [warehouseData, warehouseDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('warehouses.getByID', { _id });
			isLoading = !subs.ready();

			data = WarehousesCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [previousName, setPreviousName] = useState('');
	const [isStore, setIsStore] = useState(0);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [locationID, setLocationID] = useState('');

	const [searchLocationText, setSearchLocationText] = useState('');
	const [searchCompanyText, setSearchCompanyText] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
		useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] =
		useState('');
	const [
		deleteConfirmationDialogContent,
		setDeleteConfirmationDialogContent,
	] = useState('');

	//run eachtime warehouseData / warehouseDataLoading changed
	useEffect(() => {
		if (warehouseData && warehouseDataLoading === false) {
			setPreviousName(warehouseData.name);
			setIsStore(warehouseData.isStore);
			setName(warehouseData.name);
			setCode(warehouseData.code);
			setLocationID(warehouseData.locationID);
		} else if (!warehouseData && warehouseDataLoading === false) {
			setPreviousName('');
			setIsStore('');
			setName('');
			setCode('');
			setLocationID('');
			navigate('/Warehouses');
		}
	}, [warehouseData, warehouseDataLoading]);
	const [locations, locationsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('locations.search', {
			searchText: searchLocationText,
			selectedID: locationID,
		});

		let data = LocationsCollections.find({
			$or: [
				{
					_id: locationID,
				},
				{
					code: {
						$regex: searchLocationText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchLocationText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchLocationText, locationID]);

	const edit = (e) => {
		setEditing(true);
		if (name && code && locationID) {
			Meteor.call(
				'warehouses.edit',
				{
					_id,
					isStore: Number(isStore),
					name,
					code,
					locationID,
					companyIDs,
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
			setDialogContent('Nama, Kode, Lokasi Wajib Diisi');
		}
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'warehouses.delete',
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
	const renderLocationsLoading = (menu) => {
		if (locationsLoading) {
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
					currentmenu="warehouseMasterdata"
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
								onClick={(e) => navigate('/Warehouses')}
							>
								Data Gudang / Store
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Gudang / Store - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Gudang / Store - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							edit();
						}}
						disabled={editing || warehouseDataLoading}
					>
						<Form.Group>
							<Checkbox
								checked={isStore === 1 ? true : false}
								onChange={(e) => {
									if (isStore === 1) {
										setIsStore(0);
									} else {
										setIsStore(1);
									}
								}}
								disabled={editing || warehouseDataLoading}
							>
								Toko / Store
							</Checkbox>
							{/* <Checkbox> Perkiraan Bank</Checkbox> */}
						</Form.Group>
						<Form.Group controlId="name">
							<Form.ControlLabel>
								Nama Gudang / Store
							</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Gudang / Store"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || warehouseDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>
								Kode Gudang / Store
							</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Gudang / Store"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || warehouseDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="locationID">
							<Form.ControlLabel>
								Lokasi Gudang / Store
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Lokasi Gudang / Store"
								required
								disabled={editing || warehouseDataLoading}
								data={locations.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								value={locationID}
								onChange={(input) => {
									setLocationID(input);
								}}
								onClean={() => {
									setLocationID('');
								}}
								onSearch={(input) => {
									setSearchLocationText(input);
								}}
								renderMenu={renderLocationsLoading}
							/>
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || warehouseDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Warehouses');
									}}
									disabled={editing || warehouseDataLoading}
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
											'Hapus data Gudang / Store'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Gudang / Store ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Gudang / Store ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || warehouseDataLoading}
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
