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
import Checkbox from 'rsuite/Checkbox';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';

import { CompaniesCollections } from '../../../../../db/Companies';
import { LocationsCollections } from '../../../../../db/Locations';
import { Topbar } from '../../../template/Topbar';

export function AddWarehouse(props) {
	let navigate = useNavigate();

	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	
	const [isStore, setIsStore] = useState(0);
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [location, setLocation] = useState('');

	const add = (e) => {
		setAdding(true);
		if (name && code && location) {
			Meteor.call(
				'warehouses.add',
				{
					isStore: Number(isStore),
					name,
					code,
					location,
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
							setLocation('');
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
			setDialogContent('Nama, Kode, Lokasi Wajib Diisi');
		}
	};

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

	const renderCompaniesLoading = (menu) => {
		if (companiesLoading) {
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
								onClick={(e) => navigate('/Warehouses')}
							>
								Data Gudang / Store
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Data Gudang / Store
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Gudang / Store</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="locationID">
							<Form.ControlLabel>
								Lokasi Gudang / Store
							</Form.ControlLabel>
							<Form.Control
								name="location"
								required
								placeholder="location"
								value={location}
								onChange={(e) => {
									setLocation(e);
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
										navigate('/Warehouses');
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
