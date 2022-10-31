import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const ReturPembelianCollections = new Mongo.Collection('returPembelian');

export const returPembelianSchema = new SimpleSchema({
    noFaktur: { type: String },
    tglFaktur: { type: Date, defaultValue: Date.now },
    tglJatuhTempo: { type: Date, defaultValue: Date.now },
    supplierID: { type: String },
    currencyID: { type: String },
    noOrder: { type: String },
	grandTotal : { type: Number, defaultValue: 0 },	
    status : { type: String },
	createdAt: { type: Date, defaultValue: Date.now },
    createdBy: { type: String },
    modifiedAt: { type: Date, defaultValue: Date.now },
    modifiedBy: { type: String },
});

ReturPembelianCollections.schema = returPembelianSchema;