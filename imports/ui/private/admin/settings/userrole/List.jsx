import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { Pagination, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import Dropdown from 'rsuite/Dropdown';
import Input from 'rsuite/Input';
import InputGroup from 'rsuite/InputGroup';
import Loader from 'rsuite/Loader';
import Modal from 'rsuite/Modal';
import IconButton from 'rsuite/IconButton';
import Divider from 'rsuite/Divider';

import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons/faChevronCircleDown';
import { faChevronCircleUp } from '@fortawesome/free-solid-svg-icons/faChevronCircleUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import PlusIcon from '@rsuite/icons/Plus';
import SearchIcon from '@rsuite/icons/Search';
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

import { UserRoleCollections } from '../../../../../db/UserRole';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function ListUserRole(props) {
	let navigate = useNavigate();

	const [searchText, setSearchText] = useState('');

	const [limit, setLimit] = useState(10);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('name');
	const [order, setOrder] = useState(1);

	const [userRole, userRoleLoading] = useTracker(() => {
		let subs = Meteor.subscribe('userrole.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = UserRoleCollections.find(
			{
				$or: [
					{
						roleid: {
							$regex: searchText,
							$options: 'i',
						},
					},
					{
						roledesc: {
							$regex: searchText,
							$options: 'i',
						},
					},
				],
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const [userRoleCount, userRoleCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('userrole.countList', { searchText });

		let data = Counts.get('userrole.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(userRoleCount / 20));
	}, [userRoleCount]);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
		useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] =
		useState('');
	const [
		deleteConfirmationDialogContent,
		setDeleteConfirmationDialogContent,
	] = useState('');

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'userrole.delete',
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
						let resultroleid = res.roleid;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultroleid === 200) {
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
	}, [selectedDeleteID]);
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
								color="red"
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
								Data User Role
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Data User Role</b>
					</h6>
					<hr />
					<Row>
						<Col>
							<IconButton 
								color="blue" appearance="primary"
								icon={<PlusIcon />} 
								onClick={(e) => {navigate('/AddUserRole');}}
							>Add New</IconButton>
						</Col>
						<Col>
						<InputGroup inside>
							<Input
								type="text"
								placeholder="Cari Data"
								style={{width:300}}
								value={searchText}
								onChange={(e) => {
									setSearchText(e);
								}}
							/>
							<InputGroup.Addon>
        						<SearchIcon />
      						</InputGroup.Addon>
						</InputGroup>
						</Col>
					</Row>
					<hr />
					<Table responsive striped bordered hover>
						<thead>
							<tr>
								<th className="nomor">#</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'roleid') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('roleid');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Role ID
										{orderBy === 'roleid' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th>
									<div
										onClick={(e) => {
											if (orderBy === 'roledesc') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('roledesc');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Role Description
										{orderBy === 'roledesc' && (
											<>
												{order === 1 ? (
													<FontAwesomeIcon
														icon={faChevronCircleUp}
													/>
												) : (
													order === -1 && (
														<FontAwesomeIcon
															icon={
																faChevronCircleDown
															}
														/>
													)
												)}
											</>
										)}
									</div>
								</th>
								<th className="action">Action</th>
							</tr>
						</thead>
						<tbody>
							{userRoleLoading ? (
								<tr>
									<td colSpan={10}>
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
									{userRole.length > 0 ? (
										<>
											{userRole.map((item, index) => (
												<tr key={index}>
													<td>
														{(page - 1) * limit +
															(index + 1)}
													</td>
													<td>{item.roleid}</td>
													<td>{item.roledesc}</td>
													<td style={{ textAlign: "center" }}>
														<a className ="fakeLink"
															onClick={( e ) => {
																navigate('/EditUserRole/' + item._id);
															}}
														>
															<FaPencilAlt /> 
														</a>
														<Divider vertical />
														<a className ="fakeLink"
																onClick={(
																	e
																) => {
																	setSelectedID(
																		item._id
																	);
																	setDeleteConfirmationDialogOpen(
																		true
																	);
																	setDeleteConfirmationDialogTitle(
																		'Hapus data User Role'
																	);
																	setDeleteConfirmationDialogContent(
																		'Anda akan menghapus data User Role ' +
																			'[' +
																			item.roleid +
																			'] ' +
																			item.roledesc +
																			'. Semua data yang berhubungan dengan User Role ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
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
											<td colSpan={10}>
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
