import { Meteor } from 'meteor/meteor';

import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import MuiAlert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} {...props} />;
});

export function AddKassa() {
	let navigate = useNavigate();

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [severity, setSeverity] = useState('info');
	const [msg, setMsg] = useState('');
	const [msgTitle, setMsgTitle] = useState('');

	const [adding, setAdding] = useState(false);

	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [desc, setDesc] = useState('');

	const add = async (e) => {
		setAdding(true);
		if (name && code) {
			await Meteor.call(
				'kassa.add',
				{
					code,
					name,
					desc,
				},
				(err, res) => {
					if (err) {
						setAdding(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle(err.error);
						setMsg(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setName('');
							setCode('');
							setDesc('');
							setAdding(false);
							setOpenSnackbar(true);
							setSeverity("success");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						} else {
							setAdding(false);
							setOpenSnackbar(true);
							setSeverity("warning");
							setMsgTitle(resultTitle);
							setMsg(resultMessage);
						}
					} else {
						setAdding(false);
						setOpenSnackbar(true);
						setSeverity("error");
						setMsgTitle('Kesalahan Sistem');
						setMsg('Terjadi kesalahan pada sistem, silahkan hubungi customer service');
					}
				}
			);
		} else {
			setAdding(false);
			setOpenSnackbar(true);
			setSeverity("warning");
			setMsgTitle('Kesalahan Validasi');
			setMsg('Kode dan Nama Kassa wajib diisi!');
		}
	};

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
								Tambah Data Kassa
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Kassa</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
										navigate('/Kassa');
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
