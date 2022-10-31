import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import { Input, InputGroup } from 'rsuite';

import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { UserRoleCollections } from '../../../../../db/UserRole';

import { Topbar } from '../../../template/Topbar';

export function AddUser() {
	let navigate = useNavigate();

	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [username, setUsername] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [roleID, setRoleID] = useState('');
	const [status, setStatus] = useState('');

	const [searchRoleText, setSearchRoleText] = useState('');

	const add = (e) => {
		setAdding(true);
		if (username && name) {
			Meteor.call(
				'Users.add',
				{
					username,
					name,
					password,
					roleID,
				},
				(err, res) => {
					if (err) {
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setUsername('');
							setName('');
							setPassword('');
							setRoleID('');
							setAdding(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setAdding(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		} else {
			setAdding(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent('Silahkan isi Kode dan Nama Users');
		}
	};

	const [role, roleLoading] = useTracker(() => {
		let subs = Meteor.subscribe('userrole.search', {
			searchText: searchRoleText,
			selectedID: roleID,
		});

		let data = UserRoleCollections.find({
			$or: [
				{
					_id: roleID,
				},
				{
					roleid: {
						$regex: searchRoleText,
						$options: 'i',
					},
				},
				{
					roledesc: {
						$regex: searchRoleText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchRoleText, roleID]);

	const renderRoleLoading = (menu) => {
		if (roleLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

	const [visible, setVisible] = React.useState(false);

	const handleChange = () => {
	  setVisible(!visible);
	};

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
				<div className="mainContent">
					<div className="breadcrumContainer">
						<Breadcrumb separator={<ArrowRightIcon />} className="m-0" >
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item onClick={(e) => navigate('/Users')}>
								Data User
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Tambah Data User
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data User</b>
					</h6>
					<hr />
					<Form
						fluid
						layout="horizontal"
						onSubmit={() => {
							add();
						}}
						disabled={adding}
					>
						<Form.Group controlId="username">
							<Form.ControlLabel className="text-left">Username</Form.ControlLabel>
							<Form.Control
								name="username"
								required
								placeholder="Username"
								value={username}
								onChange={(e) => {
									setUsername(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="name">
							<Form.ControlLabel className="text-left">Nama</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={adding}
							/>
						</Form.Group>
						<Form.Group controlId="password">
							<Form.ControlLabel className="text-left">Password</Form.ControlLabel>
							<InputGroup inside style={{width:300}}>
    						  	<Input 
									type={visible ? 'text' : 'password'} 
									value={password}
									name="password"
									required
									placeholder="Password"
									onChange={(e) => {
										setPassword(e);
									}}
									disabled={adding}
								/>
    						  	<InputGroup.Button onClick={handleChange}>
    						    	{visible ? <EyeIcon /> : <EyeSlashIcon />}
    						  	</InputGroup.Button>
    						</InputGroup>
						</Form.Group>
						<Form.Group controlId="roleID">
							<Form.ControlLabel className="text-left">Role</Form.ControlLabel>
							<SelectPicker
								placeholder="Role"
								className="combobox"
								required
								disabled={adding}
								data={role.map((s) => ({
									label: '[' + s.roleid + '] ' + s.roledesc,
									value: s.roleid,
								}))}
								//style={{ width: '170px' }}
								value={roleID}
								onChange={(input) => {
									setRoleID(input);
								}}
								onClean={() => {
									setRoleID('');
								}}
								onSearch={(input) => {
									setSearchRoleText(input);
								}}
								renderMenu={renderRoleLoading}
							/>
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={adding}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Users');
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
