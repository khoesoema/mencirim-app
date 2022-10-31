import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import MenuIcon from '@rsuite/icons/Menu';
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
import { BrandsCollections } from '../../../../../db/Brands';
import { toBase64 } from '../../../../etc/tools';
import { Topbar } from '../../../template/Topbar';

export function EditBrand(props) {
	const imageRef = useRef();
	let navigate = useNavigate();
	let { _id } = useParams();

	const [brandData, brandDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (_id) {
			let subs = Meteor.subscribe('brands.getByID', { _id });
			isLoading = !subs.ready();

			data = BrandsCollections.findOne({ _id });
		}
		return [data, isLoading];
	}, [_id]);

	const [openDrawer, setOpenDrawer] = React.useState(false);
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

	//run eachtime brandData / brandDataLoading changed
	useEffect(() => {
		if (brandData && brandDataLoading === false) {
			setPreviousName(brandData.name);
			setName(brandData.name);
			setCode(brandData.code);
			setCurrentImage(brandData.imageBase64);
		} else if (!brandData && brandDataLoading === false) {
			setPreviousName('');
			setCode('');
			setName('');
			setCurrentImage('');
			navigate('/Brands');
		}
	}, [brandData, brandDataLoading]);

	const edit = async (e) => {
		setEditing(true);
		if (name && code) {
			await Meteor.call(
				'brands.edit',
				{
					_id,
					code,
					name,
					imageBase64,
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
							setImageBase64('');
							imageRef.current.value = '';
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
				'brands.delete',
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

	const deleteImage = () => {
		Meteor.call(
			'brands.deleteImage',
			{
				_id,
			},
			(err, res) => {
				if (err) {
					setDialogOpen(true);
					setDialogTitle(err.error);
					setDialogContent(err.reason);
				} else if (res) {
					let resultCode = res.code;
					let resultTitle = res.title;
					let resultMessage = res.message;
					if (resultCode === 200) {
						setDialogOpen(true);
						setDialogTitle(resultTitle);
						setDialogContent(resultMessage);
					} else {
						setDialogOpen(true);
						setDialogTitle(resultTitle);
						setDialogContent(resultMessage);
					}
				} else {
					setDialogOpen(true);
					setDialogTitle('Kesalahan Sistem');
					setDialogContent(
						'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
					);
				}
			}
		);
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
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item
								onClick={(e) => navigate('/Brands')}
							>
								Data Brand
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Ubah Data Brand - {previousName}
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Ubah Data Brand - {previousName}</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							edit();
						}}
						disabled={editing || brandDataLoading}
					>
						<Form.Group controlId="name">
							<Form.ControlLabel>Nama Brand</Form.ControlLabel>
							<Form.Control
								name="name"
								required
								placeholder="Nama Brand"
								value={name}
								onChange={(e) => {
									setName(e);
								}}
								disabled={editing || brandDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>Kode Brand</Form.ControlLabel>
							<Form.Control
								name="code"
								required
								placeholder="Kode Brand"
								value={code}
								onChange={(e) => {
									setCode(e);
								}}
								disabled={editing || brandDataLoading}
							/>
						</Form.Group>
						<Form.Group controlId="code">
							<Form.ControlLabel>Gambar Brand</Form.ControlLabel>

							<BSForm.Control
								name="image"
								type="file"
								placeholder="Gambar Brand"
								inputProps={{ accept: 'image/*' }}
								onChange={async (e) => {
									setImageBase64(
										await toBase64(e.target.files[0])
									);
								}}
								ref={imageRef}
								disabled={editing || brandDataLoading}
							/>
							<Row>
								{currentImage && (
									<Col>
										<p className="mt-5">
											<b>Gambar sebelumnya</b>
										</p>
										<hr />
										<Row className="selectedImages">
											<Col
												xs={4}
												className="selectedImage"
											>
												<div className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth">
													<Button
														appearance="primary"
														color="red"
														disabled={editing}
														onClick={(e) => {
															let confirmResult =
																window.confirm(
																	'Anda akan menghapus gambar ini, apakah anda yakin?'
																);
															if (confirmResult) {
																deleteImage();
															}
														}}
													>
														Hapus
													</Button>
												</div>
												<img
													src={currentImage}
													className="img-fluid mb-5 "
													alt="Responsive image"
												></img>
											</Col>
										</Row>
									</Col>
								)}
								{imageBase64 && (
									<Col>
										<p className="mt-5">
											<b>Gambar yang dipilih</b>
										</p>
										<hr />
										<Row className="selectedImages">
											<Col
												xs={4}
												className="selectedImage"
											>
												<div className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth">
													<Button
														appearance="primary"
														color="red"
														disabled={editing}
														onClick={(e) => {
															setImageBase64('');
															imageRef.current.value =
																'';
														}}
													>
														Hapus
													</Button>
												</div>
												<img
													src={imageBase64}
													className="img-fluid mb-5 "
													alt="Responsive image"
												></img>
											</Col>
										</Row>
									</Col>
								)}
							</Row>
						</Form.Group>
						<Form.Group>
							<ButtonToolbar>
								<Button
									type="submit"
									appearance="primary"
									loading={editing || brandDataLoading}
								>
									Simpan
								</Button>
								<Button
									appearance="default"
									onClick={(e) => {
										navigate('/Brands');
									}}
									disabled={editing || brandDataLoading}
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
											'Hapus data Brand'
										);
										setDeleteConfirmationDialogContent(
											'Anda akan menghapus data Brand ' +
												'[' +
												code +
												']' +
												name +
												'. Semua data yang berhubungan dengan Brand ini juga akan dihapus. Data yang sudah dihapus, tidak dapat dikembalikan, apakah anda yakin?'
										);
									}}
									disabled={editing || brandDataLoading}
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
