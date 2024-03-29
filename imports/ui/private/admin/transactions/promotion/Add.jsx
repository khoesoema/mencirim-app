import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { Table } from 'react-bootstrap';

import DatePicker from 'rsuite/DatePicker';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import Input from 'rsuite/Input';
import IconButton from 'rsuite/IconButton';
import Radio from 'rsuite/Radio';
import RadioGroup from 'rsuite/RadioGroup';
import Divider from 'rsuite/Divider';
import Message from 'rsuite/Message';
import { useToaster } from 'rsuite';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import PlusIcon from '@rsuite/icons/Plus';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import { PromotionsDetailCollections } from '../../../../../db/PromotionsDetail';

import { Topbar } from '../../../template/Topbar';

import DetailPurchase from './components/DetailPurchase';
import EditDetailPurchase from './components/EditDetailPurchase';

import '../../../../../ui/assets/css/addpurchase.css';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function AddPromotion(props) {

	let navigate = useNavigate();

	const [adding, setAdding] = useState(false);

	const [updateDetail, setUpdateDetail] = useState(false);

	const toaster = useToaster();
	const [placement, setPlacement] = useState('topCenter');

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');
	const [selectedDeleteID, setSelectedDeleteID] = useState('');

	const [promoNo, setPromoNo] = useState('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [target, setTarget] = useState(1);
	const [keterangan, setKeterangan] = useState('');

	const [itemNo, setItemNo] = useState(0);

	const [open, setOpen] = React.useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	
	const [page, setPage] = useState(1);
	const [orderBy, setOrderBy] = useState('itemNo');
	const [order, setOrder] = useState(1);

	const [promotionsDetailCount, promotionsDetailCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('promotionsdetail.countList', { promoNo });

		let data = Counts.get('promotionsdetail.countList.' + promoNo);
		return [data, !subs.ready()];
	}, [promoNo]);

	const [promotionsDetail, promotionsDetailLoading] = useTracker(() => {
		let subs = Meteor.subscribe('promotionsdetail.list', {
			page,
			promoNo,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = PromotionsDetailCollections.find(
			{
				promoNo: promoNo,
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [promoNo, orderBy, order]);

	const formatNum = (input, dec) => {
		if (input) {
			return parseFloat(input)
					.toFixed(dec)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	useEffect(() => {
		setItemNo(promotionsDetailCount + 1);

		if (selectedDeleteID) {
			Meteor.call(
				'promotionsdetail.delete',
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

	}, [promotionsDetail, promotionsDetailCount, selectedDeleteID]);

	const resetvalue = () => {
		setPromoNo('');
		setStartDate(new Date());
		setEndDate(new Date());
		setTarget('');
		setKeterangan('');	
	} 

	const add = () => {
		setAdding(true);
		if ( promoNo ) {
			Meteor.call(
				'promotions.add',
				{
					promoNo,
					startDate,
					endDate,
					target,
					keterangan,
				},
				(err, res) => {
					if (err) {
						setAdding(false);
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
							resetvalue();
							setAdding(false);
							let type = 'success';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						} else {
							setAdding(false);
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
						setAdding(false);
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
			setAdding(false);
			let type = 'error';
			let title = 'Kesalahan Sistem';
			let desc = 'Nomor Promosi wajib diisi';
			toaster.push(
				<Message showIcon type={type} header={title}>
					{desc}
				  </Message>
				,{placement})
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
				</Modal>
				
				{updateDetail === false
				 	?	<DetailPurchase 
							open={open} 
							handleClose={() => handleClose()}
							itemNo={itemNo}
							promoNo={promoNo}
						/>
					:	<EditDetailPurchase 
							open={open} 
							handleClose={() => handleClose()}
							promoNo={promoNo}
							selectedID={selectedID}
						/>
				}	

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
								onClick={(e) => navigate('/Promotions')}
							>
								Transaksi Promosi Barang
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Input Transaksi Promosi Barang
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Input Transaksi Promosi Barang</b>
					</h6>
					<hr />
					<Form
						onSubmit={() => {
							add();
						}}
						disabled={adding}
						layout="horizontal"
					>
						<Form.Group controlId="promoNo" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left"> 
								Nomor Promosi
							</Form.ControlLabel>
							<Form.Control
								name="promoNo"
								placeholder="Nomor Promosi"
								value={promoNo}
								onChange={(e) => {
									setPromoNo(e);
								}}
								disabled={adding}
							/>
							<Form.HelpText tooltip>Akan otomatis digenerate oleh sistem jika kosong</Form.HelpText>
						</Form.Group>
						<Form.Group controlId="startDate" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">
								Tanggal Mulai
							</Form.ControlLabel>
							<Form.Control 
								name="startDate" 
								accepter={DatePicker} 
								value={startDate}
								onChange={(e) => {
									setStartDate(e);
								}}
								disabled={adding}
								/>
						</Form.Group>
						<Form.Group controlId="endDate" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">
								Tanggal Berakhir
							</Form.ControlLabel>
							<Form.Control 
								name="endDate" 
								accepter={DatePicker} 
								value={endDate}
								onChange={(e) => {
									setEndDate(e);
								}}
								disabled={adding}
								/>
						</Form.Group>
						<Form.Group controlId="target" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">
								Target Konsumen
							</Form.ControlLabel>
  						  	<RadioGroup name="target" inline value={target} onChange={(e)=> setTarget(e)}>
  						    	<Radio value={1}>Semua</Radio>
  						    	<Radio value={2}>Member</Radio>
  						    	<Radio value={3}>Umum</Radio>
  						  	</RadioGroup>
  						</Form.Group>
						<Form.Group controlId="selectedProducts" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left" >Tambah Item </Form.ControlLabel>
							<IconButton 
								color="blue" appearance="primary"
								icon={<PlusIcon />} 
								onClick={(e) => {
									if(promoNo ===''){
										setDialogOpen(true);
										setDialogTitle('Kesalahan Sistem');
										setDialogContent('Nomor Promosi belum diisi!');
									} else {
										setUpdateDetail(false);
										handleOpen(e);
									}
								}}
							>Add New</IconButton>
							
							<Table responsive striped bordered hover style={{ fontSize: "12px", marginBottom: 10, marginTop: 10}}>
								<thead>
									<tr>
										<th>#</th>
										<th>Kode Barang</th>
										<th>Nama Barang</th>
										<th className="text-center">% Diskon</th>
										<th className="text-center"># Diskon</th>
										<th className="text-center">Action</th>
									</tr>
								</thead>
								<tbody>
									{promotionsDetailLoading ? (
										<tr>
											<td colSpan={6}>
												<center>
													<Loader
														size="sm"
														content="Loading Data..."
													/>
												</center>
											</td>
										</tr>
									) : (
										<>
											{promotionsDetail.length > 0 ? (
												<>
													{promotionsDetail.map((item, index) => (
														<tr key={index}>
															<td>{item.itemNo}</td>
															<td>{item.kodeBarang}</td>
															<td>{item.namaBarang}</td>
															<td className="text-right">{ formatNum(item.diskonPersen,2)}</td>
															<td className="text-right">{ formatNum(item.diskonHarga,2)}</td>
															<td style={{ textAlign: "center" }}>
																<a 	className ="fakeLink"
																	onClick={(e) => {
																		setSelectedID( item._id );
																		setUpdateDetail(true);
																		handleOpen(e);
																	}}
																	>
																	<FaPencilAlt /> 
																</a>
																<Divider vertical/>
																<a 	className ="fakeLink"
																	style={{color: "red"}}
																	onClick={() => {
																		setSelectedID( item._id );
																		setDeleteConfirmationDialogOpen( true);
																		setDeleteConfirmationDialogTitle( 'Hapus data Promosi Barang Detail');
																		setDeleteConfirmationDialogContent(
																			'Anda akan menghapus data Promosi Barang Detail ' +
																				'[' +
																				item.kodeBarang +
																				']' +
																				item.namaBarang +
																				'. Semua data yang berhubungan dengan Promosi Barang Detail ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
																		);
																	}}
																	>
																	<FaTrashAlt />
																</a>
															</td>
														</tr>
													))}
												</>
											) : (
												<tr>
													<td colSpan={6}>
														<center>Tidak ada data</center>
													</td>
												</tr>
											)}
										</>
									)}
								</tbody>
							</Table>
						</Form.Group>
						<Form.Group controlId="keterangan" style={{ marginBottom: 10}}>
							<Form.ControlLabel className="text-left">Keterangan</Form.ControlLabel>
							<Input
								as="textarea"
								rows={3}
								name="keterangan"
								placeholder="Keterangan"
								style={{width: 400}}
								value={keterangan}
								onChange={(e) => {
									setKeterangan(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									disabled={adding}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Promotions');
									}}
									disabled={adding}
								>
									Batal
								</Button>
							</ButtonToolbar>
						</Form.Group>	
					</Form>
				</div>
			</div>
		</>
	);
}
