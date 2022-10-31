import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const BrandsCollections = new Mongo.Collection('mst_brands');

export const brandsSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	imageBase64: { type: String },
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
BrandsCollections.schema = brandsSchema;
