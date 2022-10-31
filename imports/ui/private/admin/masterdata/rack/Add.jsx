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
import { WarehousesCollections } from '../../../../../db/Warehouses';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';

export function AddRack(props) {
	let navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [warehouseID, setWarehouseID] = useState('');

	const [searchWarehouseText, setSearchWarehouseText] = useState('');
	const [warehouses, warehousesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('warehouses.search', {
			searchText: searchWarehouseText,
			selectedID: warehouseID,
		});

		let data = WarehousesCollections.find({
			$or: [
				{
					_id: warehouseID,
				},
				{
					code: {
						$regex: searchWarehouseText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchWarehouseText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchWarehouseText, warehouseID]);

	const add = (e) => {
		setAdding(true);
		if (name && code && warehouseID) {
			Meteor.call(
				'racks.add',
				{
					name,
					code,
					warehouseID,
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
							setWarehouseID('');
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
			setDialogContent('Nama, Kode, Gudang Wajib Diisi');
		}
	};

	const renderWarehousesLoading = (menu) => {
		if (warehousesLoading) {
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
					currentmenu="rackMasterdata"
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
								onClick={(e) => navigate('/Racks')}
							>
								Data Rak
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Data Rak
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Rak</b>
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
							<Form.ControlLabel>Nama Rak</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Rak"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>Kode Rak</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Rak"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="locationID">
							<Form.ControlLabel>Gudang Rak</Form.ControlLabel>
							<SelectPicker
								placeholder="Gudang Rak"
								required
								disabled={adding}
								data={warehouses.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								value={warehouseID}
								onChange={(input) => {
									setWarehouseID(input);
								}}
								onClean={() => {
									setWarehouseID('');
								}}
								onSearch={(input) => {
									setSearchWarehouseText(input);
								}}
								renderMenu={renderWarehousesLoading}
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
										navigate('/Racks');
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
