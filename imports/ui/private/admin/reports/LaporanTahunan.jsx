import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';

import moment from 'moment-timezone';
import 'moment/locale/id';

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Pagination, Table } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Loader from 'rsuite/Loader';
import Breadcrumb from 'rsuite/Breadcrumb';
import InputNumber from 'rsuite/InputNumber';
import Stack from 'rsuite/Stack';

import ArrowRightIcon from '@rsuite/icons/ArrowRight';

import { ProductsHistoriesCollections } from '../../../../db/Products';

moment.locale('id');
moment.tz.setDefault('Asia/Jakarta');

export function LaporanTahunan() {
	let navigate = useNavigate();

	const [tahun, setTahun] = useState(new Date());

	const [productshistories, productshistoriesLoading] = useTracker(() => {
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
						profit += item.profit;
					}
					if (item.jenis === 'Retur Penjualan'){
						returPenjualan = item.total;
						profit += item.profit;
					}
				}
			})

			dataTahun[i] = {
				bulan: i + 1,
				pembelian,
				returPembelian,
				penjualan,
				returPenjualan,
				profit
			}
		}

		return [dataTahun, !subs.ready()];
	}, [tahun]);

	const formatNum = (input) => {
		if (input) {
			return parseFloat(input)
					.toFixed(2)
					.replace(/(\d)(?=(\d{3})+(\.(\d){0,2})*$)/g, '$1,');
		} else {
			return 0;
		}	
	};

	const toMonthName = (monthNumber) => {
		const date = new Date();
		date.setMonth(monthNumber - 1);
	  
		return date.toLocaleString('en-US', {
		  month: 'short',
		});
	}

	return (
		<>
			<div className="mainContainerRoot">
				<div className="mainContent">
					<div className="breadcrumContainer">
						<Breadcrumb
							separator={<ArrowRightIcon />}
							className="m-0"
						>
							<Breadcrumb.Item onClick={(e) => navigate('/')}>
								Dashboard
							</Breadcrumb.Item>
							<Breadcrumb.Item active>
								Laporan Tahunan
							</Breadcrumb.Item>
						</Breadcrumb>
					</div>
					<h6>
						<b>Laporan Tahunan</b>
					</h6>
					<hr />
					<Stack spacing={20}>
                	    Tahun :
                	    <InputNumber 
							className="text-right" 
							defaultValue={new Date().getUTCFullYear()} 
							max={2999} 
							min={1900} 
							onChange={(e)=> setTahun(e)}
						/>
                	</Stack>
					<hr />
					<Table responsive striped bordered hover className="tbl-prod">
						<thead>
							<tr>
								<th>#</th>
								<th className="text-center">Bulan</th>
								<th className="text-center">Pembelian</th>
								<th className="text-center">Retur Pembelian</th>
								<th className="text-center">Penjualan</th>
								<th className="text-center">Retur Penjualan</th>
								<th className="text-center" colSpan={2}>Profit Penjualan</th>
							</tr>
						</thead>
						<tbody>
							{productshistoriesLoading ? (
								<tr>
									<td colSpan={20}>
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
									{productshistories.length > 0 ? (
										<>
											{productshistories.map((item, index) => {
												return (
												<tr key={index}>
													<td>{ index + 1 }</td>
													<td className="text-center">{ toMonthName(item.bulan) + '-' + new Date(tahun).getUTCFullYear() }</td>
													<td className="text-right">{ formatNum(item.pembelian) }</td>
													<td className="text-right">{ formatNum(item.returPembelian) }</td>
													<td className="text-right">{ formatNum(item.penjualan) }</td>
													<td className="text-right">{ formatNum(item.returPenjualan) }</td>
													<td className="text-right">{ formatNum(item.profit/(item.penjualan-item.returPenjualan) * 100 ) + ' %' }</td>
													<td className="text-right">{ formatNum(item.profit) }</td>
												</tr>
												);
											})}
										</>
									) : (
										<tr>
											<td colSpan={20}>
												<center>Tidak ada data</center>
											</td>
										</tr>
									)}
								</>
							)}
						</tbody>
					</Table>
				</div>
			</div>
		</>
	);
}
