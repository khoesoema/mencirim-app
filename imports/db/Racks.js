import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const RacksCollections = new Mongo.Collection('mst_racks');

export const racksSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	warehouseID: { type: String, regEx: SimpleSchema.RegEx.Id },
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
RacksCollections.schema = racksSchema;
