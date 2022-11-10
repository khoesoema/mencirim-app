import React from 'react';
import { useNavigate } from 'react-router-dom';

import Drawer from 'rsuite/Drawer';
import Dropdown from 'rsuite/Dropdown';
import Nav from 'rsuite/Nav';
import Sidenav from 'rsuite/Sidenav';

import * as faCashRegister from '@fortawesome/free-solid-svg-icons/faCashRegister';
import * as faWarehouse from '@fortawesome/free-solid-svg-icons/faWarehouse';
import { Icon } from '@rsuite/icons';
import DashboardIcon from '@rsuite/icons/Dashboard';
import GearIcon from '@rsuite/icons/Gear';
import TableIcon from '@rsuite/icons/Table';
import TagIcon from '@rsuite/icons/Tag';
import { FaSvgIcon } from '../../etc/tools';
import DetailIcon from '@rsuite/icons/Detail';

import PropTypes from 'prop-types';

const Sidebar = (props) => {
	let navigate = useNavigate();

	const panelStyles = {
		padding: '15px 20px',
		color: '#aaa'
	};

	return (
		<Drawer
			open={props.opendrawer}
			onClose={props.closedrawer}
			backdrop="true"
			placement="left"
			//size="xs"
			//className="rs-theme-dark"
		>
			<Drawer.Header>
				<Drawer.Title>Menu</Drawer.Title>
			</Drawer.Header>
			<Drawer.Body className="p-0">
				<Sidenav
					defaultOpenKeys={
						props.currentmenu === 'currencyMasterdata' ||
						props.currentmenu === 'negaraMasterdata' ||
						props.currentmenu === 'provinsiMasterdata' ||
						props.currentmenu === 'kotaMasterdata' ||
						props.currentmenu === 'taxCodeMasterdata' ||
						props.currentmenu === 'accountMasterdata' ||
						props.currentmenu === 'uomMasterData' ||
						props.currentmenu === 'businessTypeMasterdata' ||
						props.currentmenu === 'companyMasterdata' ||
						props.currentmenu === 'locationMasterdata' ||
						props.currentmenu === 'warehouseMasterdata' ||
						props.currentmenu === 'rackMasterdata' ||
						props.currentmenu === 'customerMasterdata' ||
						props.currentmenu === 'vendorMasterdata' ||
						props.currentmenu === 'categoryMasterdata' ||
						props.currentmenu === 'productMasterdata'
							? ['masterdata']
							: props.currentmenu === 'purchaseInvoicesTransactions' ||
							  props.currentmenu === 'salesInvoicesTransactions' ||
							  props.currentmenu === 'promotionsTransactions'
							? ['transactions']
							: props.currentmenu === 'stockIn' ||
							  props.currentmenu === 'stockOut' ||
							  props.currentmenu === 'stockTransfer' ||
							  props.currentmenu === 'stockConversion'
							? ['warehouses']
							: props.currentmenu === 'usersSettings'
							? ['settings']
							: props.currentmenu === 'cashier'
							? ['cashier']
							: [props.currentmenu]
					}
					className="sideBarBody"
				>
					<Sidenav.Body className="sideBarBody">
						<Nav {...props}>
							<Nav.Item
								
								eventKey="cashier"
								active={ props.currentmenu === 'cashier' ? true : false }
								icon={
									<Icon
										as={FaSvgIcon}
										faIcon={faCashRegister}
									/>
								}
								onClick={(e) => navigate('/CashierOnBoarding')}
								className="fakeLink"
							>
								Kasir
							</Nav.Item>
							<Nav.Item
								
								eventKey="dashboard"
								active={
									props.currentmenu === 'dashboard'
										? true
										: false
								}
								icon={<DashboardIcon />}
								onClick={(e) => navigate('/')}
								className="fakeLink"
							>
								Dashboard
							</Nav.Item>
							<Nav.Menu
								
								eventKey="masterdata"
								title="Data"
								activeKey={props.currentmenu}
								icon={<TableIcon />}
								className="fakeLink"
							>
								<Nav.Item panel style={panelStyles}> Barang </Nav.Item>
								<Nav.Item
									
									eventKey="productMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'productMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Products')}
								>
									Produk
								</Nav.Item>
								<Nav.Item
									
									eventKey="categoryMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'categoryMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Categories')}
								>
									Kategori
								</Nav.Item>
								<Nav.Item
									
									eventKey="uomMasterData"
									className="navitem"
									active={
										props.currentmenu === 'uomMasterData'
											? true
											: false
									}
									onClick={(e) => navigate('/UOM')}
								>
									Satuan
								</Nav.Item>
								<Nav.Item divider />
								<Nav.Item panel style={panelStyles}> Customer </Nav.Item>
								<Nav.Item
									
									eventKey="customerMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'customerMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Customers')}
								>
									Customer
								</Nav.Item>
								<Nav.Item divider />
								<Nav.Item panel style={panelStyles}> Supplier </Nav.Item>
								<Nav.Item
									
									eventKey="vendorMasterdata"
									className="navitem"
									active={
										props.currentmenu === 'vendorMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Supplier')}
								>
									Supplier
								</Nav.Item>
								<Nav.Item
									
									eventKey="businessTypeMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'businessTypeMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/BusinessTypes')}
								>
									Tipe Bisnis
								</Nav.Item>
								<Nav.Item divider />
								<Nav.Item panel style={panelStyles}> Lokasi </Nav.Item>
								<Nav.Item
									
									eventKey="negaraMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'negaraMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Negara')}
								>
									Negara
								</Nav.Item>
								<Nav.Item
									
									eventKey="provinsiMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'provinsiMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Provinsi')}
								>
									Provinsi
								</Nav.Item>
								<Nav.Item
									
									eventKey="kotaMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'kotaMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Kota')}
								>
									Kota
								</Nav.Item>
								<Nav.Item divider />
								<Nav.Item panel style={panelStyles}> Others </Nav.Item>
								<Nav.Item
									eventKey="kassaMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'kassaMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Kassa')}
								>
									Kassa
								</Nav.Item>
								<Nav.Item
									
									eventKey="currencyMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'currencyMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Currencies')}
								>
									Mata Uang
								</Nav.Item>
								<Nav.Item
									
									eventKey="taxCodeMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'taxCodeMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/TaxCodes')}
								>
									Kode Pajak
								</Nav.Item>
								<Nav.Item
									
									eventKey="accountMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'accountMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Accounts')}
								>
									Nomor Perkiraan GL
								</Nav.Item>
								<Nav.Item
									
									eventKey="companyMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'companyMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Companies')}
								>
									Perusahaan
								</Nav.Item>
								{/*<Nav.Item
									
									eventKey="locationMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'locationMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Locations')}
								>
									Lokasi
								</Nav.Item>*/}
								<Nav.Item
									
									eventKey="warehouseMasterdata"
									className="navitem"
									active={
										props.currentmenu ===
										'warehouseMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Warehouses')}
								>
									Gudang / Store
								</Nav.Item>
								<Nav.Item
									
									eventKey="rackMasterdata"
									className="navitem"
									active={
										props.currentmenu === 'rackMasterdata'
											? true
											: false
									}
									onClick={(e) => navigate('/Racks')}
								>
									Rak
								</Nav.Item>
								
							</Nav.Menu>

							<Nav.Menu
								eventKey="transactions"
								title="Transaksi"
								activeKey={props.currentmenu}
								icon={<TagIcon />}
								className="fakeLink"
							>
								<Nav.Item panel style={panelStyles}> Pembelian Barang </Nav.Item>
								<Nav.Item
									
									eventKey="orderpembelian"
									className="navitem"
									active={
										props.currentmenu ===
										'orderpembelian'
											? true
											: false
									}
									onClick={(e) =>
										navigate('/PurchaseOrder')
									}
								>
									Order Pembelian
								</Nav.Item>
								<Nav.Item
									
									eventKey="purchaseInvoicesTransactions"
									className="navitem"
									active={
										props.currentmenu ===
										'purchaseInvoicesTransactions'
											? true
											: false
									}
									onClick={(e) =>
										navigate('/PurchaseInvoices')
									}
								>
									Pembelian
								</Nav.Item>
								<Nav.Item
									
									eventKey="returpembelian"
									className="navitem"
									active={
										props.currentmenu ===
										'returpembelian'
											? true
											: false
									}
									onClick={(e) =>
										navigate('/PurchaseRetur')
									}
								>
									Retur Pembelian
								</Nav.Item>
								<Nav.Item divider />
								<Nav.Item panel style={panelStyles}> Penjualan Barang </Nav.Item>
								<Nav.Item
									
									eventKey="salesInvoicesTransactions"
									className="navitem"
									active={
										props.currentmenu ===
										'salesInvoicesTransactions'
											? true
											: false
									}
									onClick={(e) => navigate('/SalesInvoices')}
								>
									Penjualan
								</Nav.Item>
								<Nav.Item
									
									eventKey="returpenjualan"
									className="navitem"
									active={
										props.currentmenu ===
										'returpenjualan'
											? true
											: false
									}
									onClick={(e) =>
										navigate('/SalesReturInvoices')
									}
								>
									Retur Penjualan
								</Nav.Item>
								<Nav.Item divider />
								<Nav.Item panel style={panelStyles}> Promo Barang </Nav.Item>
								<Nav.Item
									
									eventKey="promotionsTransactions"
									className="navitem"
									active={
										props.currentmenu ===
										'promotionsTransactions'
											? true
											: false
									}
									onClick={(e) => navigate('/Promotions')}
								>
									Promosi
								</Nav.Item>
								
							</Nav.Menu>
							<Nav.Menu
								eventKey="warehouses"
								title="Gudang"
								activeKey={props.currentmenu}
								icon={
									<Icon as={FaSvgIcon} faIcon={faWarehouse} />
								}
								className="fakeLink"
							>
								<Nav.Item
									
									eventKey="stockIn"
									className="navitem"
									active={
										props.currentmenu === 'stockIn'
											? true
											: false
									}
									onClick={(e) => navigate('/StockIn')}
								>
									Stok Masuk
								</Nav.Item>
								<Nav.Item
									
									eventKey="stockOut"
									active={
										props.currentmenu === 'stockOut'
											? true
											: false
									}
									onClick={(e) => navigate('/StockOut')}
								>
									Stok Keluar
								</Nav.Item>
								<Nav.Item
									
									eventKey="stockTransfer"
									className="navitem"
									active={
										props.currentmenu === 'stockTransfer'
											? true
											: false
									}
									onClick={(e) => navigate('/StockTransfer')}
								>
									Transfer Stok
								</Nav.Item>
								<Nav.Item
									
									eventKey="stockConversion"
									className="navitem"
									active={
										props.currentmenu === 'stockConversion'
											? true
											: false
									}
									onClick={(e) =>
										navigate('/StockConversion')
									}
								>
									Konversi Stok
								</Nav.Item>
							</Nav.Menu>
							<Nav.Menu
								eventKey="reports"
								title="Laporan"
								activeKey={props.currentmenu}
								icon={<DetailIcon />}
								className="fakeLink"
							>
								<Nav.Item
									eventKey="stockReport"
									className="navitem"
									active={
										props.currentmenu === 'stockReport'
											? true
											: false
									}
									onClick={(e) => navigate('/LaporanStok')}
								>
									Laporan Stok
								</Nav.Item>
								<Nav.Item
									eventKey="purchaseReport"
									className="navitem"
									active={
										props.currentmenu === 'purchaseReport'
											? true
											: false
									}
									onClick={(e) => navigate('/LaporanPembelian')}
								>
									Laporan Pembelian
								</Nav.Item>
								<Nav.Item
									eventKey="salesReport"
									className="navitem"
									active={
										props.currentmenu === 'salesReport'
											? true
											: false
									}
									onClick={(e) => navigate('/LaporanPenjualan')}
								>
									Laporan Penjualan
								</Nav.Item>
								<Nav.Item
									eventKey="salesDetailReport"
									className="navitem"
									active={
										props.currentmenu === 'salesDetailReport'
											? true
											: false
									}
									onClick={(e) => navigate('/LaporanPenjualanDetail')}
								>
									Laporan Penjualan Detail
								</Nav.Item>
								<Nav.Item
									eventKey="monthlyReport"
									className="navitem"
									active={
										props.currentmenu === 'monthlyReport'
											? true
											: false
									}
									onClick={(e) => navigate('/LaporanBulanan')}
								>
									Laporan Bulanan
								</Nav.Item>
								<Nav.Item
									eventKey="yearlyReport"
									className="navitem"
									active={
										props.currentmenu === 'yearlyReport'
											? true
											: false
									}
									onClick={(e) => navigate('/LaporanTahunan')}
								>
									Laporan Tahunan
								</Nav.Item>
							</Nav.Menu>
							<Nav.Menu
								eventKey="settings"
								title="Pengaturan"
								activeKey={props.currentmenu}
								icon={<GearIcon />}
								className="fakeLink"
							>
								<Nav.Item
									
									eventKey="usersSettings"
									className="navitem"
									active={
										props.currentmenu === 'usersSettings'
											? true
											: false
									}
									onClick={(e) => navigate('/Users')}
								>
									User
								</Nav.Item>
								<Nav.Item
									
									eventKey="userRole"
									className="navitem"
									active={
										props.currentmenu === 'userRole'
											? true
											: false
									}
									onClick={(e) => navigate('/UserRole')}
								>
									User Role
								</Nav.Item>
								<Nav.Item
									
									eventKey="userLog"
									className="navitem"
									active={
										props.currentmenu === 'userLog'
											? true
											: false
									}
									onClick={(e) => navigate('/UserLog')}
								>
									User Log
								</Nav.Item>
								<Nav.Item
									eventKey="errorLog"
									className="navitem"
									active={
										props.currentmenu === 'errorLog'
											? true
											: false
									}
									onClick={(e) => navigate('/ErrorLog')}
								>
									User Error Log
								</Nav.Item>
							</Nav.Menu>
						</Nav>
					</Sidenav.Body>
				</Sidenav>
			</Drawer.Body>
		</Drawer>
	);
}

Sidebar.propTypes = {
	opendrawer: PropTypes.bool
}

Sidebar.defaultProps = {
	opendrawer: false
}

export default Sidebar;