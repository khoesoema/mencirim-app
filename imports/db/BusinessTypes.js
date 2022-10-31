import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const BusinessTypesCollections = new Mongo.Collection(
	'mst_business_types'
);

export const businessTypesSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
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
BusinessTypesCollections.schema = businessTypesSchema;
