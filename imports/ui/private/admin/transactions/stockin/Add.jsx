import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import MenuIcon from '@rsuite/icons/Menu';
import TrashIcon from '@rsuite/icons/Trash';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import IconButton from 'rsuite/IconButton';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { InvoicesTransactionsCollections } from '../../../../../db/Invoices';
import { ProductsCollections } from '../../../../../db/Products';
import { WarehousesCollections } from '../../../../../db/Warehouses';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function AddStockIn(props) {
	let navigate = useNavigate();
	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [invoiceNumber, setInvoiceNumber] = useState('');
	const [transactionDate, setTransactionDate] = useState(moment().toDate());
	const [paidTotal, setPaidTotal] = useState(0);
	const [subTotal, setSubTotal] = useState(0);
	const [grandTotal, setGrandTotal] = useState(0);
	const [discountTotal, setDiscountTotal] = useState(0);
	const [vendorID, setVendorID] = useState('');
	const [warehouseID, setWarehouseID] = useState('');
	const [selectedProducts, setSelectedProducts] = useState([]);

	const [selectedInvoiceID, setSelectedInvoiceID] = useState('');

	const [invoiceData, invoiceDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (selectedInvoiceID) {
			let subs = Meteor.subscribe('purchaseInvoices.getByID', {
				_id: selectedInvoiceID,
			});
			isLoading = !subs.ready();
			data = InvoicesTransactionsCollections.findOne({
				_id: selectedInvoiceID,
			});
		}
		return [data, isLoading];
	}, [selectedInvoiceID]);



	const [searchInvoiceText, setSearchInvoiceText] = useState('');

	const [invoices, invoicesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('purchaseInvoices.search', {
			searchText: searchInvoiceText,
			selectedID: selectedInvoiceID,
		});

		let data = InvoicesTransactionsCollections.find({
			type: 1,
			$or: [
				{
					_id: selectedInvoiceID,
				},
				{
					invoiceNumber: {
						$regex: searchInvoiceText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchInvoiceText, selectedInvoiceID]);

	const [searchProductText, setSearchProductText] = useState('');

	const [products, productsLoading] = useTracker(() => {
		let inProductIDs = [];
		if (invoiceData && invoiceData.invoiceItemData) {
			inProductIDs = invoiceData.invoiceItemData.map(function (o) {
				if (o.TII) {
					return o.TII.productID;
				}
			});
		}
		let subs = Meteor.subscribe('products.search', {
			searchText: searchProductText,
			selectedIDs: selectedProducts.map(function (o) {
				return o._id;
			}),
			inProductIDs,
		});

		let data = ProductsCollections.find({
			_id: {
				$in: inProductIDs,
			},
			$or: [
				{
					_id: {
						$in: selectedProducts.map(function (o) {
							return o._id;
						}),
					},
				},
				{
					code: {
						$regex: searchProductText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchProductText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchProductText, selectedProducts, invoiceData]);

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
		if (selectedInvoiceID && warehouseID && selectedProducts.length > 0) {
			Meteor.call(
				'stockIn.add',
				{
					invoiceID: selectedInvoiceID,
					warehouseID,
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
							setSelectedInvoiceID('');
							setWarehouseID('');
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
				'Silahkan Pilih Invoice Pembelian dan Produk yang akan diterima'
			);
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

	const renderInvoicesLoading = (menu) => {
		if (invoicesLoading) {
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
					currentmenu="stockIn"
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
								onClick={(e) => navigate('/StockIn')}
							>
								Stok Masuk
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Stok Masuk
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Stok Masuk</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
					>
						<Form.Group controlId="invoiceNumber">
							<Form.ControlLabel>
								Nomor Invoice Pembelian
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Nomor Invoice Pembelian"
								disabled={adding}
								data={invoices.map((s) => ({
									label: s.invoiceNumber,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								value={selectedInvoiceID}
								onChange={(input) => {
									setSelectedInvoiceID(input);
								}}
								onClean={() => {
									setSelectedInvoiceID('');
								}}
								onSearch={(input) => {
									setSearchInvoiceText(input);
								}}
								renderMenu={renderInvoicesLoading}
							/>
						</Form.Group>
						<Form.Group controlId="transactionDate">
							<Form.ControlLabel>
								Tanggal Transaksi
							</Form.ControlLabel>
							<DatePicker
								className="form-control"
								readOnly
								disabled
								selected={
									invoiceData &&
									invoiceData.invoiceData &&
									invoiceData.invoiceData.transactionDate
										? moment(
												invoiceData.invoiceData
													.transactionDate
										  ).toDate()
										: moment().toDate()
								}
							/>
						</Form.Group>
						<Form.Group controlId="vendorID">
							<Form.ControlLabel>Vendor</Form.ControlLabel>
							<Form.Control
								name="invoiceNumber"
								placeholder="Vendor"
								value={
									invoiceData &&
									invoiceData.vendorData &&
									invoiceData.vendorData.name
										? invoiceData.vendorData.name
										: ''
								}
								readOnly
							/>
						</Form.Group>
						<Form.Group controlId="invoiceProducts">
							<Form.ControlLabel>
								Produk di Invoice Pembelian
							</Form.ControlLabel>
							<Table responsive striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Nama</th>
										<th>Kuantiti</th>
										<th>Diterima</th>
									</tr>
								</thead>
								<tbody>
									{invoiceData &&
										invoiceData.invoiceItemData &&
										invoiceData.invoiceItemData.map(
											(item, index) =>
												item.TII && (
													<tr key={index}>
														<td>{index + 1}</td>
														<td>
															[{item.productCode}]{' '}
															{item.productName}
														</td>
														<td>
															{item.TII.quantity
																.toString()
																.replace(
																	'.',
																	','
																)
																.replace(
																	/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
																	'$1.'
																)}{' '}
															[{item.uomCode}]{' '}
															{item.uomName}
														</td>
														<td>
															{item.TII.receivedQuantity
																.toString()
																.replace(
																	'.',
																	','
																)
																.replace(
																	/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
																	'$1.'
																)}{' '}
															[{item.uomCode}]{' '}
															{item.uomName}
														</td>
													</tr>
												)
										)}
								</tbody>
							</Table>
						</Form.Group>
						<Form.Group controlId="warehouseID">
							<Form.ControlLabel>
								Diterima di Gudang
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Diterima di Gudang"
								disabled={adding}
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
									setSearchWarehouseText(input);
								}}
								renderMenu={renderWarehousesLoading}
							/>
						</Form.Group>
						<Form.Group controlId="selectedProducts">
							<Form.ControlLabel>
								Produk Diterima
							</Form.ControlLabel>
							<SelectPicker
								placeholder="Produk"
								disabled={adding}
								value={''}
								data={products.map((s) => ({
									label: '[' + s.code + '] ' + s.name,
									value: s._id,
								}))}
								style={{ width: '100%' }}
								onSelect={(value, item, e) => {
									let currSelectedProducts = [
										...selectedProducts,
									];
									var index = currSelectedProducts
										.map(function (o) {
											return o._id;
										})
										.indexOf(value);

									if (index === -1) {
										currSelectedProducts.push({
											_id: value,
											quantity: 0,
										});

										setSelectedProducts(
											currSelectedProducts
										);
									}

									// let findIndex = companyIDs.indexOf(
									// 	item.value
									// );
									// if (findIndex === -1) {
									// 	setCompanyIDs((oldArray) => [
									// 		...oldArray,
									// 		item.value,
									// 	]);
									// }
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
										<th>Kuantiti</th>
										<th></th>
									</tr>
								</thead>
								<tbody>
									{selectedProducts.map((item, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>
												[
												{products.find(
													(x) =>
														x._id === item._id &&
														x.code
												) &&
													products.find(
														(x) =>
															x._id ===
																item._id &&
															x.code
													).code}
												]{' '}
												{products.find(
													(x) =>
														x._id === item._id &&
														x.name
												) &&
													products.find(
														(x) =>
															x._id ===
																item._id &&
															x.name
													).name}
												<br />
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
