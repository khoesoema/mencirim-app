import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const UOMCollections = new Mongo.Collection('mst_uom');

export const uomSchema = new SimpleSchema({
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
UOMCollections.schema = uomSchema;
