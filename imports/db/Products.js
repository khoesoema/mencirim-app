import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ProductsCollections = new Mongo.Collection('mst_products');

export const productsSchema = new SimpleSchema({
	kodeBarang: { type: String },
	barcode: { type: String },

	namaBarang: { type: String },
	imageBase64: { type: String },

	categoryID: { type: String, regEx: SimpleSchema.RegEx.Id },

	kts: { type: Number, defaultValue: 0 },
	qty: { type: Number, defaultValue: 0 },

	satuanBesar: { type: String, regEx: SimpleSchema.RegEx.Id },
	satuanKecil: { type: String, regEx: SimpleSchema.RegEx.Id },

	supplierID: { type: String },

	hargabeli: { type: Number },
	hargabelisatuan: { type: Number },

	jenisdiskon1: { type: String },
	jenisdiskon2: { type: String },
	jenisdiskon3: { type: String },
	jenisdiskon4: { type: String },
	jenisdiskon5: { type: String },

	diskonpersen1: { type: Number, defaultValue: 0 },
	diskonpersen2: { type: Number, defaultValue: 0 },
	diskonpersen3: { type: Number, defaultValue: 0 },
	diskonpersen4: { type: Number, defaultValue: 0 },
	diskonpersen5: { type: Number, defaultValue: 0 },
	diskonharga1: { type: Number, defaultValue: 0 },
	diskonharga2: { type: Number, defaultValue: 0 },
	diskonharga3: { type: Number, defaultValue: 0 },
	diskonharga4: { type: Number, defaultValue: 0 },
	diskonharga5: { type: Number, defaultValue: 0 },

	ppnpersen: { type: Number, defaultValue: 0 },
	ppnharga: { type: Number, defaultValue: 0 },

	hargamodal: { type: Number, defaultValue: 0 },

	tglLastTrx: { type: Date, defaultValue: Date.now },
	buktiFaktur: { type: String },

	hargajual: { type: Number, defaultValue: 0 },
	profitjual: { type: Number, defaultValue: 0 },

	hargajualmember: { type: Number, defaultValue: 0 },
	profitjualmember: { type: Number, defaultValue: 0 },

	minimumjlh1: { type: Number, defaultValue: 0 },
	minimumjlh2: { type: Number, defaultValue: 0 },
	minimumjlh3: { type: Number, defaultValue: 0 },

	minimumharga1: { type: Number, defaultValue: 0 },
	minimumharga2: { type: Number, defaultValue: 0 },
	minimumharga3: { type: Number, defaultValue: 0 },
	minimumpersen1: { type: Number, defaultValue: 0 },
	minimumpersen2: { type: Number, defaultValue: 0 },
	minimumpersen3: { type: Number, defaultValue: 0 },

	kartonjlh: { type: Number, defaultValue: 0 },
	kartonharga: { type: Number, defaultValue: 0 },
	kartonpersen: { type: Number, defaultValue: 0 },

	batasMin: { type: Number, defaultValue: 0 },
	batasMax: { type: Number, defaultValue: 0 },
	minimumOrder: { type: Number, defaultValue: 0 },
	modifiedBy: { type: String },
	createdBy: { type: String },
	modifiedAt: {
		type: Date,
		defaultValue: Date.now,
	},
	createdAt: {
		type: Date,
		defaultValue: Date.now,
	},
});
ProductsCollections.schema = productsSchema;

export const ProductsHistoriesCollections = new Mongo.Collection('products_histories');

export const productsHistoriesSchema = new SimpleSchema({
	kodeBarang: { type: String },
	barcode: { type: String },
	namaBarang: { type: String},

	tglFaktur: { type: Date, defaultValue: Date.now },
	noFaktur: { type: String },
	
	supplierID: { type: String },
	customerID: { type: String },

	ktsBesar: { type: Number, defaultValue: 0 },
	ktsKecil: { type: Number, defaultValue: 0 },
	satuanBesar: { type: String },
	satuanKecil: { type: String },

	qtyBonus: { type: Number, defaultValue: 0 },

	hargabeli: { type: Number, defaultValue: 0 },
	hargabelisatuan: { type: Number, defaultValue: 0 },

	jenisdiskon1: { type: String },
	jenisdiskon2: { type: String },
	jenisdiskon3: { type: String },
	jenisdiskon4: { type: String },
	jenisdiskon5: { type: String },
	diskonpersen1: { type: Number, defaultValue: 0 },
	diskonpersen2: { type: Number, defaultValue: 0 },
	diskonpersen3: { type: Number, defaultValue: 0 },
	diskonpersen4: { type: Number, defaultValue: 0 },
	diskonpersen5: { type: Number, defaultValue: 0 },
	diskonharga1: { type: Number, defaultValue: 0 },
	diskonharga2: { type: Number, defaultValue: 0 },
	diskonharga3: { type: Number, defaultValue: 0 },
	diskonharga4: { type: Number, defaultValue: 0 },
	diskonharga5: { type: Number, defaultValue: 0 },

	ppnpersen: { type: Number, defaultValue: 0 },
	ppnharga: { type: Number, defaultValue: 0 },

	hargamodal: { type: Number, defaultValue: 0 },
	hargabruto: { type: Number, defaultValue: 0 },
	harganetto: { type: Number, defaultValue: 0 },

	hargajual: { type: Number, defaultValue: 0 },
	profitjual: { type: Number, defaultValue: 0 },
	hargajualmember: { type: Number, defaultValue: 0 },
	profitjualmember: { type: Number, defaultValue: 0 },

	createdBy: { type: String },
	createdAt: { type: Date, defaultValue: Date.now },
});
ProductsHistoriesCollections.schema = productsHistoriesSchema;
