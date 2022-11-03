import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const KassaCollections = new Mongo.Collection('mst_kassa');

export const KassaSchema = new SimpleSchema({
    code: { type: String },
	name: { type: String },
    desc: { type: String },
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

KassaCollections.schema = KassaSchema;
