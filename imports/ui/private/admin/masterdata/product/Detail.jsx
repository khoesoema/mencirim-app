import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useRef, useState } from 'react';
import { Form as BSForm } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import InputPicker from 'rsuite/InputPicker';
import InputGroup from 'rsuite/InputGroup';
import DatePicker from 'rsuite/DatePicker';
import IconButton from 'rsuite/IconButton';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';
import CloseIcon from '@rsuite/icons/Close';

import { ProductsCollections } from '../../../../../db/Products';
import { CategoriesCollections } from '../../../../../db/Categories';
import { VendorsCollections } from '../../../../../db/Vendors';
import { UOMCollections } from '../../../../../db/UOM';
import { toBase64 } from '../../../../etc/tools';
import { Topbar } from '../../../template/Topbar';

import '../../../../../ui/assets/css/addproduct.css';

export function EditProduct(props) {
	const imageRef = useRef();
	let navigate = useNavigate();
	let { _id } = useParams();

	const [productData, productDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('products.getByID', { _id });
			isLoading = !subs.ready();

			data = ProductsCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [currentImage, setCurrentImage] = useState('');
	const [previousName, setPreviousName] = useState('');

	const [kodeBarang, setKodeBarang] = useState('');
	const [barcode, setBarcode] = useState('');
	const [namaBarang, setNamaBarang] = useState('');
	const [categoryID, setCategoryID] = useState('');

	const [kts, setKts] = useState(0);
	const [satuanBesar, setSatuanBesar] = useState('');
	const [satuanKecil, setSatuanKecil] = useState('');

	const [qty, setQty] = useState(0);

	const [supplier, setSupplier] = useState('');

	const [hargabeli, setHargaBeli] = useState(0);
	const [hargabelisatuan, setHargaBeliSatuan] = useState(0);
	
	const [jenisdiskon1, setJenisDiskon1] = useState('Discount');
	const [jenisdiskon2, setJenisDiskon2] = useState('Discount');
	const [jenisdiskon3, setJenisDiskon3] = useState('Discount');
	const [jenisdiskon4, setJenisDiskon4] = useState('Discount');
	const [jenisdiskon5, setJenisDiskon5] = useState('Discount');

	const [diskonpersen1, setDiskonPersen1] = useState(0);
	const [diskonpersen2, setDiskonPersen2] = useState(0);
	const [diskonpersen3, setDiskonPersen3] = useState(0);
	const [diskonpersen4, setDiskonPersen4] = useState(0);
	const [diskonpersen5, setDiskonPersen5] = useState(0);

	const [diskonharga1, setDiskonHarga1] = useState(0);
	const [diskonharga2, setDiskonHarga2] = useState(0);
	const [diskonharga3, setDiskonHarga3] = useState(0);
	const [diskonharga4, setDiskonHarga4] = useState(0);
	const [diskonharga5, setDiskonHarga5] = useState(0);

	const [ppnpersen, setPpnPersen] = useState(0);
	const [ppnharga, setPpnHarga] = useState(0);

	const [tglLastTrx, setTglLastTrx] = useState(new Date());
	const [buktiFaktur, setBuktiFaktur] = useState('');

	const [hargamodal, setHargaModal] = useState(0);
	const [hargajual, setHargaJual] = useState(0);
	const [hargajualmember, setHargaJualMember] = useState(0);

	const [profitjual, setProfitJual] = useState(0);
	const [profitjualmember, setProfitJualMember] = useState(0);
	
	const [minimumjlh1, setMinimumjlh1] = useState(0);
	const [minimumjlh2, setMinimumjlh2] = useState(0);
	const [minimumjlh3, setMinimumjlh3] = useState(0);

	const [minimumharga1, setMinimumHarga1] = useState(0);
	const [minimumharga2, setMinimumHarga2] = useState(0);
	const [minimumharga3, setMinimumHarga3] = useState(0);

	const [minimumpersen1, setminimumpersen1] = useState(0);
	const [minimumpersen2, setminimumpersen2] = useState(0);
	const [minimumpersen3, setminimumpersen3] = useState(0);

	const [kartonjlh, setKartonJlh] = useState(0);
	const [kartonharga, setKartonHarga] = useState(0);
	const [kartonpersen, setKartonPersen] = useState(0);

	const [batasMin, setBatasMin] = useState(0);
	const [batasMax, setBatasMax] = useState(0);
	const [minimumOrder, setMinimumOrder] = useState(0);

	const [image, setImage] = useState(null);
	const [imagePath, setImagePath] = useState('');
	const [imageBase64, setImageBase64] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');

	//run eachtime productData / productDataLoading changed
	useEffect(() => {
		if (productData && productDataLoading === false) {
			setPreviousName(productData.namaBarang);
			setKodeBarang(productData.kodeBarang);
			setBarcode(productData.barcode);
			setNamaBarang (productData.namaBarang);
			setCategoryID (productData.categoryID);

			setKts(productData.kts)
			setSatuanBesar (productData.satuanBesar);
			setSatuanKecil (productData.satuanKecil);

			setQty(productData.qty);

			setSupplier (productData.supplier);

			setHargaBeli(productData.hargabeli);
			setHargaBeliSatuan(productData.hargabelisatuan);

			setJenisDiskon1(productData.jenisdiskon1);
			setJenisDiskon2(productData.jenisdiskon2);
			setJenisDiskon3(productData.jenisdiskon3);
			setJenisDiskon4(productData.jenisdiskon4);
			setJenisDiskon5(productData.jenisdiskon5);

			setDiskonPersen1(productData.diskonpersen1);
			setDiskonPersen2(productData.diskonpersen2);
			setDiskonPersen3(productData.diskonpersen3);
			setDiskonPersen4(productData.diskonpersen4);
			setDiskonPersen5(productData.diskonpersen5);

			setDiskonHarga1(productData.diskonharga1);
			setDiskonHarga2(productData.diskonharga2);
			setDiskonHarga3(productData.diskonharga3);
			setDiskonHarga4(productData.diskonharga4);
			setDiskonHarga5(productData.diskonharga5);

			setPpnPersen(productData.ppnpersen);
			setPpnHarga(productData.ppnharga);

			setTglLastTrx(moment(productData.tglLastTrx).toDate());
			setBuktiFaktur (productData.buktiFaktur);

			setHargaModal(productData.hargamodal);
			setHargaJual(productData.hargajual);
			setHargaJualMember(productData.hargajualmember);

			setProfitJual(productData.profitjual);
			setProfitJualMember(productData.profitjualmember);

			setMinimumjlh1(productData.minimumjlh1);
			setMinimumjlh2(productData.minimumjlh2);
			setMinimumjlh3(productData.minimumjlh3);

			setMinimumHarga1(productData.minimumharga1);
			setMinimumHarga2(productData.minimumharga2);
			setMinimumHarga3(productData.minimumharga3);;;

			setminimumpersen1(productData.minimumpersen2);
			setminimumpersen2(productData.minimumpersen2);
			setminimumpersen3(productData.minimumpersen2);

			setKartonJlh(productData.kartonjlh);
			setKartonHarga(productData.kartonharga);
			setKartonPersen(productData.kartonpersen);

			setBatasMin(productData.batasMin);
			setBatasMax(productData.batasMax);
			setMinimumOrder(productData.minimumOrder);
			
			setImageBase64(productData.imageBase64);
		} else if (!productData && productDataLoading === false) {
			setPreviousName('');
			setKodeBarang('');
			setBarcode('');
			setNamaBarang ('');
			setCategoryID ('');

			setKts(0)
			setSatuanBesar (''); 
			setSatuanKecil ('');

			setQty(0);

			setSupplier ('');

			setHargaBeli(0);
			setHargaBeliSatuan(0);

			setJenisDiskon1('');
			setJenisDiskon2('');
			setJenisDiskon3('');
			setJenisDiskon4('');
			setJenisDiskon5('');

			setDiskonPersen1(0);
			setDiskonPersen2(0);
			setDiskonPersen3(0);
			setDiskonPersen4(0);
			setDiskonPersen5(0);

			setDiskonHarga1(0);
			setDiskonHarga2(0);
			setDiskonHarga3(0);
			setDiskonHarga4(0);
			setDiskonHarga5(0);

			setPpnPersen(0);
			setPpnHarga(0);

			setTglLastTrx ('');
			setBuktiFaktur ('');

			setHargaModal(0);
			setHargaJual(0);
			setHargaJualMember(0);

			setProfitJual(0);
			setProfitJualMember(0);

			setMinimumjlh1(0);
			setMinimumjlh2(0);
			setMinimumjlh3(0);

			setMinimumHarga1(0);
			setMinimumHarga2(0);
			setMinimumHarga3(0);

			setminimumpersen1(0);
			setminimumpersen2(0);
			setminimumpersen3(0);

			setKartonJlh(0);
			setKartonHarga(0);
			setKartonPersen(0);

			setBatasMin(0);
			setBatasMax(0);
			setMinimumOrder(0);

			setImageBase64('');
			navigate('/Products');
		}
	}, [productData, productDataLoading]);

	const edit = async (e) => {
		setEditing(true);
		if (kodeBarang && namaBarang && kts) {
			await Meteor.call(
				'products.edit',
				{
					_id,
					kodeBarang,
					barcode,
					namaBarang,
					categoryID,
					kts,
					satuanBesar,
					satuanKecil,
					qty,
					supplier,
					hargabeli,
					hargabelisatuan,
					jenisdiskon1,
					jenisdiskon2,
					jenisdiskon3,
					jenisdiskon4,
					jenisdiskon5,
					diskonpersen1,
					diskonpersen2,
					diskonpersen3,
					diskonpersen4,
					diskonpersen5,
					diskonharga1,
					diskonharga2,
					diskonharga3,
					diskonharga4,
					diskonharga5,
					ppnpersen,
					ppnharga,
					hargamodal,
					tglLastTrx,
					buktiFaktur,
					hargajual,
					profitjual,
					hargajualmember,
					profitjualmember,
					minimumjlh1,
					minimumjlh2,
					minimumjlh3,
					minimumharga1,
					minimumharga2,
					minimumharga3,
					minimumpersen1,
					minimumpersen2,
					minimumpersen3,
					kartonjlh,
					kartonharga,
					kartonpersen,
					batasMin,
					batasMax,
					minimumOrder,
					imageBase64,
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
							//setImageBase64('');
							//imageRef.current.value = '';
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
			setDialogContent('Nama, Kode dan Satuan Wajib Diisi');
		}
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'products.delete',
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

	const deleteImage = () => {
		Meteor.call(
			'products.deleteImage',
			{
				_id,
			},
			(err, res) => {
				if (err) {
					setDialogOpen(true);
					setDialogTitle(err.error);
					setDialogContent(err.reason);
				} else if (res) {
					let resultCode = res.code;
					let resultTitle = res.title;
					let resultMessage = res.message;
					if (resultCode === 200) {
						setDialogOpen(true);
						setDialogTitle(resultTitle);
						setDialogContent(resultMessage);
					} else {
						setDialogOpen(true);
						setDialogTitle(resultTitle);
						setDialogContent(resultMessage);
					}
				} else {
					setDialogOpen(true);
					setDialogTitle('Kesalahan Sistem');
					setDialogContent(
						'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
					);
				}
			}
		);
	};

	const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
	};

	const [searchCategoriesText, setSearchCategoriesText] = useState('');
	const [searchSuppliersText, setSearchSuppliersText] = useState('');
	const [searchUOMsText, setSearchUOMsText] = useState('');
	const [searchUOM2Text, setSearchUOM2Text] = useState('');

	const [categories, categoriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('categories.search', {
			searchText: searchCategoriesText,
			selectedID: categoryID,
		});

		let data = CategoriesCollections.find({
			$or: [
				{
					code: categoryID,
				},
				{
					code: {
						$regex: searchCategoriesText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchCategoriesText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchCategoriesText, categoryID]);

	const [suppliers, suppliersLoading] = useTracker(() => {
		let subs = Meteor.subscribe('vendors.search', {
			searchText: searchSuppliersText,
			selectedID: supplier,
		});

		let data = VendorsCollections.find({
			$or: [
				{
					_id: supplier,
				},
				{
					code: {
						$regex: searchSuppliersText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchSuppliersText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchSuppliersText, supplier]);

	const [uoms, uomsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('uom.search', {
			searchText: searchUOMsText,
			selectedID: satuanBesar,
		});

		let data = UOMCollections.find({
			$or: [
				{
					code: satuanBesar,
				},
				{
					code: {
						$regex: searchUOMsText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchUOMsText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchUOMsText, satuanBesar]);

	const [uoms2, uoms2Loading] = useTracker(() => {
		let subs = Meteor.subscribe('uom.search', {
			searchText: searchUOM2Text,
			selectedID: satuanKecil,
		});

		let data = UOMCollections.find({
			$or: [
				{
					code: satuanKecil,
				},
				{
					code: {
						$regex: searchUOM2Text,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchUOM2Text,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchUOM2Text, satuanKecil]);

	const renderCategoriesLoading = (menu) => {
		if (categoriesLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const renderSuppliersLoading = (menu) => {
		if (suppliersLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const renderUOMsLoading = (menu) => {
		if (uomsLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const renderUOM2Loading = (menu) => {
		if (uoms2Loading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const selectData = ['Sub Discount', 'Discount'].map(item => ({
		label: item,
		value: item
	}));

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
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
								color="red"
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
								onClick={(e) => navigate('/Products')}
							>
								Data Produk
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Produk - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Produk - {previousName}</b>
					</h6>
					<hr />
					<Form
						onSubmit={() => { edit();}}
						disabled={editing || productDataLoading}
						layout="horizontal"
						className="prod-form" >
						<Row >
							<Col xs={8}>
								<Form.Group controlId="kodebarang" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Kode Barang</Form.ControlLabel>
									<Form.Control
										name="kodebarang"
										required
										placeholder="Kode Barang"
										value={kodeBarang}
										onChange={(e) => {
											setKodeBarang(e);
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="barcode" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Barcode</Form.ControlLabel>
									<Form.Control
										name="barcode"
										required
										placeholder="Barcode"
										value={barcode}
										onChange={(e) => {
											setBarcode(e);
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="name" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Nama Produk</Form.ControlLabel>
									<Form.Control
										name="name"
										required
										placeholder="Nama Produk"
										value={namaBarang}
										onChange={(e) => {
											setNamaBarang(e);
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="categoryID" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col>
											<Form.ControlLabel 
												className="text-left"
												style={{ width: 145 }}
											> Kategori
											</Form.ControlLabel>
										</Col>
										<Col>
											<SelectPicker
												placeholder="Kategori"
												disabled={editing || productDataLoading}
												data={categories.map((s) => ({
													label: '[' + s.code + '] ' + s.name,
													value: s.code,
												}))}
												style={{ width: 300 }}
												value={categoryID}
												onChange={(input) => {
													setCategoryID(input);
												}}
												onClean={() => {
													setCategoryID('');
												}}
												onSearch={(input) => {
													setSearchCategoriesText(input);
												}}
												renderMenu={renderCategoriesLoading}
											/>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="satuan" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Kuantitas</Form.ControlLabel>
									<Row xs="auto" >
										<Col><h5>1</h5></Col>
										<Col className="row-qty">
											<SelectPicker
												placeholder="Satuan Besar"
												required
												disabled={editing || productDataLoading}
												data={uoms.map((s) => ({
													label: s.name,
													value: s.code,
												}))}
												value={satuanBesar}
												onChange={(input) => {
													setSatuanBesar(input);
												}}
												onClean={() => {
													setSatuanBesar('');
												}}
												onSearch={(input) => {
													setSearchUOMsText(input);
												}}
												renderMenu={renderUOMsLoading}
											/>
										</Col>
										<Col>
											<Form.Control
												name="qtykecil"
												required
												placeholder="Qty Kecil"
												style={{ width: 100 }}
												className="text-right"
												value={kts
													.toString()
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
												onChange={(e) => {
													e = e.toString().split('.').join('');
													let validated = validateNumber(e);
													if (validated) {
														setKts(e);
													}
												}}
												disabled={editing || productDataLoading}
											/>
										</Col>
										<Col>
											<SelectPicker
												placeholder="Satuan Kecil"											
												required
												disabled={editing || productDataLoading}
												data={uoms2.map((t) => ({
													label: t.name,
													value: t.code,
												}))}
												//style={{ width: '30%' }}
												value={satuanKecil}
												onChange={(input) => {
													setSatuanKecil(input);
												}}
												onClean={() => {
													setSatuanKecil('');
												}}
												onSearch={(input) => {
													setSearchUOM2Text(input);
												}}
												renderMenu={renderUOM2Loading}
											/>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="supplierID" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col>
											<Form.ControlLabel 
												className="text-left"
												style={{ width: 145 }}
											> Supplier
											</Form.ControlLabel>
										</Col>
										<Col>
											<SelectPicker
												placeholder="Supplier"
												required
												disabled={editing || productDataLoading}
												data={suppliers.map((s) => ({
													label: '[' + s.code + '] ' + s.name,
													value: s._id,
												}))}
												style={{ width: 300 }}
												value={supplier}
												onChange={(input) => {
													setSupplier(input);
												}}
												onClean={() => {
													setSupplier('');
												}}
												onSearch={(input) => {
													setSearchSuppliersText(input);
												}}
												renderMenu={renderSuppliersLoading}
											/>
										</Col>
									</Row>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col xs={2}>
											<Form.ControlLabel className="text-left" >Gambar</Form.ControlLabel>
										</Col>
										<Col xs={10}>
											<BSForm.Control
												name="image"
												type="file"
												size="sm"
												placeholder="Gambar Produk"
												inputprops={{ accept: 'image/*' }}
												onChange={async (e) => {
													setImageBase64(
														await toBase64(e.target.files[0])
													);
												}}
												ref={imageRef}
												disabled={editing || productDataLoading}
											/>
										</Col>
									</Row>
									{imageBase64 && (
										<>
											<Row >
												<Col xs={2}></Col>
												<Col >
													<IconButton
														className="btnimg"
														appearance="primary"
														color="red"
														disabled={editing || productDataLoading}
														onClick={(e) => {
															let confirmResult =
																window.confirm(
																	'Anda akan menghapus gambar ini, apakah anda yakin?'
																);
															if (confirmResult) {
																deleteImage();
																setImageBase64('');
																imageRef.current.value = '';
															}
														}}
														size="sm"
														circle
														icon={<CloseIcon />}
													/>
													<img
														src={imageBase64}
														className="img-thumbnail img-prod"
														alt="Responsive image"
													></img>
												</Col>
												<Col xs={1}></Col>
											</Row>
										</>
									)}
								</Form.Group>			
							</Col>
						</Row>
						<Row>
							<Col>
								<Form.Group controlId="hargabeli" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Harga Beli</Form.ControlLabel>
									<Form.Control
										name="hargabeli"
										placeholder="Harga Beli"
										className="text-right"
										value={formatNum(hargabeli)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setHargaBeli(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="hargabelisatuan" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Harga Beli Satuan</Form.ControlLabel>
									<Form.Control
										name="hargabelisatuan"
										placeholder="Harga Beli Satuan"
										className="text-right"
										value={formatNum(hargabelisatuan)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setHargaBeliSatuan(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="disc1" style={{ marginBottom: 5}}>
									<Row xs="auto">
										<Col >
											<Form.Control
												name="disc1"
												placeholder="Jenis Disc 1"
												style={{width:180}}
												value={jenisdiskon1}
												onChange={(e) => {
													setJenisDiskon1(e);
												}}
												onClean={() => {
													setJenisDiskon1('');
												}}
												accepter={InputPicker} 
												data={selectData}
												disabled={editing || productDataLoading}
											/>

										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="diskonpersen1" 
													className="text-right"
													style={{width:100}}
													value={diskonpersen1}
													onChange= { (e) => { 
														setDiskonPersen1(e);
													} }
												>

												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										<Col>
											<Form.Control 
												name="diskonharga1" 
												className="text-right"
												value={diskonharga1}
												style={{width:150}}
												onChange={(e) => {
													setDiskonHarga1(e);
												}}
											>
											</Form.Control>
										</Col>
									</Row>
								</Form.Group >
								<Form.Group controlId="disc2" style={{ marginBottom: 5}}>
									<Row xs="auto">
										<Col >
											<Form.Control
												name="disc2"
												placeholder="Jenis Disc 2"
												style={{width:180}}
												value={jenisdiskon2.toString()}
												onChange={(e) => {
													setJenisDiskon2(e);
												}}
												accepter={InputPicker} 
												data={selectData}
												disabled={editing || productDataLoading}
											/>

										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="diskonpersen2" 
													className="text-right"
													style={{width:100}}
													value={diskonpersen2}
													onChange= { (e) => { 
														setDiskonPersen2(e);
													} }
												>

												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										<Col>
											<Form.Control 
												name="diskonharga2" 
												className="text-right"
												value={diskonharga2}
												style={{width:150}}
												onChange={(e) => {
													setDiskonHarga2(e);
												}}
											>
											</Form.Control>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="disc3" style={{ marginBottom: 5}}>
									<Row xs="auto">
										<Col >
											<Form.Control
												name="disc3"
												placeholder="Jenis Disc 3"
												style={{width:180}}
												value={jenisdiskon3.toString()}
												onChange={(e) => {
													setJenisDiskon3(e);
												}}
												accepter={InputPicker} 
												data={selectData}
												disabled={editing || productDataLoading}
											/>

										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="diskonpersen3" 
													className="text-right"
													style={{width:100}}
													value={diskonpersen3}
													onChange= { (e) => { 
														setDiskonPersen3(e);
													} }
												>

												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										<Col>
											<Form.Control 
												name="diskonharga3" 
												className="text-right"
												value={diskonharga3}
												style={{width:150}}
												onChange={(e) => {
													setDiskonHarga3(e);
												}}
											>
											</Form.Control>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="disc4" style={{ marginBottom: 5}}>
									<Row xs="auto">
										<Col >
											<Form.Control
												name="disc4"
												placeholder="Jenis Disc 4"
												style={{width:180}}
												value={jenisdiskon4.toString()}
												onChange={(e) => {
													setJenisDiskon4(e);
												}}
												accepter={InputPicker} 
												data={selectData}
												disabled={editing || productDataLoading}
											/>

										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="diskonpersen4" 
													className="text-right"
													style={{width:100}}
													value={diskonpersen4}
													onChange= { (e) => { 
														setDiskonPersen4(e);
													} }
												>

												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										<Col>
											<Form.Control 
												name="diskonharga4" 
												className="text-right"
												value={diskonharga4}
												style={{width:150}}
												onChange={(e) => {
													setDiskonHarga4(e);
												}}
											>
											</Form.Control>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="ppn" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col >
											<Form.ControlLabel className="text-left" >PPN</Form.ControlLabel>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="ppn" 
													className="text-right"
													style={{width:100}}
													value={ppnpersen}
													onChange= { (e) => { 
														setPpnPersen(e);
													} }
												>

												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										<Col>
											<Form.Control 
												name="ppnharga" 
												className="text-right"
												value={ppnharga}
												style={{width:150}}
											>
											</Form.Control>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="disc5" style={{ marginBottom: 5}}>
									<Row xs="auto">
										<Col >
											<Form.Control
												name="disc5"
												placeholder="Jenis Disc 5"
												style={{width:180}}
												value={jenisdiskon5.toString()}
												onChange={(e) => {
													setJenisDiskon5(e);
												}}
												accepter={InputPicker} 
												data={selectData}
												disabled={editing || productDataLoading}
											/>

										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="diskonpersen5" 
													className="text-right"
													style={{width:100}}
													value={diskonpersen5}
													onChange= { (e) => { 
														setDiskonPersen5(e);
													} }
												>
												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										<Col>
											<Form.Control 
												name="diskonharga4" 
												className="text-right"
												value={diskonharga5}
												style={{width:150}}
												onChange={(e) => {
													setDiskonHarga5(e);
												}}
											>
											</Form.Control>
										</Col>
									</Row>
								</Form.Group>
								<hr />
								<Form.Group controlId="hargamodal" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Harga Modal</Form.ControlLabel>
									<Form.Control
										name="hargamodal"
										placeholder="Harga Modal"
										className="text-right"
										value={hargamodal
											.toString()
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setHargaModal(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<br />
								<Form.Group controlId="qty" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Jumlah Stok</Form.ControlLabel>
									<Form.Control
										name="qty"
										placeholder="Jumlah Stok"
										className="text-right"
										value={qty
											.toString()
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setQty(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group controlId="tglLastTrxdate" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">
										Tanggal Transaksi
									</Form.ControlLabel>
									<Form.Control 
										name="tglupdate" 
										accepter={DatePicker} 
										value={tglLastTrx}
										onChange={(e) => {
											setTglLastTrx(e);
										}}
										disabled={editing || productDataLoading}
										/>
								</Form.Group>
								<Form.Group controlId="buktiFaktur" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Bukti Faktur</Form.ControlLabel>
									<Form.Control
										name="buktiFaktur"
										placeholder="Bukti Faktur"
										value={buktiFaktur}
										onChange={(e) => {
											setBuktiFaktur(e);
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>	
								<Form.Group controlId="hargajual" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col >
											<Form.ControlLabel className="text-left" >Harga Jual</Form.ControlLabel>
										</Col>
										<Col>
											<Form.Control 
												name="hargajual" 
												className="text-right"
												style={{width:150}}
												value={hargajual
													.toString()
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
												onChange={(e) => {
													e = e.toString().split('.').join('');
													let validated = validateNumber(e);
													if (validated) {
														setHargaJual(e);
													}
												}}
												disabled={editing || productDataLoading}
											>
											</Form.Control>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="hargajual" 
													className="text-right"
													style={{width:100}}
													value={profitjual}
												>
												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
										
									</Row>
								</Form.Group>	
								<Form.Group controlId="hargajualmember" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col >
											<Form.ControlLabel className="text-left" >Harga Jual Member</Form.ControlLabel>
										</Col>
										<Col>
											<Form.Control 
												name="hargajualmember" 
												className="text-right"
												style={{width:150}}
												value={hargajualmember
													.toString()
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
												onChange={(e) => {
													e = e.toString().split('.').join('');
													let validated = validateNumber(e);
													if (validated) {
														setHargaJualMember(e);
													}
												}}
												disabled={editing || productDataLoading}
											>
											</Form.Control>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="hargajualmember" 
													className="text-right"
													style={{width:100}}
													value={profitjualmember}
													disabled={editing || productDataLoading}
												>
												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="minimum1" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col xs={2}>
											<Form.ControlLabel className="text-left" >Minimum 1</Form.ControlLabel>
										</Col>
										<Col >
											<Form.Control 
												name="minimumjlh1" 
												className="text-right"
												value={minimumjlh1}
												style={{width:78}}
											>
											</Form.Control>
										</Col>
										<Col >
											<Form.Control 
												name="minimumharga1" 
												className="text-right"
												value={minimumharga1}
												style={{width:150}}
											>
											</Form.Control>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="minimumpersen1" 
													className="text-right"
													style={{width:100}}
													value={minimumpersen1
														.toString()
														.replace(
															/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
															'$1.'
														)}
													onChange={(e) => {
														e = e.toString().split('.').join('');
														let validated = validateNumber(e);
														if (validated) {
															setminimumpersenl(e);
														}
													}}
													disabled={editing || productDataLoading}
												>

												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="minimum2" style={{ marginBottom: 0}}> 
									<Row xs="auto">
										<Col xs={2}>
											<Form.ControlLabel className="text-left" >Minimum 2</Form.ControlLabel>
										</Col>
										<Col >
											<Form.Control 
												name="minimumjlh2" 
												className="text-right"
												value={minimumjlh2}
												style={{width:78}}
											>
											</Form.Control>
										</Col>
										<Col >
											<Form.Control 
												name="minimumharga2" 
												className="text-right"
												value={minimumharga2}
												style={{width:150}}
											>
											</Form.Control>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="minimumpersen2" 
													className="text-right"
													style={{width:100}}
													value={minimumpersen2
														.toString()
														.replace(
															/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
															'$1.'
														)}
													onChange={(e) => {
														e = e.toString().split('.').join('');
														let validated = validateNumber(e);
														if (validated) {
															setminimumpersen2(e);
														}
													}}
													disabled={editing || productDataLoading}
												>
												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
									</Row>
								</Form.Group>	
								<Form.Group controlId="minimum3" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col xs={2}>
											<Form.ControlLabel className="text-left" >Minimum 3</Form.ControlLabel>
										</Col>
										<Col >
											<Form.Control 
												name="minimumjlh3" 
												className="text-right"
												value={minimumjlh3}
												style={{width:78}}
											>
											</Form.Control>
										</Col>
										<Col >
											<Form.Control 
												name="minimumharga3" 
												className="text-right"
												value={minimumharga2}
												style={{width:150}}
											>
											</Form.Control>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="minimumpersen3" 
													className="text-right"
													style={{width:100}}
													value={minimumpersen3
														.toString()
														.replace(
															/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
															'$1.'
														)}
													onChange={(e) => {
														e = e.toString().split('.').join('');
														let validated = validateNumber(e);
														if (validated) {
															setminimumpersen3(e);
														}
													}}
													disabled={editing || productDataLoading}
												>
												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
									</Row>
								</Form.Group>	
								<Form.Group controlId="karton" style={{ marginBottom: 0}}>
									<Row xs="auto">
										<Col xs={2}>
											<Form.ControlLabel className="text-left" >Karton</Form.ControlLabel>
										</Col>
										<Col >
											<Form.Control 
												name="kartonjumlah" 
												className="text-right"
												value={kartonjlh}
												style={{width:78}}
											>
											</Form.Control>
										</Col>
										<Col >
											<Form.Control 
												name="kartonharga" 
												className="text-right"
												value={kartonharga}
												style={{width:150}}
											>
											</Form.Control>
										</Col>
										<Col>
											<InputGroup inside>
												<Form.Control 
													name="kartonpersen" 
													className="text-right"
													style={{width:100}}
													value={kartonpersen
														.toString()
														.replace(
															/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
															'$1.'
														)}
													onChange={(e) => {
														e = e.toString().split('.').join('');
														let validated = validateNumber(e);
														if (validated) {
															setKartonPersen(e);
														}
													}}
													disabled={editing || productDataLoading}
												>
												</Form.Control>
												<InputGroup.Addon>%</InputGroup.Addon>
											</InputGroup>
										</Col>
									</Row>
								</Form.Group>
								<br />
								<Form.Group controlId="batasMin" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Batas Minimum</Form.ControlLabel>
									<Form.Control
										name="batasMin"
										placeholder="Minimum Order"
										className="text-right"
										value={batasMin
											.toString()
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setBatasMin(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="batasMax" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Batas Maksimum</Form.ControlLabel>
									<Form.Control
										name="batasMax"
										placeholder="Maksimum Order"
										className="text-right"
										value={batasMax
											.toString()
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setBatasMax(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>
								<Form.Group controlId="minimumOrder" style={{ marginBottom: 0}}>
									<Form.ControlLabel className="text-left">Minimum Order</Form.ControlLabel>
									<Form.Control
										name="minimumOrder"
										placeholder="Minimum Order"
										className="text-right"
										value={minimumOrder
											.toString()
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
										onChange={(e) => {
											e = e.toString().split('.').join('');
											let validated = validateNumber(e);
											if (validated) {
												setMinimumOrder(e);
											}
										}}
										disabled={editing || productDataLoading}
									/>
								</Form.Group>							
							</Col>	
						</Row>
						<br />
						<br />
						<Row>
							<Col>
							</Col>
							<Col className="text-right">
								<Form.Group>
									<ButtonToolbar>
										<Button
											type="submit"
											appearance="primary"
											loading={editing || productDataLoading}
										>
											Simpan
										</Button>
										<Button
											appearance="default"
											onClick={(e) => {
												navigate('/Products');
											}}
											disabled={editing || productDataLoading}
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
													'Hapus data Produk'
												);
												setDeleteConfirmationDialogContent(
													'Anda akan menghapus data Produk ' +
														'[' +
														kodeBarang +
														']' +
														namaBarang +
														'. Semua data yang berhubungan dengan Produk ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
												);
											}}
											disabled={editing || productDataLoading}
										>
											Hapus
										</Button>
									</ButtonToolbar>
								</Form.Group>						
							</Col>
						</Row>
					</Form>
					
				</div>
			</div>
		</>
	);
}
