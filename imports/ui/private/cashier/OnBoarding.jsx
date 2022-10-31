import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { WarehousesCollections } from '../../../db/Warehouses';
import { Topbar } from '../template/Topbar';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function CashierOnBoarding(props) {
	let navigate = useNavigate();

	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selecting, setSelecting] = useState(false);
	const [warehouseID, setWarehouseID] = useState('');

	const [searchWarehousesText, setSearchWarehousesText] = useState('');

	const [warehouses, warehousesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('warehouses.search', {
			isStore: 1,
			searchText: searchWarehousesText,
			selectedID: warehouseID,
		});

		let data = WarehousesCollections.find({
			isStore: 1,
			$or: [
				{
					_id: warehouseID,
				},
				{
					code: {
						$regex: searchWarehousesText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchWarehousesText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchWarehousesText, warehouseID]);

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
				<div className="mainContent">
					<div className="breadcrumContainer">
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Mulai Kasir
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Mulai Kasir</b>
					</h6>
					<hr />
					<Row>
						<Col sm={12}>
							<Form.Group controlId="warehouseID">
								<Form.ControlLabel>Store</Form.ControlLabel>
								<SelectPicker
									placeholder="Store"
									disabled={selecting}
									value={warehouseID}
									data={warehouses.map((s) => ({
										label: '[' + s.code + '] ' + s.name,
										value: s._id,
									}))}
									style={{ width: '100%' }}
									onSelect={(value, item, e) => {
										setWarehouseID(value);
									}}
									onClean={() => {
										setWarehouseID('');
									}}
									onSearch={(input) => {
										setSearchWarehousesText(input);
									}}
									renderMenu={renderWarehousesLoading}
								/>
							</Form.Group>
							<br />
							<Button
								type="submit"
								appearance="primary"
								loading={selecting}
								onClick={() => {
									if (warehouseID) {
										navigate('/Cashier/' + warehouseID);
									} else {
										setSelecting(false);
										setDialogOpen(true);
										setDialogTitle('Kesalahan Validasi');
										setDialogContent(
											'Silahkan Pilih Store'
										);
									}
								}}
							>
								Buka
							</Button>
						</Col>
					</Row>
				</div>
			</div>
		</>
	);
}
