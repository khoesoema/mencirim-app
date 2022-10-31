import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import TrashIcon from '@rsuite/icons/Trash';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
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
import { UOMCollections } from '../../../../../db/UOM';
import { WarehousesCollections } from '../../../../../db/Warehouses';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');
const Textarea = React.forwardRef((props, ref) => (
	<Input {...props} as="textarea" ref={ref} />
));
export function AddStockConversion(props) {
	let navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [description, setDescription] = useState('');
	const [warehouseID, setWarehouseID] = useState('');
	const [rackID, setRackID] = useState('');
	const [selectedProducts, setSelectedProducts] = useState([]);

	const [searchProductText, setSearchProductText] = useState('');

	const [products, productsLoading] = useTracker(() => {
		let selectedIDs = selectedProducts.map(function (o) {
			return o._id;
		});
		let subs = Meteor.subscribe('stocksProducts.search', {
			searchText: searchProductText,
			warehouseID: warehouseID,
			rackID: rackID,
			selectedIDs,
		});

		let findObject = {
			'itemID.warehouseID': warehouseID,
		};

		if (rackID) {
			findObject['itemID.rackID'] = rackID;
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
	}, [searchProductText, warehouseID, rackID]);

	const add = (e) => {
		setAdding(true);
		if (warehouseID && selectedProducts.length > 0) {
			Meteor.call(
				'stockConversion.add',
				{
					description,
					warehouseID,
					rackID,
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
							setWarehouseID('');
							setRackID('');
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
				'Silahkan Pilih Gudang dan Produk yang akan dikonversi'
			);
		}
	};
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

	const [searchRackText, setSearchRackText] = useState('');

	const [racks, racksLoading] = useTracker(() => {
		let subs = Meteor.subscribe('racks.search', {
			searchText: searchRackText,
			selectedID: rackID,
			warehouseID: warehouseID,
		});

		let data = RacksCollections.find({
			warehouseID: warehouseID,
			$or: [
				{
					_id: rackID,
				},
				{
					code: {
						$regex: searchRackText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchRackText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchRackText, rackID, warehouseID]);

	const [searchUOMText, setSearchUOMText] = useState('');

	const [uom, uomLoading] = useTracker(() => {
		let subs = Meteor.subscribe('uom.search', {
			searchText: searchUOMText,
			selectedIDs: selectedProducts.map(function (o) {
				return o.destinationUOMID;
			}),
		});

		let data = UOMCollections.find({
			$or: [
				{
					_id: {
						$in: selectedProducts.map(function (o) {
							return o.destinationUOMID;
						}),
					},
				},
				{
					code: {
						$regex: searchUOMText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchUOMText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchUOMText, selectedProducts]);
	const renderUOMLoading = (menu) => {
		if (uomLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
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

	const renderRacksLoading = (menu) => {
		if (racksLoading) {
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
					currentmenu="stockConversion"
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
								onClick={(e) => navigate('/StockConversion')}
							>
								Konfersi Stok
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Konfersi Stok
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Konfersi Stok</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
					>
						<Form.Group controlId="warehouseID">
							<Form.ControlLabel>Gudang</Form.ControlLabel>
							<SelectPicker
								placeholder="Gudang"
								disabled={adding}
								value={warehouseID}
								data={warehouses.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								onSelect={(value, item, e) => {
									setWarehouseID(value);
									setRackID('');
									setSelectedProducts([]);
								}}
								onClean={() => {
									setWarehouseID('');
									setRackID('');
									setSelectedProducts([]);
								}}
								onSearch={(input) => {
									setSearchWarehouseText(input);
								}}
								renderMenu={renderWarehousesLoading}
							/>
						</Form.Group>
						<Form.Group controlId="rackID">
							<Form.ControlLabel>Rak</Form.ControlLabel>
							<SelectPicker
								placeholder="Rak"
								disabled={adding}
								value={rackID}
								data={racks.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								onSelect={(value, item, e) => {
									setRackID(value);
									setSelectedProducts([]);
								}}
								onClean={() => {
									setRackID('');
									setSelectedProducts([]);
								}}
								onSearch={(input) => {
									setSearchRackText(input);
								}}
								renderMenu={renderRacksLoading}
							/>
						</Form.Group>
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
								Produk yang akan dikonversi
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
												sourceQuantity: 0,
												destinationUOMID: 0,
												destinationQuantity: 0,
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
										<th>Kuantiti yang akan dikonversi</th>
										<th>Kuantiti Tujuan</th>
										<th>Satuan</th>
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
													name="sourceQuantity"
													required
													placeholder="Kuantiti yang akan dikonversi"
													value={item.sourceQuantity
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

															currItem.sourceQuantity =
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
												<Form.Control
													name="destinationQuantity"
													required
													placeholder="Kuantiti Tujuan"
													value={item.destinationQuantity
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

															currItem.destinationQuantity =
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
												{' '}
												<SelectPicker
													placeholder="Satuan"
													value={
														item.destinationUOMID
													}
													data={uom.map((s) => ({
														label:
															'[' +
															s.code +
															'] ' +
															s.name,
														value: s._id,
													}))}
													style={{ width: '100%' }}
													onSelect={(
														value,
														item,
														e
													) => {
														let currSelectedProducts =
															[
																...selectedProducts,
															];
														let currItem = {
															...currSelectedProducts[
																index
															],
														};

														currItem.destinationUOMID =
															value;

														currSelectedProducts[
															index
														] = currItem;

														setSelectedProducts(
															currSelectedProducts
														);
													}}
													onSearch={(input) => {
														setSearchUOMText(input);
													}}
													renderMenu={
														renderUOMLoading
													}
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
