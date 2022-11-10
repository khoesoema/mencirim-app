import moment from 'moment-timezone';
import 'moment/locale/id';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { AddAccount } from './admin/masterdata/account/Add';
import { EditAccount } from './admin/masterdata/account/Detail';
import { AccountLists } from './admin/masterdata/account/List';

import { AddBrand } from './admin/masterdata/brand/Add';
import { EditBrand } from './admin/masterdata/brand/Detail';
import { BrandLists } from './admin/masterdata/brand/List';

import { AddBusinessType } from './admin/masterdata/businesstype/Add';
import { EditBusinessType } from './admin/masterdata/businesstype/Detail';
import { BusinessTypeLists } from './admin/masterdata/businesstype/List';

import { AddCategory } from './admin/masterdata/category/Add';
import { EditCategory } from './admin/masterdata/category/Detail';
import { CategoryLists } from './admin/masterdata/category/List';

import { AddNegara } from './admin/masterdata/negara/Add';
import { EditNegara } from './admin/masterdata/negara/Detail';
import { ListNegara } from './admin/masterdata/negara/List';

import { AddProvinsi } from './admin/masterdata/provinsi/Add';
import { EditProvinsi } from './admin/masterdata/provinsi/Detail';
import { ListProvinsi } from './admin/masterdata/provinsi/List';

import { AddKota } from './admin/masterdata/kota/Add';
import { EditKota } from './admin/masterdata/kota/Detail';
import { ListKota } from './admin/masterdata/kota/List';

import { AddCompany } from './admin/masterdata/company/Add';
import { EditCompany } from './admin/masterdata/company/Detail';
import { CompanyLists } from './admin/masterdata/company/List';

import { AddCurrency } from './admin/masterdata/currency/Add';
import { EditCurrency } from './admin/masterdata/currency/Detail';
import { CurrencyLists } from './admin/masterdata/currency/List';

import { AddCustomer } from './admin/masterdata/customer/Add';
import { EditCustomer } from './admin/masterdata/customer/Detail';
import { CustomerLists } from './admin/masterdata/customer/List';

import { AddLocation } from './admin/masterdata/location/Add';
import { EditLocation } from './admin/masterdata/location/Detail';
import { LocationLists } from './admin/masterdata/location/List';

import { AddProduct } from './admin/masterdata/product/Add';
import { EditProduct } from './admin/masterdata/product/Detail';
import { ProductLists } from './admin/masterdata/product/List';

import { AddRack } from './admin/masterdata/rack/Add';
import { EditRack } from './admin/masterdata/rack/Detail';
import { RackLists } from './admin/masterdata/rack/List';

import { AddTaxCode } from './admin/masterdata/taxcode/Add';
import { EditTaxCode } from './admin/masterdata/taxcode/Detail';
import { TaxCodeLists } from './admin/masterdata/taxcode/List';

import { AddUOM } from './admin/masterdata/uom/Add';
import { EditUOM } from './admin/masterdata/uom/Detail';
import { UOMLists } from './admin/masterdata/uom/List';

import { AddKassa } from './admin/masterdata/kassa/Add';
import { EditKassa } from './admin/masterdata/kassa/Detail';
import { KassaLists } from './admin/masterdata/kassa/List';

import { AddSupplier } from './admin/masterdata/vendor/Add';
import { EditSupplier } from './admin/masterdata/vendor/Detail';
import { SupplierLists } from './admin/masterdata/vendor/List';

import { AddWarehouse } from './admin/masterdata/warehouse/Add';
import { EditWarehouse } from './admin/masterdata/warehouse/Detail';
import { WarehouseLists } from './admin/masterdata/warehouse/List';

import { AddPromotion } from './admin/transactions/promotion/Add';
import { EditPromotion } from './admin/transactions/promotion/Detail';
import { PromotionLists } from './admin/transactions/promotion/List';

import { AddPurchaseInvoice } from './admin/transactions/purchase/Add';
import { EditPurchaseInvoice } from './admin/transactions/purchase/Detail';
import { ViewPurchaseInvoice } from './admin/transactions/purchase/View';
import { PurchaseInvoicesLists } from './admin/transactions/purchase/List';

import { AddPurchaseOrder } from './admin/transactions/purchaseorder/Add';
import { EditPurchaseOrder } from './admin/transactions/purchaseorder/Detail';
import { ViewPurchaseOrder } from './admin/transactions/purchaseorder/View';
import { PurchaseOrderLists } from './admin/transactions/purchaseorder/List';

import { AddPurchaseRetur} from './admin/transactions/purchaseretur/Add';
import { EditPurchaseRetur } from './admin/transactions/purchaseretur/Detail';
import { ViewPurchaseRetur } from './admin/transactions/purchaseretur/View';
import { PurchaseReturLists } from './admin/transactions/purchaseretur/List';

import { AddSalesInvoice } from './admin/transactions/sales/Add';
import { EditSalesInvoice } from './admin/transactions/sales/Detail';
import { ViewSalesInvoice } from './admin/transactions/sales/View';
import { SalesInvoicesLists } from './admin/transactions/sales/List';

import { AddSalesReturInvoice } from './admin/transactions/salesretur/Add';
import { EditSalesReturInvoice } from './admin/transactions/salesretur/Detail';
import { ViewSalesReturInvoice } from './admin/transactions/salesretur/View';
import { SalesReturInvoicesLists } from './admin/transactions/salesretur/List';

import { AddStockConversion } from './admin/transactions/stockconversion/Add';
import { ViewStockConversion } from './admin/transactions/stockconversion/Detail';
import { StockConversionLists } from './admin/transactions/stockconversion/List';

import { AddStockIn } from './admin/transactions/stockin/Add';
import { ViewStockIn } from './admin/transactions/stockin/Detail';
import { StockInLists } from './admin/transactions/stockin/List';

import { AddStockTransfer } from './admin/transactions/stocktransfer/Add';
import { ViewStockTransfer } from './admin/transactions/stocktransfer/Detail';
import { StockTransferLists } from './admin/transactions/stocktransfer/List';

import { LaporanStok } from './admin/reports/LaporanStok';
import { LaporanPembelian } from './admin/reports/LaporanPembelian';
import { LaporanPenjualan } from './admin/reports/LaporanPenjualan';
import { LaporanPenjualanDetail } from './admin/reports/LaporanPenjualanDetail';
import { LaporanBulanan } from './admin/reports/LaporanBulanan';
import { LaporanTahunan } from './admin/reports/LaporanTahunan';

import { Cashier } from './cashier/Index';
import { CashierOnBoarding } from './cashier/OnBoarding';
import { DashboardPage } from './Dashboard';

import { UserLists } from './admin/settings/user/List';
import { AddUser } from './admin/settings/user/Add';
import { EditUser } from './admin/settings/user/Detail';

import { AddUserRole } from './admin/settings/userrole/Add';
import { EditUserRole } from './admin/settings/userrole/Detail';
import { ListUserRole } from './admin/settings/userrole/List';

import { ViewUserLog } from './admin/settings/userlog/Detail';
import { ListUserLog } from './admin/settings/userlog/List';

import { ViewErrorLog } from './admin/settings/errorlog/Detail';
import { ListErrorLog } from './admin/settings/errorlog/List';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function PageRoutes(props) {
	return (
		<>
			<Router>
				<Routes>
					<Route
						index
						path="/"
						render
						element={<DashboardPage />}
					/>
					<Route
						index
						path="/CashierOnBoarding"
						render
						// element={(props) => <DashboardPage {...props} />}
						element={<CashierOnBoarding />}
					/>
					<Route
						index
						path="/Cashier/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<Cashier />}
					/>

					<Route
						index
						path="/Companies"
						// element={(props) => <DashboardPage {...props} />}
						element={<CompanyLists />}
					/>
					<Route
						index
						path="/AddCompany"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddCompany />}
					/>
					<Route
						index
						path="/EditCompany/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditCompany />}
					/>

					<Route
						index
						path="/Negara"
						element={<ListNegara />}
					/>
					<Route
						index
						path="/AddNegara"
						element={<AddNegara />}
					/>
					<Route
						index
						path="/EditNegara/:_id"
						element={<EditNegara />}
					/>

					<Route
						index
						path="/Provinsi"
						element={<ListProvinsi />}
					/>
					<Route
						index
						path="/AddProvinsi"
						element={<AddProvinsi />}
					/>
					<Route
						index
						path="/EditProvinsi/:_id"
						element={<EditProvinsi />}
					/>

					<Route
						index
						path="/Kota"
						element={<ListKota />}
					/>
					<Route
						index
						path="/AddKota"
						element={<AddKota />}
					/>
					<Route
						index
						path="/EditKota/:_id"
						element={<EditKota />}
					/>


					<Route
						index
						path="/Locations"
						// element={(props) => <DashboardPage {...props} />}
						element={<LocationLists />}
					/>
					<Route
						index
						path="/AddLocation"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddLocation />}
					/>
					<Route
						index
						path="/EditLocation/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditLocation />}
					/>

					<Route
						index
						path="/Warehouses"
						// element={(props) => <DashboardPage {...props} />}
						element={<WarehouseLists />}
					/>
					<Route
						index
						path="/AddWarehouse"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddWarehouse />}
					/>
					<Route
						index
						path="/EditWarehouse/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditWarehouse />}
					/>

					<Route
						index
						path="/Racks"
						// element={(props) => <DashboardPage {...props} />}
						element={<RackLists />}
					/>
					<Route
						index
						path="/AddRack"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddRack />}
					/>
					<Route
						index
						path="/EditRack/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditRack />}
					/>

					<Route
						index
						path="/Currencies"
						// element={(props) => <DashboardPage {...props} />}
						element={<CurrencyLists />}
					/>
					<Route
						index
						path="/AddCurrency"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddCurrency />}
					/>
					<Route
						index
						path="/EditCurrency/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditCurrency />}
					/>

					<Route
						index
						path="/BusinessTypes"
						// element={(props) => <DashboardPage {...props} />}
						element={<BusinessTypeLists />}
					/>
					<Route
						index
						path="/AddBusinessType"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddBusinessType />}
					/>
					<Route
						index
						path="/EditBusinessType/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditBusinessType />}
					/>
					<Route
						index
						path="/UOM"
						// element={(props) => <DashboardPage {...props} />}
						element={<UOMLists />}
					/>
					<Route
						index
						path="/AddUOM"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddUOM />}
					/>
					<Route
						index
						path="/EditUOM/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditUOM />}
					/>

					<Route
						index
						path="/Accounts"
						// element={(props) => <DashboardPage {...props} />}
						element={<AccountLists />}
					/>
					<Route
						index
						path="/AddAccount"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddAccount />}
					/>
					<Route
						index
						path="/AddAccount/:selectedParentID"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddAccount />}
					/>
					<Route
						index
						path="/EditAccount/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditAccount />}
					/>

					<Route
						index
						path="/TaxCodes"
						// element={(props) => <DashboardPage {...props} />}
						element={<TaxCodeLists />}
					/>
					<Route
						index
						path="/AddTaxCode"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddTaxCode />}
					/>
					<Route
						index
						path="/EditTaxCode/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditTaxCode />}
					/>

					<Route
						index
						path="/Customers"
						// element={(props) => <DashboardPage {...props} />}
						element={<CustomerLists />}
					/>
					<Route
						index
						path="/AddCustomer"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddCustomer />}
					/>
					<Route
						index
						path="/EditCustomer/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditCustomer />}
					/>

					<Route
						index
						path="/Kassa"
						// element={(props) => <DashboardPage {...props} />}
						element={<KassaLists />}
					/>
					<Route
						index
						path="/AddKassa"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddKassa />}
					/>
					<Route
						index
						path="/EditKassa/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditKassa />}
					/>

					<Route
						index
						path="/Supplier"
						// element={(props) => <DashboardPage {...props} />}
						element={<SupplierLists />}
					/>
					<Route
						index
						path="/AddSupplier"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddSupplier />}
					/>
					<Route
						index
						path="/EditSupplier/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditSupplier />}
					/>

					<Route
						index
						path="/Brands"
						// element={(props) => <DashboardPage {...props} />}
						element={<BrandLists />}
					/>
					<Route
						index
						path="/AddBrand"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddBrand />}
					/>
					<Route
						index
						path="/EditBrand/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditBrand />}
					/>

					<Route
						index
						path="/Categories"
						// element={(props) => <DashboardPage {...props} />}
						element={<CategoryLists />}
					/>
					<Route
						index
						path="/AddCategory"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddCategory />}
					/>
					<Route
						index
						path="/EditCategory/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditCategory />}
					/>

					<Route
						index
						path="/Products"
						// element={(props) => <DashboardPage {...props} />}
						element={<ProductLists />}
					/>
					<Route
						index
						path="/AddProduct"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddProduct />}
					/>
					<Route
						index
						path="/EditProduct/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditProduct />}
					/>

					<Route
						index
						path="/Promotions"
						// element={(props) => <DashboardPage {...props} />}
						element={<PromotionLists />}
					/>
					<Route
						index
						path="/AddPromotion"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddPromotion />}
					/>
					<Route
						index
						path="/EditPromotion/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditPromotion />}
					/>

					<Route index path="/PurchaseInvoices" element={<PurchaseInvoicesLists />}/>
					<Route index path="/AddPurchaseInvoice" element={<AddPurchaseInvoice />}/>
					<Route index path="/ViewPurchaseInvoice/:_id" element={<ViewPurchaseInvoice />} />
					<Route index path="/EditPurchaseInvoice/:_id" element={<EditPurchaseInvoice />}/>

					<Route index path="/PurchaseOrder" element={<PurchaseOrderLists />} />
					<Route index path="/AddPurchaseOrder" element={<AddPurchaseOrder />} />
					<Route index path="/ViewPurchaseOrder/:_id" element={<ViewPurchaseOrder />} />
					<Route index path="/EditPurchaseOrder/:_id" element={<EditPurchaseOrder />}/>

					<Route index path="/EditPurchaseRetur/:_id" element={<EditPurchaseRetur />} />
					<Route index path="/PurchaseRetur" element={<PurchaseReturLists />}/>
					<Route index path="/AddPurchaseRetur" element={<AddPurchaseRetur />}/>
					<Route index path="/ViewPurchaseRetur/:_id" element={<ViewPurchaseRetur />} />
					<Route index path="/EditPurchaseRetur/:_id" element={<EditPurchaseOrder />}/>

					<Route index path="/SalesInvoices" element={<SalesInvoicesLists />}/>
					<Route index path="/AddSalesInvoice" element={<AddSalesInvoice />}/>
					<Route index path="/ViewSalesInvoice/:_id" element={<ViewSalesInvoice />} />
					<Route index path="/EditSalesInvoice/:_id" element={<EditSalesInvoice />}/>

					<Route index path="/SalesReturInvoices" element={<SalesReturInvoicesLists />}/>
					<Route index path="/AddSalesReturInvoice" element={<AddSalesReturInvoice />}/>
					<Route index path="/ViewSalesReturInvoice/:_id" element={<ViewSalesReturInvoice />} />
					<Route index path="/EditSalesReturInvoice/:_id" element={<EditSalesReturInvoice />}/>

					<Route index path="/StockIn" element={<StockInLists />}
					/>
					<Route
						index
						path="/AddStockIn"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddStockIn />}
					/>
					<Route
						index
						path="/ViewStockIn/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<ViewStockIn />}
					/>
					<Route
						index
						path="/StockTransfer"
						// element={(props) => <DashboardPage {...props} />}
						element={<StockTransferLists />}
					/>

					<Route index path="/LaporanStok" element={<LaporanStok />} />
					<Route index path="/LaporanPembelian" element={<LaporanPembelian />} />
					<Route index path="/LaporanPenjualan" element={<LaporanPenjualan />} />
					<Route index path="/LaporanPenjualanDetail" element={<LaporanPenjualanDetail />} />
					<Route index path="/LaporanBulanan" element={<LaporanBulanan />} />
					<Route index path="/LaporanTahunan" element={<LaporanTahunan />} />

					<Route
						index
						path="/AddStockTransfer"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddStockTransfer />}
					/>
					<Route
						index
						path="/ViewStockTransfer/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<ViewStockTransfer />}
					/>
					<Route
						index
						path="/StockConversion"
						// element={(props) => <DashboardPage {...props} />}
						element={<StockConversionLists />}
					/>
					<Route
						index
						path="/AddStockConversion"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddStockConversion />}
					/>
					<Route
						index
						path="/ViewStockConversion/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<ViewStockConversion />}
					/>
					<Route
						index
						path="/Users"
						// element={(props) => <DashboardPage {...props} />}
						element={<UserLists />}
					/>
					<Route
						index
						path="/AddUsers"
						// element={(props) => <DashboardPage {...props} />}
						element={<AddUser />}
					/>
					<Route
						index
						path="/EditUsers/:_id"
						// element={(props) => <DashboardPage {...props} />}
						element={<EditUser />}
					/>
					<Route
						index
						path="/UserRole"
						element={<ListUserRole/>}
					/>
					<Route
						index
						path="/AddUserRole"
						element={<AddUserRole/>}
					/>
					<Route
						index
						path="/EditUserRole/:_id"
						element={<EditUserRole/>}
					/>
					<Route
						index
						path="/UserLog"
						element={<ListUserLog/>}
					/>
					<Route
						index
						path="/ViewUserLog/:_id"
						element={<ViewUserLog/>}
					/>
					<Route
						index
						path="/ErrorLog"
						element={<ListErrorLog/>}
					/>
					<Route
						index
						path="/ViewErrorLog/:_id"
						element={<ViewErrorLog/>}
					/>
				</Routes>
			</Router>
		</>
	);
}
