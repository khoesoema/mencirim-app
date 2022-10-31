export const balanceSheetSubType = [
	{
		label: 'Kas',
		value: 10,
	},
	{
		label: 'Bank',
		value: 20,
	},
	{
		label: 'Piutang',
		value: 30,
	},
	{
		label: 'Persediaan',
		value: 40,
	},
	{
		label: 'Aktifa Lancar Lain-lain',
		value: 50,
	},
	{
		label: 'Aktifa Tetap',
		value: 60,
	},
	{
		label: 'Aktifa Lain-lain',
		value: 70,
	},
	{
		label: 'Hutang',
		value: 80,
	},
	{
		label: 'Hutang Lancar Lain-lain',
		value: 90,
	},
	{
		label: 'Hutang Jangka Panjang',
		value: 100,
	},
	{
		label: 'Hutang Lain-lain',
		value: 110,
	},
	{
		label: 'Modal',
		value: 120,
	},
	{
		label: 'Laba Ditahan',
		value: 130,
	},
	{
		label: 'Laba & Rugi - Tahun Berjalan',
		value: 140,
	},
	{
		label: 'Laba & Rugi - Bulan Berjalan',
		value: 150,
	},
];

export const incomeStatementSubType = [
	{
		label: 'Penjualan',
		value: 15,
	},
	{
		label: 'Harga Pokok Penjualan',
		value: 25,
	},
	{
		label: 'Biaya',
		value: 35,
	},
	{
		label: 'Pendapatan Lain-lain',
		value: 45,
	},
	{
		label: 'Biaya Lain-lain',
		value: 55,
	},
];

export const userTypeOptions = [
	{
		label: 'Super Admin',
		value: 0,
	},
	{
		label: 'Admin',
		value: 1,
	},
	{
		label: 'Kasir',
		value: 2,
	},
	{
		label: 'Gudang',
		value: 3,
	},
	{
		label: 'Payroll',
		value: 4,
	},
];

export const userStatus = {
	isEnabled: 1,
};
export const userPermission = {
	currency: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	taxCode: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	account: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	businessType: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	company: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	location: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	warehouse: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	rack: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	customer: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	vendor: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	brand: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	category: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	product: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
	},
	user: {
		read: 0,
		add: 0,
		edit: 0,
		delete: 0,
		unlock: 0,
		resetPassword: 0,
		setPermission: 0,
	},
};

export const userAllPermission = {
	currency: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	taxCode: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	account: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	businessType: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	company: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	location: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	warehouse: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	rack: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	customer: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	vendor: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	brand: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	category: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	product: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
	},
	user: {
		read: 1,
		add: 1,
		edit: 1,
		delete: 1,
		unlock: 1,
		resetPassword: 1,
		setPermission: 1,
	},
};

export const appliedToOptions = [
	{
		label: 'Produk',
		value: 1,
	},
	{
		label: 'Brand',
		value: 2,
	},
	{
		label: 'Kategori',
		value: 3,
	},
	{
		label: 'Pembayaran',
		value: 4,
	},
];

export const promoTypeOptions = [
	{
		label: 'Beli x Gratis x',
		value: 1,
	},
	{
		label: 'Diskon x%',
		value: 2,
	},
	{
		label: 'Diskon Rp. xxx',
		value: 3,
	},
	{
		label: 'Gratis Produk x',
		value: 4,
	},
];

export const paymentOptions = [
	{
		label: 'Kartu Debit',
		value: 1,
	},
	{
		label: 'Kartu Kredit',
		value: 2,
	},
	{
		label: 'Cash',
		value: 3,
	},
	{
		label: 'Transfer',
		value: 4,
	},
	{
		label: 'QRIS',
		value: 5,
	},
	{
		label: 'OVO',
		value: 6,
	},
	{
		label: 'GOPAY',
		value: 7,
	},
	{
		label: 'Shopee Pay',
		value: 8,
	},
	{
		label: 'eMoney Mandiri',
		value: 9,
	},
	{
		label: 'BCA Flazz',
		value: 10,
	},
];

export const bankNameOptions = [
	{
		label: 'Bank BNI',
		value: '009',
	},
	{
		label: 'Bank BRI',
		value: '002',
	},
	{
		label: 'Bank BTN',
		value: '200',
	},
	{
		label: 'Bank Mandiri',
		value: '008',
	},
	{
		label: 'Bank Syariah Indonesia (BSI) eks BRI Syariah',
		value: '422',
	},
	{
		label: 'Bank Syariah Indonesia (BSI) eks BNI Syariah',
		value: '427',
	},
	{
		label: 'Bank Syariah Indonesia (BSI) eks Mandiri Syariah',
		value: '451',
	},
	{
		label: 'Bank BCA',
		value: '014',
	},
	{
		label: 'Bank BCA Syariah',
		value: '536',
	},
	{
		label: 'Bank CIMB Niaga',
		value: '022',
	},
	{
		label: 'Bank CIMB Niaga Syariah',
		value: '022_S',
	},
	{
		label: 'Bank Muamalat',
		value: '147',
	},
	{
		label: 'Bank BTPN',
		value: '213',
	},
	{
		label: 'Bank BTPN Syariah',
		value: '547',
	},
	{
		label: 'Bank Permata',
		value: '013',
	},
	{
		label: 'Bank Permata Syariah',
		value: '013_S',
	},
	{
		label: 'Bank DBS Indonesia',
		value: '046',
	},
	{
		label: 'Digibank',
		value: '046_D',
	},
	{
		label: 'Bank Danamon',
		value: '011',
	},
	{
		label: 'Bank Maybank(BII)',
		value: '016',
	},
	{
		label: 'Bank Mega',
		value: '426',
	},
	{
		label: 'Bank Mega Syariah',
		value: '506',
	},
	{
		label: 'Bank Sinarmas',
		value: '153',
	},
	{
		label: 'Bank Commonwealth',
		value: '950',
	},
	{
		label: 'Bank OCBC NISP',
		value: '028',
	},
	{
		label: 'Bank Bukopin',
		value: '441',
	},
	{
		label: 'Bank Bukopin Syariah',
		value: '521',
	},
	{
		label: 'Bank Lippo',
		value: '026',
	},
	{
		label: 'Citibank',
		value: '031',
	},
	{
		label: 'Linkaja',
		value: '911',
	},
	{
		label: 'Jenius BTPN',
		value: '213',
	},
	{
		label: 'Bank Jabar BJB',
		value: '110',
	},
	{
		label: 'Bank Jabar BJB Syariah',
		value: '425',
	},
	{
		label: 'Bank DKI Jakarta',
		value: '111',
	},
	{
		label: 'BPD DIY',
		value: '112',
	},
	{
		label: 'Bank Jateng',
		value: '113',
	},
	{
		label: 'Bank Jatim',
		value: '114',
	},
	{
		label: 'Bank Jambi',
		value: '115',
	},
	{
		label: 'Bank Aceh',
		value: '116',
	},
	{
		label: 'Bank Aceh Syariah',
		value: '116_S',
	},
	{
		label: 'Bank Sumut',
		value: '117',
	},
	{
		label: 'Bank Nagari / Bank Sumbar',
		value: '118',
	},
	{
		label: 'Bank Riau Kepri',
		value: '119',
	},
	{
		label: 'Bank Sumsel Babel (Sumatera Selatan Bangka Belitung)',
		value: '120',
	},
	{
		label: 'Bank Lampung',
		value: '121',
	},
	{
		label: 'Bank Kalsel',
		value: '122',
	},
	{
		label: 'Bank Kalbar',
		value: '123',
	},
	{
		label: 'Bank Kaltimtara (Bank Kalimantan Timur dan Utara)',
		value: '124',
	},
	{
		label: 'Bank Kalteng',
		value: '125',
	},
	{
		label: 'Bank Sulselbar (Bank Sulawesi Selatan dan Barat)',
		value: '126',
	},
	{
		label: 'Bank Sulutgo (Bank Sulawesi Utara dan Gorontalo)',
		value: '127',
	},
	{
		label: 'Bank NTB',
		value: '128',
	},
	{
		label: 'Bank NTB Syariah',
		value: '128_S',
	},
	{
		label: 'Bank BPD Bali',
		value: '129',
	},
	{
		label: 'Bank NTT',
		value: '130',
	},
	{
		label: 'Bank Maluku',
		value: '131',
	},
	{
		label: 'Bank Papua',
		value: '132',
	},
	{
		label: 'Bank Bengkulu',
		value: '133',
	},
	{
		label: 'Bank Sulteng',
		value: '134',
	},
	{
		label: 'Bank Sultra',
		value: '135',
	},
	{
		label: 'Bank Banten',
		value: '137',
	},

	{
		label: 'Bank Panin',
		value: '019',
	},
	{
		label: 'Bank Panin Dubai Syariah',
		value: '517',
	},
	{
		label: 'Bank Arta Niaga Kencana',
		value: '020',
	},
	{
		label: 'Bank UoB Indonesia',
		value: '213',
	},

	{
		label: 'American Express Bank Ltd',
		value: '030',
	},
	{
		label: 'Bank Artha Graha Internasional',
		value: '037',
	},
	{
		label: 'MUFG Bank',
		value: '042',
	},
	{
		label: 'Bank Sumitomo Mitsui Indonesia',
		value: '045',
	},
	{
		label: 'Bank Mizuho Indonesia',
		value: '048',
	},
	{
		label: 'Standard Chartered Bank',
		value: '050',
	},

	{
		label: 'Korea Exchange Bank Danamon',
		value: '059',
	},
	{
		label: 'Rabobank Internasional Indonesia',
		value: '060',
	},
	{
		label: 'Bank ANZ Indonesia',
		value: '061',
	},
	{
		label: 'Bank Bumi Arta',
		value: '076',
	},
	{
		label: 'Bank HSBC Indonesia',
		value: '087',
	},
	{
		label: 'Bank Antardaerah',
		value: '088',
	},

	{
		label: 'Bank Haga',
		value: '089',
	},
	{
		label: 'J Trust Bank Indonesia',
		value: '095',
	},
	{
		label: 'Bank Mayapada',
		value: '097',
	},
	{
		label: 'Bank Nusantara Parahyangan',
		value: '145',
	},
	{
		label: 'Bank Maspion Indonesia',
		value: '157',
	},
	{
		label: 'Bank Hagakita',
		value: '159',
	},

	{
		label: 'Bank Ganesha',
		value: '161',
	},
	{
		label: 'Bank Windu Kentjana',
		value: '162',
	},
	{
		label: 'Bank ICBC Indonesia (Halim Indonesia Bank)',
		value: '164',
	},
	{
		label: 'Bank Harmoni International',
		value: '166',
	},
	{
		label: 'Bank QNB Indonesia',
		value: '167',
	},
	{
		label: 'Bank Woori Saudara',
		value: '212',
	},

	{
		label: 'Bank Victoria Syariah',
		value: '405',
	},
	{
		label: 'Bank Hana (Keb Hana Bank)',
		value: '484',
	},
	{
		label: 'Bank MNC',
		value: '485',
	},
	{
		label: 'Bank BRI Agro',
		value: '494',
	},
	{
		label: 'Bank Digital BCA (BCA Digital)',
		value: '501',
	},
	{
		label: 'Bank National Nobu',
		value: '503',
	},

	{
		label: 'Prima Master Bank',
		value: '520',
	},
	{
		label: 'Bank Akita',
		value: '525',
	},
	{
		label: 'Anglomas Internasional Bank',
		value: '531',
	},
	{
		label: 'Bank Sahabat Sampoerna (Bank Dipo International)',
		value: '523',
	},
	{
		label: 'Bank Kesejahteraan Ekonomi',
		value: '535',
	},
	{
		label: 'Bank Artos Indonesia',
		value: '542',
	},

	{
		label: 'Bank Multiarta Sentosa',
		value: '548',
	},
	{
		label: 'Bank Mayora Indonesia',
		value: '553',
	},
	{
		label: 'Bank Index Selindo',
		value: '555',
	},
	{
		label: 'Centratama Nasional Bank',
		value: '559',
	},
	{
		label: 'Bank Fama Internasional',
		value: '562',
	},
	{
		label: 'Bank Mandiri Taspen Pos',
		value: '564',
	},

	{
		label: 'Bank Victoria International',
		value: '566',
	},
	{
		label: 'Allo Bank eks Bank Harda Internasional',
		value: '567',
	},
	{
		label: 'IBK Bank Indonesia',
		value: '945',
	},
	{
		label: 'Bank Maybank Indocorp',
		value: '947',
	},
	{
		label: 'Bank CTBC Indonesia (China Trust)',
		value: '949',
	},
	{
		label: 'Bank Commonwealth',
		value: '950',
	},
];
