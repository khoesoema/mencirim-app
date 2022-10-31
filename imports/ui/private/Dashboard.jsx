import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Table, Card } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Badge from 'react-bootstrap/Badge';

import Modal from 'rsuite/Modal';
import Loader from 'rsuite/Loader';

import { Topbar } from './template/Topbar';

import { ProductsCollections } from '../../db/Products';
import { ProductsHistoriesCollections } from '../../db/Products';
import { CurrenciesCollections } from '../../db/Currencies';

import BarChart from "./components/BarChart";
import DoughnutChart from './components/DoughnutChart';

export function DashboardPage(props) {

	const [page, setPage] = useState(1);
	const [maxPage, setMaxPage] = useState(1);
	const [orderBy, setOrderBy] = useState('code');
	const [order, setOrder] = useState(1);

	const [currencies, currenciesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('currencies.listAll', {
			orderByColumn: orderBy,
			order,
		});

		let sortObject = {};

		sortObject[orderBy] = order;

		let data = CurrenciesCollections.find( {}, { sort: sortObject,} ).fetch();

		return [data, !subs.ready()];
	}, [ orderBy, order]);

	const [currenciesCount, currenciesCountLoading] = useTracker(() => {
		let subs = Meteor.subscribe('currencies.countAll', {});

		let data = Counts.get('currencies.countAll');
		return [data, !subs.ready()];
	}, []);

	useEffect(() => {
		setMaxPage(Math.ceil(currenciesCount / 10));
	}, [currenciesCount]);
	
	const [productshistories, productshistoriesLoading] = useTracker(() => {
		let subs = Meteor.subscribe('productshistories.countBrg', {});

		let data = ProductsHistoriesCollections.find(
			{},
			{
				sort: {jumlah: -1}
			},
			{
				limit: 10
			}
		).fetch();
		
		return [data, !subs.ready()];
	}, []);

	const [products, productsLoading] = useTracker(() => {
		let subs = Meteor.subscribe('products.countZero', {});

		let data = ProductsCollections.find({}).fetch();
		
		return [data, !subs.ready()];
	}, []);

	const [loading, setLoading] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogTitle, setDialogTitle] = useState('');
	const [dialogContent, setDialogContent] = useState('');

	const [tahun, setTahun] = useState(new Date());
	const [chartData, setChartData] = useState({});
	
	const [haveData, setHaveData] = useState(false);

	const toMonthName = (monthNumber) => {
		const date = new Date();
		date.setMonth(monthNumber - 1);
	  
		return date.toLocaleString('en-US', {
		  month: 'short',
		});
	}

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};
	
	const [productshistories2, productshistories2Loading] = useTracker(() => {
		let subs = Meteor.subscribe('productshistories.sumHargaYear',{tahun});
        let data = [];

        if(tahun){
            data =  ProductsHistoriesCollections.find({}).fetch();
        }
		
		let dataTahun = [];

        for(let i=0; i < 12; i++) {

			let pembelian = 0;
			let returPembelian = 0;
			let penjualan = 0 ;
			let returPenjualan = 0;
			let profit = 0;

			data.map((item) => {
				if(item.month === i + 1) {
					if (item.jenis === 'Pembelian'){
						pembelian = item.total;
					}
					if (item.jenis === 'Retur Pembelian'){
						returPembelian = item.total;
					}
					if (item.jenis === 'Penjualan'){
						penjualan = item.total;
						profit = item.profit;
					}
					if (item.jenis === 'Retur Penjualan'){
						returPenjualan = item.total;
						profit -= item.profit;
					}
				}
			})

			dataTahun[i] = {
				id:  i + 1,
				bulan: toMonthName(i + 1),
				beli: pembelian - returPembelian,
				jual: penjualan - returPenjualan,
			}
		}
		console.log(dataTahun);
		return [dataTahun, !subs.ready()];
	}, []);

	{/*const UserData = [
		{
		  id: 1,
		  month: "Jan",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 2,
		  month: "Feb",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 3,
		  month: "Mar",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 4,
		  month: "Apr",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 5,
		  month: "Mei",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 6,
		  month: "Jun",
		  Beli: 0,
		  Jual: 0,
		},
				{
		  id: 7,
		  month: "Jul",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 8,
		  month: "Aug",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 9,
		  month: "Sep",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 10,
		  month: "Oct",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 11,
		  month: "Nov",
		  Beli: 0,
		  Jual: 0,
		},
		{
		  id: 12,
		  month: "Dec",
		  Beli: 0,
		  Jual: 0,
		},
	  ];
	
	const [chartData0, setChartData0] = useState({
		labels: UserData.map((item) => item.Bulan),
		datasets: [
		  	{
				label: "TotalPembelian",
				data: UserData.map((item) => item.Beli),
				backgroundColor: 'rgba(255, 99, 132, 0.2)',
				borderColor: 'rgb(255, 99, 132)',
				borderWidth: 1,
		  	},
		  	{
				label: "TotalPenjualan",
				data: UserData.map((item) => item.Jual),
				backgroundColor: 'rgba(75, 192, 192, 0.2)',
				borderColor: 'rgb(75, 192, 192)',
				borderWidth: 1,
		  	},
		],
	}); */}

	useEffect(()=>{
		const fetchData = async () => {
			try {
				setChartData({
					labels: productshistories2.map((item) => item.bulan),
					datasets: [
					  {
						label: "Total Pembelian",
						data: productshistories2.map((item) => item.beli),
						backgroundColor: 'rgba(255, 99, 132, 0.2)',
						borderColor: 'rgb(255, 99, 132)',
						borderWidth: 1,
					  },
					  {
						label: "Total Penjualan",
						data: productshistories2.map((item) => item.jual),
						backgroundColor: 'rgba(75, 192, 192, 0.2)',
						borderColor: 'rgb(75, 192, 192)',
						borderWidth: 1,
					  },
					],
				});
				setHaveData(true);
			} catch(error) {
				setHaveData(false);
				console.log(error);
			}
		}
		fetchData();
	},[productshistories2, productshistories2Loading]);

	const userData2 = {
		labels: [
		  'Member',
		  'Non-Member'
		],
		datasets: [{
		  label: 'Member Dataset',
		  data: [50, 500],
		  backgroundColor: [
			'rgb(54, 162, 235)',
			'rgb(75, 192, 192)'
		  ],
		  hoverOffset: 4
		}]
	};
	
	return (
		<>
			<Topbar />
			<div className="mainContainerRoot" >
				<Modal
					backdrop={true}
					keyboard={false}
					open={dialogOpen}
					onClose={(e) => {
						setDialogOpen(false);
					}}
				>
					<Modal.Header>
						<Modal.Title>{dialogTitle}</Modal.Title>
					</Modal.Header>

					<Modal.Body>{dialogContent}</Modal.Body>
				</Modal>

				<div className="mainContent">
					<Row>
						<Col sm={7} >
							<Card>
					  			<Card.Body>
								  	<Card.Title as="h5">Total Penjualan dan Pembelian Periode Tahun {new Date().getUTCFullYear()}</Card.Title>
									<div> {haveData && <BarChart chartData={chartData} /> }</div>
					  			</Card.Body>
							</Card>
						</Col>
						<Col sm={3} >
							<Card>
					  			<Card.Header style={{fontSize: 14}}>Top Penjualan Barang Bulan {moment(new Date()).format('MMMM')}</Card.Header>
					  			<Card.Body>
							  		<Table responsive bordered={false} hover size="sm" style={{fontSize: 12}}>
								  		<tbody>
										 	{productshistoriesLoading 
												? ( <tr>
														<td colSpan={2}>
															<center>
																<Loader
																	size="sm"
																	content="Memuat Data..."
																/>
															</center>
														</td>
													</tr> )
												: ( <>
													{productshistories.length > 0 
														? (
															<>
																{productshistories.map((item, index) => (
																	<tr key={index}>
																		<td>{item.nama}</td>
																		<td style={{ textAlign: "right" }}> {item.jumlah}</td>
																	</tr>
																))}
															</>
														) 
														: (
															<tr>
																<td colSpan={2}>
																	<center>Tidak ada data</center>
																</td>
															</tr>
														)}
													</>
												)
											}
								  		</tbody>
									</Table>
					  			</Card.Body>
							</Card>
						</Col> 
						<Col sm={2} >
							<Card>
					  			<Card.Header style={{fontSize: 14}}>{ 'Kurs Hari ini (' + moment(new Date()).format('DD/MM/YY') + ')'}</Card.Header>
					  			<Card.Body>
							  		<Table bordered responsive hover size="sm" style={{fontSize: 12}}>
								  		<thead>
								  		  <tr>
								  		    <th>Kode</th>
								  		    <th style={{ textAlign: "right" }}>Nominal</th>
								  		  </tr>
								  		</thead>
										<tbody>
								  			{currenciesLoading ? (
												<tr>
													<td colSpan={10}>
														<center>
															<Loader
																size="sm"
																content="Memuat Data..."
															/>
														</center>
													</td>
												</tr>
											) : (
											<>
											{currencies.length > 0 ? (
												<>
													{currencies.map((item, index) => (
														<tr key={index}>
															<td>{item.code}</td>
															<td style={{ textAlign: "right" }}> {formatNum(item.kurs)}</td>
														</tr>
													))}
												</>
											) : (
											<tr>
												<td colSpan={10}>
													<center>Tidak ada data</center>
												</td>
											</tr>
											)}
											</>
											)}
										</tbody>
									</Table>
					  			</Card.Body>
							</Card>
						</Col>
					</Row>
					<br />
					<Row>
						<Col sm={3} >
							<Card className="d-flex">
					  			<Card.Body className ="align-items-center d-flex justify-content-center">
							  		<div>
										<h6><center>Today Sales</center></h6>
										<Stack direction="horizontal" gap={3} className="centered">
											<h1 className="strong">12,631</h1> <h3>K</h3>
											<h5>IDR</h5>
										</Stack>
										<div className="centered text-success">
											<Badge bg="success" > ▲ 10.00 % </Badge>
										</div>
										<div className="centered">
											<h6>vs Yesterday</h6>
										</div>
										
									</div>
					  			</Card.Body>
							</Card>
						</Col>
						<Col sm={3}>
							<Card className="d-flex">
					  			<Card.Body className ="align-items-center d-flex justify-content-center">
							  		<div>
										<h6><center>Today Customers</center></h6>
										<Stack direction="horizontal" gap={3} className="centered">
											<h1 className="strong">226</h1> 
										</Stack>
										<div className="centered text-danger">
											<Badge bg="danger" > ▼ 5.50 % </Badge>
										</div>
										<div className="centered">
											<h6>vs Yesterday</h6>
										</div>
										
									</div>
					  			</Card.Body>
							</Card>
						</Col>
						<Col sm={3} >
							<Card>
					  			<Card.Header style={{fontSize: 14}}>Barang yang sudah sold out</Card.Header>
					  			<Card.Body>
							  		<Table responsive bordered={false} hover size="sm" style={{fontSize: 10}}>
								  		<tbody>
										  	{ productsLoading 
												? ( <tr>
														<td colSpan={2}>
															<center>
																<Loader
																	size="sm"
																	content="Memuat Data..."
																/>
															</center>
														</td>
													</tr> 
												): ( 
													<>
														{ products.length > 0 
															? (
																<>
																	{products.map((item, index) => (
																		<tr key={index}>
																			<td>{item.namaBarang}</td>
																			<td style={{ textAlign: "right" }}> {moment(item.tglLastTrx).format('YYYY-MM-DD')}</td>
																		</tr>
																	))}
																</>
															) : (
																<tr>
																	<td colSpan={2}>
																		<center>Tidak ada data</center>
																	</td>
																</tr>
														)}
													</>
												)
											}
								  		  {/*<tr>
								  		    <td>Chicato </td>
											<td className="text-right">31-01-2021</td>
								  		  </tr>
								  		  <tr>
											<td>Mie Sedap</td>
											<td className="text-right">28-05-2022</td>
								  		  </tr>
								  		  <tr>
											<td>Item3</td>
											<td className="text-right">02-Jun-2022</td>
								  		  </tr>
											<tr>
											<td>Item4</td>
											<td className="text-right">03-Jun-2022</td>
										</tr>*/}
								  		</tbody>
									</Table>
					  			</Card.Body>
							</Card>
						</Col> 
						<Col sm={3} >
							<Card>
					  			<Card.Body>
									<div className="text-center">Total Customer Bulan ini</div>
									<div ><DoughnutChart chartData={userData2}></DoughnutChart></div>
					  			</Card.Body>
							</Card>
						</Col>
					</Row>
				</div>
			</div>
		</>
	);
}
