import moment from 'moment-timezone';
import 'moment/locale/id';
import React, { useState } from 'react';
import Button from 'rsuite/Button';
import Modal from 'rsuite/Modal';
import axios from '../../../../etc/axios';
import { endpointURL } from '../../../../etc/const';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function UnlockAccount(props) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const unlockAccount = () => {
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			// withCredentials: true,
			data: {
				_id: props._id,
			},
		};

		axios
			.options(endpointURL + '/users/unlockAccount', options)
			.then((response) => {
				let responseData = response.data;

				if (responseData) {
					let code = responseData.code;
					let message = responseData.message;
					if (code === 200) {
						setDialogOpen(true);
						setDialogTitle('Berhasil');
						setDialogContent(message);
						// usersNamespace.emit('refreshSingleUser', {
						// 	_id: selectedID,
						// });
						//
						// usersNamespace.emit('refreshAllUsers');
						props.closeDialog();
					} else {
						setDialogOpen(true);
						setDialogTitle('Gagal');
						setDialogContent(message);
					}
				} else {
					setDialogOpen(true);
					setDialogTitle('Kesalahan Sistem');
					setDialogContent(
						'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
					);
				}
			})
			.catch((error) => {
				console.log(error);
				setDialogOpen(true);
				setDialogTitle('Kesalahan Sistem');
				setDialogContent(
					'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
				);
			});
	};
	return (
		<>
			<Modal
				backdrop={true}
				keyboard={false}
				open={props.dialogOpen}
				onClose={props.closeDialog}
			>
				<Modal.Header>
					<Modal.Title>{props.dialogTitle}</Modal.Title>
				</Modal.Header>

				<Modal.Body>{props.dialogContent}</Modal.Body>
				<Modal.Footer>
					<Button
						onClick={(e) => {
							unlockAccount();
						}}
						appearance="primary"
					>
						Unlock
					</Button>
					<Button onClick={props.closeDialog} appearance="subtle">
						Batal
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
			</Modal>{' '}
		</>
	);
}
