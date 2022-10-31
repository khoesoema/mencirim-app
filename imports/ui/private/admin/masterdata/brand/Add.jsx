import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import MenuIcon from '@rsuite/icons/Menu';
import React, { useRef, useState } from 'react';
import { Col, Form as BSForm, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from 'rsuite/Breadcrumb';
import Button from 'rsuite/Button';
import ButtonToolbar from 'rsuite/ButtonToolbar';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import { toBase64 } from '../../../../etc/tools';
import { Topbar } from '../../../template/Topbar';

export function AddBrand(props) {
	const imageRef = useRef();
	let navigate = useNavigate();
	const [adding, setAdding] = useState(false);

	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');
	const [name, setName] = useState('');
	const [code, setCode] = useState('');
	const [image, setImage] = useState(null);
	const [imageBase64, setImageBase64] = useState('');

	const add = async (e) => {
		setAdding(true);
		if (name && code) {
			await Meteor.call(
				'brands.add',
				{
					code,
					name,
					imageBase64,
				},
				(err, res) => {
					if (err) {
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle(err.error);
						setDialogContent(err.reason);
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							setName('');
							setCode('');
							setImageBase64('');
							imageRef.current.value = '';
							setAdding(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						} else {
							setAdding(false);
							setDialogOpen(true);
							setDialogTitle(resultTitle);
							setDialogContent(resultMessage);
						}
					} else {
						setAdding(false);
						setDialogOpen(true);
						setDialogTitle('Kesalahan Sistem');
						setDialogContent(
							'Terjadi kesalahan pada sistem, silahkan hubungi customer service'
						);
					}
				}
			);
		} else {
			setAdding(false);
			setDialogOpen(true);
			setDialogTitle('Kesalahan Validasi');
			setDialogContent('Nama, Kode Wajib Diisi');
		}
	};

	return (
		<>
			<Topbar />
			<div className="mainContainerRoot">
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
								Tambah Data Brand
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Tambah Data Brand</b>
					</h6>
					<hr />
					<Form
						fluid
						onSubmit={() => {
							add();
						}}
						disabled={adding}
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
								disabled={adding}
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
								disabled={adding}
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
										navigate('/Brands');
									}}
									disabled={adding}
								>
									Batal
								</Button>
							</ButtonToolbar>
						</Form.Group>
						{imageBase64 && (
							<>
								<p className="mt-5">
									<b>Gambar yang dipilih</b>
								</p>
								<hr />
								<Row className="selectedImages">
									<Col xs={4} className="selectedImage">
										<div className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth">
											<Button
												appearance="primary"
												color="red"
												disabled={adding}
												onClick={(e) => {
													setImageBase64('');
													imageRef.current.value = '';
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
							</>
						)}
					</Form>
				</div>
			</div>
		</>
	);
}
