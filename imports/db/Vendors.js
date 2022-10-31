import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const VendorsCollections = new Mongo.Collection('dataSupplier');

export const vendorsSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	businessTypeID: { type: String, regEx: SimpleSchema.RegEx.Id },
	relasi: { type: String },
	terms: { type: Number },	
	phoneNumber: { type: String },
	mobileNumber: { type: String },
	address: { type: String },
	cityName: { type: String },
	stateCode: { type: String },
	countryCode: { type: String },
	postalCode: { type: String },
	NPWPNumber: { type: String },
	NPWPName: { type: String },
	NPWPAddress: { type: String },
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
VendorsCollections.schema = vendorsSchema;
