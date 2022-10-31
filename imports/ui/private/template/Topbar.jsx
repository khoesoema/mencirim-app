import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import Button from 'rsuite/Button';

import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';

import { faKey } from '@fortawesome/free-solid-svg-icons/faKey';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons/faSignOutAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaSignOutAlt, FaHive, FaCog } from 'react-icons/fa';

import Sidebar from './Sidebar';

export function Topbar() {
	const [open, setOpen] = React.useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [changePasswordDialogOpen, setChangePasswordDialogOpen] =
		useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [repeatNewPassword, setRepeatNewPassword] = useState('');
	const [changing, setChanging] = useState(false);

	const logoutNow = (e) => {
		Meteor.logout();
	};
	const changePassword = (e) => {
		setChanging(true);
		if (newPassword && confirmNewPassword) {
			setChanging(true);
			Meteor.call(
				'system.selfResetPassword',
				{
					userID: _id,
					newPassword,
					confirmNewPassword,
				},
				(err, res) => {
					if (err) {
						setStartChangePassword(false);
						setChanging(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setStartChangePassword(false);
							setChanging(false);
							setSiteChangePasswordModal(false);
							setNewPassword('');
							setConfirmNewPassword('');
							setChanging(false);
							setDialogOpen(true);
							setDialogTitle('Success');
							setDialogContent('Password Changed.');
						} else {
							setStartChangePassword(false);
							setChanging(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setStartChangePassword(false);
						setChanging(false);
						setDialogOpen(true);
						setDialogTitle('Unexpected Error');
						setDialogContent(
							'Unexpected Error Occured, please contact your customer service'
						);
					}
				}
			);
		} else {
			setStartChangePassword(false);
			setDialogOpen(true);
			setDialogTitle('Validation Failed');
			setDialogContent('Please fill all field');
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

			<Sidebar
				currentmenu="dashboard"
				opendrawer={open}
				closedrawer={() => { setOpen(false);}}
			/>

			<Navbar expand="lg" bg="dark" variant="dark" fixed="top">
			<Container fluid>
				<Nav.Link 
					onClick={() => { setOpen(true); }} 
					><FaHive className="iconmenu"/></Nav.Link>
  				<Navbar.Brand className="homemenu" href="/">Mantap Agung Sejati</Navbar.Brand>
  				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
  				<Navbar.Collapse id="responsive-navbar-nav">
  				  <Nav className="me-auto">
  				  </Nav>
  				  <Nav>
					<NavDropdown title="Settings" id="collasible-nav-dropdown">
  				      <NavDropdown.Item 
						onClick={(e) => {
							setChangePasswordDialogOpen(true);
						}}>Change Password</NavDropdown.Item>
  				      {/*<NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
  				      <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
  				      <NavDropdown.Divider />
					<NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>*/}
  				    </NavDropdown>
  				    <Nav.Link onClick={(e) => { logoutNow(e); }}><FaSignOutAlt /> Sign Out</Nav.Link>
  				  </Nav>
  				</Navbar.Collapse>
  			</Container>
			</Navbar>
		</>
	);
}
