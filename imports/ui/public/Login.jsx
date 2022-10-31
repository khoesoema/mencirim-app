import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';

import moment from 'moment-timezone';
import 'moment/locale/id';

import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Modal from 'rsuite/Modal';
import '../assets/css/welcome.css';
moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function LoginPage(props) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [userData, userLoading] = useTracker(() => {
		let subs = Meteor.subscribe('user', {});

		let data = Meteor.user();
		return [data, !subs.ready()];
	}, []);

	const loginNow = (e) => {
		e.preventDefault();

		if (username && password) {
			setLoading(true);
			Meteor.loginWithPassword(
				username.toLowerCase(),
				password,
				function (error) {
					if (error) {
						setLoading(false);
						setDialogOpen(true);
						setDialogTitle(error.error);
						setDialogContent(error.reason);
					} else {
						setLoading(false);
					}
				}
			);
		} else {
			setDialogOpen(true);
			setDialogTitle('Validation Failed');
			setDialogContent('Please fill username and password');
		}
	};

	return (
		<Container fluid className="welcomeMainContainer">
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
			<Row className="welcomeMainContainer">
				<Col
					xxl={9}
					xl={9}
					lg={8}
					className="welcomeImageContainer d-none d-sm-none d-md-none d-lg-block"
				></Col>
				<Col
					xxl={3}
					xl={3}
					lg={4}
					md={12}
					sm={12}
					xs={12}
					className="welcomeLoginContainer p-0 "
				>
					<Form
						className="bg-white p-5 m-0 w-100"
						onSubmit={(e) => {
							loginNow(e);
						}}
					>
						<h5>
							<b>Silahkan Masuk untuk Menggunakan Sistem</b>
						</h5>
						<hr />
						<Form.Group className="mb-3" controlId="formBasicEmail">
							<Form.Label>Username</Form.Label>
							<Form.Control
								type="text"
								placeholder="Masukkan Username Anda"
								required
								value={username}
								onChange={(e) => {
									setUsername(e.target.value);
								}}
								disabled={loading}
							/>
						</Form.Group>

						<Form.Group
							className="mb-3"
							controlId="formBasicPassword"
						>
							<Form.Label>Password</Form.Label>
							<Form.Control
								type="password"
								placeholder="Masukkan Password Anda"
								required
								value={password}
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								disabled={loading}
							/>
						</Form.Group>
						<Button
							variant="primary"
							type="submit"
							disabled={loading}
						>
							Masuk
						</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	);
}
