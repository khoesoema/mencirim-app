import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import axios from '../../etc/axios';
import { endpointURL } from '../../etc/const';
export function ChangePassword(props) {
	let navigate = useNavigate();
	let dispatch = useDispatch();

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
		useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatNewPassword, setRepeatNewPassword] = useState('');
	const [changing, setChanging] = useState(false);

	const changePassword = (e) => {
		setChanging(true);
		if (currentPassword && newPassword && repeatNewPassword) {
			const options = {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				// withCredentials: true,
				data: {
					currentPassword,
					newPassword,
					repeatNewPassword,
				},
			};
			axios
				.options(endpointURL + '/users/changePassword', options)
				.then((response) => {
					let responseData = response.data;

					if (responseData) {
						let code = responseData.code;
						let message = responseData.message;
						if (code === 200) {
							let updatedData = responseData.updatedData;
							setChanging(false);
							setDialogOpen(true);
							setDialogTitle('Berhasil');
							setDialogContent(message);
							setCurrentPassword('');
							setNewPassword('');
							setRepeatNewPassword('');
							setChangePasswordDialogOpen(false);
							// usersNamespace.emit('refreshAllUsers');
							// usersNamespace.emit('refreshSingleUser', {
							// 	_id,
							// });
						} else {
							setChanging(false);
							setDialogOpen(true);
							setDialogTitle('Gagal');
							setDialogContent(message);
						}
					} else {
						setChanging(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				})
				.catch((error) => {
					console.log(error);
					setChanging(false);
					setDialogOpen(true);
					setDialogTitle('Kesalahan Sistem');
					setDialogContent(
						'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
					);
				});
		} else {
			setChanging(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent(
				'Password Lama, Password Baru dan Konfirmasi Password Baru Wajib Diisi'
			);
		}
	};

	return (
		<>
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
			<Modal
				size="lg"
				backdrop={true}
				keyboard={false}
				open={changePasswordDialogOpen}
				onClose={(e) => {
					setChangePasswordDialogOpen(false);
				}}
			>
				<Modal.Header>
					<Modal.Title>Reset Password</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form
						fluid
						onSubmit={() => {
							changePassword();
						}}
						disabled={changing}
					>
						<Form.Group controlId="currentPassword">
							<Form.ControlLabel>Password Lama</Form.ControlLabel>
							<Form.Control
								type="password"
								name="currentPassword"
								required
								placeholder="Password Lama"
								value={currentPassword}
								onChange={(e) => {
									setCurrentPassword(e);
								}}
								disabled={changing}
							/>
						</Form.Group>
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
								disabled={changing}
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
								disabled={changing}
							/>
						</Form.Group>
						<Button
							type="submit"
							appearance="primary"
							loading={changing}
						>
							Ubah Password
						</Button>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={(e) => {
							setChangePasswordDialogOpen(false);
						}}
						appearance="subtle"
					>
						Tutup
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}
