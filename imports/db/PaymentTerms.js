import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const PaymentTermsCollections = new Mongo.Collection(
	'mst_payment_terms'
);

export const paymentTermsSchema = new SimpleSchema({
	name: { type: String },
	code: { type: String },
	dueDay: { type: Number, defaultValue: 0 },
	discDay: { type: Number, defaultValue: 0 },
	discPercentage: { type: Number, defaultValue: 0 },
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
PaymentTermsCollections.schema = paymentTermsSchema;
