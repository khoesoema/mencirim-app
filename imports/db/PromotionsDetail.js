import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PromotionsDetailCollections = new Mongo.Collection('promotionsDetail');

export const promotionsDetailSchema = new SimpleSchema({
	promoNo: { type: String },
	itemNo: { type: Number, defaultValue: 0 },
	kodeBarang: { type: String },
	barcode: { type: String },
	namaBarang: { type: String },
	categoryID: { type: String },
	supplierID: { type: String },
	diskonPersen: { type: Number, defaultValue: 0 },
	diskonHarga: { type: Number, defaultValue: 0 },
	createdAt: { type: Date, defaultValue: Date.now },
	createdBy: { type: String },
	modifiedAt: { type: Date, defaultValue: Date.now },
	modifiedBy: { type: String },
});

PromotionsDetailCollections.schema = promotionsDetailSchema;
