import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CompaniesCollections = new Mongo.Collection('mst_companies');

export const companiesSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	businessTypeID: { type: String, regEx: SimpleSchema.RegEx.Id },
	primaryContactName: { type: String },
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
CompaniesCollections.schema = companiesSchema;
