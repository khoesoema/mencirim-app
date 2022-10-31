import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PenjualanCollections = new Mongo.Collection('penjualan');

export const penjualanSchema = new SimpleSchema({
    noFaktur: { type: String },
    tglFaktur: { type: Date, defaultValue: Date.now },
    tglJatuhTempo: { type: Date, defaultValue: Date.now },
    supplierID: { type: String },
    currencyID: { type: String },
    noOrder: { type: String },
	grandTotal: { type: Number, defaultValue: 0 },	
    status: { type: String },
    keterangan: { type: String },
	createdAt: { type: Date, defaultValue: Date.now },
    createdBy: { type: String },
    modifiedAt: { type: Date, defaultValue: Date.now },
    modifiedBy: { type: String },
});

PenjualanCollections.schema = penjualanSchema;