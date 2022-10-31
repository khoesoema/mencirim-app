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
import SearchIcon from '@rsuite/icons/Search';
import { FaExpandAlt } from "react-icons/fa";

import { ErrorLogsCollections } from '../../../../../db/Logs';
import { Topbar } from '../../../template/Topbar';


moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function ListErrorLog() {
	let navigate = useNavigate();

	const [searchText, setSearchText] = useState('');

	const [limit, setLimit] = useState(10);

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('loggedAt');
	const [order, setOrder] = useState(-1);

	const [errorLog, errorLogLoading] = useTracker(() => {
		let subs = Meteor.subscribe('errorlog.list', {
			page,
			searchText,
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = ErrorLogsCollections.find(
			{
				module: {
					$regex: searchText,
					$options: 'i',
				},
			},
			{
				sort: sortObject,
			}
		).fetch();
		return [data, !subs.ready()];
	}, [page, searchText, orderBy, order]);

	const [errorLogCount, errorLogCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('errorlog.countList', { searchText });

		let data = Counts.get('errorlog.countList.' + searchText);
		return [data, !subs.ready()];
	}, [searchText]);

	useEffect(() => {
		setMaxPage(Math.ceil(errorLogCount / 20));
	}, [errorLogCount]);

	return (
		<>
			<Topbar />
			<div className="mainContainerRoot">
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
								Error Log
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Error Log</b>
					</h6>
					<hr />
					<Row>
						<Col></Col>
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
					<Table responsive striped bordered hover size="sm">
						<thead>
							<tr>
								<th >#</th>
								<th >
									<div
										onClick={(e) => {
											if (orderBy === 'loggedAt') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('loggedAt');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Tanggal
										{orderBy === 'loggedAt' && (
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
								<th >
									<div
										onClick={(e) => {
											if (orderBy === 'errorCode') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('errorCode');
												setOrder(1);
											}
										}}
										className="fakeCursor d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Error Code
										{orderBy === 'errorCode' && (
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
											if (orderBy === 'module') {
												if (order === -1) {
													setOrder(1);
												} else if (order === 1) {
													setOrder(-1);
												}
											} else {
												setOrderBy('module');
												setOrder(1);
											}
										}}
										className="fakeCursor  d-flex flex-row justify-content-between align-items-center flex-nowrap "
									>
										Module
										{orderBy === 'name' && (
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
								<th >Description</th>
								<th className="act"> Action</th>
							</tr>
						</thead>
						<tbody>
							{errorLogLoading ? (
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
									{errorLog.length > 0 ? (
										<>
											{errorLog.map((item, index) => (
												<tr key={index}>
													<td className="text-right">
														{(page - 1) * limit +
															(index + 1)}
													</td>
													<td className='nowrap'>
														{moment(item.loggedAt).format('YYYY-MM-DD HH:mm:ss')}
													</td>
													<td>{item.errorCode}</td>
													<td>{item.module}</td>
													<td>{item.description}</td>
													<td style={{ textAlign: "center" }}>
														<a className ="fakeLink"
															onClick={( e ) => {
																navigate('/ViewerrorLog/' + item._id);
															}}
														>
															<FaExpandAlt /> 
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
