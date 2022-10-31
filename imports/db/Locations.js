import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const LocationsCollections = new Mongo.Collection('mst_locations');

export const locationsSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	primaryContactName: { type: String },
	address: { type: String },
	phoneNumber: { type: String },
	mobileNumber: { type: String },
	countryCode: { type: String, },
	stateCode: { type: String,  },
	cityName: { type: String,  },
	postalCode: { type: String },
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
LocationsCollections.schema = locationsSchema;
