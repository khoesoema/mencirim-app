import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useEffect, useRef, useState } from 'react';
import { Col, Form as BSForm, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import { KassaCollections } from '../../../../../db/Kassa';

import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} {...props} />;
});

export function EditKassa() {
	let navigate = useNavigate();
	let { _id } = useParams();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [severity, setSeverity] = useState('info');
	const [msg, setMsg] = useState('');
	const [msgTitle, setMsgTitle] = useState('');

	const [kassaData, kassaDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('kassa.getByID', { _id });
			isLoading = !subs.ready();

			data = KassaCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [previousName, setPreviousName] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [desc, setDesc] = useState('');

	const [selectedID, setSelectedID] = useState('');
	const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] =
		useState(false);
	const [deleteConfirmationDialogTitle, setDeleteConfirmationDialogTitle] =
		useState('');
	const [
		deleteConfirmationDialogContent,
		setDeleteConfirmationDialogContent,
	] = useState('');

	useEffect(() => {
		if (kassaData && kassaDataLoading === false) {
			setPreviousName(kassaData.name);
			setName(kassaData.name);
			setCode(kassaData.code);
			setDesc(kassaData.desc);
		} else if (!kassaData && kassaDataLoading === false) {
			setPreviousName('');
			setName('');
			setCode('');
			setDesc('');
			navigate('/Kassa');
		}
	}, [kassaData, kassaDataLoading]);

	const edit = async (e) => {
		setEditing(true);
		if (name && code) {
			await Meteor.call(
				'kassa.edit',
				{
					_id,
					code,
					name,
				},
				(err, res) => {
					if (err) {
						setEditing(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle(err.error);
						setMsg(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setEditing(false);
							setOpenSnackbar(true);
							setSeverity("success");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						} else {
							setEditing(false);
							setOpenSnackbar(true);
							setSeverity("warning");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						}
					} else {
						setEditing(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle('Kesalahan Sistem');
						setMsg('Terjadi kesalahan pada sistem, silahkan hubungi customer service');
					}
				}
			);
		} else {
			setEditing(false);
			setOpenSnackbar(true);
			setSeverity("warning");
			setMsgTitle('Kesalahan Validasi');
			setMsg('Kode dan Nama Kassa wajib diisi!');
		}
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'kassa.delete',
				{
					_id: selectedDeleteID,
				},
				(err, res) => {
					if (err) {
						setSelectedID('');
						setSelectedDeleteID('');
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle(err.error);
						setMsg(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setSelectedID('');
							setSelectedDeleteID('');
							setOpenSnackbar(true);
							setSeverity("success");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						} else {
							setSelectedID('');
							setSelectedDeleteID('');
							setOpenSnackbar(true);
							setSeverity("warning");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						}
					} else {
						setSelectedID('');
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle('Kesalahan Sistem');
						setMsg('Terjadi kesalahan pada sistem, silahkan hubungi customer service');
					}
				}
			);
		}
	}, [selectedDeleteID]);

	return (
		<>
			<div className="mainContainerRoot">

				<Snackbar
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					open={openSnackbar}
					onClose={() => { setOpenSnackbar(false); }}
					autoHideDuration={3000}
					key={'top' + 'center'}
				>
					<Alert
						onClose={() => { setOpenSnackbar(false); }}
						severity={severity}
						sx={{ width: '100%' }}
					>
						<AlertTitle>{msgTitle}</AlertTitle>
						{msg}
					</Alert>
				</Snackbar>

				{selectedID && (
					<Modal
						backdrop={true}
						keyboard={false}
						open={deleteConfirmationDialogOpen}
						onClose={(e) => {
							setDeleteConfirmationDialogOpen(false);
						}}
						style={{marginTop: 35}}
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
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item
								onClick={(e) => navigate('/Kassa')}
							>
								Data Kassa
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Kassa - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Kassa - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							edit();
						}}
						disabled={editing || kassaDataLoading}
					>
						<Form.Group controlId="code">
							<Form.ControlLabel>Kode Kassa</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Kassa"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || kassaDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="name">
							<Form.ControlLabel>Nama Kassa</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Kassa"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || kassaDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="desc">
							<Form.ControlLabel>Keterangan</Form.ControlLabel>
							<Form.Control
								name="desc"
								placeholder="Keterangan"
								value={desc}
								onChange={(e) => {
									setDesc(e);
								}}
								disabled={editing || kassaDataLoading}
							/>
						</Form.Group>

						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || kassaDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Kassa');
									}}
									disabled={editing || kassaDataLoading}
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
											'Hapus data Kassa'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Kassa ' +
											'[' +
											code +
											']' +
											name +
											'. Semua data yang berhubungan dengan Kassa ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || kassaDataLoading}
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
