import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import MenuIcon from '@rsuite/icons/Menu';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import IconButton from 'rsuite/IconButton';
import Modal from 'rsuite/Modal';
import { StocksTransactionsCollections } from '../../../../../db/Stocks';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function ViewStockIn(props) {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [invoiceData, invoiceDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('stockIn.getByID', { _id });
			isLoading = !subs.ready();
			data = StocksTransactionsCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [openDrawer, setOpenDrawer] = React.useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

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
								Data Stok Masuk
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Lihat Data Stok Masuk -{' '}
								{invoiceData &&
									invoiceData.stockData &&
									invoiceData.stockData.invoiceNumber}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>
							Lihat Data Stok Masuk -{' '}
							{invoiceData &&
								invoiceData.stockData &&
								invoiceData.stockData.invoiceNumber}
						</b>
					</h6>
					<hr />
					<div class="container">
						<div class="card">
							<div class="card-header">
								Invoice{' '}
								<strong>
									{invoiceData &&
										invoiceData.stockData &&
										invoiceData.stockData.invoiceNumber}
								</strong>
							</div>
							<div class="card-body">
								<div class="row mb-4">
									<div class="col-sm-12 mb-3">
										<b className="pull-right float-right">
											{invoiceData &&
												invoiceData.stockData &&
												moment(
													invoiceData.stockData
														.transactionDate
												).format('YYYY-MM-DD')}
										</b>
									</div>
								</div>
								<div class="table-responsive-sm">
									<table class="table table-striped">
										<thead>
											<tr>
												<th class="center">#</th>
												<th class="left strong">
													Produk
												</th>

												<th class="center">Kuantiti</th>
												<th class="center">Diterima</th>
											</tr>
										</thead>
										<tbody>
											{invoiceData &&
												invoiceData.invoiceItemData && (
													<>
														{invoiceData.invoiceItemData.map(
															(item, index) =>
																item.TII && (
																	<tr>
																		<td class="center">
																			{index +
																				1}
																		</td>
																		<td class="left strong">
																			[
																			{
																				item.productCode
																			}
																			]{' '}
																			{
																				item.productName
																			}
																		</td>

																		<td class="right">
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
																			[
																			{
																				item.uomCode
																			}
																			]{' '}
																			{
																				item.uomName
																			}
																		</td>
																		<td class="center">
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
																			[
																			{
																				item.uomCode
																			}
																			]{' '}
																			{
																				item.uomName
																			}
																		</td>
																	</tr>
																)
														)}
													</>
												)}
										</tbody>
									</table>

									<hr />
									<h6>Detil Produk diterima</h6>
									<table class="table table-striped">
										<thead>
											<tr>
												<th class="center">#</th>
												<th class="left strong">
													Produk
												</th>

												<th class="right">Gudang</th>
												<th class="center">Diterima</th>
											</tr>
										</thead>
										<tbody>
											{invoiceData &&
												invoiceData.stockLedgerData && (
													<>
														{invoiceData.stockLedgerData.map(
															(item, index) =>
																item.TSL && (
																	<tr>
																		<td class="center">
																			{index +
																				1}
																		</td>
																		<td class="left strong">
																			[
																			{
																				item.productCode
																			}
																			]{' '}
																			{
																				item.productName
																			}
																		</td>
																		<td class="right">
																			[
																			{
																				item.warehouseCode
																			}
																			]{' '}
																			{
																				item.warehouseName
																			}
																		</td>
																		<td class="center">
																			{item.TSL.quantity
																				.toString()
																				.replace(
																					'.',
																					','
																				)
																				.replace(
																					/(?<!\,.*)(\d)(?=(?:\d{3})+(?:\,|$))/g,
																					'$1.'
																				)}{' '}
																			[
																			{
																				item.uomCode
																			}
																			]{' '}
																			{
																				item.uomName
																			}
																		</td>
																	</tr>
																)
														)}
													</>
												)}
										</tbody>
									</table>
								</div>
								<div class="row">
									<div class="col-lg-4 col-sm-5"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
