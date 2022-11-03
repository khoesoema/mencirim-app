import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Form from 'rsuite/Form';
import Input from 'rsuite/Input';
import DatePicker from 'rsuite/DatePicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import { ErrorLogsCollections } from '../../../../../db/Logs';
import { Topbar } from '../../../template/Topbar';

export function ViewErrorLog() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [logData, logDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('errorlog.getByID', { _id });
			isLoading = !subs.ready();

			data = ErrorLogsCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

    const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

	const [previousName, setPreviousName] = useState('');

	const [module, setModule] = useState('');
	const [errorCode, setErrorCode] = useState('');
	const [description, setDescription] = useState(0);
	const [loggedAt, setLoggedAt] = useState('');

	//run eachtime logData / logDataLoading changed
	useEffect(() => {
		if (logData && logDataLoading === false) {
			setPreviousName(moment(logData.loggedAt).format("YYYY-MM-DD") & logData.errorCode);
			setModule(logData.module);
			setErrorCode(logData.errorCode);
			setDescription(logData.description);
			setLoggedAt(logData.loggedAt);
		} else if (!logData && logDataLoading === false) {
			setPreviousName('');
			setModule('');
			setErrorCode('');
			setDescription('');
			setLoggedAt('');
			navigate('/ErrorLog');
		}
	}, [logData, logDataLoading]);

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
							<Breadcrumb.Item
								onClick={(e) => navigate('/ErrorLog')}
							>
								User Log
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								View User Log - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>View User Log - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
                        //layout="horizontal"
						//onSubmit={() => {
						//	edit();
						//}}
						//disabled={editing || productDataLoading}
					>
                        <Form.Group controlId="tanggal">
							<Form.ControlLabel>Tanggal</Form.ControlLabel>
							<Form.Control
								name="tanggal"
								placeholder="tanggal"
								value={loggedAt}
                                accepter={DatePicker}
								//onChange={(e) => {
								//	setModule(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="module">
							<Form.ControlLabel>module</Form.ControlLabel>
							<Form.Control
								name="module"
								placeholder="module"
								value={module}
								//onChange={(e) => {
								//	setModule(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
                        <Form.Group controlId="errorCode">
							<Form.ControlLabel>Module</Form.ControlLabel>
							<Form.Control
								name="errorCode"
								placeholder="errorCode"
								value={errorCode}
								//onChange={(e) => {
								//	setModule(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="description">
							<Form.ControlLabel>Description</Form.ControlLabel>
							<Form.Control
								name="description"
								placeholder="description"
								value={description}
                                rows={3}
                                accepter={Textarea}
								//onChange={(e) => {
								//	setDescription(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
					</Form>
				</div>
			</div>
		</>
	);
}
