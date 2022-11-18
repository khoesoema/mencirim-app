import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useRef, useState } from 'react';
import { Button, FormControl, InputGroup } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { useNavigate, useParams } from 'react-router-dom';
import { Element, scroller } from 'react-scroll';
import Modal from 'rsuite/Modal';
import useWindowFocus from 'use-window-focus';
import { CashierOnGoingTransactionsCollections } from '../../../db/Cashier';

import { CategoriesCollections } from '../../../db/Categories';
import { ProductsCollections } from '../../../db/Products';
import { PromotionsDetailCollections } from '../../../db/PromotionsDetail';

import '../../assets/css/cashier.css';

class CashierClass extends React.Component {
	constructor(props) {
		super(props);
	}
}
export function Cashier(props) {
	let scannedBarcode = '';
	let navigate = useNavigate();
	const windowFocused = useWindowFocus();
	const scanRef = useRef();
	const currentRef = useRef();
	const scrollRef = useRef();
	const changeQtyRef = useRef();
	const changeDescriptionRef = useRef();
	let { warehouseID } = useParams();

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

	const [changeDescriptionDialogOpen, setChangeDescriptionDialogOpen] =
		useState(false);
	const [changeDescriptionValue, setChangeDescriptionValue] = useState('');
	const [changingDescription, setChangingDescription] = useState(false);

	const [deletingItem, setDeletingItem] = useState(false);
	const [deleteItemDialogOpen, setDeleteItemDialogOpen] = useState(false);

	const [loggingOut, setLoggingOut] = useState(false);
	const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

	const [items, itemsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('cashierOnGoingTransactions.list', {
			warehouseID,
		});

		let data = CashierOnGoingTransactionsCollections.find({
			warehouseID,
		}).fetch();
		return [data, !subs.ready()];
	}, [warehouseID]);
	const [itemsCount, itemsCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('cashierOnGoingTransactions.countList', {
			warehouseID,
		});

		let data = Counts.get(
			'cashierOnGoingTransactions.countList.' + warehouseID
		);
		return [data, !subs.ready()];
	}, [warehouseID]);

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
				scanRef.current &&
				!scanRef.current.onfocus &&
				changeQuantityDialogOpen === false &&
				changeDescriptionDialogOpen === false
			) {
				// scanRef.current.focus();
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
	+
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
				if (productCode) {
					add();
				} else {
					scanRef.current.focus();
				}
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
			// Unbind the event listener on clean upproductCode
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
					warehouseID,
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
					warehouseID,
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
					warehouseID,
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
					warehouseID,
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
	return (
		<>
			<Container
				fluid
				className="kasir-container text-primary bg-light"
				style={{ 'pointer-events': 'none', pointerEvents: 'none' }}
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
				<div className="row">
					<div className="col-lg-12 mx-auto rounded">
						<div className="table-responsive table-stripped">
							<table className="table table-fixed text-primary table-light">
								<thead>
									<tr>
										<th scope="col" className="col-1">
											#
										</th>
										<th scope="col" className="col-2">
											Kode
										</th>
										<th scope="col" className="col-2">
											Produk
										</th>
										<th
											scope="col"
											className="col-2 text-center"
										>
											Harga Barang
										</th>
										<th
											scope="col"
											className="col-1 text-center"
										>
											Qty
										</th>
										<th
											scope="col"
											className="col-1 text-center"
										>
											Satuan
										</th>
										<th
											scope="col"
											className="col-1 text-center"
										>
											Disc
										</th>
										<th
											scope="col"
											className="col-2 text-center"
										>
											Jumlah Harga
										</th>
									</tr>
								</thead>
								<tbody
									ref={scrollRef}
									id="productListContainer"
								>
									{items.map((item, index) => (
										<tr
											id={'item' + index}
											tabIndex={index}
											ref={
												currentIndex === index
													? currentRef
													: undefined
											}
											className={
												currentIndex === index
													? 'selectedRow'
													: ''
											}
											name={'myScrollToElement' + index}
											onClick={(e) => {
												setCurrentIndex(index);
											}}
										>
											<td className="col-1">
												<Element
													name={
														'myScrollToElement' +
														index
													}
												></Element>

												{index + 1}
											</td>
											<td className="col-2">
												{item.productCode}
											</td>
											<td className="col-2">
												{item.productName}
											</td>
											<td className="col-2 text-center">
												{item.productPrice
													.toString()
													.replace('.', ',')
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
											</td>
											<td className="col-1 text-center">
												{item.productQuantity
													.toString()
													.replace('.', ',')
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
											</td>
											<td className="col-1 text-center">
												{item.productUOMName}
											</td>
											<td className="col-1 text-center">
												{item.productDiscount
													.toString()
													.replace('.', ',')
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
											</td>
											<td className="col-2 text-center">
												{item.productSubTotal
													.toString()
													.replace('.', ',')
													.replace(
														/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
														'$1.'
													)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
				<div className="row"></div>
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
						<table className="table text-primary table-light">
							<tbody>
								<tr>
									<td>Sub Total :</td>
									<td className="pe-4 text-right">
										{subTotal
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</td>
								</tr>
								<tr>
									<td>Discount :</td>
									<td className="pe-4 text-right">
										{discountTotal
											.toString()
											.replace('.', ',')
											.replace(
												/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
												'$1.'
											)}
									</td>
								</tr>
								<tr>
									<td>Grand Total :</td>
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
				<input type="text" hidden></input>
				<div className="row">
					<div className="col-lg-12 mx-auto">
						<table className="table text-primary table-borderless table-light">
							<tbody className="bg-light">
								<tr>
									<td colSpan={16}>
										<InputGroup className="mb-3">
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
											<Button
												id="button-addon2"
												variant="dark"
												onClick={(e) => {}}
											>
												Cari Produk(F1)
											</Button>
										</InputGroup>
									</td>
								</tr>
								<tr>
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
			</Container>
		</>
	);
}

const top100Films = [
	{ label: 'The Shawshank Redemption', year: 1994 },
	{ label: 'The Godfather', year: 1972 },
	{ label: 'The Godfather: Part II', year: 1974 },
	{ label: 'The Dark Knight', year: 2008 },
	{ label: '12 Angry Men', year: 1957 },
	{ label: "Schindler's List", year: 1993 },
	{ label: 'Pulp Fiction', year: 1994 },
	{
	  label: 'The Lord of the Rings: The Return of the King',
	  year: 2003,
	},
	{ label: 'The Good, the Bad and the Ugly', year: 1966 },
	{ label: 'Fight Club', year: 1999 },
	{
	  label: 'The Lord of the Rings: The Fellowship of the Ring',
	  year: 2001,
	},
	{
	  label: 'Star Wars: Episode V - The Empire Strikes Back',
	  year: 1980,
	},
	{ label: 'Forrest Gump', year: 1994 },
	{ label: 'Inception', year: 2010 },
	{
	  label: 'The Lord of the Rings: The Two Towers',
	  year: 2002,
	},
	{ label: "One Flew Over the Cuckoo's Nest", year: 1975 },
	{ label: 'Goodfellas', year: 1990 },
	{ label: 'The Matrix', year: 1999 },
	{ label: 'Seven Samurai', year: 1954 },
	{
	  label: 'Star Wars: Episode IV - A New Hope',
	  year: 1977,
	},
	{ label: 'City of God', year: 2002 },
	{ label: 'Se7en', year: 1995 },
	{ label: 'The Silence of the Lambs', year: 1991 },
	{ label: "It's a Wonderful Life", year: 1946 },
	{ label: 'Life Is Beautiful', year: 1997 },
	{ label: 'The Usual Suspects', year: 1995 },
	{ label: 'Léon: The Professional', year: 1994 },
	{ label: 'Spirited Away', year: 2001 },
	{ label: 'Saving Private Ryan', year: 1998 },
	{ label: 'Once Upon a Time in the West', year: 1968 },
	{ label: 'American History X', year: 1998 },
	{ label: 'Interstellar', year: 2014 },
	{ label: 'Casablanca', year: 1942 },
	{ label: 'City Lights', year: 1931 },
	{ label: 'Psycho', year: 1960 },
	{ label: 'The Green Mile', year: 1999 },
	{ label: 'The Intouchables', year: 2011 },
	{ label: 'Modern Times', year: 1936 },
	{ label: 'Raiders of the Lost Ark', year: 1981 },
	{ label: 'Rear Window', year: 1954 },
	{ label: 'The Pianist', year: 2002 },
	{ label: 'The Departed', year: 2006 },
	{ label: 'Terminator 2: Judgment Day', year: 1991 },
	{ label: 'Back to the Future', year: 1985 },
	{ label: 'Whiplash', year: 2014 },
	{ label: 'Gladiator', year: 2000 },
	{ label: 'Memento', year: 2000 },
	{ label: 'The Prestige', year: 2006 },
	{ label: 'The Lion King', year: 1994 },
	{ label: 'Apocalypse Now', year: 1979 },
	{ label: 'Alien', year: 1979 },
	{ label: 'Sunset Boulevard', year: 1950 },
	{
	  label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
	  year: 1964,
	},
	{ label: 'The Great Dictator', year: 1940 },
	{ label: 'Cinema Paradiso', year: 1988 },
	{ label: 'The Lives of Others', year: 2006 },
	{ label: 'Grave of the Fireflies', year: 1988 },
	{ label: 'Paths of Glory', year: 1957 },
	{ label: 'Django Unchained', year: 2012 },
	{ label: 'The Shining', year: 1980 },
	{ label: 'WALL·E', year: 2008 },
	{ label: 'American Beauty', year: 1999 },
	{ label: 'The Dark Knight Rises', year: 2012 },
	{ label: 'Princess Mononoke', year: 1997 },
	{ label: 'Aliens', year: 1986 },
	{ label: 'Oldboy', year: 2003 },
	{ label: 'Once Upon a Time in America', year: 1984 },
	{ label: 'Witness for the Prosecution', year: 1957 },
	{ label: 'Das Boot', year: 1981 },
	{ label: 'Citizen Kane', year: 1941 },
	{ label: 'North by Northwest', year: 1959 },
	{ label: 'Vertigo', year: 1958 },
	{
	  label: 'Star Wars: Episode VI - Return of the Jedi',
	  year: 1983,
	},
	{ label: 'Reservoir Dogs', year: 1992 },
	{ label: 'Braveheart', year: 1995 },
	{ label: 'M', year: 1931 },
	{ label: 'Requiem for a Dream', year: 2000 },
	{ label: 'Amélie', year: 2001 },
	{ label: 'A Clockwork Orange', year: 1971 },
	{ label: 'Like Stars on Earth', year: 2007 },
	{ label: 'Taxi Driver', year: 1976 },
	{ label: 'Lawrence of Arabia', year: 1962 },
	{ label: 'Double Indemnity', year: 1944 },
	{
	  label: 'Eternal Sunshine of the Spotless Mind',
	  year: 2004,
	},
	{ label: 'Amadeus', year: 1984 },
	{ label: 'To Kill a Mockingbird', year: 1962 },
	{ label: 'Toy Story 3', year: 2010 },
	{ label: 'Logan', year: 2017 },
	{ label: 'Full Metal Jacket', year: 1987 },
	{ label: 'Dangal', year: 2016 },
	{ label: 'The Sting', year: 1973 },
	{ label: '2001: A Space Odyssey', year: 1968 },
	{ label: "Singin' in the Rain", year: 1952 },
	{ label: 'Toy Story', year: 1995 },
	{ label: 'Bicycle Thieves', year: 1948 },
	{ label: 'The Kid', year: 1921 },
	{ label: 'Inglourious Basterds', year: 2009 },
	{ label: 'Snatch', year: 2000 },
	{ label: '3 Idiots', year: 2009 },
	{ label: 'Monty Python and the Holy Grail', year: 1975 },
  ];