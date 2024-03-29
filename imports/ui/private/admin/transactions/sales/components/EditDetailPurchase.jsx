import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap';

import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import InputPicker from 'rsuite/InputPicker';
import InputGroup from 'rsuite/InputGroup';
import Message from 'rsuite/Message';
import { useToaster } from 'rsuite';

import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { PenjualanDetailCollections } from '../../../../../../db/PenjualanDetail';
import { CategoriesCollections } from '../../../../../../db/Categories';
import { ProductsCollections } from '../../../../../../db/Products';
import { UOMCollections } from '../../../../../../db/UOM';

const EditDetailPurchase = (props) => { 

	let noFaktur = props.noFaktur;
	let selectedID = props.selectedID;

    //const [open, setOpen] = React.useState(props.open);
    const [overflow, setOverflow] = useState(true);
	
	const [editingDetail, setEditingDetail] = useState(false);
	
	const [itemNo, setItemNo] = useState('');

	const [kodeBarang, setKodeBarang] = useState('');
	const [barcode, setBarcode] = useState('');
	const [namaBarang, setNamaBarang] = useState('');
	const [categoryID, setCategoryID] = useState('');

	const [ktsBesar, setKtsBesar] = useState(0);
	const [ktsKecil, setKtsKecil] = useState(0);
	const [kts, setKts] = useState(0);
	const [satuanBesar, setSatuanBesar] = useState('');
	const [satuanKecil, setSatuanKecil] = useState('');

	const [hargaBeli, setHargaBeli] = useState(0);
	const [hargaBeliSatuan, setHargaBeliSatuan] = useState(0);

	const [hargaBruto, setHargaBruto] = useState(0);
	const [hargaNetto, setHargaNetto] = useState(0);
	
	const [jenisDiskon1, setJenisDiskon1] = useState('Discount');
	const [jenisDiskon2, setJenisDiskon2] = useState('Discount');
	const [jenisDiskon3, setJenisDiskon3] = useState('Discount');
	const [jenisDiskon4, setJenisDiskon4] = useState('Discount');
	const [jenisDiskon5, setJenisDiskon5] = useState('Discount');

	const [diskonPersen1, setDiskonPersen1] = useState(0);
	const [diskonPersen2, setDiskonPersen2] = useState(0);
	const [diskonPersen3, setDiskonPersen3] = useState(0);
	const [diskonPersen4, setDiskonPersen4] = useState(0);
	const [diskonPersen5, setDiskonPersen5] = useState(0);

	const [diskonHarga1, setDiskonHarga1] = useState(0);
	const [diskonHarga2, setDiskonHarga2] = useState(0);
	const [diskonHarga3, setDiskonHarga3] = useState(0);
	const [diskonHarga4, setDiskonHarga4] = useState(0);
	const [diskonHarga5, setDiskonHarga5] = useState(0);

	const [ppnPersen, setPpnPersen] = useState(0);
	const [ppnHarga, setPpnHarga] = useState(0);

	const [qtyBonus, setQtyBonus] = useState(0);

	const [hargaModal, setHargaModal] = useState(0);
	const [hargaJual, setHargaJual] = useState(0);
	const [hargaJualMember, setHargaJualMember] = useState(0);

	const [profitJual, setProfitJual] = useState(0);
	const [profitJualMember, setProfitJualMember] = useState(0);
	
	const [minimumJlh1, setMinimumjlh1] = useState(0);
	const [minimumJlh2, setMinimumjlh2] = useState(0);
	const [minimumJlh3, setMinimumjlh3] = useState(0);

	const [minimumHarga1, setMinimumHarga1] = useState(0);
	const [minimumHarga2, setMinimumHarga2] = useState(0);
	const [minimumHarga3, setMinimumHarga3] = useState(0);

	const [minimumPersen1, setMinimumPersen1] = useState(0);
	const [minimumPersen2, setMinimumPersen2] = useState(0);
	const [minimumPersen3, setMinimumPersen3] = useState(0);

	const [kartonJlh, setKartonJlh] = useState(0);
	const [kartonHarga, setKartonHarga] = useState(0);
	const [kartonPersen, setKartonPersen] = useState(0);

	const [currentImage, setCurrentImage] = useState('');

    const [searchKodeBarangText, setSearchKodeBarangText] = useState('');
	const [searchCategoriesText, setSearchCategoriesText] = useState('');

    //const [open, setOpen] = React.useState(false);
	//const [overflow, setOverflow] = React.useState(true);
	//const handleOpen = () => setOpen(true);
	//const handleClose = () => setOpen(false);

	const toaster = useToaster();
	const [placement, setPlacement] = useState('topCenter');

    const [penjualanDetailData, penjualanDetailDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if ( selectedID ) {
			let subs = Meteor.subscribe('penjualandetail.getByID', { _id: selectedID });
			isLoading = !subs.ready();

			data = PenjualanDetailCollections.findOne({ _id: selectedID });
		}
		return [data, isLoading];
	}, [selectedID]);

	useEffect(()=> {
		if(penjualanDetailData){
			setItemNo(penjualanDetailData.itemNo);
			setKodeBarang(penjualanDetailData.kodeBarang);

			setKtsKecil(penjualanDetailData.ktsKecil);
			setKtsBesar(penjualanDetailData.ktsBesar);
			setQtyBonus(penjualanDetailData.qtyBonus);

			setHargaBeli(formatNum(penjualanDetailData.hargaBeli));
			setHargaBeliSatuan(formatNum(penjualanDetailData.hargaBeliSatuan));
			setHargaBruto(formatNum(penjualanDetailData.hargaBruto));
			setHargaNetto(formatNum(penjualanDetailData.hargaNetto));

			setJenisDiskon1(penjualanDetailData.jenisDiskon1);
			setJenisDiskon2(penjualanDetailData.jenisDiskon2);
			setJenisDiskon3(penjualanDetailData.jenisDiskon3);
			setJenisDiskon4(penjualanDetailData.jenisDiskon4);
			setJenisDiskon5(penjualanDetailData.jenisDiskon5);

			setDiskonPersen1(formatNum(penjualanDetailData.diskonPersen1));
			setDiskonPersen2(formatNum(penjualanDetailData.diskonPersen2));
			setDiskonPersen3(formatNum(penjualanDetailData.diskonPersen3));
			setDiskonPersen4(formatNum(penjualanDetailData.diskonPersen4));
			setDiskonPersen5(formatNum(penjualanDetailData.diskonPersen5));

			setDiskonHarga1(formatNum(penjualanDetailData.diskonHarga1));
			setDiskonHarga2(formatNum(penjualanDetailData.diskonHarga2));
			setDiskonHarga3(formatNum(penjualanDetailData.diskonHarga3));
			setDiskonHarga4(formatNum(penjualanDetailData.diskonHarga4));
			setDiskonHarga5(formatNum(penjualanDetailData.diskonHarga5));

			setPpnPersen(formatNum(penjualanDetailData.ppnPersen));
			setPpnHarga(formatNum(penjualanDetailData.ppnHarga));

			setHargaModal(formatNum(penjualanDetailData.hargaModal));
			setHargaJual(formatNum(penjualanDetailData.hargaJual));
			setHargaJualMember(formatNum(penjualanDetailData.hargaJualMember));

			setProfitJual(formatNum(penjualanDetailData.profitJual));
			setProfitJualMember(formatNum(penjualanDetailData.profitJualMember));

			setMinimumjlh1(formatNum(penjualanDetailData.minimumJlh1));
			setMinimumjlh2(formatNum(penjualanDetailData.minimumJlh2));
			setMinimumjlh3(formatNum(penjualanDetailData.minimumJlh3));

			setMinimumHarga1(formatNum(penjualanDetailData.minimumHarga1));
			setMinimumHarga2(formatNum(penjualanDetailData.minimumHarga2));
			setMinimumHarga3(formatNum(penjualanDetailData.minimumHarga3));

			setMinimumPersen1(formatNum(penjualanDetailData.minimumPersen2));
			setMinimumPersen2(formatNum(penjualanDetailData.minimumPersen2));
			setMinimumPersen3(formatNum(penjualanDetailData.minimumPersen2));

			setKartonJlh(formatNum(penjualanDetailData.kartonJlh));
			setKartonHarga(formatNum(penjualanDetailData.kartonHarga));
			setKartonPersen(formatNum(penjualanDetailData.kartonPersen));
		} else {
			resetvalue();
		}	
	},[penjualanDetailData])

	const [productData, productDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (kodeBarang) {
			let subs = Meteor.subscribe('products.getByKode', { kodeBarang });
			isLoading = !subs.ready();

			data = ProductsCollections.findOne({ kodeBarang });

			isLoading = !subs.ready();
		}
		
		isLoading = false;
		return [data, isLoading];
	}, [kodeBarang]);

	useEffect(()=>{
		if(productData){
			setBarcode(productData.barcode);
			setNamaBarang (productData.namaBarang);
			setCategoryID (productData.categoryID);
			setCurrentImage(productData.imageBase64);
			if(productData.kts === undefined) {
				setKts(0);
			} else {
				setKts(productData.kts);
			}
		
			if (productData.satuanBesar === undefined) {
				setSatuanBesar ('');
			} else {
				setSatuanBesar (productData.satuanBesar);
			}
		
			if (productData.satuanKecil === undefined) {
				setSatuanKecil ('');
			} else {
				setSatuanKecil (productData.satuanKecil);
			}

			setCurrentImage(productData.imageBase64);

			setHargaJual(productData.hargajual);
			setHargaJualMember(productData.hargajualmember);

				
		}
	},[productData])

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

    const [products, productsLoading] = useTracker(() => {

		let isLoading = true;
		
		let subs = Meteor.subscribe('products.search', {
			searchText: searchKodeBarangText,
			selectedID: kodeBarang,
		});

		let data = ProductsCollections.find({
			$or: [
				{
					kodeBarang: kodeBarang,
				},
				{
					kodeBarang: {
						$regex: searchKodeBarangText,
						$options: 'i',
					},
				},
				{
					namaBarang: {
						$regex: searchKodeBarangText,
						$options: 'i',
					},
				},
				{
					limit: 10,
				}
			],
		}).fetch();

		isLoading = !subs.ready();

		return [data, isLoading];
	}, [searchKodeBarangText, kodeBarang]);

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

	const editDetail = () => {
		setEditingDetail(true);
		if (
			kodeBarang &&
			ktsKecil &&
			hargaJual
		) {
			Meteor.call(
				'penjualandetail.edit',
				{
					selectedID,
					itemNo,
					noFaktur,

					kodeBarang,
					barcode,
					namaBarang,
					categoryID,

					ktsBesar,
					ktsKecil,
					satuanBesar,
				 	satuanKecil,
					qtyBonus,

					jenisDiskon1,
					diskonPersen1,
					diskonHarga1,

					ppnPersen,
					ppnHarga,

					hargaBruto,
					hargaNetto,

					hargaJual,
					profitJual,
				},
				(err, res) => {
					if (err) {
						setEditingDetail(false);
						let type = 'error';
						let title = err.error;
						let desc = err.reason;
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setEditingDetail(false);
							let type = 'success';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						} else {
							setEditingDetail(false);
							let type = 'warning';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						}
					} else {
						setEditingDetail(false);
						let type = 'error';
						let title = 'Kesalahan Sistem';
						let desc = 'Terjadi kesalahan pada sistem, silahkan hubungi customer service';
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
					}
				}
			);
		} else {
			setEditingDetail(false);
			let type = 'error';
			let title = 'Kesalahan Sistem';
			let desc = 'Kode Barang, Kuantitas dan Harga Jual Wajib Diisi';
			toaster.push(
				<Message showIcon type={type} header={title}>
					{desc}
				  </Message>
				,{placement})
		}
	};

    const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
	};

    const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	const formatNum0 = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(0)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

    const selectData = ['Sub Discount', 'Discount'].map(item => ({
		label: item,
		value: item
	}));

	const resetvalue = () => {
		setKodeBarang('');
		setBarcode('');
		setNamaBarang ('');
		setCategoryID ('');

		setKts(0);

		setKtsBesar (0); 
		setKtsKecil (0);
		setSatuanBesar (''); 
		setSatuanKecil ('');
		setQtyBonus(0);
		
		setHargaBruto(0);
		setHargaNetto(0);

		setJenisDiskon1('Discount');
		setDiskonPersen1(0);
		setDiskonHarga1(0);

		setPpnPersen(0);
		setPpnHarga(0);

		setHargaJual(0);
		setHargaJualMember(0);

		setProfitJual(0);

		setCurrentImage('');
	};

	var countDecimals = (value) => {
		if (Math.floor(value) === value) return 0;
	
		var str = value.toString();
		if (str.indexOf(".") !== -1 && str.indexOf("-") !== -1) {
			return str.split("-")[1] || 0;
		} else if (str.indexOf(".") !== -1) {
			return str.split(".")[1].length || 0;
		}
		return str.split("-")[1] || 0;
	}
	
	const calcHarga = (input) => {
		let ktskcl = ktsKecil.toString().split(',').join('');
		let ktsbsr = ktsBesar.toString().split(',').join('');
		let bruto = 0;
		let netto = 0;

		let discpers1 = diskonPersen1.toString().split(',').join('');

		let dischrg1 = 0;

		let ppnpers = ppnPersen.toString().split(',').join('');
		let ppnhrg = 0;

		let hrgjual = hargaJual.toString().split(',').join('');

		let hrgjualmbr = hargaJualMember.toString().split(',').join('');

		if (input === "ktsKecil") {
			ktskcl = ktsKecil;
		} else {
			ktskcl = ktsBesar * kts;
		};

		if (input === "ktsBesar") {
			ktsbsr = ktsBesar;
		} else {
			ktsbsr = ktskcl / kts;
		};
		
		bruto = ktskcl * hrgjual;

		if (input === "diskon1") { discpers1 = diskonPersen1.toString().split(',').join(''); }
		
		dischrg1 = discpers1/100 * bruto; 
		ppnhrg   = ppnpers/100   * (bruto - dischrg1); 

		netto = bruto - dischrg1 + ppnhrg;
		
		setKtsKecil(ktskcl);
		
		if (countDecimals(ktsbsr) <= 1 ) {
			setKtsBesar(ktsbsr);
		} else {
			setKtsBesar(parseFloat(ktsbsr)
				.toFixed(2)
				.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
			);
		}

	
		setHargaBruto(formatNum(bruto));
		setDiskonHarga1(formatNum(dischrg1));
		setHargaNetto(formatNum(netto));	
		setPpnHarga(formatNum(ppnhrg));

		setHargaJual(formatNum(hrgjual));	
		setHargaJualMember(formatNum(hrgjualmbr));	
	};

	const isDisabled = () => {
		if (editingDetail || productDataLoading || penjualanDetailDataLoading){
            return true;
        } else {
            return false;
        } 
	};

    return (
        <>
            <Modal 
                overflow={overflow} 
                open={props.open} 
                onClose={props.handleClose} 
                size="full">
     		  <Modal.Header>
     		    <Modal.Title>
					{'Edit Item Penjualan # ' + itemNo } 
				</Modal.Title>
     		  </Modal.Header>
			  <hr />
     		  <Modal.Body>
			   <Form 
					layout="horizontal"
					//onSubmit={() => { addDetail();}}
					disabled={ isDisabled() }
					>
					<Row style={{marginRight: 10}}>
						<Col xs={8}>
							<Form.Group controlId="kodebrg" style={{ marginBottom: 0}}> 
								<Form.ControlLabel className="text-left">Barang</Form.ControlLabel>
								<SelectPicker
									placeholder="Produk"
									disabled={ isDisabled() }
									data={products.map((s) => ({
										label: '[' + s.kodeBarang + '] ' + s.namaBarang,
										value: s.kodeBarang,
									}))}
									style={{ minWidth: 400 }}
									value={kodeBarang}
									onSelect={( e) => {
										setKodeBarang(e);
									}}
									onClean={() => {
										resetvalue();
									}}
									onSearch={(e) => {
										setSearchKodeBarangText(e);
									}}
									renderMenu={renderProductsLoading}
								/>
        					</Form.Group>
							<Form.Group controlId="barcode" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Barcode</Form.ControlLabel>
								<Form.Control
									readOnly
									name="barcode"
									placeholder="Barcode"
									value={barcode}
									style={{color: "#1675e0" }}
									disabled={isDisabled()}
								/>
							</Form.Group>
							<Form.Group controlId="categoryID" style={{ marginBottom: 0}}>
								<Form.ControlLabel 
									className="text-left"
								> Kategori
								</Form.ControlLabel>
								<SelectPicker
									name="categoryID"
									placeholder="Kategori"
									readOnly
									disabled={isDisabled()}
									data={categories.map((s) => ({
										label: '[' + s.code + '] ' + s.name,
										value: s.code,
									}))}
									style={{ width: 300 }}
									value={categoryID}
									onChange={(input) => {
										setCategoryID(input);
									}}
								/>
							</Form.Group>
							<Form.Group controlId="kuantitas" style={{ marginBottom: 5}}>
								<Form.ControlLabel className="text-left" >Kuantitas</Form.ControlLabel>
								<Form.Control
									name="qtyBesar"
									required
									placeholder="Qty Besar"
									style={{ width: 100 }}
									className="text-right"
									disabled={isDisabled()}
									value={ktsBesar}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											setKtsBesar(e);
										} 
									}}
									onKeyPress={(e)=> {
										if(e.key === 'Enter'){
											calcHarga("ktsBesar");
										}
									}}
								/>
								<Form.Control
									name="satuanBesar"
									placeholder="SatuanBesar"
									value={satuanBesar}
									style={{color: "#1675e0" , width:100}}
									disabled={isDisabled()}
								/>
								<Form.Control
									name="qtykecil"
									required
									placeholder="Qty Kecil"
									className="text-right"
									style={{ width: 100 }}
									disabled={isDisabled()}
									value={ktsKecil}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										let validated = validateNumber(e);
										if (validated) {
											setKtsKecil(e);
										}
									}}
									onKeyPress={(e) => {
										if (e.key === 'Enter'){
											calcHarga("ktsKecil");
										}	
									}}
								/>
								<Form.Control
									name="satuanKecil"
									placeholder="Satuan Kecil"
									value={satuanKecil}
									style={{color: "#1675e0", width:100}}
									disabled={isDisabled()}
								/>
								<Form.HelpText>{ "1 " + satuanBesar + " = " + kts + " " + satuanKecil} </Form.HelpText>
							</Form.Group>
						</Col>
						<Col xs={4}>
							{currentImage && (
								<>
									<div 
										className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth"
										style={{height:180}}
										>
										<img
											src={currentImage}
											className="img-fluid img-thumbnail rounded mx-auto d-block"
											alt="Responsive image"
										></img>
									</div>
								</>
							)}
						</Col>
					</Row>
					<Row style={{marginRight: 10}}>
						<Col>
							<Form.Group controlId="hargajual" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left" >Harga Jual</Form.ControlLabel>
								<Form.Control
									placeholder="Harga Jual"
									className="text-right"
									style={{ width: 200 }}
									value={hargaJual}
									disabled={isDisabled()}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											let hrgjual = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
										
											setHargaJual(hrgjual);
										} 
									}}
									onKeyPress={(e)=> {
										if (e.key === 'Enter') {
											calcHarga("hargajual");
										}
									}}
								/>
								<Form.ControlLabel 
									className="text-left" 
									style={{ marginLeft: 10, width: 100, color:"grey"}}
									disabled={isDisabled()}
									>{" / " + satuanBesar}</Form.ControlLabel>
							</Form.Group>
							<hr />
							<Form.Group controlId="hargaBruto" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Jumlah Harga Bruto</Form.ControlLabel>
								<Form.Control
									name="hargaBruto"
									readOnly
									placeholder="Harga Bruto"
									className="text-right"
									style={{color: "#1675e0"}}
									value={hargaBruto}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											let hrgnet = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
											setHargaBruto(hrgnet);
										} 
									}}
									disabled={isDisabled()}
								/>
							</Form.Group>
							<Form.Group controlId="disc1" style={{ marginBottom: 5}}>
								<Row xs="auto" style={{marginRight: 10}}>
									<Col >
										<Form.ControlLabel className="text-left" style={{width:147}}>Diskon</Form.ControlLabel>
									</Col>
									<Col>
										<InputGroup inside style={{width:120}}>
										<Form.Control 
											name="diskonPersen1" 
											className="text-right"
											value={diskonPersen1}
											disabled={isDisabled()}
											onChange= { (e) => { 
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													let discpers = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
													setDiskonPersen1(discpers);
												} 
											} }
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("diskon1");
												}
											}}
											/>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
									<Col>
										<Form.Control 
											name="diskonHarga1" 
											readOnly
											className="text-right"
											value={diskonHarga1}
											disabled={isDisabled()}
											style={{color: "#1675e0", width:150}}
											onChange={(e) => {
												setDiskonHarga1(e);
											}}
										>
										</Form.Control>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group controlId="ppn" style={{margin: 0}}>
								<Row xs="auto" style={{marginRight: 10}}>
									<Col >
										<Form.ControlLabel className="text-left" style={{width:147}}>PPN</Form.ControlLabel>
									</Col>
									<Col>
										<InputGroup inside style={{width:120}}>
											<Form.Control 
												name="ppn" 
												className="text-right"
												value={ppnPersen}
												disabled={isDisabled()}
												onChange= { (e) => { 
													e = e.toString().split(',').join('');
													const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
													if (validateNumber) {
														let ppnpers = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')

														setPpnPersen(ppnpers);
													} 
												} }
												onKeyPress={(e)=> {
													if (e.key === 'Enter') {
														calcHarga("ppn");
													}
												}}
											>
											</Form.Control>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
									<Col>
										<Form.Control 
											name="ppnHarga" 
											className="text-right"
											value={ppnHarga}
											disabled={isDisabled()}
											style={{color: "#1675e0", width:150}}
										>
										</Form.Control>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group controlId="harganetto" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Jumlah Harga Netto</Form.ControlLabel>
								<Form.Control
									name="harganetto"
									placeholder="Harga Netto"
									className="text-right"
									style={{color: "#1675e0"}}
									value={hargaNetto}
									disabled={isDisabled()}
								/>
							</Form.Group>
							<hr />
							<Form.Group controlId="qtybonus" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Qty Bonus</Form.ControlLabel>
								<Form.Control
									name="qtybonus"
									placeholder="Qty Bonus"
									className="text-right"
									value={qtyBonus}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											let qtybns = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
											setQtyBonus(qtybns);
										} 
									}}
									disabled={isDisabled()}
								/>
							</Form.Group>
						</Col>
						<Col></Col>
					</Row>
			   	</Form>
					
     		  </Modal.Body>
     		  <Modal.Footer>
			   	{/*<Button onClick={() => addNum(harga,diskonP1)} appearance="secondary">
     		      Count
				</Button>*/}
     		    <Button 
					onClick={ () => { 
						calcHarga("");
						editDetail();
					}} 
					appearance="primary">
     		      Edit
     		    </Button>
     		    <Button onClick={props.handleClose} appearance="subtle">
     		      Cancel
     		    </Button>
     		  </Modal.Footer>
     		</Modal>
        </>
    )
}

EditDetailPurchase.defaultProps = {
    open: false
}

export default EditDetailPurchase;