import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import React, { useEffect, useState } from 'react';

import { Col, Row } from 'react-bootstrap';

import Button from 'rsuite/Button';
import Form from 'rsuite/Form';
import Modal from 'rsuite/Modal';
import SelectPicker from 'rsuite/SelectPicker';
import InputPicker from 'rsuite/InputPicker';
import InputGroup from 'rsuite/InputGroup';
import Input from 'rsuite/Input';
import Message from 'rsuite/Message';
import { useToaster } from 'rsuite';

import SpinnerIcon from '@rsuite/icons/legacy/Spinner';

import { CategoriesCollections } from '../../../../../../db/Categories';
import { ProductsCollections } from '../../../../../../db/Products';
import { VendorsCollections } from '../../../../../../db/Vendors';
 
const DetailPurchase = (props) => { 
	
    //const [open, setOpen] = React.u	seState(props.open);
    const [overflow, setOverflow] = React.useState(true);

    //const handleClose = () => setOpen(false);

	const [addingDetail, setAddingDetail] = useState(false);
	const [editingDetail, setEditingDetail] = useState(false);

	const promoNo = props.promoNo;
    // supplier = props.vendorID;
    const [tglLastTrx, setTglLastTrx] = useState(new Date());

	const itemNo = props.itemNo;

	useEffect(()=>{
		setItemNum(itemNo);
	},[itemNo]);

	const [itemNum, setItemNum] = useState(0);
	const [kodeBarang, setKodeBarang] = useState('');
	const [barcode, setBarcode] = useState('');
	const [namaBarang, setNamaBarang] = useState('');
	const [categoryID, setCategoryID] = useState('');
	const [supplierID, setSupplierID] = useState('');
	const [diskonPersen, setDiskonPersen] = useState(0);
	const [diskonHarga, setDiskonHarga] = useState(0);

	const [currentImage, setCurrentImage] = useState('');
	
    const [searchKodeBarangText, setSearchKodeBarangText] = useState('');
	const [searchCategoriesText, setSearchCategoriesText] = useState('');
	const [searchSuppliersText, setSearchSuppliersText] = useState('');

	const toaster = useToaster();
	const [placement, setPlacement] = useState('topCenter');

    const [productData, productDataLoading] = useTracker(() => {
		let isLoading = true;
		let data = {};

		if (kodeBarang) {
			let subs = Meteor.subscribe('products.getByKode', { kodeBarang });
			isLoading = !subs.ready();

			data = ProductsCollections.findOne({ kodeBarang });

			isLoading = !subs.ready();
		}
		
		isLoading = false;
		return [data, isLoading];
	}, [kodeBarang]);
    
    useEffect(()=>{

        if (productData && productDataLoading === false) {
			setBarcode(productData.barcode);
			setNamaBarang (productData.namaBarang);
			setCategoryID (productData.categoryID);
			setSupplierID(productData.supplier);
			setCurrentImage(productData.imageBase64);
		} else if (!productData && productDataLoading === false) {
			resetvalue();
		}
    },[productData, productDataLoading])
    
    const [categories, categoriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('categories.search', {
			searchText: searchCategoriesText,
			selectedID: categoryID,
		});

		let data = CategoriesCollections.find({
			$or: [
				{
					code: categoryID,
				},
				{
					code: {
						$regex: searchCategoriesText,
						$options: 'i',
					},
				},
				{
					name: {
						$regex: searchCategoriesText,
						$options: 'i',
					},
				},
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchCategoriesText, categoryID]);

    const [products, productsLoading] = useTracker(() => {

		let isLoading = true;
		
		let subs = Meteor.subscribe('products.search', {
			searchText: searchKodeBarangText,
			selectedID: kodeBarang,
		});

		let data = ProductsCollections.find({
			$or: [
				{
					kodeBarang: kodeBarang,
				},
				{
					kodeBarang: {
						$regex: searchKodeBarangText,
						$options: 'i',
					},
				},
				{
					namaBarang: {
						$regex: searchKodeBarangText,
						$options: 'i',
					},
				},
				{
					limit: 10,
				}
			],
		}).fetch();

		isLoading = !subs.ready();

		return [data, isLoading];
	}, [searchKodeBarangText, kodeBarang]);

	const [suppliers, suppliersLoading] = useTracker(() => {
		let subs = Meteor.subscribe('vendors.search', {
			searchText: searchSuppliersText,
			selectedID: supplierID,
		});

		let data = VendorsCollections.find({
			$or: [
				{
					code: supplierID,
				}
			],
		}).fetch();
		return [data, !subs.ready()];
	}, [searchSuppliersText, supplierID]);

    const renderProductsLoading = (menu) => {
		if (productsLoading) {
			return (
				<p style={{ padding: 4, color: '#999', textAlign: 'center' }}>
					<SpinnerIcon spin /> Loading...
				</p>
			);
		}
		return menu;
	};

    const validateNumber = (input) => {
		let regex = /^[0-9]*$/;

		if (input === '' || regex.test(input)) {
			return true;
		} else {
			return false;
		}
	};

    const formatNum = (input, dec) => {
		if (input) {
			return parseFloat(input)
					.toFixed(dec)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	const resetvalue = () => {
		setKodeBarang('');
		setBarcode('');
		setNamaBarang ('');
		setCategoryID ('');

		setSupplierID('');
		setDiskonPersen('');
		setDiskonHarga('');

		setCurrentImage('');
	};

	const isDisabled = () => {
		if (addingDetail || productDataLoading){
            return true;
        } else {
            return false;
        } 
	};

	const addDetail = () => {
		setAddingDetail(true);
		if ( kodeBarang && ( diskonHarga || diskonPersen ) ) {
			Meteor.call(
				'promotionsdetail.add',
				{
					itemNum,
					promoNo,

					kodeBarang,
					barcode,
					namaBarang,
					categoryID,
					supplierID,
					diskonPersen,
					diskonHarga,
				},
				(err, res) => {
					if (err) {
						setAddingDetail(false);
						//setType('error');
						//setHeader(err.error);
						//setDesc(err.reason);
						let type = 'error';
						let title = err.error;
						let desc = err.reason;
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
					} else if (res) {
						let resultCode = res.code;
						let resultTitle = res.title;
						let resultMessage = res.message;
						if (resultCode === 200) {
							resetvalue();
							setBarcode('');
							setAddingDetail(false);
							let type = 'success';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						} else {
							setAddingDetail(false);
							let type = 'warning';
							let title = resultTitle;
							let desc = resultMessage;
							toaster.push(
								<Message showIcon type={type} header={title}>
									{desc}
								  </Message>
								,{placement})
						}
					} else {
						setAddingDetail(false);
						let type = 'error';
						let title = 'Kesalahan Sistem';
						let desc = 'Terjadi kesalahan pada sistem, silahkan hubungi customer service';
						toaster.push(
							<Message showIcon type={type} header={title}>
								{desc}
							  </Message>
							,{placement})
					}
				}
			);
		} else {
			setAddingDetail(false);
			let type = 'error';
			let title = 'Kesalahan Sistem';
			let desc = 'Kode Barang dan diskon Wajib Diisi';
			toaster.push(
				<Message showIcon type={type} header={title}>
					{desc}
				  </Message>
				,{placement})
		}
		
	};

    return (
        <>
            <Modal 
                overflow={overflow} 
                open={props.open} 
                onClose={ ()=> props.handleClose()} 
                size="lg">
     		  <Modal.Header>
     		    <Modal.Title>
					<Row xs="auto">
						<Col>
							Tambah Item Promotions #
						</Col>
						<Col>
							<Input
								size="sm"
								className="text-right"
								style={{width: 100}}
								value={itemNum}
								onChange={(e) => { 
									e = e.toString().split(',').join('');
									const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
									if (validateNumber) {
										setItemNum(e);
									} 
								}}
							/>
						</Col>
					</Row>
				</Modal.Title>
     		  </Modal.Header>
			  <hr />
     		  <Modal.Body>
			    <Form 
					layout="horizontal"
					//onSubmit={() => { addDetail();}}
					disabled={ isDisabled() }
					>
					<Row style={{marginRight: 10}}>
						<Col xs={8}>
							<Form.Group controlId="kodebrg" style={{ marginBottom: 0}}> 
								<Form.ControlLabel className="text-left">Barang</Form.ControlLabel>
								<SelectPicker
									placeholder="Produk"
									disabled={ isDisabled() }
									data={products.map((s) => ({
										label: '[' + s.kodeBarang + '] ' + s.namaBarang,
										value: s.kodeBarang,
									}))}
									style={{ minWidth: 400 }}
									value={kodeBarang}
									onSelect={( e) => {
										setKodeBarang(e);
									}}
									onClean={() => {
										resetvalue();
									}}
									onSearch={(e) => {
										setSearchKodeBarangText(e);
									}}
									renderMenu={renderProductsLoading}
								/>
        					</Form.Group>
							<Form.Group controlId="barcode" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Barcode</Form.ControlLabel>
								<Form.Control
									readOnly
									name="barcode"
									placeholder="Barcode"
									value={barcode}
									style={{color: "#1675e0" }}
									disabled={isDisabled()}
								/>
							</Form.Group>
							<Form.Group controlId="categoryID" style={{ marginBottom: 0}}>
								<Form.ControlLabel 
									className="text-left"
								> Kategori
								</Form.ControlLabel>
								<SelectPicker
									name="categoryID"
									placeholder="Kategori"
									readOnly
									disabled={isDisabled()}
									data={categories.map((s) => ({
										label: '[' + s.code + '] ' + s.name,
										value: s.code,
									}))}
									style={{ width: 300 }}
									value={categoryID}
									onChange={(input) => {
										setCategoryID(input);
									}}
								/>
							</Form.Group>
							<Form.Group controlId="supplierID" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Supplier</Form.ControlLabel>
								<SelectPicker
									placeholder="Supplier"
									required
									disabled={isDisabled()}
									data={suppliers.map((s) => ({
										label: '[' + s.code + '] ' + s.name,
										value: s.code,
									}))}
									style={{ width: 300 }}
									value={supplierID}
									onClean={() => {
										setSupplierID('');
									}}
								/>
							</Form.Group>
							<Form.Group controlId="diskonPersen" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Diskon %</Form.ControlLabel>
								<InputGroup inside style={{ width: 300 }}>
									<Form.Control
										name="diskonPersen"
										placeholder="Diskon Persen"
										value={diskonPersen}
										className="text-right"
										disabled={isDisabled()}
										onChange={(e) => {
											e = e.toString().split(',').join('');
											const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
											if (validateNumber) {
												let n = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
												setDiskonPersen(n);
												setDiskonHarga(0);
											}
										}}
									/>
									<InputGroup.Addon>%</InputGroup.Addon>
								</InputGroup>
							</Form.Group>
							<Form.Group controlId="diskonHarga" style={{ marginBottom: 0}}>
								<Form.ControlLabel className="text-left">Diskon #</Form.ControlLabel>
								<InputGroup inside style={{ width: 300 }}>
									<InputGroup.Addon>Rp</InputGroup.Addon>
									<Form.Control
										name="diskonHarga"
										placeholder="Diskon Harga"
										className="text-right"
										value={diskonHarga}
										disabled={isDisabled()}
										onChange={(e) => {
											e = e.toString().split(',').join('');
											const validateNumber = e.match(/^(\d*\.{0,1}\d{0,2}$)/);
											if (validateNumber) {
												let n = e.toString().replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,')
												setDiskonHarga(n);
												setDiskonPersen(0);
											}
										}}
									/>
								</InputGroup>
							</Form.Group>
						</Col>
						<Col xs={4}>
							{currentImage && (
								<>
									<div 
										className="d-flex flex-row flex-nowrap justify-content-end align-content-end fullWidth"
										style={{height:180}}
										>
										<img
											src={currentImage}
											className="img-fluid img-thumbnail rounded mx-auto d-block"
											alt="Responsive image"
										></img>
									</div>
								</>
							)}
						</Col>
					</Row>
					
			   	</Form>
					
     		  </Modal.Body>
     		  <Modal.Footer>
     		    <Button 
					onClick={ () => { 
						addDetail();
					}} 
					appearance="primary">
     		      Add
     		    </Button>
     		    <Button onClick={() => props.handleClose() } appearance="subtle">
     		      Cancel
     		    </Button>
     		  </Modal.Footer>
     		</Modal>
        </>
    )
}

DetailPurchase.defaultProps = {
    open: false
}

export default DetailPurchase;