import React, { useEffect, useState } from 'react';
import { Accordion, Col, Row } from 'react-bootstrap';
import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import Toggle from 'rsuite/Toggle';
import axios from '../../../../etc/axios';
import {
    endpointURL,
    userAllPermission,
    userPermission
} from '../../../../etc/const';

export function SetPermission(props) {

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [permission, setPermission] = useState(userPermission);
	const [setting, setSetting] = useState(false);

	useEffect(() => {
		setPermission(props.permission);
	}, [props.permission]);

	const submitPermission = (e) => {
		setSetting(true);
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			// withCredentials: true,
			data: {
				_id: props._id,
				permission,
			},
		};
		axios
			.options(endpointURL + '/users/setPermission', options)
			.then((response) => {
				let responseData = response.data;

				if (responseData) {
					let code = responseData.code;
					let message = responseData.message;
					if (code === 200) {
						let updatedData = responseData.updatedData;
						setSetting(false);
						setDialogOpen(true);
						setDialogTitle('Berhasil');
						setDialogContent(message);
						props.closeDialog();
					} else {
						setSetting(false);
						setDialogOpen(true);
						setDialogTitle('Gagal');
						setDialogContent(message);
					}
				} else {
					setSetting(false);
					setDialogOpen(true);
					setDialogTitle('Kesalahan Sistem');
					setDialogContent(
						'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
					);
				}
			})
			.catch((error) => {
				console.log(error);
				setSetting(false);
				setDialogOpen(true);
				setDialogTitle('Kesalahan Sistem');
				setDialogContent(
					'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
				);
			});
	};
	const toggleAllPermission = (e) => {
		if (e === false) {
			setPermission(userPermission);
		} else {
			setPermission(userAllPermission);
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
					<Modal.Title>Ubah Akses</Modal.Title>
				</Modal.Header>

				<Modal.Body>
					<Form
						fluid
						onSubmit={() => {
							submitPermission();
						}}
						disabled={setting}
					>
						<Form.Group controlId="status">
							<Form.ControlLabel>
								Berikan Semua Akses
							</Form.ControlLabel>
							<Toggle
								size="lg"
								checked={
									permission === userAllPermission
										? true
										: false
								}
								onChange={toggleAllPermission}
								checkedChildren="Ijinkan"
								unCheckedChildren="Blokir"
								disabled={setting}
							/>
						</Form.Group>
						<Accordion>
							<Accordion.Item eventKey="currencyPermission">
								<Accordion.Header>Mata Uang</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.currency
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.currency,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.currency =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.currency
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.currency,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.currency =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.currency
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.currency,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.currency =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.currency
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.currency,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.currency =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="taxCodePermission">
								<Accordion.Header>Kode Pajak</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.taxCode
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.taxCode,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.taxCode =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.taxCode
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.taxCode,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.taxCode =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.taxCode
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.taxCode,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.taxCode =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.taxCode
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.taxCode,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.taxCode =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="accountPermission">
								<Accordion.Header>
									Nomor Perkiraan GL
								</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.account
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.account,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.account =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.account
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.account,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.account =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.account
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.account,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.account =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.account
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.account,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.account =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="businessTypePermission">
								<Accordion.Header>Tipe Bisnis</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.businessType
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.businessType,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.businessType =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.businessType
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.businessType,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.businessType =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.businessType
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.businessType,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.businessType =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.businessType
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.businessType,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.businessType =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="companyPermission">
								<Accordion.Header>Perusahaan</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.company
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.company,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.company =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.company
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.company,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.company =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.company
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.company,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.company =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.company
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.company,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.company =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="locationPermission">
								<Accordion.Header>Lokasi</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.location
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.location,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.location =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.location
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.location,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.location =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.location
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.location,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.location =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.location
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.location,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.location =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="warehousePermission">
								<Accordion.Header>Gudang</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.warehouse
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.warehouse,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.warehouse =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.warehouse
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.warehouse,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.warehouse =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.warehouse
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.warehouse,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.warehouse =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.warehouse
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.warehouse,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.warehouse =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="rackPermission">
								<Accordion.Header>Rak</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.rack.read ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.rack,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.rack =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.rack.add ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.rack,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.rack =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.rack.edit ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.rack,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.rack =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.rack
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.rack,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.rack =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="customerPermission">
								<Accordion.Header>Pelanggan</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.customer
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.customer,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.customer =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.customer
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.customer,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.customer =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.customer
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.customer,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.customer =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.customer
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.customer,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.customer =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="vendorPermission">
								<Accordion.Header>Vendor</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.vendor
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.vendor,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.vendor =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.vendor
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.vendor,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.vendor =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.vendor
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.vendor,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.vendor =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.vendor
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.vendor,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.vendor =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="brandPermission">
								<Accordion.Header>Brand</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.brand
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.brand,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.brand =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.brand.add ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.brand,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.brand =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.brand
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.brand,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.brand =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.brand
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.brand,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.brand =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="categoryPermission">
								<Accordion.Header>Kategori</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.category
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.category,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.category =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.category
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.category,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.category =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.category
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.category,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.category =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.category
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.category,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.category =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="productPermission">
								<Accordion.Header>Produk</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.product
															.read === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.product,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.product =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.product
															.add === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.product,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.product =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.product
															.edit === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.product,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.product =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.product
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.product,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.product =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="userPermission">
								<Accordion.Header>User</Accordion.Header>
								<Accordion.Body>
									<Row>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Lihat
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user.read ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.read = 0;
														} else {
															currCurrenyPermission.read = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											{' '}
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Tambah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user.add ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.add = 0;
														} else {
															currCurrenyPermission.add = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user.edit ===
														1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.edit = 0;
														} else {
															currCurrenyPermission.edit = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Hapus
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user
															.delete === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.delete = 0;
														} else {
															currCurrenyPermission.delete = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>

										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Unlock
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user
															.unlock === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.unlock = 0;
														} else {
															currCurrenyPermission.unlock = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>

										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Reset Password
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user
															.resetPassword === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.resetPassword = 0;
														} else {
															currCurrenyPermission.resetPassword = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>

										<Col xs="3">
											<Form.Group controlId="status">
												<Form.ControlLabel>
													Ubah Akses
												</Form.ControlLabel>
												<Toggle
													size="lg"
													checked={
														permission.user
															.setPermission === 1
															? true
															: false
													}
													onChange={(e) => {
														let currPermission = {
															...permission,
														};
														let currCurrenyPermission =
															{
																...currPermission.user,
															};
														if (e === false) {
															currCurrenyPermission.setPermission = 0;
														} else {
															currCurrenyPermission.setPermission = 1;
														}
														currPermission.user =
															currCurrenyPermission;
														setPermission(
															currPermission
														);
													}}
													checkedChildren="Ijinkan"
													unCheckedChildren="Blokir"
													disabled={setting}
												/>
											</Form.Group>
										</Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
						<br />
						<br />

						<Button
							type="submit"
							appearance="primary"
							loading={setting}
						>
							Ubah Akses
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
