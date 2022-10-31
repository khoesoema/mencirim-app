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

import { CountriesCollections } from '../../../../../db/Countries';
import { toBase64 } from '../../../../etc/tools';

import { Topbar } from '../../../template/Topbar';

export function EditNegara(props) {
	const imageRef = useRef();
	let navigate = useNavigate();
	let { _id } = useParams();

	const [countryData, countryDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('countries.getByID', { _id });
			isLoading = !subs.ready();

			data = CountriesCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [editing, setEditing] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [previousName, setPreviousName] = useState('');
	const [currentImage, setCurrentImage] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [image, setImage] = useState(null);
	const [imagePath, setImagePath] = useState('');
	const [imageBase64, setImageBase64] = useState('');

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
		if (countryData && countryDataLoading === false) {
			setPreviousName(countryData.name);
			setName(countryData.name);
			setCode(countryData.code);
			setCurrentImage(countryData.imageBase64);
		} else if (!countryData && countryDataLoading === false) {
			setPreviousName('');
			setName('');
			setCode('');
			setCurrentImage('');
			navigate('/countries');
		}
	}, [countryData, countryDataLoading]);

	const edit = async (e) => {
		setEditing(true);
		if (name && code) {
			await Meteor.call(
				'countries.edit',
				{
					_id,
					code,
					name,
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
			setDialogContent('Nama, Kode Wajib Diisi');
		}
	};

	const [selectedDeleteID, setSelectedDeleteID] = useState('');
	useEffect(() => {
		if (selectedDeleteID) {
			Meteor.call(
				'countries.delete',
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
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item
								onClick={(e) => navigate('/Negara')}
							>
								Data Negara
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Negara - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Negara - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							edit();
						}}
						disabled={editing || countryDataLoading}
					>
						<Form.Group controlId="code">
							<Form.ControlLabel>Kode Negara</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Negara"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || countryDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="name">
							<Form.ControlLabel>Nama Negara</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Negara"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || countryDataLoading}
							/>
						</Form.Group>
						
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || countryDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Negara');
									}}
									disabled={editing || countryDataLoading}
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
											'Hapus data Negara'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Negara ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Negara ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || countryDataLoading}
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
