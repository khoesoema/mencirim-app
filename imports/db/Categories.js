import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const CategoriesCollections = new Mongo.Collection('mst_categories');

export const categoriesSchema = new SimpleSchema({
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

CategoriesCollections.schema = categoriesSchema;
