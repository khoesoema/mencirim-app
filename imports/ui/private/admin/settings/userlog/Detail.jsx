import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Form from 'rsuite/Form';
import Input from 'rsuite/Input';
import DatePicker from 'rsuite/DatePicker';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import { LogsCollections } from '../../../../../db/Logs';
import { Topbar } from '../../../template/Topbar';

export function ViewUserLog() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [logData, logDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('userlog.getByID', { _id });
			isLoading = !subs.ready();

			data = LogsCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	//const [editing, setEditing] = useState(false);
	//const [dialogOpen, setDialogOpen] = useState(false);
	//const [dialogTitle, setDialogTitle] = useState('');
	//const [dialogContent, setDialogContent] = useState('');

    const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

	const [previousName, setPreviousName] = useState('');

	const [username, setUsername] = useState('');
    const [ipAddress, setIPAddress] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState(0);
	const [createdAt, setCreatedAt] = useState('');

	//const [selectedID, setSelectedID] = useState('');
	//const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	//const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	//const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent ] = useState('');

	//run eachtime logData / logDataLoading changed
	useEffect(() => {
		if (logData && logDataLoading === false) {
			setPreviousName(logData.title);
            setIPAddress(logData.ipAddress);
			setUsername(logData.username);
			setTitle(logData.title);
			setDescription(logData.description);
			setCreatedAt(logData.createdAt);
		} else if (!logData && logDataLoading === false) {
			setPreviousName('');
            setIPAddress('');
			setUsername('');
			setTitle('');
			setDescription('');
			setCreatedAt('');
			navigate('/UserLog');
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
								onClick={(e) => navigate('/UserLog')}
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
								value={createdAt}
                                accepter={DatePicker}
								//onChange={(e) => {
								//	setUsername(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
                        <Form.Group controlId="ipaddr">
							<Form.ControlLabel>IP Address</Form.ControlLabel>
							<Form.Control
								name="ipaddr"
								placeholder="IP Address"
								value={ipAddress}
								//onChange={(e) => {
								//	setUsername(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="username">
							<Form.ControlLabel>Username</Form.ControlLabel>
							<Form.Control
								name="username"
								placeholder="username"
								value={username}
								//onChange={(e) => {
								//	setUsername(e);
								//}}
								//disabled={editing || productDataLoading}
							/>
						</Form.Group>
                        <Form.Group controlId="title">
							<Form.ControlLabel>Module</Form.ControlLabel>
							<Form.Control
								name="title"
								placeholder="title"
								value={title}
								//onChange={(e) => {
								//	setUsername(e);
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
