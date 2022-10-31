import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

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
import { DataUsersCollections } from '../../../../../db/Userscol';

import { Topbar } from '../../../template/Topbar';

export function EditUser() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [userData, userDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('dataUser.getByID', { _id });
			isLoading = !subs.ready();

			data = DataUsersCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [previousName, setPreviousName] = useState('');
	const [username, setUsername] = useState('');
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');
	const [roleID, setRoleID] = useState('');

	const [searchRoleText, setSearchRoleText] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] = useState('');
	const [deleteConfirmationDialogContent, setDeleteConfirmationDialogContent] = useState('');
	
	useEffect(() => {
		if (userData && userDataLoading === false) {
			setPreviousName(userData.username);
			setUsername(userData.username);
			setName(userData.name);
			setPassword(userData.services.password.bcrypt);
			setRoleID(userData.roleID);
		} else if (!userData && userDataLoading === false) {
			setPreviousName('');
			setUsername('');
			setName('');
			setPassword('');
			setRoleID('');
			navigate('/Users');
		}
	}, [userData, userDataLoading]);

	const edit = async (e) => {
		setEditing(true);
		if (roleID && username) {
			await Meteor.call(
				'datauser.edit',
				{
					_id,
					username,
					name,
					roleID,
				},
				(err, res) => {
					if (err) {
						setEditing(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setEditing(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setEditing(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setEditing(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		} else {
			setEditing(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent('Username dan Role Wajib Diisi');
		}
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'datauser.delete',
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
	}, [selectedDeleteID]);

	const [role, roleLoading] = useTracker(() => {
		let subs = Meteor.subscribe('userrole.search', {
			searchText: searchRoleText,
			selectedID: roleID,
		});

		let data = UserRoleCollections.find({
			$or: [
				{
					roleid: roleID,
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
								Ubah Data User - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data User - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						layout="horizontal"
						onSubmit={() => {
							edit();
						}}
						disabled={editing || userDataLoading}
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
								disabled={editing || userDataLoading}
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
								disabled={editing || userDataLoading}
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
									disabled={editing || userDataLoading}
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
								disabled={editing || userDataLoading}
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
									loading={editing || userDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Users');
									}}
									disabled={editing || userDataLoading}
								>
									Batal
								</Button>
								<Button
									className="float-end"
									color="red"
									appearance="primary"
									onClick={(e) => {
										setSelectedID(_id);
										setDeleteConfirmationDialogOpen(true);
										setDeleteConfirmationDialogTitle(
											'Hapus data User'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data User ' +
												'[' +
												username +
												']' +
												name +
												'. Semua data yang berhubungan dengan User ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || userDataLoading}
								>
									Hapus
								</Button>
							</ButtonToolbar>
						</Form.Group>
					</Form>
				</div>
			</div>
		</>
	);
}
