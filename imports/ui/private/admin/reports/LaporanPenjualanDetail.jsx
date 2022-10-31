import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pagination, Table } from 'react-bootstrap';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { ProductsCollections } from '../../../../db/Products';
import { ProfitCollections } from '../../../../db/Profit';
import { VendorsCollections } from '../../../../db/Vendors';
import { CustomersCollections } from '../../../../db/Customers';

import { Topbar } from '../../template/Topbar';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function LaporanPenjualanDetail() {
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

	const [profit, profitLoading] = useTracker(() => {
		let subs = Meteor.subscribe('profit.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = ProfitCollections.find({
			$or: [
				{
					kodeBarang: {
						$regex: searchText,
						$options: 'i',
					},
				},
				{
					sort: sortObject,
				}
			]}
		).fetch();

		return [data, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const [profitCount, profitCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('profit.countList', { searchText });

		let data = Counts.get('profit.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(profitCount / 20));
	}, [profitCount]);

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
								Laporan Penjualan Barang Detail
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Laporan Penjualan Barang Detail</b>
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
								<th className="text-center">#</th>
								<th className="text-center">Kode Barang</th>
								<th className="text-center">Nama Barang</th>
								<th className="text-center">Tgl Faktur</th>
								<th className="text-center">No Faktur</th>
								<th className="text-center">Item No</th>
								<th className="text-center" colSpan={2}>Qty</th>
                                <th className="text-center">Harga Modal</th>
                                <th className="text-center">Harga Jual</th>
                                <th className="text-center" colSpan={2}>Profit</th>
								<th className="text-center">Total Profit</th>
							</tr>
						</thead>
						<tbody>
							{profitLoading ? (
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
									{profit.length > 0 ? (
										<>
											{profit.map((item, index) => {
												return (
												<tr key={ index }>
													<td>{ (page - 1) * limit + (index + 1) }</td>
													<td>{ item.kodeBarang }</td>
													<td>{ item.namaBarang }</td>
													<td>{ moment(item.tglFaktur).format( 'YYYY-MM-DD') }</td>
													<td>{ item.noFaktur }</td>
												    <td className="text-right">{ item.itemNo }</td>
													<td className="text-right">{ (item.ktsKecil) }</td>
													<td>{ (item.satuanKecil) }</td>
													<td className="text-right">{ formatNum(item.hargaModal,2) }</td>
													<td className="text-right">{ formatNum(item.hargaJual,2) }</td>
													<td className="text-right">{ formatNum((item.profitJual/item.ktsKecil)/item.hargaModal*100,0) + ' %'}</td>
													<td className="text-right">{ formatNum(item.profitJual/item.ktsKecil,2) }</td>
													<td className="text-right">{ formatNum(item.profitJual,2) }</td>
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
