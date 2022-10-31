import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ProfitCollections = new Mongo.Collection('profit');

export const penjualanDetailSchema = new SimpleSchema({
    
    noFaktur: { type: String },
	itemNo: { type: Number, defaultValue: 0 },

	kodeBarang: { type: String },
	barcode: { type: String },
	namaBarang: { type: String },
	categoryID: { type: String, regEx: SimpleSchema.RegEx.Id },

	ktsBesar: { type: Number, defaultValue: 0 },
	ktsKecil: { type: Number, defaultValue: 0 },
	satuanBesar: { type: String, regEx: SimpleSchema.RegEx.Id },
	satuanKecil: { type: String, regEx: SimpleSchema.RegEx.Id },
	qtyBonus: { type: Number, defaultValue: 0 },

	hargabeli: { type: Number, defaultValue: 0 },
	hargabelisatuan: { type: Number, defaultValue: 0 },

	hargamodal: { type: Number, defaultValue: 0 },
	hargajual: { type: Number, defaultValue: 0 },
	profitjual: { type: Number, defaultValue: 0 },
	
	createdAt: { type: Date, defaultValue: Date.now },
    createdBy: { type: String },
    modifiedAt: { type: Date, defaultValue: Date.now },
    modifiedBy: { type: String },
});

ProfitCollections.schema = penjualanDetailSchema;