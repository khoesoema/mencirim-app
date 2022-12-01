import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CustomersCollections = new Mongo.Collection('mst_customers');

export const customersSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	address: { type: String },
	phoneNumber: { type: String },
	mobileNumber: { type: String },
	countryCode: { type: String, },
	stateCode: { type: String,  },
	cityName: { type: String,  },
	postalCode: { type: String },
	NPWPNumber: { type: String },
	NPWPName: { type: String },
	NPWPAddress: { type: String },
	identityNumber: { type: String },
	identityName: { type: String },
	identityAddress: { type: String },
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
CustomersCollections.schema = customersSchema;
