import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap';

import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import InputPicker from 'rsuite/InputPicker';
import InputGroup from 'rsuite/InputGroup';
import Message from 'rsuite/Message';
import { useToaster } from 'rsuite';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { ReturPembelianDetailCollections } from '../../../../../../db/ReturPembelianDetail';
import { CategoriesCollections } from '../../../../../../db/Categories';
import { ProductsCollections } from '../../../../../../db/Products';
import { UOMCollections } from '../../../../../../db/UOM';

const EditDetailPurchase = (props) => { 

	let noFaktur = props.noFaktur;
	let selectedID = props.selectedID;

    //const [open, setOpen] = React.useState(props.open);
    const [overflow, setOverflow] = useState(true);
	
	const [editingDetail, setEditingDetail] = useState(false);
	
    const [tglLastTrx, setTglLastTrx] = useState(new Date());

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

    const [pembelianDetailData, pembelianDetailDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if ( selectedID ) {
			let subs = Meteor.subscribe('returpembeliandetail.getByID', { _id: selectedID });
			isLoading = !subs.ready();

			data = ReturPembelianDetailCollections.findOne({ _id: selectedID });
		}
		return [data, isLoading];
	}, [selectedID]);

	useEffect(()=> {
		if(pembelianDetailData){
			setItemNo(pembelianDetailData.itemNo);
			setKodeBarang(pembelianDetailData.kodeBarang);

			setKtsKecil(pembelianDetailData.ktsKecil);
			setKtsBesar(pembelianDetailData.ktsBesar);
			setQtyBonus(pembelianDetailData.qtyBonus);

			setHargaBeli(formatNum(pembelianDetailData.hargaBeli));
			setHargaBeliSatuan(formatNum(pembelianDetailData.hargaBeliSatuan));
			setHargaBruto(formatNum(pembelianDetailData.hargaBruto));
			setHargaNetto(formatNum(pembelianDetailData.hargaNetto));

			setJenisDiskon1(pembelianDetailData.jenisDiskon1);
			setJenisDiskon2(pembelianDetailData.jenisDiskon2);
			setJenisDiskon3(pembelianDetailData.jenisDiskon3);
			setJenisDiskon4(pembelianDetailData.jenisDiskon4);
			setJenisDiskon5(pembelianDetailData.jenisDiskon5);

			setDiskonPersen1(formatNum(pembelianDetailData.diskonPersen1));
			setDiskonPersen2(formatNum(pembelianDetailData.diskonPersen2));
			setDiskonPersen3(formatNum(pembelianDetailData.diskonPersen3));
			setDiskonPersen4(formatNum(pembelianDetailData.diskonPersen4));
			setDiskonPersen5(formatNum(pembelianDetailData.diskonPersen5));

			setDiskonHarga1(formatNum(pembelianDetailData.diskonHarga1));
			setDiskonHarga2(formatNum(pembelianDetailData.diskonHarga2));
			setDiskonHarga3(formatNum(pembelianDetailData.diskonHarga3));
			setDiskonHarga4(formatNum(pembelianDetailData.diskonHarga4));
			setDiskonHarga5(formatNum(pembelianDetailData.diskonHarga5));

			setPpnPersen(formatNum(pembelianDetailData.ppnPersen));
			setPpnHarga(formatNum(pembelianDetailData.ppnHarga));

			setHargaModal(formatNum(pembelianDetailData.hargaModal));
			setHargaJual(formatNum(pembelianDetailData.hargaJual));
			setHargaJualMember(formatNum(pembelianDetailData.hargaJualMember));

			setProfitJual(formatNum(pembelianDetailData.profitJual));
			setProfitJualMember(formatNum(pembelianDetailData.profitJualMember));

			setMinimumjlh1(formatNum(pembelianDetailData.minimumJlh1));
			setMinimumjlh2(formatNum(pembelianDetailData.minimumJlh2));
			setMinimumjlh3(formatNum(pembelianDetailData.minimumJlh3));

			setMinimumHarga1(formatNum(pembelianDetailData.minimumHarga1));
			setMinimumHarga2(formatNum(pembelianDetailData.minimumHarga2));
			setMinimumHarga3(formatNum(pembelianDetailData.minimumHarga3));

			setMinimumPersen1(formatNum(pembelianDetailData.minimumPersen2));
			setMinimumPersen2(formatNum(pembelianDetailData.minimumPersen2));
			setMinimumPersen3(formatNum(pembelianDetailData.minimumPersen2));

			setKartonJlh(formatNum(pembelianDetailData.kartonJlh));
			setKartonHarga(formatNum(pembelianDetailData.kartonHarga));
			setKartonPersen(formatNum(pembelianDetailData.kartonPersen));
		} else {
			resetvalue();
		}	
	},[pembelianDetailData])

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

			if (hargaModal === 0 ) {
				setHargaBeli(formatNum(productData.hargabeli));
				setHargaBeliSatuan(formatNum(productData.hargabelisatuan));

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

				//setTglLastTrx(productData.tglLastTrx);
				//setBuktiFaktur (productData.buktifaktur);

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
				setMinimumHarga3(productData.minimumharga3);

				setMinimumPersen1(productData.minimumpersen2);
				setMinimumPersen2(productData.minimumpersen2);
				setMinimumPersen3(productData.minimumpersen2);

				setKartonJlh(productData.kartonjlh);
				setKartonHarga(productData.kartonharga);
				setKartonPersen(productData.kartonpersen);
			}
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
			hargaBeliSatuan 
		) {
			Meteor.call(
				'returpembeliandetail.edit',
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

					hargaBeli,
					hargaBeliSatuan,

					jenisDiskon1,
					jenisDiskon2,
					jenisDiskon3,
					jenisDiskon4,
					jenisDiskon5,

					diskonPersen1,
					diskonPersen2,
					diskonPersen3,
					diskonPersen4,
					diskonPersen5,

					diskonHarga1,
					diskonHarga2,
					diskonHarga3,
					diskonHarga4,
					diskonHarga5,

					ppnPersen,
					ppnHarga,
						
					hargaModal,
					hargaBruto,
					hargaNetto,

					hargaJual,
					hargaJualMember,
						
					profitJual,
					profitJualMember,
						
					minimumJlh1,
					minimumJlh2,
					minimumJlh3,
						
					minimumHarga1,
					minimumHarga2,
					minimumHarga3,
						
					minimumPersen1,
					minimumPersen2,
					minimumPersen3,
						
					kartonJlh,
					kartonHarga,
					kartonPersen,
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
			let desc = 'Kode Barang, Kuantitas dan Harga Beli Wajib Diisi';
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

		//setSupplier ('');

		setHargaBeli(0);
		setHargaBeliSatuan(0);
		
		setHargaBruto(0);
		setHargaNetto(0);
		setHargaModal(0);

		setJenisDiskon1('Discount');
		setJenisDiskon2('Discount');
		setJenisDiskon3('Discount');
		setJenisDiskon4('Discount');
		setJenisDiskon5('Discount');

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

		//setTglLastTrx ('');
		//setBuktiFaktur ('');

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

		setMinimumPersen1(0);
		setMinimumPersen2(0);
		setMinimumPersen3(0);

		setKartonJlh(0);
		setKartonHarga(0);
		setKartonPersen(0);

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
		let hrgbeli = hargaBeli.toString().split(',').join('');
		let hrgsatuan = hargaBeliSatuan.toString().split(',').join('');
		let bruto = 0;
		let netto = 0;

		let jenisdisc1 = jenisDiskon1;
		let jenisdisc2 = jenisDiskon2;
		let jenisdisc3 = jenisDiskon3;
		let jenisdisc4 = jenisDiskon4;
		let jenisdisc5 = jenisDiskon5;

		let discpers1 = diskonPersen1.toString().split(',').join('');
		let discpers2 = diskonPersen2.toString().split(',').join('');
		let discpers3 = diskonPersen3.toString().split(',').join('');
		let discpers4 = diskonPersen4.toString().split(',').join('');
		let discpers5 = diskonPersen5.toString().split(',').join('');

		let dischrg1 = 0;
		let dischrg2 = 0;
		let dischrg3 = 0;
		let dischrg4 = 0;
		let dischrg5 = 0;

		let ppnpers = ppnPersen.toString().split(',').join('');
		let ppnhrg = 0;

		let subdisc = 0;

		let hrgmodal = 0;

		let hrgjual = hargaJual.toString().split(',').join('');
		let profit = profitJual.toString().split(',').join('');

		let hrgjualmbr = hargaJualMember.toString().split(',').join('');
		let profitmbr = profitJualMember.toString().split(',').join('');

		let jlhmin1 = minimumJlh1.toString().split(',').join('');
		let jlhmin2 = minimumJlh2.toString().split(',').join('');
		let jlhmin3 = minimumJlh3.toString().split(',').join('');

		let hrgmin1 = minimumHarga1.toString().split(',').join('');
		let hrgmin2 = minimumHarga2.toString().split(',').join('');
		let hrgmin3 = minimumHarga3.toString().split(',').join('');
		
		let persmin1 = minimumPersen1.toString().split(',').join('');
		let persmin2 = minimumPersen2.toString().split(',').join('');
		let persmin3 = minimumPersen3.toString().split(',').join('');

		let jlhkart  = kartonJlh.toString().split(',').join('');
		let hrgkart  = kartonHarga.toString().split(',').join('');
		let perskart = kartonPersen.toString().split(',').join('');

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
		
		if(input === "hargaBeli"){
			hrgbeli = hargaBeli.toString().split(',').join('');
		} else {
			hrgbeli = hrgsatuan * kts;
		}
		
		if(input === "hargaBeliSatuan"){
			hrgsatuan = hargaBeliSatuan.toString().split(',').join('');
		} else {
			hrgsatuan = hrgbeli/kts;
		}
		
		bruto = ktskcl * hrgsatuan;

		if (input === "diskon1") { discpers1 = diskonPersen1.toString().split(',').join(''); }
		if (input === "diskon2") { discpers2 = diskonPersen2.toString().split(',').join(''); }
		if (input === "diskon3") { discpers3 = diskonPersen3.toString().split(',').join(''); }
		if (input === "diskon4") { discpers4 = diskonPersen4.toString().split(',').join(''); }
		if (input === "ppn")     { ppnpers   = ppnPersen.toString().split(',').join(''); }
		if (input === "diskon5") { discpers5 = diskonPersen5.toString().split(',').join(''); }
		
		dischrg1 = discpers1/100 * bruto; 
		dischrg2 = discpers2/100 * (bruto - dischrg1);
		dischrg3 = discpers3/100 * (bruto - dischrg1 - dischrg2); 
		dischrg4 = discpers4/100 * (bruto - dischrg1 - dischrg2 - dischrg3); 
		ppnhrg   = ppnpers/100   * (bruto - dischrg1 - dischrg2 - dischrg3 - dischrg4); 
		dischrg5 = discpers5/100 * (bruto - dischrg1 - dischrg2 - dischrg3 - dischrg4 + ppnhrg); 

		netto = bruto - dischrg1 - dischrg2 - dischrg3 - dischrg4 + ppnhrg - dischrg5;

		hrgmodal = netto / ktskcl;
		
		if(jenisdisc1 === "Sub Discount"){ subdisc = subdisc + (dischrg1/kts); } 
		if(jenisdisc2 === "Sub Discount"){ subdisc = subdisc + (dischrg2/kts); } 
		if(jenisdisc3 === "Sub Discount"){ subdisc = subdisc + (dischrg3/kts); } 
		if(jenisdisc4 === "Sub Discount"){ subdisc = subdisc + (dischrg4/kts); } 
		if(jenisdisc5 === "Sub Discount"){ subdisc = subdisc + (dischrg5/kts); } 

		if (input === "profitJual") {
			profit = profitJual.toString().split(',').join('');
			hrgjual = (hrgmodal + subdisc) * (1 + profit/100) ; 
		} else if (input === "hargaJual") { 
			hrgjual = hargaJual.toString().split(',').join('');
			profit = (hrgjual - (hrgmodal + subdisc)) / (hrgmodal + subdisc) * 100
		} else {
			if(profit < 0) {
				profit = 0;
				hrgjual = (hrgmodal + subdisc) * (1 + profit/100) ;
			} else {
				profit = profitJual.toString().split(',').join('');
				hrgjual = (hrgmodal + subdisc) * (1 + profit/100) ;
			}
		}

		if (input === "profitJualMember") {
			profitmbr = profitJualMember.toString().split(',').join('');
			hrgjualmbr = (hrgmodal + subdisc) * (1 + profitmbr/100) ; 
		} else if (input === "hargaJualMember") { 
			hrgjualmbr = hargaJualMember.toString().split(',').join('');
			profitmbr = (hrgjual - (hrgmodal + subdisc)) / (hrgmodal + subdisc) * 100
		} else {
			if(profitmbr < 0) {
				profitmbr = 0;
				hrgjualmbr = (hrgmodal + subdisc) * (1 + profitmbr/100) ;
			} else {
				profitmbr = profitJualMember.toString().split(',').join('');
				hrgjualmbr = (hrgmodal + subdisc) * (1 + profitmbr/100) ;
			}
		}
		
		if (input === "minimumPersen1") {
			persmin1 = minimumPersen1.toString().split(',').join('');
			hrgmin1 = (hrgmodal + subdisc) * (1 + persmin1/100) ; 
		} else if (input === "minimumHarga3") { 
			hrgmin1 = minimumHarga1.toString().split(',').join('');
			persmin1 = (hrgjual - (hrgmodal + subdisc)) / (hrgmodal + subdisc) * 100
		} else {
			if(persmin1 < 0) {
				persmin1 = 0;
				hrgmin1 = (hrgmodal + subdisc) * (1 + persmin1/100) ;
			} else {
				persmin1 = minimumPersen1.toString().split(',').join('');
				hrgmin1 = (hrgmodal + subdisc) * (1 + persmin1/100) ;
			}
		}

		if (input === "minimumPersen2") {
			persmin2 = minimumPersen1.toString().split(',').join('');
			hrgmin2 = (hrgmodal + subdisc) * (1 + persmin2/100) ; 
		} else if (input === "minimumHarga2") { 
			hrgmin2 = minimumHarga1.toString().split(',').join('');
			persmin2 = (hrgjual - (hrgmodal + subdisc)) / (hrgmodal + subdisc) * 100
		} else {
			if(persmin2 < 0) {
				persmin2 = 0;
				hrgmin2 = (hrgmodal + subdisc) * (1 + persmin2/100) ;
			} else {
				persmin2 = minimumPersen1.toString().split(',').join('');
				hrgmin2 = (hrgmodal + subdisc) * (1 + persmin2/100) ;
			}
		}

		if (input === "minimumPersen3") {
			persmin3 = minimumPersen1.toString().split(',').join('');
			hrgmin3 = (hrgmodal + subdisc) * (1 + persmin3/100) ; 
		} else if (input === "minimumHarga3") { 
			hrgmin3 = minimumHarga1.toString().split(',').join('');
			persmin3 = (hrgjual - (hrgmodal + subdisc)) / (hrgmodal + subdisc) * 100
		} else {
			if(persmin3 < 0) {
				persmin3 = 0;
				hrgmin3 = (hrgmodal + subdisc) * (1 + persmin3/100) ;
			} else {
				persmin3 = minimumPersen1.toString().split(',').join('');
				hrgmin3 = (hrgmodal + subdisc) * (1 + persmin3/100) ;
			}
		}

		setKtsKecil(ktskcl);
		
		if (countDecimals(ktsbsr) <= 1 ) {
			setKtsBesar(ktsbsr);
		} else {
			setKtsBesar(parseFloat(ktsbsr)
				.toFixed(2)
				.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
			);
		}

		setHargaBeli(parseFloat(hrgbeli)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);									
		setHargaBeliSatuan(parseFloat(hrgsatuan)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		setHargaBruto(parseFloat(bruto)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

		setDiskonHarga1(parseFloat(dischrg1)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		setDiskonHarga2(parseFloat(dischrg2)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		setDiskonHarga3(parseFloat(dischrg3)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		setDiskonHarga4(parseFloat(dischrg4)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		setPpnHarga(parseFloat(ppnhrg)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		setDiskonHarga5(parseFloat(dischrg5)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

		setHargaNetto(parseFloat(netto)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);	
		setHargaModal(parseFloat(hrgmodal)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);
		
		setHargaJual(parseFloat(hrgjual)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);	

		setProfitJual(parseFloat(profit)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

		setHargaJualMember(parseFloat(hrgjualmbr)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);	

		setProfitJualMember(parseFloat(profitmbr)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

		setMinimumHarga1(parseFloat(hrgmin1)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);	

		setMinimumPersen1(parseFloat(persmin1)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

		setMinimumHarga2(parseFloat(hrgmin2)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);	

		setMinimumPersen2(parseFloat(persmin2)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

		setMinimumHarga3(parseFloat(hrgmin3)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);	

		setMinimumPersen3(parseFloat(persmin3)
			.toFixed(2)
			.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
		);

	};

	const isDisabled = () => {
		if (editingDetail || productDataLoading || pembelianDetailDataLoading){
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
					{'Edit Item Retur Pembelian # ' + itemNo } 
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
									onSelect={(e) => {
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
							<Form.Group controlId="hargabeli" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left" >Harga Beli</Form.ControlLabel>
								<Form.Control
									placeholder="Harga Beli"
									className="text-right"
									style={{ width: 200 }}
									value={hargaBeli}
									disabled={isDisabled()}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											let hrgbeli = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
										
											setHargaBeli(hrgbeli);
										} 
									}}
									onKeyPress={(e)=> {
										if (e.key === 'Enter') {
											calcHarga("hargaBeli");
										}
									}}
								/>
								<Form.ControlLabel 
									className="text-left" 
									style={{ marginLeft: 10, width: 100, color:"grey"}}
									disabled={isDisabled()}
									>{" / " + satuanBesar}</Form.ControlLabel>
							</Form.Group>
							<Form.Group controlId="hargabelisatuan" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Harga Beli Satuan</Form.ControlLabel>
								<Form.Control
									placeholder="Harga Beli Satuan"
									className="text-right"
									style={{ width: 200 }}
									disabled={isDisabled()}
									value={hargaBeliSatuan}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											//let hrgbelis = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
										
											setHargaBeliSatuan(e);
										} 
									}}
									onKeyPress = {(e)=> {
										if(e.key === 'Enter'){
											calcHarga("hargaBeliSatuan");
										}
									}}
								/>
								<Form.ControlLabel 
									className="text-left" 
									style={{ marginLeft: 10, width: 100, color:"grey"}}
									disabled={isDisabled()}
									>{" / " + satuanKecil}</Form.ControlLabel>	
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
										<Form.Control
											name="disc1"
											placeholder="Jenis Disc 1"
											style={{width:160}}
											value={jenisDiskon1}
											onChange={(e) => {
												setJenisDiskon1(e);
												calcHarga("");
											}}
											onClean={() => {
												setJenisDiskon1('');
											}}
											accepter={InputPicker} 
											data={selectData}
											disabled={isDisabled()}
										/>
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
							<Form.Group controlId="disc2" style={{ marginBottom: 5}}>
								<Row xs="auto" style={{marginRight: 10}}>
									<Col >
										<Form.Control
											name="disc2"
											placeholder="Jenis Disc 2"
											style={{width:160}}
											value={jenisDiskon2}
											onChange={(e) => {
												setJenisDiskon2(e);
												calcHarga("");
											}}
											onClean={() => {
												setJenisDiskon2('Discount');
											}}
											accepter={InputPicker} 
											data={selectData}
											disabled={isDisabled()}
										/>
									</Col>
									<Col>
										<InputGroup inside style={{width:120}}>
										<Form.Control 
											name="diskonPersen1" 
											className="text-right"
											value={diskonPersen2}
											disabled={isDisabled()}
											onChange= { (e) => { 
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													let discpers = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
													setDiskonPersen2(discpers);
												} 
											} }
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("diskon2");
												}
											}}
											/>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
									<Col>
										<Form.Control 
											name="diskonHarga2" 
											className="text-right"
											value={diskonHarga2}
											disabled={isDisabled()}
											style={{color: "#1675e0", width:150}}
											//onChange={(e) => {
											//	setDiskonHarga2(e);
											//}}
										>
										</Form.Control>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group controlId="disc3" style={{ marginBottom: 5}}>
								<Row xs="auto" style={{marginRight: 10}}>
									<Col >
										<Form.Control
											name="disc3"
											placeholder="Jenis Disc 3"
											style={{width:160}}
											value={jenisDiskon3}
											disabled={isDisabled()}
											onChange={(e) => {
												setJenisDiskon3(e);
												calcHarga("");
											}}
											onClean={() => {
												setJenisDiskon3('Discount');
											}}
											accepter={InputPicker} 
											data={selectData}
										/>
									</Col>
									<Col>
										<InputGroup inside style={{width:120}}>
										<Form.Control 
											name="diskonPersen3" 
											className="text-right"
											value={diskonPersen3}
											disabled={isDisabled()}
											onChange= { (e) => { 
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													let discpers = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
													setDiskonPersen3(discpers);
												} 
											} }
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("diskon3");
												}
											}}
											/>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
									<Col>
										<Form.Control 
											name="diskonHarga3" 
											className="text-right"
											value={diskonHarga3}
											disabled={isDisabled()}
											style={{color: "#1675e0", width:150}}
										>
										</Form.Control>
									</Col>
								</Row>
							</Form.Group>
							<Form.Group controlId="disc4" style={{ marginBottom: 5}}>
								<Row xs="auto" style={{marginRight: 10}}>
									<Col >
										<Form.Control
											name="disc4"
											placeholder="Jenis Disc 4"
											style={{width:160}}
											value={jenisDiskon4}
											disabled={isDisabled()}
											onChange={(e) => {
												setJenisDiskon4(e);
												calcHarga("");
											}}
											onClean={() => {
												setJenisDiskon4('Discount');
											}}
											accepter={InputPicker} 
											data={selectData}
										/>
									</Col>
									<Col>
										<InputGroup inside style={{width:120}}>
										<Form.Control 
											name="diskonPersen4" 
											className="text-right"
											value={diskonPersen4}
											disabled={isDisabled()}
											onChange= { (e) => { 
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													let discpers = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
													setDiskonPersen4(discpers);
												} 
											} }
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("diskon4");
												}
											}}
											/>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
									<Col>
										<Form.Control 
											name="diskonHarga4" 
											className="text-right"
											value={diskonHarga4}
											disabled={isDisabled()}
											style={{color: "#1675e0", width:150}}
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
							<Form.Group controlId="disc5" style={{ marginBottom: 5}}>
								<Row xs="auto" style={{marginRight: 10}}>
									<Col >
										<Form.Control
											name="disc5"
											placeholder="Jenis Disc 5"
											style={{color: "#1675e0", width:160}}
											value={jenisDiskon5}
											disabled={isDisabled()}
											onChange={(e) => {
												setJenisDiskon5(e);
												calcHarga("");
											}}
											onClean={() => {
												setJenisDiskon5('Discount');
											}}
											accepter={InputPicker} 
											data={selectData}
										/>
									</Col>
									<Col>
										<InputGroup inside style={{width:120}}>
										<Form.Control 
											name="diskonPersen5" 
											className="text-right"
											value={diskonPersen5}
											disabled={isDisabled()}
											onChange= { (e) => { 
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													let discpers = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
													setDiskonPersen5(discpers);
												} 
											} }
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("diskon5");
												}
											}}
											/>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
									<Col>
										<Form.Control 
											name="diskonHarga5" 
											className="text-right"
											value={diskonHarga5}
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
						<Col>
							<Form.Group controlId="hargamodal" style={{ marginBottom: 5}}>
								<Form.ControlLabel className="text-left">Harga Modal</Form.ControlLabel>
								<Form.Control
									name="hargamodal"
									placeholder="Harga Modal"
									className="text-right"
									style={{color: "#1675e0"}}
									value={hargaModal}
									onChange={(e) => {
										e = e.toString().split(',').join('');
										const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
										if (validateNumber) {
											let hrgmodal = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
											setHargaModal(hrgmodal);
										} 
									}}
									disabled={isDisabled()}
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
											value={hargaJual}
											disabled={isDisabled()}
											onChange={(e) => {
												e = e.toString().split('.').join('');
												let validated = validateNumber(e);
												if (validated) {
													setHargaJual(e);
												}
											}}
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("hargaJual");
												}
											}}
										>
										</Form.Control>
									</Col>
									<Col>
										<InputGroup inside>
											<Form.Control 
												name="hargajual" 
												className="text-right"
												style={{width:100}}
												value={profitJual}
												disabled={isDisabled()}
												onChange={(e) => {
													e = e.toString().split(',').join('');
													const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
													if (validateNumber) {
														let profit = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
														setProfitJual(profit);
													} 
												}}
												onKeyPress={(e)=> {
													if (e.key === 'Enter') {
														calcHarga("profitJual");
													}
												}}
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
											value={hargaJualMember}
											disabled={isDisabled()}
											onChange={(e) => {
												e = e.toString().split('.').join('');
												let validated = validateNumber(e);
												if (validated) {
													setHargaJualMember(e);
												}
											}}
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("hargaJualMember");
												}
											}}
										>
										</Form.Control>
									</Col>
									<Col>
										<InputGroup inside>
											<Form.Control 
												name="hargajualmember" 
												className="text-right"
												style={{width:100}}
												value={profitJualMember}
												disabled={isDisabled()}
												onChange={(e) => {
													e = e.toString().split(',').join('');
													const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
													if (validateNumber) {
														let profit = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
														setProfitJualMember(profit);
													} 
												}}
												onKeyPress={(e)=> {
													if (e.key === 'Enter') {
														calcHarga("profitJualMember");
													}
												}}
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
											name="minimumJlh1" 
											className="text-right"
											value={minimumJlh1}
											disabled={isDisabled()}
											style={{width:78}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setMinimumjlh1( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
										>
										</Form.Control>
									</Col>
									<Col >
										<Form.Control 
											name="minimumHarga1" 
											className="text-right"
											value={minimumHarga1}
											disabled={isDisabled()}
											style={{width:150}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setMinimumHarga1( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("minimumHarga1");
												}
											}}
										>
										</Form.Control>
									</Col>
									<Col>
										<InputGroup inside>
											<Form.Control 
												name="minimumPersen1" 
												className="text-right"
												style={{width:100}}
												value={minimumPersen1}
												disabled={isDisabled()}
												onChange={(e) => {
													e = e.toString().split(',').join('');
													const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
													if (validateNumber) {
														setMinimumPersen1( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
													} 
												}}
												onKeyPress={(e)=> {
													if (e.key === 'Enter') {
														calcHarga("minimumPersen1");
													}
												}}
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
											name="minimumJlh2" 
											className="text-right"
											value={minimumJlh2}
											disabled={isDisabled()}
											style={{width:78}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setMinimumjlh2( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
										>
										</Form.Control>
									</Col>
									<Col >
										<Form.Control 
											name="minimumHarga2" 
											className="text-right"
											value={minimumHarga2}
											disabled={isDisabled()}
											style={{width:150}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setMinimumHarga1( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("minimumHarga2");
												}
											}}
										>
										</Form.Control>
									</Col>
									<Col>
										<InputGroup inside>
											<Form.Control 
												name="minimumPersen2" 
												className="text-right"
												style={{width:100}}
												value={minimumPersen2}
												disabled={isDisabled()}
												onChange={(e) => {
													e = e.toString().split('.').join('');
													let validated = validateNumber(e);
													if (validated) {
														setMinimumPersen2(e);
													}
												}}
												onKeyPress={(e)=> {
													if (e.key === 'Enter') {
														calcHarga("minimumPersen2");
													}
												}}
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
											name="minimumJlh3" 
											className="text-right"
											value={minimumJlh3}
											disabled={isDisabled()}
											style={{width:78}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setMinimumjlh3( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
										>
										</Form.Control>
									</Col>
									<Col >
										<Form.Control 
											name="minimumHarga3" 
											className="text-right"
											value={minimumHarga3}
											disabled={isDisabled()}
											style={{width:150}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setMinimumHarga3( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
											onKeyPress={(e)=> {
												if (e.key === 'Enter') {
													calcHarga("minimumHarga3");
												}
											}}
										>
										</Form.Control>
									</Col>
									<Col>
										<InputGroup inside>
											<Form.Control 
												name="minimumPersen3" 
												className="text-right"
												style={{width:100}}
												value={minimumPersen3}
												disabled={isDisabled()}
												onChange={(e) => {
													e = e.toString().split(',').join('');
													const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
													if (validateNumber) {
														setMinimumPersen3( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
													} 
												}}
												onKeyPress={(e)=> {
													if (e.key === 'Enter') {
														calcHarga("minimumPersen3");
													}
												}}
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
											value={kartonJlh}
											disabled={isDisabled()}
											style={{width:78}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setKartonJlh( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
										>
										</Form.Control>
									</Col>
									<Col >
										<Form.Control 
											name="kartonHarga" 
											className="text-right"
											value={kartonHarga}
											disabled={isDisabled()}
											style={{width:150}}
											onChange={(e) => {
												e = e.toString().split(',').join('');
												const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
												if (validateNumber) {
													setKartonHarga( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
												} 
											}}
										>
										</Form.Control>
									</Col>
									<Col>
										<InputGroup inside>
											<Form.Control 
												name="kartonPersen" 
												className="text-right"
												style={{width:100}}
												value={kartonPersen}
												disabled={isDisabled()}
												onChange={(e) => {
													e = e.toString().split(',').join('');
													const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
													if (validateNumber) {
														setKartonPersen( e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
													} 
												}}
											>
											</Form.Control>
											<InputGroup.Addon>%</InputGroup.Addon>
										</InputGroup>
									</Col>
								</Row>
							</Form.Group>
						</Col>
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