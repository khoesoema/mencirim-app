import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useRef, useState } from 'react';
import { FormControl, InputGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import { Col, Row } from 'react-bootstrap';
import Clock from 'react-live-clock';

import Modal from 'rsuite/Modal';
import Form from 'rsuite/Form';
import SelectPicker from 'rsuite/SelectPicker';
import Button from 'rsuite/Button';

import useWindowFocus from 'use-window-focus';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { KassaCollections } from '../../../db/Kassa';
import { DataUsersCollections } from '../../../db/Userscol';

import { CategoriesCollections } from '../../../db/Categories';
import { ProductsCollections } from '../../../db/Products';
import { CustomersCollections } from '../../../db/Customers';
import { PromotionsDetailCollections } from '../../../db/PromotionsDetail';
import { PenjualanCollections } from '../../../db/Penjualan';
import { PenjualanDetailCollections } from '../../../db/PenjualanDetail';

import '../../assets/css/cashier.css';
import { FaBullseye } from 'react-icons/fa';

import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} {...props} />;
});

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

const filterOptions = createFilterOptions({
	matchFrom: 'any',
	stringify: (option) => option.barcode + option.name,
});

class CashierClass extends React.Component {
	constructor(props) {
		super(props);
	}
}

export function Cashier(props) {

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [severity, setSeverity] = useState('info');
	const [msg, setMsg] = useState('');
	const [msgTitle, setMsgTitle] = useState('');

	const [value, setValue] = useState({
		label: '',
		code: '',
		barcode: '',
		name: ''
	});
	const [inputValue, setInputValue] = useState('');

	const [value2, setValue2] = useState({
		label: '',
		code: '',
		mobileNumber: '',
		name: ''
	});
	const [inputValue2, setInputValue2] = useState('');

	const myRefs = useRef();

	let scannedBarcode = '';
	let navigate = useNavigate();
	const windowFocused = useWindowFocus();
	const scanRef = useRef();
	const custRef = useRef();
	const scrollRef = useRef();
	const changeQtyRef = useRef();
	const changeDescriptionRef = useRef();

	const [addingDetail, setAddingDetail] = useState(false);
	const [tglTrx, setTglTrx] = useState(new Date());
	const [noFaktur, setNoFaktur] = useState('');
	const [tglFaktur, setTglFaktur] = useState(new Date());
	const [currencyID, setCurrencyID] = useState('IDR');
	const [keterangan, setKeterangan] = useState('');

	const [kassaCode, setKassaCode] = useState('');
	const [kassaName, setKassaName] = useState('');
	const [formatLastNo, setFormatLastNo] = useState('');
	const [lastNo, setLastNo] = useState('');

	let { _id } = useParams();
	let kassaID = _id;
	let userID = Meteor.user()._id;

	const [itemNum, setItemNum] = useState(0);
	const [kodeBarang, setKodeBarang] = useState('');
	const [barcode, setBarcode] = useState('');
	const [namaBarang, setNamaBarang] = useState('');
	const [categoryID, setCategoryID] = useState('');

	const [ktsBesar, setKtsBesar] = useState(0);
	const [ktsKecil, setKtsKecil] = useState(1);
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

	const [changeQuantityDialogOpen, setChangeQuantityDialogOpen] = useState(false);
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

	const [readOnlyQty, setReadOnlyQty] = useState(true);

	const [optionsProd, setOptionsProd] = useState([]);

	const [optionsCust, setOptionsCust] = useState([]);
	const [customerID, setCustomerID] = useState('');
	const [customerName, setCustomerName] = useState('');
	const [customerBirth, setCustomerBirth] = useState('');
	const [customerAddress, setCustomerAddress] = useState('');
	const [customerPoin, setCustomerPoin] = useState('');

	const [openModal, setOpenModal] = useState(false);

	const [paymentMethod, setPaymentMethod] = useState('1');
	const [payment, setPayment] = useState(0);
	const [changeMoney, setChangeMoney] = useState(0);

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
				.toFixed(2)
				.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}
	};

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
			let lastNum = kassaData.code + '.' + moment(new Date()).format('YYMMDD') + '.';
			setFormatLastNo(lastNum);
		} else if (!kassaData && kassaDataLoading === false) {
			setKassaCode('');
			setKassaName('');
			setFormatLastNo('');
		}
	}, [kassaData, kassaDataLoading]);

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

	const [penjualanData, penjualanDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = '';
		let searchText = formatLastNo;

		if (formatLastNo) {
			let subs = Meteor.subscribe('penjualan.getLastNo', { searchText });
			isLoading = !subs.ready();

			data = PenjualanCollections.findOne(
				{
					noFaktur:
					{
						$regex: searchText,
						$options: 'i',
					}
				},
				{ sort: { noFaktur: 1 } },
				{ limit: 1 }
			);
		}

		return [data, isLoading];
	}, [formatLastNo]);

	useEffect(() => {
		let last = '';
		if (penjualanData && penjualanDataLoading === false) {
			let data = penjualanData.noFaktur;
			const arr = data.split(".");
			let num = parseInt(arr[2]) + 1;
			last = arr[0] + '.' + arr[1] + '.' + num;
		} else if (!penjualanData && penjualanDataLoading === false) {
			last = kassaCode + '.' + moment(new Date()).format('YYMMDD') + '.1';
		};
		setLastNo(last);
		setNoFaktur(last);
	}, [penjualanData, penjualanDataLoading]);

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

	useEffect(() => {
		let isMember = customerID;
		if (productData && productDataLoading === false) {
			setBarcode(productData.barcode);
			setNamaBarang(productData.namaBarang);
			setCategoryID(productData.categoryID);

			if (productData.kts === undefined) {
				setKts(0);
			} else {
				setKts(productData.kts);
			}

			if (productData.satuanBesar === undefined) {
				setSatuanBesar('');
			} else {
				setSatuanBesar(productData.satuanBesar);
			}

			if (productData.satuanKecil === undefined) {
				setSatuanKecil('');
			} else {
				setSatuanKecil(productData.satuanKecil);
			}

			setHargaJual(formatNum(productData.hargajual));
			setHargaJualMember(formatNum(productData.hargajualmember));

			if (isMember != '') {
				setHargaJual(formatNum(productData.hargajualmember));
			}
			setCurrentImage(productData.imageBase64);
		} else if (!productData && productDataLoading === false) {
			resetvalue();
		}
	}, [productData, productDataLoading])

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

		let subs = Meteor.subscribe('products.search2', {
			searchText: inputValue,
			selectedID: value.barcode,
		});

		let data = ProductsCollections.find({
			$or: [
				{
					barcode: value.barcode,
				},
				{
					barcode: {
						$regex: inputValue,
						$options: 'i',
					},
				},
				{
					namaBarang: {
						$regex: inputValue,
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
	}, [inputValue, value]);

	useEffect(() => {
		let baris = [];
		if (products && productsLoading === false) {
			products.map((item, index) => {
				baris[index] = {
					label: item.namaBarang,
					code: item.kodeBarang,
					barcode: item.barcode,
					name: item.namaBarang,
				};
			})
			setOptionsProd(baris);
		} else if (!products && productsLoading === false) {
			baris = [];
		}
	}, [products, productsLoading]);

	const [customers, customersLoading] = useTracker(() => {
		let subs = Meteor.subscribe('customers.search2', {
			searchText: inputValue2,
			selectedID: customerID,
		});

		let data = CustomersCollections.find({
			$or: [
				{
					code: customerID,
				},
				{
					mobileNumber: {
						$regex: inputValue2,
						$options: 'i',
					},
				},
			],
		}).fetch();

		return [data, !subs.ready()];
	}, [inputValue2, customerID]);

	useEffect(() => {
		let baris = [];
		if (customers && customersLoading === false) {
			customers.map((item, index) => {
				baris[index] = {
					label: item.mobileNumber,
					code: item.code,
					mobileNumber: item.mobileNumber,
					name: item.name,
					tglLahir: item.birthPlace + ', ' + moment(item.birthDate).format('DD-MMM-YYYY'),
					address: item.address,
					poin: item.current,
				};
			})
			setOptionsCust(baris);
		} else if (!customers && customersLoading === false) {
			baris = [];
		}
	}, [customers, customersLoading]);

	const [promotionsDetailData, promotionsDetailDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (kodeBarang && tglTrx) {
			let subs = Meteor.subscribe('promotionsdetail.getByTgl', { kodeBarang, tglTrx });
			isLoading = !subs.ready();

			data = PromotionsDetailCollections.find({}).fetch();

			isLoading = !subs.ready();
		}

		isLoading = false;
		return [data, isLoading];
	}, [kodeBarang, tglTrx]);

	useEffect(() => {
		if (promotionsDetailData && promotionsDetailDataLoading === false) {
			if (promotionsDetailData.length > 0) {
				promotionsDetailData.map((item) => {
					if (item.target === 1) {
						if (item.diskonPersen > 0) {
							setDiskonPersen1(item.diskonPersen);
						} else if (item.diskonHarga > 0) {
							let hrgJual = hargaJual.toString().split(',').join('')
							let diskonP = item.diskonHarga / hrgJual * 100;
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
	}, [promotionsDetailData, promotionsDetailDataLoading]);

	const resetvalue = () => {
		setValue({
			label: '',
			code: '',
			barcode: '',
			name: ''
		});
		setInputValue('');
		setKodeBarang('');
		setBarcode('');
		setNamaBarang('');
		setCategoryID('');

		setKts(0);
		setKtsKecil(1);
		setQtyBonus(0);

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

	//useEffect(() => {
	//	if (windowFocused) {
	//		if (
	//			scanRef.current &&
	//			!scanRef.current.onfocus 
	//		) {
	//			//scanRef.current.focus();
	//		}
	//	}
	//}, [windowFocused]);

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
					{/*setCurrentIndex((prev) => {
							if (prev >= itemsCount - 1) {
								return itemsCount - 1;
							} else {
								return prev + 1;
							}
						});*/}
				}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F1') {
				event.preventDefault();
				scanRef.current.focus();

				//scanRef.current.focus();
				//if (productCode) {
				//	add();
				//} else {
				//	scanRef.current.focus();
				//}
				// let currIndex = currentIndex + 1;
				// setCurrentIndex(currIndex);
			} else if (currentKey === 'F2') {
				setReadOnlyQty(false);
				event.preventDefault();
				changeQtyRef.current.focus();
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
					//deleteItem();
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
			} else if (currentKey === 'F5') {
				event.preventDefault();
				event.stopImmediatePropagation();
			} else if (currentKey === 'F6') {
				event.preventDefault();
				custRef.current.focus();
			} else if (currentKey === 'F7') {
				event.preventDefault();
			} else if (currentKey === 'F8') {
				event.preventDefault();
				handleClickOpen();
			} else if (currentKey === 'F9') {
				event.preventDefault();
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
				//add(scannedBarcode);
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
			// Unbind the event listener on clean upproductCode
			document.removeEventListener('keydown', handleKeyboardButon);
			window.removeEventListener('keypress', handleBarcode);
		};
	}, [
		changeQuantityDialogOpen,
		changeDescriptionDialogOpen,
		deleteItemDialogOpen,
		logoutDialogOpen,
		currentIndex,
		productCode,
	]);

	const [page, setPage] = useState(1);
	const [orderBy, setOrderBy] = useState('itemNo');
	const [order, setOrder] = useState(1);

	const [penjualanDetail, penjualanDetailLoading] = useTracker(() => {
		let subs = Meteor.subscribe('penjualandetail.list', {
			page,
			noFaktur,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = PenjualanDetailCollections.find(
			{
				noFaktur: noFaktur,
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [noFaktur, orderBy, order]);

	const [penjualanDetailCount, penjualanDetailCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('penjualandetail.countList', { noFaktur });

		let data = Counts.get('penjualandetail.countList' + noFaktur);
		return [data, !subs.ready()];
	}, [noFaktur]);

	useEffect(() => {
		setItemNum(penjualanDetailCount + 1);
	}, [penjualanDetailCount]);

	const columns = [
		{ id: 'itemNo', label: '#', minWidth: 50 },
		{ id: 'barcode', label: 'Barcode', minWidth: 120 },
		{ id: 'namaBarang', label: 'NamaBarang', minWidth: 240 },
		{
			id: 'ktsKecil',
			label: 'Qty',
			minWidth: 100,
			align: 'right',
			format: (value) => value.toFixed(0),
		},
		{
			id: 'hargaJual',
			label: 'HargaBarang',
			minWidth: 100,
			align: 'right',
			format: (value) => formatNum(value),
		},
		{
			id: 'diskonHarga1',
			label: '#Diskon',
			minWidth: 80,
			align: 'right',
			format: (value) => formatNum(value),
		},
		{
			id: 'diskonPersen1',
			label: '%Diskon',
			minWidth: 80,
			align: 'right',
			format: (value) => formatNum(value),
		},
		{
			id: 'hargaNetto',
			label: 'JumlahHarga',
			minWidth: 120,
			align: 'right',
			format: (value) => formatNum(value),
		},
	];

	const [rows, setRows] = useState([]);

	useEffect(() => {
		let baris = [];
		if (penjualanDetail && penjualanDetailLoading === false) {
			penjualanDetail.map((item, index) => {
				baris[index] = {
					...item
				};
			})
			setRows(baris);
		} else if (!penjualanDetail && penjualanDetailLoading === false) {
			baris = [];
		}

		let grandttl = 0;
		if (penjualanDetail.length > 0) {
			penjualanDetail.map((item) => {
				grandttl += item.hargaNetto;
				return grandttl;
			})
		}
		setGrandTotal(formatNum(grandttl));
	}, [penjualanDetail, penjualanDetailLoading]);

	const isDisabled = () => {
		if (addingDetail || productDataLoading) {
			return true;
		} else {
			return false;
		}
	};

	const add = () => {
		setAdding(true);
		if (
			noFaktur &&
			tglFaktur
		) {
			Meteor.call(
				'penjualan.add',
				{
					noFaktur,
					tglFaktur,
					currencyID,
					customerID,
					grandTotal,
					keterangan,
				},
				(err, res) => {
					if (err) {
						setAdding(false);
						setSeverity("error");
						setMsgTitle(err.error);
						setMsg(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setNoFaktur('');
							setTglFaktur(moment().toDate());
							setCustomerID('');
							setCurrencyID('');
							setGrandTotal(0);
							setKeterangan('');
							setAdding(false);
							setOpenSnackbar(true);
							setSeverity("success");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						} else {
							setAdding(false);
							setOpenSnackbar(true);
							setSeverity("warning");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						}
					} else {
						setAdding(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle('Kesalahan Sistem');
						setMsg('Terjadi kesalahan pada sistem, silahkan hubungi customer service');
					}
				}
			);
		} else {
			setAdding(false);
			setOpenSnackbar(true);
			setSeverity("warning");
			setMsgTitle('Kesalahan Validasi');
			setMsg('Customer, Mata Uang,  Tanggal Transaksi, Produk Wajib Diisi');
		}
	};

	const addDetail = () => {
		setAddingDetail(true);
		if (
			kodeBarang &&
			ktsKecil
		) {
			Meteor.call(
				'penjualandetail.addc',
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

					hargaJual,
				},
				(err, res) => {
					if (err) {
						setAddingDetail(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle(err.error);
						setMsg(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							resetvalue();
							setBarcode('');
							setAddingDetail(false);
							setOpenSnackbar(true);
							setSeverity("success");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						} else {
							setAddingDetail(false);
							setOpenSnackbar(true);
							setSeverity("warning");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						}
					} else {
						setAddingDetail(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle('Kesalahan Sistem');
						setMsg('Terjadi kesalahan pada sistem, silahkan hubungi customer service');
					}
				}
			);
		} else {
			setAddingDetail(false);
			setOpenSnackbar(true);
			setSeverity("warning");
			setMsgTitle('Kesalahan Validasi');
			setMsg('Kode Barang, Kuantitas dan Harga wajib diisi!');
		}
	};

	const handleClick = () => {
		//calcHarga();
		setReadOnlyQty(true);
		addDetail();
	};

	const handleClickOpen = () => {
		setOpenModal(true);
	};

	const handleClose = () => {
		setOpenModal(false);
	};

	const handleClose2 = () => {
		add();
		setOpenModal(false);
	};

	const dataPaymentMethod = ['Cash', 'Debit Card', 'Credit Card'].map(
		(item, index) => ({ label: item, value: (index + 1) })
	);

	return (
		<>
			<Container
				fluid
				className="kasir-container"
				style={{ height: '100%', margin: 0, backgroundColor: '#eceff1' }}
			>

				<Modal
					open={openModal}
					onClose={handleClose}
					size="sm"
					style={{ margintTop: 50 }}
				>
					<Modal.Header>
						<Modal.Title> Pembayaran </Modal.Title>
					</Modal.Header>
					<hr />
					<Modal.Body>
						<Form
							layout="horizontal"
						//onSubmit={() => { addDetail();}}
						//disabled={isDisabled()}
						>
							<Form.Group controlId="total" style={{ marginBottom: 0 }}>
								<Form.ControlLabel className="text-left">Total</Form.ControlLabel>
								<Form.Control
									readOnly
									name="total"
									placeholder="Grand Total"
									value={grandTotal}
									style={{ color: "#1675e0" }}
									className="text-right"
								//disabled={isDisabled()}
								/>
							</Form.Group>

							<Form.Group controlId="payment" style={{ marginBottom: 0 }}>
								<Stack
									direction="row"
									justifyContent="flex-start"
									alignItems="flex-end"
									spacing={1}
									mt={1}
									mb={1}
								>
									<Form.ControlLabel className="text-left">Pembayaran</Form.ControlLabel>
									<SelectPicker
										name="paymentMethod"
										searchable={false}
										style={{ width: 224 }}
										data={dataPaymentMethod}
										value={paymentMethod}
										onChange={(e) => {
											setPaymentMethod(e);
										}}
										onClean={() => {
											setPaymentMethod('');
										}}
									//disabled={adding}
									/>
									<Form.Control
										name="payment"
										className="text-right"
										placeholder=""
										value={payment}
										onChange={(e) => {
											e = e.toString().split(',').join('');
											const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
											if (validateNumber) {
												let paym = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
												setPayment(paym);

												let chg = e.toString().split(',').join('') - grandTotal.toString().split(',').join('');
												setChangeMoney(chg.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,'));
											}
										}}
									//disabled={isDisabled()}
									/>
								</Stack>
							</Form.Group>
							<Form.Group controlId="changeMoney" style={{ marginBottom: 0 }}>
								<Form.ControlLabel className="text-left">Kembalian</Form.ControlLabel>
								<Form.Control
									readOnly
									name="changeMoney"
									placeholder="Change Money"
									value={changeMoney}
									style={{ color: "#1675e0" }}
									className="text-right"
								//disabled={isDisabled()}
								/>
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={handleClose} appearance="subtle">
							Cancel
						</Button>
						<Button
							onClick={handleClose2}
							appearance="primary">
							Pay
						</Button>
					</Modal.Footer>
				</Modal>

				<Snackbar
					anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
					open={openSnackbar}
					onClose={() => { setOpenSnackbar(false); }}
					autoHideDuration={2000}
					key={'bottom' + 'right'}
				>
					<Alert
						onClose={() => { setOpenSnackbar(false); }}
						severity={severity}
						sx={{ width: '100%' }}
					>
						{/*<AlertTitle>{msgTitle}</AlertTitle>*/}
						{msg}
					</Alert>
				</Snackbar>

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

				<Grid
					container
					spacing={2}
					sx={{
						pt: 2,
						pb: 2,
						backgroundColor: '#eceff1',
						height: '100%',
						margin: 0,
						maxWidth: '100%',
						fontFamily: 'Roboto'
					}}
				>
					<Grid item xs={9}>
						<Card sx={{ height: '100%', display: 'flex' }}>
							<CardContent>
								<Row>
									<Col xs={6}>
										<Autocomplete
											id="searchProducts"
											size="small"
											options={optionsProd}

											value={value}
											onChange={(event, newValue) => {
												if (newValue === null) {
													resetvalue();
												} else {
													setValue(newValue);
													setKodeBarang(newValue.code);
													setKtsKecil(1);
													let jlh = ktsKecil * hargaJual;
													setHargaBruto(jlh);
												}
											}}

											inputValue={inputValue}
											onInputChange={(event, newInputValue) => {
												setInputValue(newInputValue);
											}}

											//autoHighlight
											disablePortal
											clearOnEscape
											getOptionLabel={(option) => option.label}

											renderOption={(props, option) => (
												<Box component="li" {...props}>
													[{option.barcode}] {option.name}
												</Box>
											)}

											renderInput={(params) =>
												<TextField
													{...params}
													label="Search Product Barcode / Name"
													onKeyDown={(e) => {
														let currentKey = e.key;
													}}
													inputRef={(input) => (scanRef.current = input)}
													size="small"
												/>}
										/>
										<Stack
											direction="row"
											justifyContent="flex-start"
											alignItems="flex-end"
											spacing={1}
											mt={1}
											mb={1}
										>
											<TextField
												label="Barcode"
												value={barcode ? barcode : ''}
												variant="standard"
												size="small"
												InputProps={{
													readOnly: true,
												}}
											/>
											<TextField
												label="Kode Barang"
												value={kodeBarang ? kodeBarang : ''}
												variant="standard"
												size="small"
												InputProps={{
													readOnly: true,
												}}
											/>
										</Stack>
										<Stack
											direction="row"
											justifyContent="flex-start"
											alignItems="flex-end"
											spacing={1}
											mt={1}
											mb={1}
										>
											<TextField
												label="Qty"
												value={ktsKecil}
												variant="standard"
												size="small"
												className='text-right'
												InputProps={{
													readOnly: readOnlyQty,
												}}
												onChange={(e) => {
													setKtsKecil(e.target.value);
												}}
												onKeyDown={(e) => {
													let currentKey = e.key;
												}}
												inputRef={(input) => (changeQtyRef.current = input)}
											/>
											<Button onClick={handleClick}> Add </Button>
										</Stack>
									</Col>
									<Col xs={3}>
										<TextField
											label="Harga Barang"
											value={hargaJual}
											variant="standard"
											size="small"
											className='text-right'
											InputProps={{
												readOnly: true,
											}}
										/>
										<TextField
											label="# Diskon"
											value={diskonHarga1}
											variant="standard"
											size="small"
											className='text-right'
											InputProps={{
												readOnly: true,
											}}
										/>
										<TextField
											label="% Diskon"
											value={diskonPersen1}
											variant="standard"
											size="small"
											className='text-right'
											InputProps={{
												readOnly: true,
											}}
										/>
									</Col>
									<Col xs={3}>
										{currentImage && (
											<>
												<div
													className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth"
													style={{ height: 120 }}
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
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Typography variant="h4" component="div">{kassaName}</Typography>
								<Typography variant="body2" color="text.secondary">
									<Clock format={'DD-MMMM-YYYY HH:mm:ss'} ticking={true} timezone={'Asia/Jakarta'} />
								</Typography>
								<Typography variant="body" component="div">
									{Meteor.user().username + ' '}
									{(userDataLoading === false) && (<strong>{userData.name}</strong>)}
								</Typography>
								<Typography variant="body" component="div">
									{(penjualanDataLoading === false) && ('No. ' + noFaktur)}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={9}>
						<Card>
							<CardContent>
								<TableContainer sx={{ height: 300 }}>
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
											{rows.map((row) => {
												return (
													<TableRow hover role="checkbox" tabIndex={-1} key={row.itemNo}>
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
											Keterangan:
										</p>
										<hr />
									</div>
									<div className="col-lg-4 mx-auto rounded">
										<table className="table table-borderless">
											<tbody>
												<tr>
													<td>Total :</td>
													<td className="text-right">
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
						<Card sx={{ height: '100%' }}>
							<CardContent>
								<Autocomplete
									id="searchCustomers"
									size="small"
									options={optionsCust}

									value={value2}
									onChange={(event, newValue) => {
										if (newValue === null) {
											setValue2({
												label: '',
												code: '',
												mobileNumber: '',
												name: ''
											});
											setCustomerID('');
											setCustomerName('');
											setCustomerBirth('');
											setCustomerAddress('');
											setCustomerPoin('');
										} else {
											setValue2(newValue);
											setCustomerID(newValue.code);
											setCustomerName(newValue.name);
											setCustomerBirth(newValue.tglLahir);
											setCustomerAddress(newValue.address);
											setCustomerPoin(newValue.poin);
										}
									}}

									inputValue={inputValue2}
									onInputChange={(event, newInputValue) => {
										setInputValue2(newInputValue);
									}}

									disablePortal
									clearOnEscape
									getOptionLabel={(option) => option.label}

									renderOption={(props, option) => (
										<Box component="li" {...props}>
											[{option.label}] {option.name}
										</Box>
									)}

									renderInput={(params) =>
										<TextField
											{...params}
											label="Search No HP Customer"
											onKeyDown={(e) => {
												let currentKey = e.key;
											}}
											inputRef={(input) => (custRef.current = input)}
											size="small"
										/>}
								/>
								{customerID &&
									<>
										<TextField
											label="Kode Customer"
											value={customerID ? customerID : ''}
											variant="standard"
											size="small"
											fullWidth
											InputProps={{
												readOnly: true,
											}}
											sx={{ mt: 2 }}
										/>
										<TextField
											label="Nama Customer"
											value={customerName ? customerName : ''}
											variant="standard"
											size="small"
											fullWidth
											InputProps={{
												readOnly: true,
											}}
											sx={{ mt: 2 }}
										/>
										<TextField
											label="Tempat & Tanggal Lahir"
											value={customerBirth ? customerBirth : ''}
											variant="standard"
											size="small"
											fullWidth
											InputProps={{
												readOnly: true,
											}}
											sx={{ mt: 2 }}
										/>
										<TextField
											label="Alamat Customer"
											value={customerAddress ? customerAddress : ''}
											variant="standard"
											size="small"
											fullWidth
											multiline
											maxRows={2}
											InputProps={{
												readOnly: true,
											}}
											sx={{ mt: 2 }}
										/>
										<TextField
											label="Poin"
											value={customerPoin ? customerPoin : ''}
											variant="standard"
											size="small"
											fullWidth
											InputProps={{
												readOnly: true,
											}}
											sx={{ mt: 2 }}
										/>
									</>
								}
							</CardContent>
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