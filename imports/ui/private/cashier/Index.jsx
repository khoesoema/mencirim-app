import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useRef, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import Form from 'rsuite/Form';
import { Col, Row } from 'react-bootstrap';

import SelectPicker from 'rsuite/SelectPicker';
import Modal from 'rsuite/Modal';
import useWindowFocus from 'use-window-focus';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { KassaCollections } from '../../../db/Kassa';
import { DataUsersCollections } from '../../../db/Userscol';
import { CashierOnGoingTransactionsCollections } from '../../../db/Cashier';

import { CategoriesCollections } from '../../../db/Categories';
import { ProductsCollections } from '../../../db/Products';
import { PromotionsDetailCollections } from '../../../db/PromotionsDetail';

import '../../assets/css/cashier.css';

import Clock from 'react-live-clock';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function Cashier() {
	let scannedBarcode = '';
	let navigate = useNavigate();
	const windowFocused = useWindowFocus();
	const scanRef = useRef();
	const currentRef = useRef();
	const scrollRef = useRef();
	const changeQtyRef = useRef();
	const changeDescriptionRef = useRef();

	const [addingDetail, setAddingDetail] = useState(false);
	const [ tglTrx, setTglTrx] = useState(new Date());

	let { _id } = useParams();
	let  kassaID = _id;

	const [kassaCode, setKassaCode] = useState('');
	const [kassaName, setKassaName] = useState('');

	const [kassaData, kassaDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('kassa.getByID', { _id });
			isLoading = !subs.ready();

			data = KassaCollections.findOne({ _id });
		}
		return [data, isLoading];	
	}, [_id]);


	useEffect(() => {
		if (kassaData && kassaDataLoading === false) {
			setKassaCode(kassaData.code);
			setKassaName(kassaData.name);
		} else if (!kassaData && kassaDataLoading === false) {
			setKassaCode('');
			setKassaName('');
		}
	}, [kassaData, kassaDataLoading]);

	
	let userID = Meteor.user()._id;
	
	const [userData, userDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (userID) {
			let subs = Meteor.subscribe('dataUser.getByID', { _id: userID });
			isLoading = !subs.ready();

			data = DataUsersCollections.findOne({ _id: userID });
		}
		return [data, isLoading];
	}, [userID]);

	const [itemNum, setItemNum] = useState(0);
	const [kodeBarang, setKodeBarang] = useState('');
	const [barcode, setBarcode] = useState('');
	const [namaBarang, setNamaBarang] = useState('');
	const [categoryID, setCategoryID] = useState('');
	
	const [ktsBesar, setKtsBesar] = useState(0);
	const [ktsKecil, setKtsKecil] = useState(0);
	const [kts, setKts] = useState(0);
	const [satuanBesar, setSatuanBesar] = useState('');
	const [satuanKecil, setSatuanKecil] = useState('');
	
	const [jenisDiskon1, setJenisDiskon1] = useState('Discount');
	const [diskonPersen1, setDiskonPersen1] = useState(0);
	const [diskonHarga1, setDiskonHarga1] = useState(0);

	const [hargaBeli, setHargaBeli] = useState(0);
	const [hargaBeliSatuan, setHargaBeliSatuan] = useState(0);

	const [hargaBruto, setHargaBruto] = useState(0);
	const [hargaNetto, setHargaNetto] = useState(0);

	const [ppnPersen, setPpnPersen] = useState(0);
	const [ppnHarga, setPpnHarga] = useState(0);

	const [qtyBonus, setQtyBonus] = useState(0);

	const [hargaModal, setHargaModal] = useState(0);
	const [hargaJual, setHargaJual] = useState(0);
	const [hargaJualMember, setHargaJualMember] = useState(0);
	
    const [searchKodeBarangText, setSearchKodeBarangText] = useState('');
	const [searchCategoriesText, setSearchCategoriesText] = useState('');

	const [currentImage, setCurrentImage] = useState('');

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
		let isMember='';
        if (productData && productDataLoading === false) {
			setBarcode(productData.barcode);
			setNamaBarang (productData.namaBarang);
			setCategoryID (productData.categoryID);

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
			
			setHargaJual(formatNum(productData.hargajual));
			setHargaJualMember(formatNum(productData.hargajualmember));

			if(isMember != '') {
				setHargaJual(formatNum(productData.hargajualmember));
			}
			setCurrentImage(productData.imageBase64);
		} else if (!productData && productDataLoading === false) {
			resetvalue();
		}
    },[productData, productDataLoading])

	const [categoryData, categoryDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};
		let code = categoryID;
		if (code) {
			let subs = Meteor.subscribe('categories.getByCode', { code });
			isLoading = !subs.ready();

			data = CategoriesCollections.findOne({ code });
		}
		return [data, isLoading];
	}, [categoryID]);

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

	const [promotionsDetailData, promotionsDetailDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (kodeBarang && tglTrx) {
			let subs = Meteor.subscribe('promotionsdetail.getByTgl', { kodeBarang, tglTrx});
			isLoading = !subs.ready();

			data = PromotionsDetailCollections.find({}).fetch();

			isLoading = !subs.ready();
		}
		
		isLoading = false;
		return [data, isLoading];
	}, [kodeBarang, tglTrx]);

	useEffect(()=> {
		if(promotionsDetailData && promotionsDetailDataLoading === false){
			if (promotionsDetailData.length > 0 ){
				promotionsDetailData.map((item)=> {
					if (item.target === 1 ) {
						if (item.diskonPersen > 0 ) {
							setDiskonPersen1(item.diskonPersen);
						} else if (item.diskonHarga > 0 ) {
							let hrgJual = hargaJual.toString().split(',').join('')
							let diskonP = item.diskonHarga / hrgJual * 100 ;
							console.log(diskonP, hrgJual);
							setDiskonPersen1(formatNum(diskonP))
							setDiskonHarga1(formatNum(item.diskonHarga));
						}
					}
				})
			}

		} else if (!promotionsDetailData && promotionsDetailDataLoading === false) {
			setDiskonPersen1(0);
			setDiskonHarga1(0);
		};
	},[promotionsDetailData, promotionsDetailDataLoading]);

	const resetvalue = () => {
		setKodeBarang('');
		setBarcode('');
		setNamaBarang ('');
		setCategoryID ('');

		setKts(0);
		setQtyBonus(0);

		//setSupplier ('');
		
		setHargaBruto(0);
		setHargaNetto(0);
		setHargaModal(0);

		setJenisDiskon1('Discount');

		setDiskonPersen1(0);

		setDiskonHarga1(0);

		setPpnPersen(0);
		setPpnHarga(0);

		setHargaJual(0);
		setHargaJualMember(0);

		setCurrentImage('');
	};


	const [changeQuantityDialogOpen, setChangeQuantityDialogOpen] =
		useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [adding, setAdding] = useState(false);
	const [productCode, setProductCode] = useState('');
	const [currentIndex, setCurrentIndex] = useState(-1);
	const [subTotal, setSubTotal] = useState(0);
	const [grandTotal, setGrandTotal] = useState(0);
	const [discountTotal, setDiscountTotal] = useState(0);

	const [changeQtyAmount, setChangeQtyAmount] = useState(0);
	const [changingQty, setChangingQty] = useState(false);

	const [changeDescriptionDialogOpen, setChangeDescriptionDialogOpen] = useState(false);
	const [changeDescriptionValue, setChangeDescriptionValue] = useState('');
	const [changingDescription, setChangingDescription] = useState(false);

	const [deletingItem, setDeletingItem] = useState(false);
	const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);

	const [loggingOut, setLoggingOut] = useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	const [items, itemsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('cashierOnGoingTransactions.list', {
			kassaID,
		});

		let data = CashierOnGoingTransactionsCollections.find({
			kassaID,
		}).fetch();
		return [data, !subs.ready()];
	}, [kassaID]);
	
	const [itemsCount, itemsCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('cashierOnGoingTransactions.countList', {
			kassaID,
		});

		let data = Counts.get(
			'cashierOnGoingTransactions.countList.' + kassaID
		);
		return [data, !subs.ready()];
	}, [kassaID]);

	useEffect(() => {
		let currDiscountTotal = items.reduce(
			(a, b) => a + b.productDiscountTotal,
			0
		);
		let currSubTotal = items.reduce((a, b) => a + b.productSubTotal, 0);

		setDiscountTotal(currDiscountTotal);
		setSubTotal(currSubTotal);
		setGrandTotal(currSubTotal - currDiscountTotal);
	}, [items]);

	useEffect(() => {
		if (currentIndex !== -1) {
			scroller.scrollTo('myScrollToElement' + currentIndex, {
				delay: 0,
				smooth: false,
				offset: -25,
				containerId: 'productListContainer',
			});
		}
	}, [currentIndex]);

	useEffect(() => {
		if (windowFocused) {
			if (
				scanRef.input &&
				!scanRef.input.onfocus 
			) {
				scanRef.input.focus();
			}
		}
	}, [windowFocused]);
	// useEffect(() => {
	// 	if (
	// 		changeQuantityDialogOpen === false &&
	// 		changeDescriptionDialogOpen === false
	// 	) {
	// 		setTimeout(() => {
	// 			// scanRef.current.focus();
	// 		}, 500);
	// 	}
	// }, [changeDescriptionDialogOpen, changeQuantityDialogOpen]);
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleKeyboardButon(event) {
			let currentKey = event.key;
			if (currentKey === 'Escape') {
				event.preventDefault();
				if (
					changeDescriptionDialogOpen === false &&
					changeQuantityDialogOpen === false &&
					deleteItemDialogOpen === false &&
					logoutDialogOpen === false
				) {
					setLogoutDialogOpen(true);
				}

				if (logoutDialogOpen === true) {
					navigate('/');
				}
			} else if (currentKey === 'ArrowUp') {
				if (
					changeDescriptionDialogOpen === false &&
					changeQuantityDialogOpen === false &&
					deleteItemDialogOpen === false &&
					logoutDialogOpen === false
				) {
					event.preventDefault();
					setCurrentIndex((prev) => {
						if (prev <= 0) {
							return 0;
						} else {
							return prev - 1;
						}
					});
				}
				// let currIndex = currentIndex - 1;
				// if (currentIndex > 0) {
				// 	setCurrentIndex(currIndex);
				// }
			} else if (currentKey === 'ArrowDown') {
				if (
					changeDescriptionDialogOpen === false &&
					changeQuantityDialogOpen === false &&
					deleteItemDialogOpen === false &&
					logoutDialogOpen === false
				) {
					event.preventDefault();
					setCurrentIndex((prev) => {
						if (prev >= itemsCount - 1) {
							return itemsCount - 1;
						} else {
							return prev + 1;
						}
					});
				}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F2') {
				if (
					currentIndex !== -1 &&
					changeDescriptionDialogOpen === false &&
					changeQuantityDialogOpen === false &&
					deleteItemDialogOpen === false &&
					logoutDialogOpen === false
				) {
					event.preventDefault();
					setChangeQtyAmount(items[currentIndex].productQuantity);
					setChangeQuantityDialogOpen(true);
				}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F3') {
				if (
					currentIndex !== -1 &&
					changeDescriptionDialogOpen === false &&
					changeQuantityDialogOpen === false &&
					deleteItemDialogOpen === false &&
					logoutDialogOpen === false
				) {
					event.preventDefault();
					setDeleteItemDialogOpen(true);
				}

				if (currentIndex !== -1 && deleteItemDialogOpen === true) {
					event.preventDefault();
					deleteItem();
				}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F4') {
				if (
					currentIndex !== -1 &&
					changeDescriptionDialogOpen === false &&
					changeQuantityDialogOpen === false &&
					deleteItemDialogOpen === false &&
					logoutDialogOpen === false
				) {
					event.preventDefault();
					setChangeDescriptionValue(
						items[currentIndex].productDescription
					);
					setChangeDescriptionDialogOpen(true);
				}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F1') {
				event.preventDefault();
				scanRef.current.focus();
				//if (productCode) {
				//	add();
				//} else {
				//	scanRef.current.focus();
				//}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F12') {
				event.preventDefault();
				if (logoutDialogOpen === true) {
					setLogoutDialogOpen(false);
				}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			}
		}

		function handleBarcode(e) {
			e.stopImmediatePropagation();
			let barcode = '';
			let code = e.keyCode ? e.keyCode : e.which;

			if (code === 13) {
				add(scannedBarcode);
				scannedBarcode = '';
			} else {
				barcode = barcode + String.fromCharCode(code);
				scannedBarcode += barcode;
			}
		}

		// Bind the event listener
		document.addEventListener('keydown', handleKeyboardButon);
		window.addEventListener('keypress', handleBarcode);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('keydown', handleKeyboardButon);
			window.removeEventListener('keypress', handleBarcode);
		};
	}, [
		itemsCount,
		changeQuantityDialogOpen,
		changeDescriptionDialogOpen,
		deleteItemDialogOpen,
		logoutDialogOpen,
		currentIndex,
		productCode,
	]);

	const add = (inputCode = undefined) => {
		setAdding(true);
		if (productCode || inputCode) {
			let submitCode = inputCode ? inputCode : productCode;
			Meteor.call(
				'cashierOnGoingTransactions.add',
				{
					productCode: submitCode,
					kassaID,
				},
				(err, res) => {
					if (err) {
						setProductCode('');
						setAdding(false);
						// setDialogOpen(true);
						// setDialogTitle(err.error);
						// setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setProductCode('');
							setAdding(false);
							// scanRef.current.focus();

							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setProductCode('');
							setAdding(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						}
					} else {
						setProductCode('');
						setAdding(false);
						// setDialogOpen(true);
						// setDialogTitle('Kesalahan Sistem');
						// setDialogContent(
						// 	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						// );
					}
				}
			);
		} else {
			setProductCode('');
			setAdding(false);
			// setDialogOpen(true);
			// setDialogTitle('Kesalahan Validasi');
			// setDialogContent('Silahkan Isi Scan Produk/Kode Produk');
		}
	};
	const changeQty = (e) => {
		setChangingQty(true);
		let selectedProduct = items[currentIndex];
		if (selectedProduct && Number(changeQtyAmount)) {
			Meteor.call(
				'cashierOnGoingTransactions.changeQty',
				{
					productCode: selectedProduct.productCode,
					kassaID,
					quantity: Number(changeQtyAmount),
				},
				(err, res) => {
					if (err) {
						setChangingQty(false);
						// setDialogOpen(true);
						// setDialogTitle(err.error);
						// setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setChangeQtyAmount(0);
							setChangingQty(false);
							setChangeQuantityDialogOpen(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						} else {
							setChangingQty(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						}
					} else {
						setChangingQty(false);
						// setDialogOpen(true);
						// setDialogTitle('Kesalahan Sistem');
						// setDialogContent(
						// 	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						// );
					}
				}
			);
		} else {
			alert('Qty Produk harus lebih besar dari 0');
			setChangingQty(false);
			setTimeout(() => {
				changeQtyRef.current.focus();
			}, 500);
			// setDialogOpen(true);
			// setDialogTitle('Kesalahan Validasi');
			// setDialogContent('Silahkan Isi Scan Produk/Kode Produk');
		}
	};

	const changeDescription = (e) => {
		setChangingDescription(true);
		let selectedProduct = items[currentIndex];
		if (selectedProduct) {
			Meteor.call(
				'cashierOnGoingTransactions.changeDescription',
				{
					productCode: selectedProduct.productCode,
					kassaID,
					description: changeDescriptionValue,
				},
				(err, res) => {
					if (err) {
						setChangingDescription(false);
						// setDialogOpen(true);
						// setDialogTitle(err.error);
						// setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setChangeDescriptionValue('');
							setChangingDescription(false);
							setChangeDescriptionDialogOpen(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						} else {
							setChangingDescription(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						}
					} else {
						setChangingDescription(false);
						// setDialogOpen(true);
						// setDialogTitle('Kesalahan Sistem');
						// setDialogContent(
						// 	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						// );
					}
				}
			);
		} else {
			setChangingDescription(false);
			setTimeout(() => {
				changeDescriptionRef.current.focus();
			}, 500);
			// setDialogOpen(true);
			// setDialogTitle('Kesalahan Validasi');
			// setDialogContent('Silahkan Isi Scan Produk/Kode Produk');
		}
	};

	const deleteItem = (e) => {
		setDeletingItem(true);
		let selectedProduct = items[currentIndex];
		if (selectedProduct) {
			Meteor.call(
				'cashierOnGoingTransactions.deleteItem',
				{
					productCode: selectedProduct.productCode,
					kassaID,
				},
				(err, res) => {
					if (err) {
						setDeletingItem(false);
						// setDialogOpen(true);
						// setDialogTitle(err.error);
						// setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setDeletingItem(false);
							setDeleteItemDialogOpen(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						} else {
							setDeletingItem(false);
							// setDialogOpen(true);
							// setDialogTitle(resultTitle);
							// setDialogContent(resultMessage);
						}
					} else {
						setDeletingItem(false);
						// setDialogOpen(true);
						// setDialogTitle('Kesalahan Sistem');
						// setDialogContent(
						// 	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						// );
					}
				}
			);
		} else {
			setDeletingItem(false);
			// setDialogOpen(true);
			// setDialogTitle('Kesalahan Validasi');
			// setDialogContent('Silahkan Isi Scan Produk/Kode Produk');
		}
	};

	const columns = [
		{ id: 'no', label: '#', minWidth: 50 },
		{ id: 'barcode', label: 'Barcode', minWidth: 120 },
		{ id: 'namaBarang', label: 'Nama Barang', minWidth: 240 },
		{
			id: 'qty',
			label: 'Qty',
			minWidth: 100,
			align: 'right',
			format: (value) => value.toFixed(2),
		},
		{
		  id: 'hargaBarang',
		  label: 'Harga Barang',
		  minWidth: 100,
		  align: 'right',
		  format: (value) => value.toFixed(2),
		},
		{
			id: 'discHarga',
			label: '# Diskon',
			minWidth: 80,
			align: 'right',
			format: (value) => value.toFixed(2),
		},
		{
			id: 'discPersen',
			label: '% Diskon',
			minWidth: 80,
			align: 'right',
			format: (value) => value.toFixed(2),
		},
		{
			id: 'jumlahHarga',
			label: 'Jumlah Harga',
			minWidth: 120,
			align: 'right',
			format: (value) => value.toFixed(2),
		},
	];

	function createData(no, barcode, namaBarang, qty, hargaBarang, discHarga, discPersen) {
		const jumlahHarga = qty * (hargaBarang - discHarga);
		return { no, barcode, namaBarang, qty, hargaBarang, discHarga, discPersen, jumlahHarga };
	}

	const rows = [
		createData(1, 1324171354,'Indomie Goreng Spesial 85Gr', 5, 2570, 0,0),
	];
	
	const isDisabled = () => {
		if (addingDetail || productDataLoading){
            return true;
        } else {
            return false;
        } 
	};

	const addDetail = () => {
		setAddingDetail(true);
		if (
			kodeBarang &&
			ktsKecil 
		) {
			Meteor.call(
				'penjualandetail.add',
				{
					itemNum,
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
					diskonPersen1,
					diskonHarga1,

					ppnPersen,
					ppnHarga,
						
					hargaBruto,
					hargaNetto,

					hargaJual,
				},
				(err, res) => {
					if (err) {
						setAddingDetail(false);
						//setType('error');
						//setHeader(err.error);
						//setDesc(err.reason);
						let type = 'error';
						let title = err.error;
						let desc = err.reason;
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
						//setDialogOpen(true);
						//setDialogTitle(err.error);
						//setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							resetvalue();
							setBarcode('');
							setAddingDetail(false);
							let type = 'success';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
							//setDialogOpen(true);
							//setDialogTitle(resultTitle);
							//setDialogContent(resultMessage);
						} else {
							setAddingDetail(false);
							let type = 'warning';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
							//setDialogOpen(true);
							//setDialogTitle(resultTitle);
							//setDialogContent(resultMessage);
						}
					} else {
						setAddingDetail(false);
						let type = 'error';
						let title = 'Kesalahan Sistem';
						let desc = 'Terjadi kesalahan pada sistem, silahkan hubungi customer service';
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
						//setDialogOpen(true);
						//setDialogTitle('Kesalahan Sistem');
						//setDialogContent(
						//	'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						//);
					}
				}
			);
		} else {
			setAddingDetail(false);
			let type = 'error';
			let title = 'Kesalahan Sistem';
			let desc = 'Kode Barang, Kuantitas dan Harga Beli Wajib Diisi';
			toaster.push(
				<Message showIcon type={type} header={title}>
					{desc}
				  </Message>
				,{placement})
			//setDialogOpen(true);
			//setDialogTitle('Kesalahan Validasi');
			//setDialogContent(
			//	'Kode Barang, Kuantitas dan Harga Beli Wajib Diisi'
			//);
		}
		
	};

	return (
		<>
			<Container
				fluid
				className="kasir-container"
				style={{ height: '100%', margin:0, backgroundColor: '#0d47a1'}}
			>
				<Modal
					backdrop={true}
					keyboard={false}
					open={dialogOpen}
					onClose={(e) => {
						setDialogOpen(false);
						// scanRef.current.focus();
					}}
				>
					<Modal.Header>
						<Modal.Title>{dialogTitle}</Modal.Title>
					</Modal.Header>

					<Modal.Body>{dialogContent}</Modal.Body>
				</Modal>
				
				<Modal
					backdrop={true}
					keyboard={true}
					open={changeQuantityDialogOpen}
					onClose={(e) => {
						setChangeQuantityDialogOpen(false);
						// scanRef.current.focus();
					}}
				>
					<Modal.Header>
						<Modal.Title>Ubah Jumlah Produk </Modal.Title>
					</Modal.Header>

					<Modal.Body>
						{items[currentIndex] && (
							<>
								<h6>
									Produk :{' '}
									<b>{items[currentIndex].productName}</b>
								</h6>
								<h6>
									Kode :{' '}
									<b>{items[currentIndex].productCode}</b>
								</h6>
								<h6>
									Keterangan :{' '}
									<b>
										{items[currentIndex].productDescription}
									</b>
								</h6>
								<h6>
									Harga Barang :{' '}
									<b>
										{items[currentIndex].productPrice
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Qty :{' '}
									<b>
										{items[currentIndex].productQuantity
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Satuan :{' '}
									<b>{items[currentIndex].productUOMName}</b>
								</h6>
								<h6>
									Diskon :{' '}
									<b>
										{items[currentIndex].productDiscount
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Jumlah Harga :{' '}
									<b>
										{items[currentIndex].productSubTotal
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>

								<FormControl
									ref={changeQtyRef}
									autoFocus
									type="text"
									name="productPrice"
									placeholder="Jumlah Produk"
									defaultValue={items[
										currentIndex
									].productQuantity
										.toString()
										.replace('.', ',')
										.replace(
											/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
											'$1.'
										)}
									value={changeQtyAmount}
									onChange={(e) => {
										let input = e.currentTarget.value;
										let regex = /^-?[0-9.]*,?[0-9.]*$/;
										if (
											input === '' ||
											input === '-' ||
											input === '0' ||
											regex.test(input)
										) {
											let pureValue = input;

											let firstChar = pureValue.substring(
												0,
												1
											);
											if (firstChar === '-') {
												if (
													pureValue.toString()
														.length > 2
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
														.length > 1
												) {
													pureValue =
														pureValue.replace(
															/^(-?)0+(?!,)/,
															'$1'
														);
												}
											}
											pureValue = Number(
												pureValue
													.split('.')
													.join('')
													.replace(',', '.')
											);
											setChangeQtyAmount(pureValue);
										}
									}}
									disabled={changingQty}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											changeQty();
										}
									}}
								/>
							</>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={changingQty}
							onClick={(e) => {
								changeQty();
							}}
							variant="primary"
						>
							Ok (Enter)
						</Button>
						<Button
							disabled={changingQty}
							onClick={(e) => {
								setChangeQuantityDialogOpen(false);
							}}
							variant="warning"
						>
							Batal (Escape)
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal
					backdrop={true}
					keyboard={true}
					open={changeDescriptionDialogOpen}
					onClose={(e) => {
						setChangeDescriptionDialogOpen(false);
						// scanRef.current.focus();
					}}
				>
					<Modal.Header>
						<Modal.Title>Ubah Deskripsi Produk </Modal.Title>
					</Modal.Header>

					<Modal.Body>
						{items[currentIndex] && (
							<>
								<h6>
									Produk :{' '}
									<b>{items[currentIndex].productName}</b>
								</h6>
								<h6>
									Kode :{' '}
									<b>{items[currentIndex].productCode}</b>
								</h6>
								<h6>
									Keterangan :{' '}
									<b>
										{items[currentIndex].productDescription}
									</b>
								</h6>
								<h6>
									Harga Barang :{' '}
									<b>
										{items[currentIndex].productPrice
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Qty :{' '}
									<b>
										{items[currentIndex].productQuantity
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Satuan :{' '}
									<b>{items[currentIndex].productUOMName}</b>
								</h6>
								<h6>
									Diskon :{' '}
									<b>
										{items[currentIndex].productDiscount
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Jumlah Harga :{' '}
									<b>
										{items[currentIndex].productSubTotal
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>

								<FormControl
									ref={changeDescriptionRef}
									disabled={changingDescription}
									autoFocus
									type="text"
									name="productDescription"
									placeholder="Keterangan Produk"
									defaultValue={
										items[currentIndex].productDescription
									}
									value={changeDescriptionValue}
									onChange={(e) => {
										let input = e.currentTarget.value;
										setChangeDescriptionValue(input);
									}}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											changeDescription();
										}
									}}
								/>
							</>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={changingDescription}
							onClick={(e) => {
								changeDescription();
							}}
							variant="primary"
						>
							Ok (Enter)
						</Button>
						<Button
							disabled={changingDescription}
							onClick={(e) => {
								setChangeDescriptionDialogOpen(false);
							}}
							variant="warning"
						>
							Batal (Escape)
						</Button>
					</Modal.Footer>
				</Modal>
				<Modal
					backdrop={true}
					keyboard={true}
					open={deleteItemDialogOpen}
					onClose={(e) => {
						setDeleteItemDialogOpen(false);
						// scanRef.current.focus();
					}}
				>
					<Modal.Header>
						<Modal.Title>Hapus Produk </Modal.Title>
					</Modal.Header>

					<Modal.Body>
						{items[currentIndex] && (
							<>
								<h6>
									Produk :{' '}
									<b>{items[currentIndex].productName}</b>
								</h6>
								<h6>
									Kode :{' '}
									<b>{items[currentIndex].productCode}</b>
								</h6>
								<h6>
									Keterangan :{' '}
									<b>
										{items[currentIndex].productDescription}
									</b>
								</h6>
								<h6>
									Harga Barang :{' '}
									<b>
										{items[currentIndex].productPrice
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Qty :{' '}
									<b>
										{items[currentIndex].productQuantity
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Satuan :{' '}
									<b>{items[currentIndex].productUOMName}</b>
								</h6>
								<h6>
									Diskon :{' '}
									<b>
										{items[currentIndex].productDiscount
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
								<h6>
									Jumlah Harga :{' '}
									<b>
										{items[currentIndex].productSubTotal
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</b>
								</h6>
							</>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={deletingItem}
							onClick={(e) => {
								deleteItem();
							}}
							variant="primary"
						>
							Ok (F3)
						</Button>
						<Button
							disabled={deletingItem}
							onClick={(e) => {
								setDeleteItemDialogOpen(false);
							}}
							variant="warning"
						>
							Batal (Escape)
						</Button>
					</Modal.Footer>
				</Modal>

				<Modal
					backdrop={true}
					keyboard={false}
					open={logoutDialogOpen}
					onClose={(e) => {
						setLogoutDialogOpen(false);
						// scanRef.current.focus();
					}}
				>
					<Modal.Header>
						<Modal.Title>Logout dari program</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						Anda akan keluar dari program kasir ini, apakah anda
						yakin?
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={loggingOut}
							onClick={(e) => {
								navigate('/');
							}}
							variant="primary"
						>
							Ok (Escape)
						</Button>
						<Button
							disabled={loggingOut}
							onClick={(e) => {
								setLogoutDialogOpen(false);
							}}
							variant="warning"
						>
							Batal (F12)
						</Button>
					</Modal.Footer>
				</Modal>

				<Grid container spacing={2} sx={{ pt: 2, pb:2, backgroundColor: '#0d47a1', height: '100%', margin:0, maxWidth: '100%'}}>
					<Grid item xs={9}>
						<Card sx={{height:'100%', display: 'flex'}}>
							<CardContent>
								<Form 
									layout="horizontal"
									//onSubmit={() => { addDetail();}}
									disabled={ isDisabled() }
									>
									<Row>
										<Col xs={8}>
											<FormControl
												ref={scanRef}
												disabled={adding}
												value={productCode}
												id="productCodeSearch"
												// autoFocus
												onKeyDown={(e) => {
													let currentKey = e.key;
												}}
												onChange={(e) => {
													setProductCode(
														e.currentTarget.value
													);
												}}
											/>
											<Form.Group controlId="barcode" style={{ marginBottom: 2}}>
												<Form.ControlLabel className="text-left" style={{color: "#1675e0"}}>
													{barcode}
												</Form.ControlLabel>
											</Form.Group>
											<Form.Group controlId="categoryID" style={{ marginBottom: 2}}>
												<Form.ControlLabel className="text-left" style={{color: "#1675e0"}}>
													{(categoryDataLoading === false) && categoryData.name}
												</Form.ControlLabel>
											</Form.Group>
											</Col>
											<Col xs={4}>
												{currentImage && (
													<>
														<div 
															className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth"
															style={{height:120}}
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
								</Form>		
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card>
							<CardContent>
								<Typography variant="h4" component="div">{kassaName}</Typography>
								<Typography variant="body2" color="text.secondary">
									<Clock format={'DD-MMMM-YYYY HH:mm:ss'} ticking={true} timezone={'Asia/Jakarta'} />
        						</Typography>
								<Typography variant="body">
									{ Meteor.user().username + ' ' }
									{ (userDataLoading === false ) && (<strong>{userData.name}</strong>) }
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={9}>
						<Card>
							<CardContent>
								<TableContainer sx={{ height: 350, maxHeight: 350 }}>
      							  <Table stickyHeader aria-label="sticky table">
      							    <TableHead>
      							      <TableRow>
      							        {columns.map((column) => (
      							          <TableCell
      							            key={column.id}
      							            align={column.align}
      							            style={{ minWidth: column.minWidth }}
      							          >
      							            {column.label}
      							          </TableCell>
      							        ))}
      							      </TableRow>
      							    </TableHead>
      							    <TableBody>
      							      {rows
      							        .map((row) => {
      							          return (
      							            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
      							              {columns.map((column) => {
      							                const value = row[column.id];
      							                return (
      							                  <TableCell key={column.id} align={column.align}>
      							                    {column.format && typeof value === 'number'
      							                      ? column.format(value)
      							                      : value}
      							                  </TableCell>
      							                );
      							              })}
      							            </TableRow>
      							          );
      							        })}
      							    </TableBody>
      							  </Table>
      							</TableContainer>
								<div className="row">
									<div className="col-lg-8 mx-auto rounded">
										<p>
											Keterangan:{' '}
											{items[currentIndex] &&
												items[currentIndex].productDescription}
										</p>
										<hr />
									</div>
									<div className="col-lg-4 mx-auto rounded">
										<table className="table table-borderless">
											<tbody>
												<tr>
													<td>Total :</td>
													<td className="pe-4 text-right">
														<h3>
															<b>
																{grandTotal
																	.toString()
																	.replace('.', ',')
																	.replace(
																		/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
																		'$1.'
																	)}
															</b>
														</h3>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={3} >
						<Card sx={{height: '100%'}}>
							<CardContent></CardContent>
						</Card>
					</Grid>
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<input type="text" hidden></input>
								<div className="row">
									<div className="col-lg-12 mx-auto">
										<table className="table table-borderless">
											<tbody>
												<tr>
													<td className="bg-dark text-white rounded text-center">
														F1
													</td>
													<td className="text-dark">Cari Produk</td>
													<td className="bg-dark text-white rounded text-center">
														F2
													</td>
													<td className="text-dark">Ubah Qty</td>
													<td className="bg-dark text-white rounded text-center">
														F3
													</td>
													<td className="text-dark">Hapus</td>
													<td className="bg-dark text-white rounded text-center">
														F4
													</td>
													<td className="text-dark">Keterangan</td>
													<td className="bg-dark text-white rounded text-center">
														F5
													</td>
													<td className="text-dark">Diskon</td>
													<td className="bg-dark text-white rounded text-center">
														F6
													</td>
													<td className="text-dark">Member Card</td>
													<td className="bg-dark text-white rounded text-center">
														F7
													</td>
													<td className="text-dark">Print Struk</td>
													<td className="bg-dark text-white rounded text-center">
														F8
													</td>
													<td className="text-dark">Pembayaran</td>
													<td className="bg-dark text-white rounded text-center">
														Esc
													</td>
													<td className="text-dark">Log Out</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
