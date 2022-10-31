import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pagination, Table } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { ProductsCollections } from '../../../../db/Products';
import { ProductsHistoriesCollections } from '../../../../db/Products';
import { VendorsCollections } from '../../../../db/Vendors';
import { CustomersCollections } from '../../../../db/Customers';

import { Topbar } from '../../template/Topbar';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function LaporanPenjualan() {
	let navigate = useNavigate();

	const [searchText, setSearchText] = useState('');

	const [limit, setLimit] = useState(20);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('tglFaktur');
	const [order, setOrder] = useState(1);

	const [kodeBarang, setKodeBarang] = useState('');
	const [searchKodeBarangText, setSearchKodeBarangText] = useState('');

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

	const [productshistories, productshistoriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('productshistories.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = ProductsHistoriesCollections.find(
			{
				kodeBarang: searchText,
                jenis: { $in: ['Penjualan', 'Retur Penjualan']},
			},
			{
				sort: sortObject,
			}
		).fetch();

		let data2 = [];
		let jlh = 0;

		data.map((item, index) => {
			
			jlh = jlh + item.ktsKecil;

			data2[index] = {
				...item,
				jumlah: jlh,
			};

		});

		let data3 = [];

		data2.map((item, index) => {
			let dataSupplier = {};
			let codeSupp = item.supplierID;

			if (codeSupp) {
				let subs2 = Meteor.subscribe('vendors.getByCode', { code: codeSupp });
				if(subs2.ready()){
					dataSupplier = VendorsCollections.findOne({ code: codeSupp});
				}	
			}	

			data3[index] = {
				...item,
				supplierName: dataSupplier.name,
			};

		});

		let data4 = [];

		data3.map((item, index) => {
			let dataCustomer = {};
			let codeCust = item.customerID;

			if (codeCust) {
				let subs2 = Meteor.subscribe('customers.getByCode', { code: codeCust });
				if(subs2.ready()){
					dataCustomer = CustomersCollections.findOne({ code: codeCust});
				}	
			}	

			data4[index] = {
				...item,
				customerName: dataCustomer.name,
			};

		});

		return [data4, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const [productshistoriesCount, productshistoriesCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('productshistories.countList', { searchText });

		let data = Counts.get('productshistories.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(productshistoriesCount / 20));
	}, [productshistoriesCount]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent,	setDeleteConfirmationDialogContent] = useState('');
	
	const formatNum = (input, dec) => {
		if (input) {
			return parseFloat(input)
					.toFixed(dec)
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
				</Modal>{' '}
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
								Laporan Penjualan Barang
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Laporan Penjualan Barang</b>
					</h6>
					<hr />
					<SelectPicker
						placeholder="Produk"
						data={products.map((s) => ({
							label: '[' + s.kodeBarang + '] ' + s.namaBarang,
							value: s.kodeBarang,
						}))}
						style={{ minWidth: 400 }}
						value={kodeBarang}
						onSelect={( e) => {
							setKodeBarang(e);
							setSearchText(e);
						}}
						onClean={() => {
							setKodeBarang('');
							setSearchText('');
						}}
						onSearch={(e) => {
							setSearchKodeBarangText(e);
						}}
						renderMenu={renderProductsLoading}
					/>
					<hr />
					<Table responsive striped bordered hover className="tbl-prod">
						<thead>
							<tr>
								<th>#</th>
								<th>Kode Barang</th>
								<th>Nama Barang</th>
								<th>Jenis</th>
								<th>Tgl Faktur</th>
								<th>No Faktur</th>
								<th>Nama</th>
								<th>Harga Jual</th>
                                <th>Diskon</th>
                                <th>PPN</th>
                                <th>Harga Jual Net</th>
								<th>Qty</th>
                                <th>Jumlah Harga</th>
                                <th colSpan={2}>Profit</th>
							</tr>
						</thead>
						<tbody>
							{productshistoriesLoading ? (
								<tr>
									<td colSpan={20}>
										<center>
											<Loader
												size="sm"
												content="Memuat Data..."
											/>
										</center>
									</td>
								</tr>
							) : (
								<>
									{productshistories.length > 0 ? (
										<>
											{productshistories.map((item, index) => {
												return (
												<tr key={ index }>
													<td>{ (page - 1) * limit + (index + 1) }</td>
													<td>{ item.kodeBarang }</td>
													<td>{ item.namaBarang }</td>
													<td>{ item.jenis }</td>
													<td>{ moment(item.tglFaktur).format( 'YYYY-MM-DD') }</td>
													<td>{ item.noFaktur }</td>
													<td>{ item.customerName }</td>
												    <td className="text-right">{ formatNum(item.hargaJual,2) }</td>
                                                    <td className="text-right">{ formatNum(item.diskonPersen1,0) + ' %' }</td>
                                                    <td className="text-right">{ formatNum(item.ppnPersen,0) + ' %' }</td>
													{ (item.jenis === 'Penjualan') 
														? 	
															<>
																<td className="text-right">{ formatNum( (item.hargaNetto / (item.ktsKecil * -1)), 2) }</td>
																<td className="text-right">{ (item.ktsKecil * -1 ) }</td>
                                                    			<td className="text-right">{ formatNum(item.hargaNetto, 2) }</td>
																<td className="text-right">{ formatNum( (item.profitJual / item.hargaNetto * 100), 0 ) + ' %'}</td>
                                                    			<td className="text-right">{ formatNum(item.profitJual, 2) }</td>
															</> 
														: 	<>
																<td className="text-right">{ formatNum( (item.hargaNetto / item.ktsKecil), 2 ) }</td>
																<td className="text-right">{ item.ktsKecil}</td>
                                                    			<td className="text-right">{ formatNum( (item.hargaNetto * -1 ), 2 ) }</td>
																<td className="text-right">{ formatNum( (item.profitJual / item.hargaNetto * 100), 0 ) + ' %'}</td>
                                                    			<td className="text-right">{ formatNum( (item.profitJual * -1 ), 2 ) }</td>
															</>
													}
                                                    
												</tr>
												);
											})}
										</>
									) : (
										<tr>
											<td colSpan={20}>
												<center>Tidak ada data</center>
											</td>
										</tr>
									)}
								</>
							)}
						</tbody>
					</Table>
					<hr />

					<Pagination className="float-end">
						<Pagination.First
							onClick={(e) => {
								setPage(1);
							}}
						/>
						<Pagination.Prev
							onClick={(e) => {
								let nextPage = page - 1;
								if (nextPage <= 0) {
									setPage(1);
								} else {
									setPage(nextPage);
								}
							}}
						/>
						<Pagination.Item disabled>
							{page}/{maxPage}
						</Pagination.Item>
						<Pagination.Next
							onClick={(e) => {
								let nextPage = page + 1;
								if (nextPage > maxPage) {
									setPage(maxPage);
								} else {
									setPage(nextPage);
								}
							}}
						/>
						<Pagination.Last
							onClick={(e) => {
								setPage(maxPage);
							}}
						/>
					</Pagination>
				</div>
			</div>
		</>
	);
}
