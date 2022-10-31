import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import TrashIcon from '@rsuite/icons/Trash';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useState } from 'react';
import { Col, Row, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Input from 'rsuite/Input';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { RacksCollections } from '../../../../../db/Racks';
import { StocksLedgersCollections } from '../../../../../db/Stocks';
import { WarehousesCollections } from '../../../../../db/Warehouses';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');
const Textarea = React.forwardRef((props, ref) => (
	<Input {...props} as="textarea" ref={ref} />
));
export function AddStockTransfer(props) {
	let navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [description, setDescription] = useState('');
	const [sourceWarehouseID, setSourceWarehouseID] = useState('');
	const [destinationWarehouseID, setDestinationWarehouseID] = useState('');
	const [sourceRackID, setSourceRackID] = useState('');
	const [destinationRackID, setDestinationRackID] = useState('');
	const [selectedProducts, setSelectedProducts] = useState([]);

	const [searchProductText, setSearchProductText] = useState('');

	const [products, productsLoading] = useTracker(() => {
		let selectedIDs = selectedProducts.map(function (o) {
			return o._id;
		});
		let subs = Meteor.subscribe('stocksProducts.search', {
			searchText: searchProductText,
			warehouseID: sourceWarehouseID,
			rackID: sourceRackID,
			selectedIDs,
		});

		let findObject = {
			'itemID.warehouseID': sourceWarehouseID,
		};

		if (sourceRackID) {
			findObject['itemID.rackID'] = sourceRackID;
		}

		let findOrObject = [
			{
				productCode: {
					$regex: searchProductText,
					$options: 'i',
				},
			},
			{
				productName: {
					$regex: searchProductText,
					$options: 'i',
				},
			},
			{
				uomCode: {
					$regex: searchProductText,
					$options: 'i',
				},
			},
			{
				uomName: {
					$regex: searchProductText,
					$options: 'i',
				},
			},
		];

		if (selectedIDs) {
			findOrObject.push({
				_id: { $in: selectedIDs },
			});
		}

		let data = StocksLedgersCollections.find({ $or: findOrObject }).fetch();
		return [data, !subs.ready()];
	}, [searchProductText, sourceWarehouseID, sourceRackID]);

	const add = (e) => {
		setAdding(true);
		if (
			sourceWarehouseID &&
			destinationWarehouseID &&
			selectedProducts.length > 0
		) {
			Meteor.call(
				'stockTransfer.add',
				{
					description,
					sourceWarehouseID,
					sourceRackID,
					destinationWarehouseID,
					destinationRackID,
					selectedProducts,
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
							setDescription('');
							setSourceWarehouseID('');
							setSourceRackID('');
							setDestinationWarehouseID('');
							setDestinationRackID('');
							setSelectedProducts([]);
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
				'Silahkan Pilih Gudang Asal dan Gudang Tujuan dan Produk yang akan ditransfer'
			);
		}
	};
	const [searchSourceWarehouseText, setSearchSourceWarehouseText] =
		useState('');

	const [sourceWarehouses, sourceWarehousesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('warehouses.search', {
			searchText: searchSourceWarehouseText,
			selectedID: sourceWarehouseID,
		});

		let data = WarehousesCollections.find({
			$or: [
				{
					_id: sourceWarehouseID,
				},
				{
					code: {
						$regex: searchSourceWarehouseText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchSourceWarehouseText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchSourceWarehouseText, sourceWarehouseID]);

	const [searchDestinationWarehouseText, setSearchDestinationWarehouseText] =
		useState('');

	const [destinationWarehouses, destinationWarehousesLoading] =
		useTracker(() => {
			let subs = Meteor.subscribe('warehouses.search', {
				searchText: searchDestinationWarehouseText,
				selectedID: destinationWarehouseID,
			});

			let data = WarehousesCollections.find({
				$or: [
					{
						_id: destinationWarehouseID,
					},
					{
						code: {
							$regex: searchDestinationWarehouseText,
							$options: 'i',
						},
					},
					{
						name: {
							$regex: searchDestinationWarehouseText,
							$options: 'i',
						},
					},
				],
			}).fetch();
			return [data, !subs.ready()];
		}, [searchDestinationWarehouseText, destinationWarehouseID]);

	const [searchSourceRackText, setSearchSourceRackText] = useState('');

	const [sourceRacks, sourceRacksLoading] = useTracker(() => {
		let subs = Meteor.subscribe('racks.search', {
			searchText: searchSourceRackText,
			selectedID: sourceRackID,
			warehouseID: sourceWarehouseID,
		});

		let data = RacksCollections.find({
			warehouseID: sourceWarehouseID,
			$or: [
				{
					_id: sourceRackID,
				},
				{
					code: {
						$regex: searchSourceRackText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchSourceRackText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchSourceRackText, sourceRackID, sourceWarehouseID]);

	const [searchDestinationRackText, setSearchDestinationRackText] =
		useState('');

	const [destinationRacks, destinationRacksLoading] = useTracker(() => {
		let subs = Meteor.subscribe('racks.search', {
			searchText: searchDestinationRackText,
			selectedID: destinationRackID,
			warehouseID: destinationWarehouseID,
		});

		let data = RacksCollections.find({
			warehouseID: destinationWarehouseID,
			$or: [
				{
					_id: destinationRackID,
				},
				{
					code: {
						$regex: searchDestinationRackText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchDestinationRackText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchDestinationRackText, destinationRackID, destinationWarehouseID]);

	const renderSourceWarehousesLoading = (menu) => {
		if (sourceWarehousesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};
	const renderDestinationWarehousesLoading = (menu) => {
		if (destinationWarehousesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const renderSourceRacksLoading = (menu) => {
		if (sourceRacksLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};
	const renderDestinationRacksLoading = (menu) => {
		if (destinationRacksLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};
	const renderProductsLoading = (menu) => {
		if (productsLoading) {
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
					currentmenu="stockTransfer"
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
								onClick={(e) => navigate('/StockTransfer')}
							>
								Transfer Stok
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Transfer Stok
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Transfer Stok</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
					>
						<Row>
							<Col sm={6}>
								<Form.Group controlId="sourceWarehouseID">
									<Form.ControlLabel>
										Dari Gudang
									</Form.ControlLabel>
									<SelectPicker
										placeholder="Dari Gudang"
										disabled={adding}
										value={sourceWarehouseID}
										data={sourceWarehouses.map((s) => ({
											label: '[' + s.code + '] ' + s.name,
											value: s._id,
										}))}
										style={{ width: '100%' }}
										onSelect={(value, item, e) => {
											setSourceWarehouseID(value);
											setSourceRackID('');
											setSelectedProducts([]);
										}}
										onClean={() => {
											setSourceWarehouseID('');
											setSourceRackID('');
											setSelectedProducts([]);
										}}
										onSearch={(input) => {
											setSearchSourceWarehouseText(input);
										}}
										renderMenu={
											renderSourceWarehousesLoading
										}
									/>
								</Form.Group>
								<Form.Group controlId="sourceRackID">
									<Form.ControlLabel>
										Dari Rak
									</Form.ControlLabel>
									<SelectPicker
										placeholder="Dari Rak"
										disabled={adding}
										value={sourceRackID}
										data={sourceRacks.map((s) => ({
											label: '[' + s.code + '] ' + s.name,
											value: s._id,
										}))}
										style={{ width: '100%' }}
										onSelect={(value, item, e) => {
											setSourceRackID(value);
											setSelectedProducts([]);
										}}
										onClean={() => {
											setSourceRackID('');
											setSelectedProducts([]);
										}}
										onSearch={(input) => {
											setSearchSourceRackText(input);
										}}
										renderMenu={renderSourceRacksLoading}
									/>
								</Form.Group>
							</Col>
							<Col sm={6}>
								<Form.Group controlId="destinationWarehouseID">
									<Form.ControlLabel>
										Diterima di Gudang
									</Form.ControlLabel>
									<SelectPicker
										placeholder="Diterima di Gudang"
										disabled={adding}
										value={destinationWarehouseID}
										data={destinationWarehouses.map(
											(s) => ({
												label:
													'[' +
													s.code +
													'] ' +
													s.name,
												value: s._id,
											})
										)}
										style={{ width: '100%' }}
										onSelect={(value, item, e) => {
											setDestinationWarehouseID(value);
											setDestinationRackID('');
										}}
										onClean={() => {
											setDestinationWarehouseID('');
											setDestinationRackID('');
										}}
										onSearch={(input) => {
											setSearchDestinationWarehouseText(
												input
											);
										}}
										renderMenu={
											renderDestinationWarehousesLoading
										}
									/>
								</Form.Group>
								<Form.Group controlId="destinationRackID">
									<Form.ControlLabel>
										Diterima di Rak
									</Form.ControlLabel>
									<SelectPicker
										placeholder="Diterima di Rak"
										disabled={adding}
										value={destinationRackID}
										data={destinationRacks.map((s) => ({
											label: '[' + s.code + '] ' + s.name,
											value: s._id,
										}))}
										style={{ width: '100%' }}
										onSelect={(value, item, e) => {
											setDestinationRackID(value);
										}}
										onClean={() => {
											setDestinationRackID('');
										}}
										onSearch={(input) => {
											setSearchDestinationRackText(input);
										}}
										renderMenu={
											renderDestinationRacksLoading
										}
									/>
								</Form.Group>
							</Col>
						</Row>
						<br />
						<Form.Group controlId="description">
							<Form.ControlLabel>
								Keterangan (Jika Ada)
							</Form.ControlLabel>
							<Form.Control
								rows={5}
								accepter={Textarea}
								disabled={adding}
								value={description}
								onChange={(e) => {
									setDescription(e);
								}}
							/>
						</Form.Group>
						<br />
						<Form.Group controlId="selectedProducts">
							<Form.ControlLabel>
								Produk yang akan ditransfer
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Produk"
								disabled={adding}
								value={''}
								data={products.map((s) => ({
									label:
										'[' +
										s.productCode +
										'] ' +
										s.productName +
										' [' +
										s.uomCode +
										'] ' +
										s.uomName,
									value: s.itemID,
								}))}
								style={{ width: '100%' }}
								onSelect={(value, item, e) => {
									let currSelectedProducts = [
										...selectedProducts,
									];

									var index = currSelectedProducts
										.map(function (o) {
											return JSON.stringify(o.itemID);
										})
										.indexOf(JSON.stringify(value));

									if (index === -1) {
										let currItem = products.find(
											(x) =>
												JSON.stringify(x.itemID) ===
												JSON.stringify(value)
										);
										if (currItem) {
											currSelectedProducts.push({
												_id: currItem._id,
												itemID: value,
												productName:
													currItem.productName,
												productCode:
													currItem.productCode,
												uomName: currItem.uomName,
												uomCode: currItem.uomCode,
												availableQuantity:
													currItem.quantity,
												quantity: 0,
											});

											setSelectedProducts(
												currSelectedProducts
											);
										}
									}
								}}
								onSearch={(input) => {
									setSearchProductText(input);
								}}
								renderMenu={renderProductsLoading}
							/>
							<Table responsive striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Nama</th>
										<th>Kuantiti Sekarang</th>
										<th>Kuantiti</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{selectedProducts.map((item, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>
												[{item.productCode}]{' '}
												{item.productName}
											</td>
											<td>
												{item.availableQuantity
													.toString()
													.replace('.', ',')
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}{' '}
												[{item.uomCode}] {item.uomName}
											</td>

											<td>
												<Form.Control
													name="quantity"
													required
													placeholder="Kuantiti"
													value={item.quantity
														.toString()
														.replace('.', ',')
														.replace(
															/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
															'$1.'
														)}
													onChange={(input) => {
														let regex =
															/^-?[0-9.]*,?[0-9.]*$/;
														if (
															input === '' ||
															input === '-' ||
															input === '0' ||
															regex.test(input)
														) {
															let pureValue =
																input;

															let firstChar =
																pureValue.substring(
																	0,
																	1
																);
															if (
																firstChar ===
																'-'
															) {
																if (
																	pureValue.toString()
																		.length >
																	2
																) {
																	pureValue =
																		pureValue.replace(
																			/^(-?)0+(?!,)/,
																			'$1'
																		);
																}
															} else {
																if (
																	pureValue.toString()
																		.length >
																	1
																) {
																	pureValue =
																		pureValue.replace(
																			/^(-?)0+(?!,)/,
																			'$1'
																		);
																}
															}
															pureValue =
																pureValue
																	.split('.')
																	.join('')
																	.replace(
																		',',
																		'.'
																	);
															let currSelectedProducts =
																[
																	...selectedProducts,
																];
															let currItem = {
																...currSelectedProducts[
																	index
																],
															};

															let currQuantity =
																Number(
																	pureValue
																);

															currItem.quantity =
																currQuantity;
															currSelectedProducts[
																index
															] = currItem;

															setSelectedProducts(
																currSelectedProducts
															);
														}
													}}
													disabled={adding}
												/>
											</td>
											<td>
												<IconButton
													icon={<TrashIcon />}
													color="red"
													appearance="primary"
													circle
													onClick={(e) => {
														var index =
															selectedProducts
																.map(function (
																	o
																) {
																	return o._id;
																})
																.indexOf(
																	item._id
																);

														if (index !== -1) {
															let currSelectedProducts =
																[
																	...selectedProducts,
																];

															currSelectedProducts.splice(
																index,
																1
															);
															setSelectedProducts(
																currSelectedProducts
															);
														}
													}}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</Form.Group>
						<br />
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
