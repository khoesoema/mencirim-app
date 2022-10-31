import React, { useState } from 'react';
import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import axios from '../../../../etc/axios';
import { endpointURL } from '../../../../etc/const';

export function ResetPassword(props) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [newPassword, setNewPassword] = useState('');
	const [repeatNewPassword, setRepeatNewPassword] = useState('');
	const [reseting, setReseting] = useState(false);

	const resetPassword = (e) => {
		setReseting(true);
		if (newPassword && repeatNewPassword) {
			const options = {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// withCredentials: true,
				data: {
					_id: props._id,
					newPassword,
					repeatNewPassword,
				},
			};
			axios
				.options(endpointURL + '/users/resetPassword', options)
				.then((response) => {
					let responseData = response.data;

					if (responseData) {
						let code = responseData.code;
						let message = responseData.message;
						if (code === 200) {
							let updatedData = responseData.updatedData;
							setReseting(false);
							setDialogOpen(true);
							setDialogTitle('Berhasil');
							setDialogContent(message);
							setNewPassword('');
							setRepeatNewPassword('');
							props.closeDialog();
							// usersNamespace.emit('refreshAllUsers');
							// usersNamespace.emit('refreshSingleUser', {
							// 	_id,
							// });
						} else {
							setReseting(false);
							setDialogOpen(true);
							setDialogTitle('Gagal');
							setDialogContent(message);
						}
					} else {
						setReseting(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				})
				.catch((error) => {
					console.log(error);
					setReseting(false);
					setDialogOpen(true);
					setDialogTitle('Kesalahan Sistem');
					setDialogContent(
						'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
					);
				});
		} else {
			setReseting(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent(
				'Password Baru dan Konfirmasi Password Baru Wajib Diisi'
			);
		}
	};

	return (
		<>
			<Modal
				size="lg"
				backdrop={true}
				keyboard={false}
				open={props.dialogOpen}
				onClose={props.closeDialog}
			>
				<Modal.Header>
					<Modal.Title>Reset Password</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form
						fluid
						onSubmit={() => {
							resetPassword();
						}}
						disabled={reseting}
					>
						<Form.Group controlId="newPassword">
							<Form.ControlLabel>Password Baru</Form.ControlLabel>
							<Form.Control
								type="password"
								name="newPassword"
								required
								placeholder="Password Baru"
								value={newPassword}
								onChange={(e) => {
									setNewPassword(e);
								}}
								disabled={reseting}
							/>
						</Form.Group>
						<Form.Group controlId="repeatNewPassword">
							<Form.ControlLabel>
								Konfirmasi Password Baru
							</Form.ControlLabel>
							<Form.Control
								type="password"
								name="repeatNewPassword"
								required
								placeholder="Konfirmasi Password Baru"
								value={repeatNewPassword}
								onChange={(e) => {
									setRepeatNewPassword(e);
								}}
								disabled={reseting}
							/>
						</Form.Group>
						<Button
							type="submit"
							appearance="primary"
							loading={reseting}
						>
							Reset Password
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.closeDialog} appearance="subtle">
						Tutup
					</Button>
				</Modal.Footer>
			</Modal>
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
		</>
	);
}
