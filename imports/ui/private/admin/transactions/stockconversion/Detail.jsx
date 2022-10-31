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
import { StocksConversionsCollections } from '../../../../../db/Stocks';
import { Sidebar } from '../../../template/Sidebar';
import { Topbar } from '../../../template/Topbar';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function ViewStockConversion(props) {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [invoiceData, invoiceDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('stockConversion.getByID', { _id });
			isLoading = !subs.ready();
			data = StocksConversionsCollections.findOne({ _id });
			console.log(data);
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
					currentmenu="stockConversion"
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
								onClick={(e) => navigate('/StockConversion')}
							>
								Data Konfersi Stok
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Lihat Data Konfersi Stok -{' '}
								{invoiceData &&
									invoiceData.invoiceData &&
									invoiceData.invoiceData.conversionNumber}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>
							Lihat Data Konfersi Stok -{' '}
							{invoiceData &&
								invoiceData.invoiceData &&
								invoiceData.invoiceData.conversionNumber}
						</b>
					</h6>
					<hr />
					<div class="container">
						<div class="card">
							<div class="card-header">
								Konversi{' '}
								<strong>
									{invoiceData &&
										invoiceData.invoiceData &&
										invoiceData.invoiceData
											.conversionNumber}
								</strong>
								<span class="float-right">
									{' '}
									<strong>Status:</strong>{' '}
									{invoiceData &&
										invoiceData.invoiceData &&
										invoiceData.invoiceData.status === 0 &&
										'Baru'}
								</span>
							</div>
							<div class="card-body">
								<div class="row mb-4">
									<div class="col-sm-12 mb-3">
										<b className="pull-right float-right">
											{invoiceData &&
												invoiceData.invoiceData &&
												moment(
													invoiceData.invoiceData
														.transactionDate
												).format('YYYY-MM-DD')}
										</b>
									</div>
								</div>
								{invoiceData && (
									<div class="row mb-4">
										<div class="col-sm-6">
											<h6 class="mb-3">Dari:</h6>
											<div>
												<strong>
													[{invoiceData.warehouseCode}
													]{' '}
													{invoiceData.warehouseName}
												</strong>
											</div>
											<div>
												Rak: [{invoiceData.rackCode}]{' '}
												{invoiceData.rackName}
											</div>
										</div>
									</div>
								)}

								<div class="table-responsive-sm">
									<table class="table table-striped">
										<thead>
											<tr>
												<th class="center">#</th>
												<th class="left strong">
													Produk
												</th>
												<th class="center">
													Kuantiti yang dikonversi
												</th>
												<th class="center">
													Kuantiti setelah Konversi
												</th>
											</tr>
										</thead>
										<tbody>
											{invoiceData &&
												invoiceData.invoiceItemData && (
													<>
														{invoiceData.invoiceItemData.map(
															(item, index) =>
																item.TSTC && (
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
																			{item.TSTC.sourceQuantity
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
																				item.sourceUomCode
																			}
																			]{' '}
																			{
																				item.sourceUomName
																			}
																		</td>
																		<td class="right">
																			{item.TSTC.destinationQuantity
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
																				item.destinationUomCode
																			}
																			]{' '}
																			{
																				item.destinationUomName
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
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
